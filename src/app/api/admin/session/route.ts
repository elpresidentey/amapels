import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/adminSession'

export async function GET() {
  try {
    const secret = process.env.SECRET_KEY
    if (!secret) {
      return NextResponse.json({ authenticated: false }, { status: 200 })
    }

    const cookieStore = cookies()
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
    const session = verifySessionToken(token, secret)

    if (!session) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({ authenticated: true, session })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
