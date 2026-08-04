import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const authError = requireAdmin(request)
  if (authError) return authError

  try {
    const { data: deleted, error } = await supabase
      .from('orders')
      .delete()
      .not('id', 'is', 'null')
      .select('id')

    if (error) throw error

    const deletedCount = deleted?.length ?? 0
    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Cleared ${deletedCount} orders`
    })
  } catch (error) {
    console.error('Error clearing orders:', error)
    return NextResponse.json({ error: 'Failed to clear orders' }, { status: 500 })
  }
}