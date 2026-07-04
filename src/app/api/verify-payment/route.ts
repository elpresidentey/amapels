import { NextRequest, NextResponse } from 'next/server'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      )
    }

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Paystack configuration error' },
        { status: 500 }
      )
    }

    // Verify payment with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Payment verification failed', details: data },
        { status: response.status }
      )
    }

    // Check if payment was successful
    if (data.status && data.data.status === 'success') {
      return NextResponse.json({
        success: true,
        data: data.data,
        message: 'Payment verified successfully',
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment was not successful',
          data: data.data,
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error during payment verification' },
      { status: 500 }
    )
  }
}
