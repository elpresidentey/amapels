import { NextRequest, NextResponse } from 'next/server'
import { createOrder, getOrders } from '@/lib/supabase'

// Validation schemas
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone: string): boolean => {
  // Nigerian phone number validation (flexible format)
  const phoneRegex = /^(\+234|234|0)?([789][01])\d{8}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

const validateOrderData = (data: any) => {
  const errors: string[] = []

  // Required fields validation
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

  // Type and format validation
  if (data.customerEmail && !validateEmail(data.customerEmail)) {
    errors.push('Invalid email format')
  }

  if (data.customerPhone && !validatePhone(data.customerPhone)) {
    errors.push('Invalid phone number format')
  }

  if (data.customerName && (typeof data.customerName !== 'string' || data.customerName.trim().length < 2)) {
    errors.push('Customer name must be at least 2 characters')
  }

  // Items validation
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

  // Address validation
  if (data.shippingAddress) {
    const requiredAddressFields = ['street', 'city', 'state', 'country']
    for (const field of requiredAddressFields) {
      if (!data.shippingAddress[field] || data.shippingAddress[field].trim().length === 0) {
        errors.push(`Shipping address missing: ${field}`)
      }
    }
  }

  // Amount validation
  if (typeof data.subtotal !== 'number' || data.subtotal < 0) {
    errors.push('Invalid subtotal amount')
  }

  if (typeof data.total !== 'number' || data.total < 0) {
    errors.push('Invalid total amount')
  }

  if (data.subtotal && data.total && data.total < data.subtotal) {
    errors.push('Total amount cannot be less than subtotal')
  }

  return errors
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    let orderData
    try {
      orderData = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    // Validate order data
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

    // Sanitize and prepare order data
    const sanitizedOrderData = {
      customer_name: orderData.customerName.trim(),
      customer_email: orderData.customerEmail.trim().toLowerCase(),
      customer_phone: orderData.customerPhone.trim(),
      items: orderData.items.map((item: any) => ({
        productId: String(item.productId),
        name: item.name.trim(),
        price: Math.round(item.price * 100) / 100,
        quantity: Math.floor(item.quantity),
        image: item.image || ''
      })),
      shipping_address: {
        street: orderData.shippingAddress.street.trim(),
        city: orderData.shippingAddress.city.trim(),
        state: orderData.shippingAddress.state.trim(),
        postalCode: orderData.shippingAddress.postalCode?.trim() || '',
        country: orderData.shippingAddress.country.trim()
      },
      payment_reference: orderData.paymentReference?.trim() || null,
      payment_status: orderData.paymentStatus || 'pending',
      subtotal: Math.round(orderData.subtotal * 100) / 100,
      shipping_cost: Math.round((orderData.shippingCost || 0) * 100) / 100,
      tax: Math.round((orderData.tax || 0) * 100) / 100,
      total: Math.round(orderData.total * 100) / 100,
      status: 'pending',
      tracking_number: null,
      estimated_delivery: null,
      metadata: orderData.metadata || null
    }
    
    // Create order using Supabase
    try {
      const order = await createOrder(sanitizedOrderData)
      
      // Return success response
      return NextResponse.json({
        message: 'Order created successfully',
        order: {
          id: order.id,
          orderNumber: order.order_number,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          total: order.total,
          status: order.status,
          paymentStatus: order.payment_status,
          createdAt: order.created_at
        }
      }, { status: 201 })

    } catch (error: any) {
      console.error('Order creation failed:', error)
      
      // Handle specific Supabase/Postgres errors
      if (error.code === '23505') {
        // Unique constraint violation (duplicate payment reference)
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
    
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        ...(isDevelopment && { details: error instanceof Error ? error.message : 'Unknown error' })
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1)
    const offset = (page - 1) * limit
    
    const { orders, total } = await getOrders({
      status: status || undefined,
      limit,
      offset
    })
    
    // Transform snake_case to camelCase for frontend
    const transformedOrders = orders.map(order => ({
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