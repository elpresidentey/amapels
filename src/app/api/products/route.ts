import { NextRequest, NextResponse } from 'next/server'
import { getProducts, supabase, getProductImages } from '@/lib/supabase'
import { isShopifyConfigured, getShopifyProducts } from '@/lib/shopify'
import { requireAdmin } from '@/lib/admin-guard'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  if (!category) {
    if (productsCache && Date.now() < productsCache.expiresAt) {
      return NextResponse.json(productsCache.payload)
    }
    if (productsCacheInflight) {
      try {
        const cachedPayload = await productsCacheInflight
        return NextResponse.json(cachedPayload)
      } catch {
        // fall through and fetch fresh
      }
    }
  }

  // 1. Shopify first (headless backend) when configured

  // Run the catalog lookup once and share the in-flight promise with concurrent
  // requests, so a burst of homepage mounts shares one slow Supabase call.
  productsCacheInflight = (async () => {
    const payload = await buildCatalogPayload(category)
    if (!category) {
      productsCache = { expiresAt: Date.now() + PRODUCT_CACHE_TTL_MS, payload }
    }
    return payload
  })()

  try {
    const payload = await productsCacheInflight
    return NextResponse.json(payload)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 503 }
    )
  } finally {
    if (productsCacheInflight) productsCacheInflight = null
  }
}

async function buildCatalogPayload(category: string | null) {
  // 1. Shopify first (headless backend) when configured
  if (isShopifyConfigured()) {
    try {
      const products = await getShopifyProducts(
        category && category !== 'All' ? category : undefined
      )
      // Only use Shopify while it actually has products —
      // an empty catalog (e.g. fresh store) falls through to Supabase/static
      if (products.length > 0) {
        return { success: true, source: 'shopify' as const, data: products }
      }
      console.log('Shopify returned 0 products, falling through to Supabase')
    } catch (error) {
      console.log('Shopify fetch failed, falling through to Supabase:', (error as Error).message)
    }
  }

  if (!supabase) {
    console.error('Supabase not configured — product catalog unavailable')
    throw new Error('The product database is not configured.')
  }

  try {
    const products = await getProducts({
      category: category && category !== 'All' ? category : undefined
    })

    // Database query succeeded — return database results even if empty.
    // An empty array means there are genuinely no products; do NOT fall back.
    return {
      success: true,
      source: 'database' as const,
      data: products.map(p => ({
        _id: p.id,
        name: p.name,
        price: `₦${p.price}`,
        category: p.category,
        description: p.description,
        images: getProductImages(p),
        featured: p.featured,
        story: 'Picked with care',
        material: 'Premium materials',
        details: ['Elegant design', 'High quality', 'Perfect for any occasion'],
        materials: 'Premium materials with attention to detail',
        care: 'Store in a dry place and wipe gently with a soft cloth after wearing.',
        options: ['Standard Size', 'Gift Box'],
        createdAt: p.created_at,
        updatedAt: p.updated_at
      })),
    }
  } catch (error) {
    // Database query failed — surface it to the client instead of silently
    // substituting a legacy catalog the store owner has already discarded.
    console.error('Database fetch failed — product catalog unavailable:', error)
    throw new Error('Could not reach the product database. Please try again.')
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request)
  if (authError) return authError

  try {
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured. Please run the Supabase setup scripts.'
      }, { status: 500 })
    }

    const body = await request.json()
    
    // Extract price number from string (remove ₦ and commas)
    const priceString = body.price.replace(/[₦,]/g, '').trim()
    const priceNumber = parseFloat(priceString)

    // Collect all image URLs (support multiple angles)
    const imageUrls = Array.isArray(body.images)
      ? body.images.filter((img: string) => img && img.trim())
      : []
    
    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        name: body.name,
        description: body.description,
        price: priceNumber,
        image: imageUrls[0] || null,
        images: imageUrls,
        category: body.category,
        stock: body.stock || 100,
        featured: body.featured || false
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase insert error:', error)
      throw error
    }
    
    return NextResponse.json({
      success: true,
      data: {
        _id: product.id,
        ...body,
        createdAt: product.created_at,
        updatedAt: product.updated_at
      },
      message: 'Product created successfully!'
    }, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create product'
      },
      { status: 400 }
    )
  }
}

export const dynamic = 'force-dynamic'

const PRODUCT_CACHE_TTL_MS = 30_000
let productsCache: { expiresAt: number; payload: unknown } | null = null
let productsCacheInflight: Promise<unknown> | null = null
