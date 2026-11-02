import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'

export type NewsletterSource = 'checkout' | 'order-confirmation' | 'footer' | 'admin'

export interface NewsletterSubscriber {
  id: string
  email: string
  name: string | null
  source: NewsletterSource
  consent_at: string
  unsubscribed_at: string | null
  order_reference: string | null
  created_at: string
}

export interface SubscribeInput {
  email: string
  name?: string | null
  source: NewsletterSource
  orderReference?: string | null
  metadata?: Record<string, unknown>
}

export interface SubscribeResult {
  email: string
  alreadySubscribed: boolean
  resendSynced: boolean
}

export interface NewsletterListOptions {
  search?: string
  limit?: number
  offset?: number
  activeOnly?: boolean
}

export interface NewsletterStats {
  total: number
  active: number
  unsubscribed: number
}

export const NEWSLETTER_CONSENT_TEXT =
  'I agree to receive new arrivals and price drop emails from AMAPELS. I can unsubscribe at any time.'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const configuredAudienceId = process.env.RESEND_AUDIENCE_ID

let cachedAudienceId: string | null = null
let audienceLookup: Promise<string | null> | null = null

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isNewsletterTableMissing(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const code = (error as { code?: string }).code
  const message = (error as { message?: string }).message || ''
  return (
    code === '42P01' ||
    code === 'PGRST205' ||
    /newsletter_subscribers.*does not exist/i.test(message) ||
    /could not find the table.*newsletter_subscribers/i.test(message)
  )
}

/**
 * Resolve the Resend audience used for marketing contacts.
 *
 * Set RESEND_AUDIENCE_ID to pin a specific audience. When it is not set we
 * look for an audience named AMAPELS and create one if it does not exist yet,
 * so the first signup can complete without extra dashboard setup.
 */
async function resolveAudienceId(): Promise<string | null> {
  if (configuredAudienceId) return configuredAudienceId
  if (!resend) return null
  if (cachedAudienceId) return cachedAudienceId
  if (!audienceLookup) {
    audienceLookup = (async () => {
      try {
        const { data, error } = await resend.audiences.list()
        if (error) {
          console.error('Resend audience lookup failed:', error)
          return null
        }

        const audiences = data?.data ?? []
        const existing = audiences.find((audience) => /amapels/i.test(audience.name))
        if (existing) {
          cachedAudienceId = existing.id
          return existing.id
        }

        const created = await resend.audiences.create({ name: 'AMAPELS' })
        if (created.error) {
          console.error('Resend audience creation failed:', created.error)
          return null
        }

        cachedAudienceId = created.data?.id ?? null
        return cachedAudienceId
      } catch (error) {
        console.error('Resend audience lookup error:', error)
        return null
      } finally {
        audienceLookup = null
      }
    })()
  }
  return audienceLookup
}

async function syncToResend(
  email: string,
  name: string | null
): Promise<{ synced: boolean; contactId: string | null }> {
  if (!resend) return { synced: false, contactId: null }

  const audienceId = await resolveAudienceId()
  if (!audienceId) return { synced: false, contactId: null }

  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  const firstName = parts[0] || undefined
  const lastName = parts.slice(1).join(' ') || undefined

  try {
    const created = await resend.contacts.create({
      audienceId,
      email,
      firstName,
      lastName,
      unsubscribed: false,
    })

    if (!created.error) {
      return { synced: true, contactId: created.data?.id ?? null }
    }

    // A contact with this email already exists. Update it so a previous
    // unsubscribe does not silently keep the buyer off the list.
    const updated = await resend.contacts.update({
      audienceId,
      email,
      firstName,
      lastName,
      unsubscribed: false,
    })

    if (!updated.error) {
      return { synced: true, contactId: updated.data?.id ?? null }
    }

    console.error('Resend contact sync failed:', created.error, updated.error)
    return { synced: false, contactId: null }
  } catch (error) {
    console.error('Resend contact sync error:', error)
    return { synced: false, contactId: null }
  }
}

export async function subscribeToNewsletter(input: SubscribeInput): Promise<SubscribeResult> {
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }

  const email = normalizeEmail(input.email)
  if (!isValidEmail(email)) {
    throw new Error('Please enter a valid email address.')
  }

  const { data: existing, error: existingError } = await supabase
    .from('newsletter_subscribers')
    .select('id, name, order_reference, metadata, unsubscribed_at')
    .eq('email', email)
    .maybeSingle()

  if (existingError) throw existingError

  const now = new Date().toISOString()
  const name = input.name?.trim() || existing?.name || null
  const orderReference = input.orderReference || existing?.order_reference || null

  const { data: saved, error } = await supabase
    .from('newsletter_subscribers')
    .upsert(
      {
        email,
        name,
        source: input.source,
        marketing_consent: true,
        consent_text: NEWSLETTER_CONSENT_TEXT,
        consent_at: now,
        order_reference: orderReference,
        unsubscribed_at: null,
        updated_at: now,
        metadata: {
          ...(existing?.metadata || {}),
          ...(input.metadata || {}),
        },
      },
      { onConflict: 'email' }
    )
    .select('id, email')
    .single()

  if (error) throw error

  const resendSync = await syncToResend(email, name)
  if (resendSync.contactId && saved?.id) {
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({ resend_contact_id: resendSync.contactId })
      .eq('id', saved.id)

    if (updateError) {
      console.error('Failed to store Resend contact id:', updateError)
    }
  }

  return {
    email,
    alreadySubscribed: Boolean(existing && !existing.unsubscribed_at),
    resendSynced: resendSync.synced,
  }
}

export async function getNewsletterSubscribers(options: NewsletterListOptions = {}) {
  if (!supabase) throw new Error('Supabase is not configured')

  let query = supabase
    .from('newsletter_subscribers')
    .select(
      'id, email, name, source, consent_at, unsubscribed_at, order_reference, created_at',
      { count: 'exact' }
    )

  if (options.activeOnly) {
    query = query.is('unsubscribed_at', null)
  }

  const term = options.search?.trim().replace(/[,()%_]/g, ' ').slice(0, 80)
  if (term) {
    query = query.or(`email.ilike.%${term}%,name.ilike.%${term}%`)
  }

  const limit = Math.min(Math.max(options.limit ?? 50, 1), 500)
  const offset = Math.max(options.offset ?? 0, 0)

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error

  return {
    subscribers: (data || []) as NewsletterSubscriber[],
    total: count || 0,
  }
}

export async function getAllActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  if (!supabase) throw new Error('Supabase is not configured')

  const pageSize = 1000
  const maxRows = 20000
  const all: NewsletterSubscriber[] = []
  let offset = 0

  while (offset < maxRows) {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, name, source, consent_at, unsubscribed_at, order_reference, created_at')
      .is('unsubscribed_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) throw error
    if (!data?.length) break

    all.push(...(data as NewsletterSubscriber[]))
    if (data.length < pageSize) break
    offset += pageSize
  }

  return all
}

export async function getNewsletterStats(): Promise<NewsletterStats> {
  if (!supabase) throw new Error('Supabase is not configured')

  const [totalResult, activeResult] = await Promise.all([
    supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .is('unsubscribed_at', null),
  ])

  if (totalResult.error) throw totalResult.error
  if (activeResult.error) throw activeResult.error

  const total = totalResult.count || 0
  const active = activeResult.count || 0

  return {
    total,
    active,
    unsubscribed: Math.max(total - active, 0),
  }
}
