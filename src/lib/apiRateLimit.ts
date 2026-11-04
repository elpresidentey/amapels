import crypto from 'crypto'
import type { NextRequest } from 'next/server'
import ApiRateLimit from '@/models/ApiRateLimit'
import dbConnect from '@/lib/mongodb'

export async function checkApiRateLimit(
  request: NextRequest,
  scope: string,
  maxRequests: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not configured')

  const ip = request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  const ipHash = crypto.createHmac('sha256', secret).update(ip).digest('hex')
  const now = Date.now()
  const window = Math.floor(now / windowMs)
  const key = `${scope}:${ipHash}:${window}`
  const expiresAt = new Date((window + 2) * windowMs)

  await dbConnect()
  await ApiRateLimit.init()

  let bucket
  try {
    bucket = await ApiRateLimit.findOneAndUpdate(
      { key },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
      { upsert: true, new: true }
    ).lean()
  } catch (error) {
    // A concurrent upsert may win the unique-key race; read and increment its bucket.
    if ((error as { code?: number })?.code !== 11000) throw error
    bucket = await ApiRateLimit.findOneAndUpdate(
      { key },
      { $inc: { count: 1 } },
      { new: true }
    ).lean()
  }

  const retryAfterSeconds = Math.max(1, Math.ceil(((window + 1) * windowMs - now) / 1000))
  return { allowed: Boolean(bucket && bucket.count <= maxRequests), retryAfterSeconds }
}
