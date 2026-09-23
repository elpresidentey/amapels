import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE_NAME,
  SESSION_DURATION_MS,
  createSessionToken,
  safeEqual,
  sessionCookieOptions,
  type AdminSession,
} from '@/lib/adminSession'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    const secret = process.env.SECRET_KEY

    if (!adminEmail || !adminPassword || !secret) {
      console.error('Admin environment variables are not fully configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Basic body validation before credential comparison
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Constant-time comparisons to prevent timing attacks
    const emailMatches = safeEqual(email.toLowerCase(), adminEmail.toLowerCase())
    const passwordMatches = safeEqual(password, adminPassword)

    if (!emailMatches || !passwordMatches) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const session: AdminSession = {
      email: email.toLowerCase(),
      name: 'Admin',
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
    }

    const token = createSessionToken(session, secret)

    const response = NextResponse.json({ success: true, session })
    response.cookies.set(ADMIN_COOKIE_NAME, token, sessionCookieOptions(SESSION_DURATION_MS / 1000))
    return response
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

