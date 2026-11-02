import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import {
  getAllActiveSubscribers,
  getNewsletterStats,
  getNewsletterSubscribers,
  isNewsletterTableMissing,
} from '@/lib/newsletter'

function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? '' : String(value)
  // Guard against spreadsheet formula injection.
  if (/^[=+\-@]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)

    if (searchParams.get('format') === 'csv') {
      const subscribers = await getAllActiveSubscribers()
      const rows: Array<Array<string>> = [
        ['email', 'name', 'source', 'subscribed_at', 'order_reference'],
        ...subscribers.map((subscriber) => [
          subscriber.email,
          subscriber.name || '',
          subscriber.source,
          subscriber.consent_at,
          subscriber.order_reference || '',
        ]),
      ]

      const csv = rows.map((row) => row.map(csvCell).join(',')).join('\r\n')

      return new NextResponse(`\uFEFF${csv}`, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="amapels-newsletter-${new Date()
            .toISOString()
            .slice(0, 10)}.csv"`,
          'Cache-Control': 'no-store',
        },
      })
    }

    const search = searchParams.get('search') || undefined
    const limit = Math.min(
      Math.max(parseInt(searchParams.get('limit') || '50', 10) || 50, 1),
      100
    )
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10) || 1, 1)

    const [{ subscribers, total }, stats] = await Promise.all([
      getNewsletterSubscribers({
        search,
        limit,
        offset: (page - 1) * limit,
      }),
      getNewsletterStats(),
    ])

    return NextResponse.json({
      subscribers: subscribers.map((subscriber) => ({
        id: subscriber.id,
        email: subscriber.email,
        name: subscriber.name,
        source: subscriber.source,
        subscribedAt: subscriber.consent_at,
        unsubscribedAt: subscriber.unsubscribed_at,
        orderReference: subscriber.order_reference,
        createdAt: subscriber.created_at,
      })),
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(Math.ceil(total / limit), 1),
      },
    })
  } catch (error) {
    console.error('Failed to load newsletter subscribers:', error)

    if (isNewsletterTableMissing(error)) {
      return NextResponse.json(
        { error: 'Newsletter storage is not set up yet.', code: 'NOT_CONFIGURED' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to load subscribers.' },
      { status: 500 }
    )
  }
}
