import { NextRequest, NextResponse } from 'next/server'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAY = 1000 // 1 second

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Enhanced fetch with retry logic
async function fetchWithRetry(url: string, options: RequestInit, maxAttempts = MAX_RETRY_ATTEMPTS): Promise<Response> {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown fetch error')
      console.error(`Paystack API attempt ${attempt}/${maxAttempts} failed:`, lastError.message)
      
      if (attempt < maxAttempts) {
        await delay(RETRY_DELAY * attempt) // Exponential backoff
      }
    }
  }
  
  throw lastError || new Error('All retry attempts failed')
}

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    let requestData
    try {
      requestData = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { reference } = requestData

    // Validate reference
    if (!reference || typeof reference !== 'string' || reference.trim().length === 0) {
      return NextResponse.json(
        { error: 'Payment reference is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    // Validate reference format (should match our generated format)
    if (!reference.match(/^AMP-\d+-[A-Z0-9]+$/)) {
      return NextResponse.json(
        { error: 'Invalid payment reference format' },
        { status: 400 }
      )
    }

    if (!PAYSTACK_SECRET_KEY) {
      console.error('Paystack secret key not configured')
      return NextResponse.json(
        { error: 'Payment system configuration error' },
        { status: 500 }
      )
    }

    // Verify payment with Paystack using retry logic
    let response: Response
    try {
      response = await fetchWithRetry(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference.trim())}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Amapels-Checkout/1.0'
          },
        }
      )
    } catch (error) {
      console.error('Paystack API communication failed:', error)
      return NextResponse.json(
        { 
          error: 'Unable to verify payment with Paystack. Please try again.',
          code: 'PAYSTACK_API_ERROR'
        },
        { status: 503 } // Service Unavailable
      )
    }

    let data
    try {
      data = await response.json()
    } catch (error) {
      console.error('Failed to parse Paystack response:', error)
      return NextResponse.json(
        { 
          error: 'Invalid response from payment provider',
          code: 'PAYSTACK_RESPONSE_ERROR'
        },
        { status: 502 } // Bad Gateway
      )
    }

    if (!response.ok) {
      console.error('Paystack verification failed:', {
        status: response.status,
        statusText: response.statusText,
        data
      })

      // Handle specific Paystack error cases
      if (response.status === 404) {
        return NextResponse.json(
          { 
            error: 'Payment reference not found',
            code: 'REFERENCE_NOT_FOUND'
          },
          { status: 404 }
        )
      } else if (response.status === 401) {
        return NextResponse.json(
          { 
            error: 'Payment system authentication error',
            code: 'AUTH_ERROR'
          },
          { status: 500 }
        )
      } else {
        return NextResponse.json(
          { 
            error: 'Payment verification failed',
            code: 'VERIFICATION_FAILED',
            details: data?.message || 'Unknown error'
          },
          { status: response.status }
        )
      }
    }

    // Validate response structure
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { 
          error: 'Invalid response structure from payment provider',
          code: 'INVALID_RESPONSE'
        },
        { status: 502 }
      )
    }

    if (!data.data) {
      return NextResponse.json(
        { 
          error: 'Missing transaction data in payment response',
          code: 'MISSING_TRANSACTION_DATA'
        },
        { status: 502 }
      )
    }

    // Check if payment was successful
    if (data.status && data.data.status === 'success') {
      // Additional validation for successful payments
      const transactionData = data.data
      
      // Validate required fields in successful transaction
      const requiredFields = ['reference', 'amount', 'currency', 'customer', 'status']
      const missingFields = requiredFields.filter(field => !transactionData[field])
      
      if (missingFields.length > 0) {
        console.error('Missing required fields in transaction data:', missingFields)
        return NextResponse.json(
          { 
            error: 'Incomplete transaction data',
            code: 'INCOMPLETE_DATA',
            missingFields
          },
          { status: 502 }
        )
      }

      return NextResponse.json({
        success: true,
        data: transactionData,
        message: 'Payment verified successfully',
        verifiedAt: new Date().toISOString()
      })
    } else {
      const transactionStatus = data.data?.status || 'unknown'
      console.warn('Payment verification unsuccessful:', {
        reference,
        status: transactionStatus,
        message: data.data?.gateway_response
      })

      return NextResponse.json(
        {
          success: false,
          message: `Payment was not successful (Status: ${transactionStatus})`,
          code: 'PAYMENT_UNSUCCESSFUL',
          data: {
            status: transactionStatus,
            gateway_response: data.data?.gateway_response,
            reference: data.data?.reference
          }
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    
    // Don't expose internal error details to client
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    return NextResponse.json(
      { 
        error: 'Internal server error during payment verification',
        code: 'INTERNAL_ERROR',
        ...(isDevelopment && { details: error instanceof Error ? error.message : 'Unknown error' })
      },
      { status: 500 }
    )
  }
}
