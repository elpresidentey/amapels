import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import CustomerLoginChallenge from '@/models/CustomerLoginChallenge'
import dbConnect from '@/lib/mongodb'
import { checkApiRateLimit } from '@/lib/apiRateLimit'
import { sendCustomerLoginCode } from '@/lib/email'

export const dynamic = 'force-dynamic'

const CODE_TTL_MS = 10 * 60 * 1000
const RESEND_COOLDOWN_MS = 60 * 1000

function hashCode(email: string, code: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(`${email}\0${code}`).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const rate = await checkApiRateLimit(request, 'customer-login-request', 10, 10 * 60 * 1000)
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many sign-in requests. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const input = body as { email?: unknown; name?: unknown }
    const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : ''
    const nameInput = typeof input?.name === 'string' ? input.name.trim().slice(0, 100) : ''
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      console.error('Customer sign-in is unavailable: JWT_SECRET is not configured')
      return NextResponse.json({ error: 'Sign-in is temporarily unavailable.' }, { status: 503 })
    }

    await dbConnect()
    await CustomerLoginChallenge.init()

    const code = crypto.randomInt(0, 100_000_000).toString().padStart(8, '0')
    const codeHash = hashCode(email, code, secret)
    const now = new Date()
    const challengeFilter = {
      email,
      $or: [
        { lastSentAt: { $lte: new Date(now.getTime() - RESEND_COOLDOWN_MS) } },
        { lastSentAt: { $exists: false } },
      ],
    }

    let challenge
    try {
      challenge = await CustomerLoginChallenge.findOneAndUpdate(
        challengeFilter,
        {
          $set: {
            name: nameInput || email.split('@')[0],
            codeHash,
            attempts: 0,
            lastSentAt: now,
            expiresAt: new Date(now.getTime() + CODE_TTL_MS),
          },
          $setOnInsert: { email },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).lean()
    } catch (error) {
      // A duplicate-key upsert means a recent challenge already exists.
      if ((error as { code?: number })?.code === 11000) {
        return NextResponse.json({ success: true, message: 'If the address can receive mail, a code has been sent.' })
      }
      throw error
    }

    if (!challenge) throw new Error('Could not create a sign-in challenge')

    let result
    try {
      result = await sendCustomerLoginCode(email, code)
    } catch (error) {
      console.error('Customer sign-in email delivery failed:', error)
      result = { sent: false, reason: 'Email provider error' }
    }
    if (!result.sent) {
      await CustomerLoginChallenge.deleteOne({ _id: challenge._id, codeHash })
      console.error('Customer sign-in email could not be sent:', result.reason || 'Email provider unavailable')
      return NextResponse.json({ error: 'We could not send a sign-in code right now. Please try again later.' }, { status: 503 })
    }

    return NextResponse.json({ success: true, message: 'If the address can receive mail, a code has been sent.' })
  } catch (error) {
    console.error('Customer sign-in request failed:', error)
    return NextResponse.json({ error: 'Sign-in is temporarily unavailable.' }, { status: 503 })
  }
}
