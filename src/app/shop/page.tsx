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
          <div className="w-16 h-16 border-4 border-gold border-t-brown-dark rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black/70">Loading products...</p>
        </div>
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
    <div className="pt-16 min-h-screen sm:pt-20 md:pt-24">
      <section className="py-16 px-4 sm:py-20 sm:px-6 md:py-24 md:px-8 lg:py-28 lg:px-12 xl:px-24">
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

          {!products || products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-black/60">No products found in this category yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 md:gap-8 lg:grid-cols-3 lg:gap-9 xl:gap-10">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 45 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.12 }}
                  className="group cursor-pointer w-full hover-lift card-premium"
                >
                  <Link href={`/shop/${product._id}`}>
                    <div className="relative w-full overflow-hidden mb-4 rounded-2xl bg-white shadow-sm sm:mb-5 sm:rounded-3xl md:mb-6 md:rounded-[32px]" style={{ aspectRatio: '3/4' }}>
                      <Image 
                        src={product.images?.[0] || '/images/sabrianna-Y_bxfTa_iUA-unsplash.jpg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover img-premium"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="px-2 sm:px-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-black/50 mb-1.5 sm:mb-2 sm:text-[10px] transition-colors group-hover:text-gold">{product.category}</p>
                      <h3 className="font-serif text-base font-medium text-black-dark mb-1 line-clamp-2 sm:text-lg md:text-xl transition-colors group-hover:text-gold">{product.name}</h3>
                      <p className="text-sm text-black-dark font-medium sm:text-base text-gradient-gold">{product.price}</p>
                    </div>
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

