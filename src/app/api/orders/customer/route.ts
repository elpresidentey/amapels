import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { getSessionFromCookies } from '@/lib/customer-session'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = getSessionFromCookies()
    if (!session?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    await dbConnect()

    const orders = await Order.find({ customerEmail: session.email })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    const transformed = orders.map((order) => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items,
      total: order.total,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentReference: order.paymentReference,
      shippingAddress: order.shippingAddress,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }))

    return NextResponse.json({ orders: transformed })
  } catch (error) {
    console.error('Customer orders error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
