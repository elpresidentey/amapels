import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Product from '@/models/Product'
import { seedProducts } from '@/lib/fallbackProducts'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: 'MONGODB_URI not set' }, { status: 500 })
    }

    await mongoose.connect(process.env.MONGODB_URI)
    await Product.deleteMany({})
    const products = await Product.insertMany(seedProducts)

    return NextResponse.json({
      success: true,
      count: products.length,
      products: products.map((p) => ({ name: p.name, id: p._id })),
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
