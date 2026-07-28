import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

async function clearOrders() {
  const { default: dbConnect } = await import('@/lib/mongodb')
  const { default: Order } = await import('@/models/Order')

  try {
    await dbConnect()
    const result = await Order.deleteMany({})
    console.log(`Cleared ${result.deletedCount} orders from database.`)
    console.log('Dashboard will now show zero orders and revenue.')
    process.exit(0)
  } catch (error) {
    console.error('Error clearing orders:', error)
    process.exit(1)
  }
}

clearOrders()