import { NextRequest, NextResponse } from 'next/server'
import { createSessionCookie } from '@/lib/customer-session'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const displayName = (name || email.split('@')[0]).trim()
    const cookie = createSessionCookie(email, displayName)

    const response = NextResponse.json({
      success: true,
      user: { email: email.toLowerCase().trim(), name: displayName },
    })

    response.cookies.set(cookie.name, cookie.value, cookie.options as any)
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}