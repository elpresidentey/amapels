import { NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, sessionCookieOptions } from '@/lib/adminSession'

export const dynamic = 'force-dynamic'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE_NAME, '', sessionCookieOptions(0))
  return response
}
