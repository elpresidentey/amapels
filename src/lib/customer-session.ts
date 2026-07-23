import { cookies } from 'next/headers'
import crypto from 'crypto'

const SESSION_KEY = process.env.JWT_SECRET || 'amapels-customer-session-key-v1'
const COOKIE_NAME = 'amp_customer'
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000

export interface SessionPayload {
  email: string
  name: string
  exp: number
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', SESSION_KEY).update(payload).digest('hex')
}

function encode(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = sign(data)
  return `${data}.${sig}`
}

function decode(token: string): SessionPayload | null {
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [data, sig] = parts
  if (sign(data) !== sig) return null
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString()) as SessionPayload
    if (Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export function createSessionCookie(email: string, name: string): { name: string; value: string; options: Record<string, unknown> } {
  const payload: SessionPayload = {
    email: email.toLowerCase().trim(),
    name: name.trim(),
    exp: Date.now() + SESSION_DURATION_MS,
  }
  return {
    name: COOKIE_NAME,
    value: encode(payload),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: SESSION_DURATION_MS / 1000,
    },
  }
}

export function clearSessionCookie(): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: COOKIE_NAME,
    value: '',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 0,
    },
  }
}

export function getSessionFromCookies(): SessionPayload | null {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return decode(token)
}