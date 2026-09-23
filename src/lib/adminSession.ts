import { NextResponse } from 'next/server'
import crypto from 'crypto'

export const ADMIN_COOKIE_NAME = 'admin_session'
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

export interface AdminSession {
  email: string
  name: string
  loginTime: string
  expiresAt: string
}

/**
 * Creates a signed session token (payload.signature) using HMAC-SHA256.
 * The signature covers the payload so it cannot be forged without SECRET_KEY.
 */
export function createSessionToken(session: AdminSession, secret: string): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url')
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64url')
  return `${payload}.${signature}`
}

/**
 * Verifies a signed session token. Returns the session if valid and unexpired,
 * otherwise null.
 */
export function verifySessionToken(token: string | undefined | null, secret: string): AdminSession | null {
  if (!token) return null

  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null

  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64url')

  // Timing-safe comparison so signatures can't be probed
  const sigBuf = Buffer.from(signature)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null
  }

  try {
    const session: AdminSession = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (new Date() > new Date(session.expiresAt)) return null
    return session
  } catch {
    return null
  }
}

/** Constant-time string comparison to prevent timing attacks on credentials. */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) {
    // Compare against itself to keep timing consistent, then fail
    crypto.timingSafeEqual(bufA, bufA)
    return false
  }
  return crypto.timingSafeEqual(bufA, bufB)
}

/** Cookie options shared by login/logout routes. */
export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}
