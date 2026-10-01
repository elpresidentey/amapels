import { NextResponse } from 'next/server'
import { isShopifyConfigured, getShopifyDomain, getShopifyProducts } from '@/lib/shopify'

// GET /api/shopify/status — safe diagnostic (never leaks tokens)
export async function GET() {
  const configured = isShopifyConfigured()
  if (!configured) {
    return NextResponse.json({
      success: false,
      configured: false,
      domain: getShopifyDomain(),
      hint: 'Set NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN. See docs/SHOPIFY_SETUP.md.',
    })
  }
  try {
    const products = await getShopifyProducts(undefined, 5)
    return NextResponse.json({
      success: true,
      configured: true,
      domain: getShopifyDomain(),
      sampleCount: products.length,
      sample: products.map((p) => ({ id: p._id, name: p.name, price: p.price, handle: p.handle })),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        configured: true,
        domain: getShopifyDomain(),
        error: error instanceof Error ? error.message : 'Shopify query failed',
      },
      { status: 502 }
    )
  }
}

export const dynamic = 'force-dynamic'
