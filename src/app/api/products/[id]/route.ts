import { NextRequest, NextResponse } from 'next/server'
import { getProduct, supabase } from '@/lib/supabase'
import { getFallbackProductById } from '@/lib/fallbackProducts'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const fallbackProduct = getFallbackProductById(params.id)

  try {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const product = await getProduct(params.id)
    
    return NextResponse.json({
      success: true,
      data: product,
      source: 'database',
    })
  } catch (error) {
    if (fallbackProduct) {
      return NextResponse.json({
        success: true,
        data: fallbackProduct,
        source: 'fallback',
        fallbackReason: (error as Error).message,
      })
    }

    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 404 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const body = await request.json()
    
    const { data: product, error } = await supabase
      .from('products')
      .update({
        name: body.name,
        description: body.description,
        price: body.price,
        image: body.image,
        category: body.category,
        stock: body.stock,
        featured: body.featured
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) throw error
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', params.id)
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      data: {},
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    )
  }
}
