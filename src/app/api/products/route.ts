import { NextRequest, NextResponse } from 'next/server'
import { getProducts, supabase } from '@/lib/supabase'
import { getFallbackProducts } from '@/lib/fallbackProducts'
import { requireAdmin } from '@/lib/admin-guard'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  try {
    // Try Supabase first
    if (supabase) {
      try {
        const products = await getProducts({
          category: category && category !== 'All' ? category : undefined
        })
        
        // If we have products from database, return them
        if (products && products.length > 0) {
          return NextResponse.json({
            success: true,
            data: products.map(p => ({
              _id: p.id,
              name: p.name,
              price: `₦${p.price}`,
              category: p.category,
              description: p.description,
              images: p.image ? [p.image] : [],
              featured: p.featured,
              story: 'Handcrafted with care',
              material: 'Premium materials',
              details: ['Elegant design', 'High quality', 'Perfect for any occasion'],
              materials: 'Premium materials with attention to detail',
              care: 'Store in a dry place and wipe gently with a soft cloth after wearing.',
              options: ['Standard Size', 'Gift Box'],
              createdAt: p.created_at,
              updatedAt: p.updated_at
            })),
            source: 'database',
          })
        }
      } catch (dbError) {
        console.log('Database fetch failed, using fallback:', dbError)
      }
    }

    // Fallback to static products
    console.log('Using fallback products')
    return NextResponse.json({
      success: true,
      data: getFallbackProducts(category),
      source: 'fallback',
    })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      {
        success: true,
        data: getFallbackProducts(category) || [],
        source: 'fallback',
        fallbackReason: (error as Error).message,
      },
      { status: 200 }
    )
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
    
    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        name: body.name,
        description: body.description,
        price: priceNumber,
        image: body.images && body.images.length > 0 ? body.images[0] : null,
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
