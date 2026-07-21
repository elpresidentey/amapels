import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ error: 'Admin credentials not configured' }, { status: 500 })
    }

    if (email?.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const secret = process.env.SECRET_KEY || 'amapels-default-secret'

    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${sessionId}:${expiresAt}:${email.toLowerCase()}`)
      .digest('hex')

    const session = {
      email: email.toLowerCase(),
      name: 'Admin',
      loginTime: new Date().toISOString(),
      sessionId,
      expiresAt,
      signature,
    }

    return NextResponse.json({ success: true, session })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
