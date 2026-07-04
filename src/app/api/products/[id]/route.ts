import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { getFallbackProductById } from '@/lib/fallbackProducts'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const fallbackProduct = getFallbackProductById(params.id)

  try {
    await dbConnect()
    const product = await Product.findById(params.id)
    
    if (!product) {
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
    }
    
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
      { status: 400 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const fallbackProduct = getFallbackProductById(params.id)

  try {
    await dbConnect()
    const body = await request.json()
    const product = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
    
    if (!product) {
      if (fallbackProduct) {
        return NextResponse.json({
          success: true,
          data: {
            ...fallbackProduct,
            ...body,
            _id: fallbackProduct._id,
            updatedAt: new Date().toISOString(),
          },
          source: 'fallback',
        })
      }

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
  const fallbackProduct = getFallbackProductById(params.id)

  try {
    await dbConnect()
    const product = await Product.findByIdAndDelete(params.id)
    
    if (!product) {
      if (fallbackProduct) {
        return NextResponse.json({
          success: true,
          data: {},
          source: 'fallback',
        })
      }

      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
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
