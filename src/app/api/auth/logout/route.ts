import { NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/customer-session'

export async function POST() {
  const cookie = clearSessionCookie()
  const response = NextResponse.json({ success: true })
  response.cookies.set(cookie.name, cookie.value, cookie.options as any)
  return response
}