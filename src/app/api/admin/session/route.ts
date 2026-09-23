import { NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/adminSession'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const secret = process.env.SECRET_KEY
    if (!secret) {
      return NextResponse.json({ authenticated: false }, { status: 200 })
    }

    const cookieHeader = request.headers.get('cookie') || ''
    const token = cookieHeader
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${ADMIN_COOKIE_NAME}=`))
      ?.slice(ADMIN_COOKIE_NAME.length + 1)
    const session = verifySessionToken(token, secret)

    if (!session) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({ authenticated: true, session })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
