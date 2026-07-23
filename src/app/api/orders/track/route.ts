import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

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

    let order
    if (input.startsWith('TRK-')) {
      order = await Order.findOne({ trackingNumber: input }).lean()
    } else {
      order = await Order.findOne({ orderNumber: input }).lean()
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const timeline = order.metadata?.timeline || [
      {
        date: new Date(order.createdAt).toLocaleDateString(),
        time: new Date(order.createdAt).toLocaleTimeString(),
        status: 'Order confirmed',
        location: 'AMAPELS',
        completed: true
      }
    ]

    const trackingData = {
      orderId: order.orderNumber,
      status: order.status,
      estimatedDelivery: order.estimatedDelivery
        ? new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'To be determined',
      currentLocation: order.metadata?.current_location || 'Processing',
      trackingNumber: order.trackingNumber || 'Pending',
      courierName: order.metadata?.courier_name || 'AMAPELS Logistics',
      courierPhone: order.metadata?.courier_phone || '+234-800-123-4567',
      paymentReference: order.paymentReference || 'N/A',
      paymentStatus: order.paymentStatus,
      totalAmount: `₦${order.total.toLocaleString()}`,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      items: order.items,
      shippingAddress: order.shippingAddress,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      total: order.total,
      createdAt: order.createdAt,
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
