import { NextRequest, NextResponse } from 'next/server'
import {
  isNewsletterTableMissing,
  isValidEmail,
  normalizeEmail,
  subscribeToNewsletter,
  type NewsletterSource,
} from '@/lib/newsletter'

const ALLOWED_SOURCES: NewsletterSource[] = ['checkout', 'order-confirmation', 'footer']
const RATE_LIMIT_MAX = 8
const RATE_LIMIT_WINDOW_MS = 60_000
const rateBuckets = new Map<string, { count: number; resetAt: number }>()

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const bucket = rateBuckets.get(ip)

  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  bucket.count += 1
  return bucket.count > RATE_LIMIT_MAX
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again in a minute.' },
      { status: 429 }
    )
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Hidden honeypot field. Real customers never fill this in.
  if (typeof body?.website === 'string' && body.website.trim().length > 0) {
    return NextResponse.json({ success: true, message: "You're on the list." })
  }

  const email = typeof body?.email === 'string' ? normalizeEmail(body.email) : ''
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 }
    )
  }

  if (body?.consent !== true) {
    return NextResponse.json(
      { error: 'Please confirm you want to receive new arrivals and price drops.' },
      { status: 400 }
    )
  }

  const source: NewsletterSource = ALLOWED_SOURCES.includes(body?.source)
    ? body.source
    : 'footer'
  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 120) : null
  const orderReference =
    typeof body?.orderReference === 'string'
      ? body.orderReference.trim().slice(0, 80)
      : null

  try {
    const result = await subscribeToNewsletter({
      email,
      name,
      source,
      orderReference,
      metadata: {
        userAgent: request.headers.get('user-agent')?.slice(0, 300) || null,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: result.alreadySubscribed
          ? "You're already on the list."
          : "You're on the list.",
        alreadySubscribed: result.alreadySubscribed,
      },
      { status: result.alreadySubscribed ? 200 : 201 }
    )
  } catch (error) {
    console.error('Newsletter signup failed:', error)

    if (isNewsletterTableMissing(error)) {
      return NextResponse.json(
        { error: 'Newsletter signup is not available just yet. Please try again later.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'We could not save your email right now. Please try again.' },
      { status: 500 }
    )
  }
}
