import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

type OrderItem = { productId?: string; quantity?: number }
type PaidOrder = { items: OrderItem[] | string | null }

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ productIds: [] }, { headers: { 'Cache-Control': 'public, s-maxage=300' } })
  }

  const { data, error } = await supabase
    .from('orders')
    .select('items')
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false })
    .limit(1000)

  if (error) {
    return NextResponse.json({ error: 'Could not load bestsellers' }, { status: 503 })
  }

  const quantities = new Map<string, number>()
  for (const order of (data || []) as PaidOrder[]) {
    let items: OrderItem[] = []
    if (Array.isArray(order.items)) items = order.items
    else if (typeof order.items === 'string') {
      try {
        const parsed: unknown = JSON.parse(order.items)
        if (Array.isArray(parsed)) items = parsed
      } catch {
        continue
      }
    }

    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number' || !Number.isFinite(item.quantity) || item.quantity <= 0) continue
      quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity)
    }
  }

  const productIds = [...quantities.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => id)

  return NextResponse.json({ productIds }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } })
}

export const dynamic = 'force-dynamic'
