import { NextRequest, NextResponse } from 'next/server'
import { getProducts, supabase } from '@/lib/supabase'
import { getFallbackProducts } from '@/lib/fallbackProducts'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  try {
    // Always use fallback products for now (until Supabase products are added)
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
  try {
    // For now, return success without saving to database
    // Products will work with fallback data
    const body = await request.json()
    
    return NextResponse.json({
      success: true,
      message: 'Product creation is currently using fallback data. To enable database storage, run the Supabase setup scripts.',
      data: {
        id: `temp-${Date.now()}`,
        ...body
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    )
  }
}
