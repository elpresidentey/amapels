import { NextRequest, NextResponse } from 'next/server'
import { getProduct, supabase } from '@/lib/supabase'
import { getFallbackProductById } from '@/lib/fallbackProducts'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Always use fallback products for now
    const fallbackProduct = getFallbackProductById(params.id)
    
    if (fallbackProduct) {
      return NextResponse.json({
        success: true,
        data: fallbackProduct,
        source: 'fallback',
      })
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
    const body = await request.json()
    
    return NextResponse.json({
      success: true,
      message: 'Product updates are currently disabled. Using fallback data.',
      data: {
        id: params.id,
        ...body
      }
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
    return NextResponse.json({
      success: true,
      message: 'Product deletion is currently disabled. Using fallback data.',
      data: {}
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    )
  }
}
