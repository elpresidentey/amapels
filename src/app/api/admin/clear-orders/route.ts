import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'

export async function POST(request: Request) {
  const authError = requireAdmin(request)
  if (authError) return authError

  try {
    await dbConnect()
    const result = await Order.deleteMany({})
    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Cleared ${result.deletedCount} orders`
    })
  } catch (error) {
    console.error('Error clearing orders:', error)
    return NextResponse.json({ error: 'Failed to clear orders' }, { status: 500 })
  }
}