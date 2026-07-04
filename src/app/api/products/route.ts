import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { getFallbackProducts } from '@/lib/fallbackProducts'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  try {
    await dbConnect()

    let query = {}
    if (category && category !== 'All') {
      query = { category }
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      data: products,
      source: 'database',
    })
  } catch (error) {
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
    await dbConnect()
    const body = await request.json()
    const product = await Product.create(body)
    
    return NextResponse.json({
      success: true,
      data: product,
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    )
  }
}
