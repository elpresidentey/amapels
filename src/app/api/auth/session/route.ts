import { NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/customer-session'

export async function GET() {
  try {
    const session = getSessionFromCookies()
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    return NextResponse.json({
      authenticated: true,
      user: { email: session.email, name: session.name },
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}