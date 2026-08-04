import { NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/customer-session'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = getSessionFromCookies()
    if (!session?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', session.email)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    const transformed = (orders || []).map((order: Record<string, any>) => ({
      id: order.id,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      items: order.items,
      total: order.total,
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      tax: order.tax,
      status: order.status,
      paymentStatus: order.payment_status,
      paymentReference: order.payment_reference,
      shippingAddress: order.shipping_address,
      trackingNumber: order.tracking_number,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    }))

    return NextResponse.json({ orders: transformed })
  } catch (error) {
    console.error('Customer orders error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}