import { seedProducts } from '@/lib/fallbackProducts'

const API_URL = 'http://localhost:3000/api/products'

async function seedProductsViaAPI() {
  try {
    console.log('Seeding products via API...')
    
    let successCount = 0
    let errorCount = 0
    
    for (const product of seedProducts.slice(0, 10)) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        })

        if (response.ok) {
          const result = await response.json()
          console.log(`✓ Added: ${product.name}`)
          successCount++
        } else {
          console.error(`✗ Failed to add: ${product.name}`)
          errorCount++
        }
      } catch (error) {
        console.error(`✗ Error adding ${product.name}:`, error)
        errorCount++
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    console.log(`\nSeeding complete: ${successCount} products added, ${errorCount} failed`)
    process.exit(successCount > 0 ? 0 : 1)
  } catch (error) {
    console.error('Error seeding products:', error)
    process.exit(1)
  }
}

seedProductsViaAPI()
