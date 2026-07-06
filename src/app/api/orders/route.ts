import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'

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

    // Connect to database with retry
    let dbConnected = false
    let dbAttempts = 0
    const maxDbAttempts = 3

    while (!dbConnected && dbAttempts < maxDbAttempts) {
      dbAttempts++
      try {
        await dbConnect()
        dbConnected = true
      } catch (error) {
        console.error(`Database connection attempt ${dbAttempts}/${maxDbAttempts} failed:`, error)
        if (dbAttempts >= maxDbAttempts) {
          return NextResponse.json(
            { 
              error: 'Database connection failed',
              code: 'DB_CONNECTION_ERROR'
            },
            { status: 503 }
          )
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * dbAttempts))
      }
    }

    // Sanitize and prepare order data
    const sanitizedOrderData = {
      customerName: orderData.customerName.trim(),
      customerEmail: orderData.customerEmail.trim().toLowerCase(),
      customerPhone: orderData.customerPhone.trim(),
      items: orderData.items.map((item: any) => ({
        productId: String(item.productId), // Ensure it's a string
        name: item.name.trim(),
        price: Math.round(item.price * 100) / 100, // Round to 2 decimal places
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
      paymentReference: orderData.paymentReference?.trim() || '',
      paymentStatus: orderData.paymentStatus || 'pending',
      subtotal: Math.round(orderData.subtotal * 100) / 100,
      shippingCost: Math.round((orderData.shippingCost || 0) * 100) / 100,
      tax: Math.round((orderData.tax || 0) * 100) / 100,
      total: Math.round(orderData.total * 100) / 100,
      status: 'pending',
      metadata: orderData.metadata || {}
    }
    
    // Create new order with retry logic
    let order
    let saveAttempts = 0
    const maxSaveAttempts = 3

    while (saveAttempts < maxSaveAttempts) {
      saveAttempts++
      try {
        order = new Order(sanitizedOrderData)
        const savedOrder = await order.save()
        
        // Return success response
        return NextResponse.json({
          message: 'Order created successfully',
          order: {
            id: savedOrder._id,
            customerName: savedOrder.customerName,
            customerEmail: savedOrder.customerEmail,
            total: savedOrder.total,
            status: savedOrder.status,
            paymentStatus: savedOrder.paymentStatus,
            createdAt: savedOrder.createdAt
          }
        }, { status: 201 })

      } catch (error: any) {
        console.error(`Order save attempt ${saveAttempts}/${maxSaveAttempts} failed:`, error)
        
        // Handle specific MongoDB errors
        if (error.code === 11000) {
          // Duplicate key error
          return NextResponse.json(
            { 
              error: 'Order with this reference already exists',
              code: 'DUPLICATE_ORDER'
            },
            { status: 409 }
          )
        }
        
        if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map((err: any) => err.message)
          return NextResponse.json(
            { 
              error: 'Database validation failed',
              code: 'DB_VALIDATION_ERROR',
              details: validationErrors
            },
            { status: 400 }
          )
        }

        if (saveAttempts >= maxSaveAttempts) {
          return NextResponse.json(
            { 
              error: 'Failed to create order after multiple attempts',
              code: 'ORDER_SAVE_ERROR'
            },
            { status: 500 }
          )
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 500 * saveAttempts))
      }
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
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100) // Cap at 100
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1) // Minimum 1
    
    let query = {}
    if (status && status !== 'all' && ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      query = { status }
    }
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-__v') // Exclude version field
      .lean() // Return plain objects for better performance
    
    const total = await Order.countDocuments(query)
    
    return NextResponse.json({
      orders,
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