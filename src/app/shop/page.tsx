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
      <div className="min-h-screen bg-primary pt-16 sm:pt-20 md:pt-24">
        <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12 xl:px-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 animate-pulse border-b border-black/[0.06] pb-10 sm:mb-16">
              <div className="mb-4 h-2 w-28 rounded-full bg-black/[0.04]" />
              <div className="h-10 w-40 rounded-full bg-black/[0.04] sm:h-12" />
              <div className="mt-5 h-4 w-72 max-w-full rounded-full bg-black/[0.04]" />
            </div>
            <div className="mb-12 flex flex-wrap gap-2 sm:mb-14">
              {categories.map((category) => (
                <div key={category} className="h-9 w-24 animate-pulse rounded-full bg-black/[0.04]" />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-12 md:gap-x-8 lg:grid-cols-3 lg:gap-x-9 lg:gap-y-14">
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
      <div className="flex min-h-screen items-center justify-center pt-32">
        <div className="max-w-md px-6 text-center">
          <p className="mb-3 font-serif text-2xl font-light text-black-dark">Something went wrong</p>
          <p className="text-sm text-black/55">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary pt-16 sm:pt-20 md:pt-24">
      <section className="px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12 lg:py-24 xl:px-24">
        <div className="mx-auto max-w-7xl">
          {/* Editorial header */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 border-b border-black/[0.06] pb-10 sm:mb-14 sm:pb-12 md:mb-16"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-black/40">
                  The Collection
                </p>
                <h1 className="font-serif text-4xl font-light tracking-tight text-black-dark sm:text-5xl md:text-6xl">
                  Shop
                </h1>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-black/55 md:text-right">
                Explore artisan craftsmanship and timeless pieces — for everyday radiance or gifting with intention.
              </p>
            </div>
          </motion.div>

          {/* Category filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 flex flex-wrap items-center gap-2 sm:mb-12 sm:gap-2.5 md:mb-14"
          >
            {categories.map((category) => {
              const active = selectedCategory === category
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`btn-premium px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-[11px] ${
                    active
                      ? 'bg-black-dark text-white shadow-premium'
                      : 'border border-black/10 text-black/55 hover:border-gold/50 hover:text-black-dark'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </motion.div>

          {products && products.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-8 text-[10px] font-medium uppercase tracking-[0.28em] text-black/35 sm:mb-10"
            >
              {products.length} {products.length === 1 ? 'piece' : 'pieces'}
              {selectedCategory !== 'All' ? ` · ${selectedCategory}` : ''}
            </motion.p>
          )}

          {!products || products.length === 0 ? (
            <div className="border border-dashed border-black/10 py-20 text-center">
              <p className="font-serif text-xl font-light text-black-dark">Nothing here yet</p>
              <p className="mt-2 text-sm text-black/45">Check back soon for new pieces in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-14 md:gap-x-8 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
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
        <div className="flex min-h-screen items-center justify-center pt-32">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border border-gold/30 border-t-gold" />
            <p className="text-sm text-black/50">Loading the collection…</p>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  )
}
