import { NextRequest, NextResponse } from 'next/server'
import { createShopifyCheckout, isShopifyConfigured } from '@/lib/shopify'

// POST /api/shopify/checkout
// Body: { lines: [{ variantId: "gid://shopify/ProductVariant/xxx", quantity: 1 }] }
// Returns: { success, checkoutUrl }
export async function POST(request: NextRequest) {
  if (!isShopifyConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Shopify not configured. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN. See docs/SHOPIFY_SETUP.md.',
      },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const lines = Array.isArray(body.lines) ? body.lines : []
    if (!lines.length) {
      return NextResponse.json({ success: false, error: 'Cart is empty.' }, { status: 400 })
    }

    const { checkoutUrl, cartId } = await createShopifyCheckout(lines)
    return NextResponse.json({ success: true, checkoutUrl, cartId })
  } catch (error) {
    console.error('Shopify checkout error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Checkout failed' },
      { status: 400 }
    )
  }
}

export const dynamic = 'force-dynamic'
