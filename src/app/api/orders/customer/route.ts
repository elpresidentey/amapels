import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', email.toLowerCase().trim())
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Customer orders fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    const transformed = (orders || []).map((order: Record<string, unknown>) => ({
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
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    }))

    return NextResponse.json({ orders: transformed })
  } catch (error) {
    console.error('Customer orders error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}