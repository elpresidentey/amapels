import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { checkApiRateLimit } from '@/lib/apiRateLimit'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const rate = await checkApiRateLimit(request, 'order-tracking', 20, 10 * 60 * 1000)
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Too many tracking attempts. Please try again shortly.' }, {
        status: 429,
        headers: { 'Retry-After': String(rate.retryAfterSeconds) },
      })
    }

    const body = await request.json().catch(() => null)
    const identifier = typeof body?.identifier === 'string' ? body.identifier.trim().slice(0, 100) : ''
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase().slice(0, 254) : ''
    if (!identifier || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Enter your order number and the email used at checkout.' }, { status: 400 })
    }
    if (!supabase) return NextResponse.json({ error: 'Order tracking is temporarily unavailable.' }, { status: 503 })

    const column = identifier.toUpperCase().startsWith('TRK') ? 'tracking_number' : 'order_number'
    const { data: order, error } = await supabase
      .from('orders')
      .select('order_number,status,estimated_delivery,tracking_number,created_at,metadata')
      .eq(column, identifier)
      .eq('customer_email', email)
      .maybeSingle()
    if (error) throw error
    if (!order) return NextResponse.json({ error: 'Order not found. Check your details and try again.' }, { status: 404 })

    const rawTimeline = Array.isArray(order.metadata?.timeline) ? order.metadata.timeline : []
    const timeline = rawTimeline.slice(0, 20).map((entry: any) => ({
      date: typeof entry?.date === 'string' ? entry.date.slice(0, 40) : '',
      time: typeof entry?.time === 'string' ? entry.time.slice(0, 30) : '',
      status: typeof entry?.status === 'string' ? entry.status.slice(0, 120) : '',
      location: typeof entry?.location === 'string' ? entry.location.slice(0, 120) : '',
      completed: entry?.completed === true,
    }))
    if (!timeline.length && order.created_at) {
      timeline.push({ date: new Date(order.created_at).toLocaleDateString(), time: '', status: 'Order confirmed', location: 'AMAPELS', completed: true })
    }

    return NextResponse.json({ success: true, data: {
      orderId: order.order_number,
      status: order.status,
      estimatedDelivery: order.estimated_delivery,
      trackingNumber: order.tracking_number,
      currentLocation: typeof order.metadata?.current_location === 'string' ? order.metadata.current_location.slice(0, 120) : 'Processing',
      courierName: typeof order.metadata?.courier_name === 'string' ? order.metadata.courier_name.slice(0, 100) : 'AMAPELS Logistics',
      timeline,
    } })
  } catch (error) {
    console.error('Error tracking order:', error)
    return NextResponse.json({ error: 'Order tracking is temporarily unavailable.' }, { status: 503 })
  }
}
