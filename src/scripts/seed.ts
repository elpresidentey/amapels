import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '@/models/Product'
import { seedProducts } from '@/lib/fallbackProducts'

dotenv.config({ path: '.env' })

async function seedDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing products
    await Product.deleteMany({})
    console.log('Cleared existing products')

    // Insert new products
    const products = await Product.insertMany(seedProducts)
    console.log(`Successfully seeded ${products.length} products`)

    // Log the inserted products
    products.forEach((product) => {
      console.log(`- ${product.name} (${product._id})`)
    })

    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
