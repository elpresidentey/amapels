import { NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/adminSession'

/**
 * Server-side admin guard. Validates the signed session token from either
 * the httpOnly cookie (set at login) or a Bearer token, in that order.
 * Returns a 401/500 NextResponse on failure, or null when authorized.
 */
export function requireAdmin(request: Request) {
  const secret = process.env.SECRET_KEY
  if (!secret) {
    console.error('SECRET_KEY environment variable is not set')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  // Prefer the httpOnly cookie (parsed from the raw header so this helper
  // also works during static prerendering, where next/headers is unavailable)
  let token: string | undefined
  const cookieHeader = request.headers.get('cookie') || ''
  const cookieToken = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE_NAME}=`))
    ?.slice(ADMIN_COOKIE_NAME.length + 1)
  if (cookieToken) token = cookieToken

  // Fall back to a Bearer token (payload.signature format)
  if (!token) {
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7)
    }
  }

  const session = verifySessionToken(token, secret)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}

