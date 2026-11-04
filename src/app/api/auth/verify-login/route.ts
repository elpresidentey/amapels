import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import CustomerLoginChallenge from '@/models/CustomerLoginChallenge'
import dbConnect from '@/lib/mongodb'
import { checkApiRateLimit } from '@/lib/apiRateLimit'
import { createSessionCookie } from '@/lib/customer-session'

export const dynamic = 'force-dynamic'

const MAX_ATTEMPTS = 5

function hashCode(email: string, code: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(`${email}\0${code}`).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const rate = await checkApiRateLimit(request, 'customer-login-verify', 20, 10 * 60 * 1000)
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const input = body as { email?: unknown; code?: unknown }
    const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : ''
    const code = typeof input?.code === 'string' ? input.code.trim() : ''
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{8}$/.test(code)) {
      return NextResponse.json({ error: 'The code is invalid or expired. Request a new code and try again.' }, { status: 400 })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      console.error('Customer sign-in is unavailable: JWT_SECRET is not configured')
      return NextResponse.json({ error: 'Sign-in is temporarily unavailable.' }, { status: 503 })
    }

    await dbConnect()
    await CustomerLoginChallenge.init()
    const challenge = await CustomerLoginChallenge.findOne({ email, expiresAt: { $gt: new Date() } })
      .select('_id name codeHash attempts')
      .lean()

    if (!challenge || challenge.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: 'The code is invalid or expired. Request a new code and try again.' }, { status: 400 })
    }

    const submittedHash = hashCode(email, code, secret)
    const expected = Buffer.from(challenge.codeHash, 'hex')
    const submitted = Buffer.from(submittedHash, 'hex')
    if (expected.length !== submitted.length || !crypto.timingSafeEqual(expected, submitted)) {
      await CustomerLoginChallenge.updateOne(
        { _id: challenge._id, attempts: { $lt: MAX_ATTEMPTS } },
        { $inc: { attempts: 1 } }
      )
      return NextResponse.json({ error: 'The code is invalid or expired. Request a new code and try again.' }, { status: 400 })
    }

    // Deleting the challenge atomically makes the code single-use, including under concurrent requests.
    const consumed = await CustomerLoginChallenge.findOneAndDelete({
      _id: challenge._id,
      codeHash: submittedHash,
      attempts: { $lt: MAX_ATTEMPTS },
      expiresAt: { $gt: new Date() },
    }).lean()
    if (!consumed) {
      return NextResponse.json({ error: 'The code is invalid or expired. Request a new code and try again.' }, { status: 400 })
    }

    const cookie = createSessionCookie(email, consumed.name)
    const response = NextResponse.json({
      success: true,
      user: { email, name: consumed.name },
    })
    response.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof response.cookies.set>[2])
    return response
  } catch (error) {
    console.error('Customer sign-in verification failed:', error)
    return NextResponse.json({ error: 'Sign-in is temporarily unavailable.' }, { status: 503 })
  }
}
