import { NextResponse } from 'next/server'
import crypto from 'crypto'

export function requireAdmin(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sessionJson = Buffer.from(authHeader.slice(7), 'base64').toString('utf-8')
    const session = JSON.parse(sessionJson)

    if (new Date() > new Date(session.expiresAt)) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    const secret = process.env.SECRET_KEY || 'amapels-default-secret'
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${session.sessionId}:${session.expiresAt}:${session.email}`)
      .digest('hex')

    if (session.signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    return null
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }
}
