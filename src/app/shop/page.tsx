'use client'

import { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { useProducts } from '@/hooks/useProducts'
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard'

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
      <div className="min-h-screen bg-primary-light/15 pt-16 sm:pt-20 md:pt-24">
        <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12 xl:px-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 animate-pulse text-center sm:mb-16 md:mb-20">
              <div className="mx-auto mb-4 h-2.5 w-36 rounded bg-black/5" />
              <div className="mx-auto h-10 w-32 rounded bg-black/5 sm:h-12" />
              <div className="mx-auto mt-6 h-4 w-80 max-w-full rounded bg-black/5" />
            </div>
            <div className="mb-12 flex flex-wrap justify-center gap-2 sm:mb-16 md:mb-20">
              {categories.map((category) => (
                <div key={category} className="h-10 w-24 animate-pulse rounded-full bg-black/5 sm:w-28" />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 md:gap-8 lg:grid-cols-3 lg:gap-9 xl:gap-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-accent-orange mb-4">Oops! Something went wrong.</p>
          <p className="text-black/70">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-light/15 pt-16 sm:pt-20 md:pt-24">
      <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12 lg:py-28 xl:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.45em] text-black/50 sm:mb-6">DISCOVER TREASURES</p>
            <h1 className="font-serif text-3xl font-light text-black-dark sm:text-4xl md:text-5xl lg:text-6xl">SHOP</h1>
            <p className="mt-4 text-base text-black/70 px-4 sm:mt-6 sm:text-lg md:mt-8">Explore exquisite jewelry, artisan craftsmanship, and timeless pieces to treasure or gift.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="flex flex-wrap justify-center gap-2 mb-12 sm:gap-3 sm:mb-16 md:gap-4 md:mb-20"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`btn-premium px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] transition-all duration-300 sm:px-6 sm:py-2.5 sm:text-[11px] md:px-7 md:py-3 md:tracking-[0.35em] ${
                  selectedCategory === category 
                    ? 'bg-black text-white shadow-gold-glow scale-105' 
                    : 'border border-gold text-black/75 hover:border-black hover:text-black-dark hover:shadow-premium'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {products && products.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mb-10 text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-black/45 sm:mb-12 md:mb-14"
            >
              {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
              {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ' to Discover'}
            </motion.p>
          )}

          {!products || products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-black/60">No products found in this category yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 md:gap-8 lg:grid-cols-3 lg:gap-9 xl:gap-10">
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
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
            <div className="w-16 h-16 border-4 border-gold border-t-brown-dark rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-black/70">Loading products...</p>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  )
}

