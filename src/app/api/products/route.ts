import { NextRequest, NextResponse } from 'next/server'
import { getProducts, supabase } from '@/lib/supabase'
import { getFallbackProducts } from '@/lib/fallbackProducts'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  try {
    const products = await getProducts({
      category: category && category !== 'All' ? category : undefined
    })
    
    return NextResponse.json({
      success: true,
      data: products,
      source: 'database',
    })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      {
        success: true,
        data: getFallbackProducts(category),
        source: 'fallback',
        fallbackReason: (error as Error).message,
      },
      { status: 200 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        name: body.name,
        description: body.description,
        price: body.price,
        image: body.image || body.imageUrl,
        category: body.category,
        stock: body.stock || 0,
        featured: body.featured || false
      }])
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      data: product,
    }, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    )
  }
}
