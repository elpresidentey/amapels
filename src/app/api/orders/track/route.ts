import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderNumber = searchParams.get('orderNumber')
    const trackingNumber = searchParams.get('trackingNumber')

    const input = orderNumber || trackingNumber

    if (!input) {
      return NextResponse.json(
        { error: 'Order number or tracking number is required' },
        { status: 400 }
      )
    }

    let query = supabase.from('orders').select('*')
    if (input.startsWith('TRK-')) {
      query = query.eq('tracking_number', input)
    } else {
      query = query.eq('order_number', input)
    }

    const { data: order, error } = await query.maybeSingle()

    if (error) throw error

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const timeline = order.metadata?.timeline || [
      {
        date: new Date(order.created_at).toLocaleDateString(),
        time: new Date(order.created_at).toLocaleTimeString(),
        status: 'Order confirmed',
        location: 'AMAPELS',
        completed: true
      }
    ]

    const trackingData = {
      orderId: order.order_number,
      status: order.status,
      estimatedDelivery: order.estimated_delivery
        ? new Date(order.estimated_delivery).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'To be determined',
      currentLocation: order.metadata?.current_location || 'Processing',
      trackingNumber: order.tracking_number || 'Pending',
      courierName: order.metadata?.courier_name || 'AMAPELS Logistics',
      courierPhone: order.metadata?.courier_phone || '+234-800-123-4567',
      paymentReference: order.payment_reference || 'N/A',
      paymentStatus: order.payment_status,
      totalAmount: `₦${order.total.toLocaleString()}`,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      items: order.items,
      shippingAddress: order.shipping_address,
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      tax: order.tax,
      total: order.total,
      createdAt: order.created_at,
      timeline
    }

    return NextResponse.json({ success: true, data: trackingData })
  } catch (error) {
    console.error('Error tracking order:', error)
    return NextResponse.json(
      { error: 'Failed to track order' },
      { status: 500 }
    )
  }
}