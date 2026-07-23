import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { requireAdmin } from '@/lib/admin-guard'
import { sendOrderConfirmation } from '@/lib/email'

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+234|234|0)?([789][01])\d{8}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

const validateOrderData = (data: any) => {
  const errors: string[] = []

  const requiredFields = [
    'customerName',
    'customerEmail',
    'customerPhone',
    'items',
    'shippingAddress',
    'subtotal',
    'total'
  ]

  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  if (data.customerEmail && !validateEmail(data.customerEmail)) {
    errors.push('Invalid email format')
  }

  if (data.customerPhone && !validatePhone(data.customerPhone)) {
    errors.push('Invalid phone number format')
  }

  if (data.customerName && (typeof data.customerName !== 'string' || data.customerName.trim().length < 2)) {
    errors.push('Customer name must be at least 2 characters')
  }

  if (data.items) {
    if (!Array.isArray(data.items) || data.items.length === 0) {
      errors.push('Order must contain at least one item')
    } else {
      data.items.forEach((item: any, index: number) => {
        if (!item.productId || !item.name || typeof item.price === 'undefined' || !item.quantity) {
          errors.push(`Item ${index + 1} is missing required fields (productId, name, price, quantity)`)
        }
        if (typeof item.quantity !== 'number' || item.quantity < 1) {
          errors.push(`Item ${index + 1} must have quantity >= 1`)
        }
        if (typeof item.price !== 'number' || item.price < 0) {
          errors.push(`Item ${index + 1} must have valid price`)
        }
      })
    }
  }

  if (data.shippingAddress) {
    const requiredAddressFields = ['street', 'city', 'state', 'country']
    for (const field of requiredAddressFields) {
      if (!data.shippingAddress[field] || data.shippingAddress[field].trim().length === 0) {
        errors.push(`Shipping address missing: ${field}`)
      }
    }
  }

  if (typeof data.subtotal !== 'number' || data.subtotal < 0) {
    errors.push('Invalid subtotal amount')
  }

  if (typeof data.total !== 'number' || data.total < 0) {
    errors.push('Invalid total amount')
  }

  return errors
}

export async function POST(request: NextRequest) {
  try {
    let orderData
    try {
      orderData = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const validationErrors = validateOrderData(orderData)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationErrors
        },
        { status: 400 }
      )
    }

    await dbConnect()

    const sanitizedOrderData = {
      customerName: orderData.customerName.trim(),
      customerEmail: orderData.customerEmail.trim().toLowerCase(),
      customerPhone: orderData.customerPhone.trim(),
      items: orderData.items.map((item: any) => ({
        productId: String(item.productId),
        name: item.name.trim(),
        price: Math.round(item.price * 100) / 100,
        quantity: Math.floor(item.quantity),
        image: item.image || ''
      })),
      shippingAddress: {
        street: orderData.shippingAddress.street.trim(),
        city: orderData.shippingAddress.city.trim(),
        state: orderData.shippingAddress.state.trim(),
        postalCode: orderData.shippingAddress.postalCode?.trim() || '',
        country: orderData.shippingAddress.country.trim()
      },
      paymentReference: orderData.paymentReference?.trim() || null,
      paymentStatus: orderData.paymentStatus || 'pending',
      subtotal: Math.round(orderData.subtotal * 100) / 100,
      shippingCost: Math.round((orderData.shippingCost || 0) * 100) / 100,
      tax: Math.round((orderData.tax || 0) * 100) / 100,
      total: Math.round(orderData.total * 100) / 100,
      status: 'pending',
      metadata: orderData.metadata || {}
    }

    try {
      const order = await Order.create(sanitizedOrderData)

      sendOrderConfirmation({
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        orderNumber: order.orderNumber || '',
        items: order.items,
        total: order.total,
        shippingAddress: order.shippingAddress
      })

      return NextResponse.json({
        message: 'Order created successfully',
        order: {
          id: order._id.toString(),
          orderNumber: order.orderNumber,
          trackingNumber: order.trackingNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          total: order.total,
          status: order.status,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt
        }
      }, { status: 201 })

    } catch (error: any) {
      console.error('Order creation failed:', error)

      if (error.code === 11000) {
        return NextResponse.json(
          {
            error: 'Order with this reference already exists',
            code: 'DUPLICATE_ORDER'
          },
          { status: 409 }
        )
      }

      return NextResponse.json(
        {
          error: 'Failed to create order',
          code: 'ORDER_SAVE_ERROR',
          details: error.message
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Order creation error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV === 'development' && { details: error instanceof Error ? error.message : 'Unknown error' })
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request)
  if (authError) return authError

  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1)
    const skip = (page - 1) * limit

    const filter: Record<string, any> = {}
    if (status && status !== 'all') {
      filter.status = status
    }

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter)
    ])

    const transformedOrders = orders.map(order => ({
      _id: order._id.toString(),
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      items: order.items,
      shippingAddress: order.shippingAddress,
      paymentReference: order.paymentReference,
      paymentStatus: order.paymentStatus,
      status: order.status,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      total: order.total,
      orderNumber: order.orderNumber,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }))

    return NextResponse.json({
      orders: transformedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
