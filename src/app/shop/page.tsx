'use client'

import { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useProducts } from '@/hooks/useProducts'

const categories = ['All', 'Earrings', 'Necklaces', 'Bracelets', 'Jewellery Sets']

function ShopContent() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const categoryFromQuery = searchParams.get('category')
    if (categoryFromQuery && categories.includes(categoryFromQuery)) {
      setSelectedCategory(categoryFromQuery)
      return
    }
    setSelectedCategory('All')
  }, [searchParams])

  const { products, loading, error } = useProducts(selectedCategory)

  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sand border-t-brown-dark rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brown/70">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-accent-orange mb-4">Oops! Something went wrong.</p>
          <p className="text-brown/70">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen">
      <section className="py-28 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center mb-20"
          >
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.45em] text-brown/50">DISCOVER TREASURES</p>
            <h1 className="font-serif text-5xl font-light text-brown-dark md:text-6xl">SHOP</h1>
            <p className="mt-8 text-lg text-brown/70">Explore exquisite jewelry, artisan craftsmanship, and timeless pieces to treasure or gift.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="flex flex-wrap justify-center gap-4 mb-20"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.35em] transition-all duration-300 ${
                  selectedCategory === category 
                    ? 'bg-brown-dark text-white' 
                    : 'border border-sand text-brown/75 hover:border-brown-dark hover:text-brown-dark'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-brown/60">No products found in this category yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 45 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.12 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/shop/${product._id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden mb-6 rounded-[32px] bg-white shadow-sm">
                      <Image 
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-800 group-hover:scale-108"
                      />
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brown/50 mb-2">{product.category}</p>
                    <h3 className="font-serif text-xl font-medium text-brown-dark mb-1">{product.name}</h3>
                    <p className="text-brown-dark font-medium">{product.price}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-sand border-t-brown-dark rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-brown/70">Loading products...</p>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  )
}
