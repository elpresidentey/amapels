import { NextRequest, NextResponse } from 'next/server'
import { getOrder, updateOrderStatus } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-guard'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAdmin(request)
  if (authError) return authError
  try {
    const order = await getOrder(params.id)
    
    // Transform snake_case to camelCase
    const transformedOrder = {
      _id: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      items: order.items,
      shippingAddress: order.shipping_address,
      paymentReference: order.payment_reference,
      paymentStatus: order.payment_status,
      status: order.status,
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      tax: order.tax,
      total: order.total,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }
    
    return NextResponse.json({ order: transformedOrder })
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAdmin(request)
  if (authError) return authError

  try {
    const { status } = await request.json()
    
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }
    
    await updateOrderStatus(params.id, status)
    
    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully'
    })
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return PUT(request, { params })
}