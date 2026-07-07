import { NextRequest, NextResponse } from 'next/server'
import { getProduct, supabase } from '@/lib/supabase'
import { getFallbackProductById } from '@/lib/fallbackProducts'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First try fallback products
    const fallbackProduct = getFallbackProductById(params.id)
    
    if (fallbackProduct) {
      return NextResponse.json({
        success: true,
        data: fallbackProduct,
        source: 'fallback',
      })
    }

    // If not found in fallback, try Supabase
    if (supabase) {
      try {
        const product = await getProduct(params.id)
        
        // Transform Supabase product to match frontend format
        const transformedProduct = {
          _id: product.id,
          name: product.name,
          price: `₦${product.price.toLocaleString()}`,
          category: product.category as any,
          story: 'Handcrafted in Lagos',
          material: product.description?.split('.')[0] || 'Premium materials',
          description: product.description || '',
          details: ['Handcrafted with care', 'Premium quality materials', 'Beautiful gift packaging'],
          materials: product.description?.includes('gold') ? 'Gold-plated brass' : 'Premium materials',
          care: 'Store in dry place. Wipe with soft cloth.',
          options: ['Standard'],
          images: product.image ? [product.image] : ['/images/sabrianna-Y_bxfTa_iUA-unsplash.jpg'],
          featured: product.featured,
          createdAt: product.created_at,
          updatedAt: product.updated_at
        }
        
        return NextResponse.json({
          success: true,
          data: transformedProduct,
          source: 'supabase',
        })
      } catch (error) {
        // Supabase query failed, product might not exist
      }
    }

    return NextResponse.json(
      { success: false, error: 'Product not found' },
      { status: 404 }
    )
  } catch (error) {
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
      return NextResponse.json({
        success: false,
        error: 'Database not configured'
      }, { status: 500 })
    }
    
    const body = await request.json()
    
    // Extract price number from string
    const priceString = body.price.replace(/[₦,]/g, '').trim()
    const priceNumber = parseFloat(priceString)
    
    const { data: product, error } = await supabase
      .from('products')
      .update({
        name: body.name,
        description: body.description,
        price: priceNumber,
        image: body.images && body.images.length > 0 ? body.images[0] : null,
        category: body.category,
        stock: body.stock || 100,
        featured: body.featured || false
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
      data: {
        _id: product.id,
        ...body,
        updatedAt: product.updated_at
      },
      message: 'Product updated successfully!'
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
      return NextResponse.json({
        success: false,
        error: 'Database not configured'
      }, { status: 500 })
    }
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', params.id)
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      data: {},
      message: 'Product deleted successfully!'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    )
  }
}
