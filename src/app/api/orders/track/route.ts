import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderNumber = searchParams.get('orderNumber')
    const trackingNumber = searchParams.get('trackingNumber')
    const email = searchParams.get('email')

    if (!orderNumber && !trackingNumber) {
      return NextResponse.json(
        { error: 'Order number or tracking number is required' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('orders')
      .select('*')
      .or(`order_number.eq.${orderNumber},tracking_number.eq.${trackingNumber}`)

    if (email) {
      query = query.eq('customer_email', email)
    }

    const { data: order, error } = await query.single()

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Format the response for the frontend
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
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      items: order.items,
      shippingAddress: order.shipping_address,
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      tax: order.tax,
      total: order.total,
      paymentStatus: order.payment_status,
      createdAt: order.created_at,
      timeline: order.metadata?.timeline || [
        {
          date: new Date(order.created_at).toLocaleDateString(),
          time: new Date(order.created_at).toLocaleTimeString(),
          status: 'Order confirmed',
          location: 'AMAPELS',
          completed: true
        }
      ]
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
