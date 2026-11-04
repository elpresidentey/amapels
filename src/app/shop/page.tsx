'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useProducts } from '@/hooks/useProducts'
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard'
import { matchesFinish, type FinishFilter } from '@/lib/productFinish'

const categories = ['All', 'Earrings', 'Necklaces', 'Bracelets', 'Rings']

function ShopContent({ initialCategory, initialFinish }: { initialCategory: string; initialFinish: FinishFilter }) {
  const prefersReducedMotion = useReducedMotion()
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedFinish, setSelectedFinish] = useState<FinishFilter>(initialFinish)

  useEffect(() => {
    setSelectedCategory(initialCategory)
  }, [initialCategory])

  useEffect(() => {
    setSelectedFinish(initialFinish)
  }, [initialFinish])

  const { products, loading, error, refetch } = useProducts(selectedCategory)
  const visibleProducts = products.filter((product) => matchesFinish(product, selectedFinish))

  if (loading) {
    return (
      <div className="min-h-screen bg-paper pt-16 sm:pt-20 md:pt-24">
        <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12 xl:px-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 animate-pulse border-b border-ink/[0.06] pb-10 sm:mb-16">
              <div className="mb-4 h-2 w-28 rounded-full bg-ink/[0.04]" />
              <div className="h-10 w-40 rounded-full bg-ink/[0.04] sm:h-12" />
              <div className="mt-5 h-4 w-72 max-w-full rounded-full bg-ink/[0.04]" />
            </div>
            <div className="mb-12 flex flex-wrap gap-2 sm:mb-14">
              {categories.map((category) => (
                <div key={category} className="h-9 w-24 animate-pulse rounded-full bg-ink/[0.04]" />
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
          <p className="mb-3 font-serif text-2xl font-light text-ink">Something went wrong</p>
          <p className="text-sm text-ink/65">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-7 border border-ink/10 bg-chrome px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-ink transition-all duration-300 hover:border-gold/50 hover:bg-gold/10 active:scale-95"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper pt-16 sm:pt-20 md:pt-24">
      <section className="px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12 lg:py-24 xl:px-24">
        <div className="mx-auto max-w-7xl">
          {/* Editorial header */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 border-b border-ink/[0.06] pb-10 sm:mb-14 sm:pb-12 md:mb-16"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-ink/60">
                  The Collection
                </p>
                <h1 className="font-serif text-3xl font-light tracking-tight text-ink sm:text-4xl md:text-5xl">
                  Shop
                </h1>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-ink/65 md:text-right">
                Explore carefully sourced, timeless pieces — for everyday radiance or gifting with intention.
              </p>
            </div>
          </motion.div>

          {/* Category filters */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.6, delay: prefersReducedMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 flex flex-wrap items-center gap-2 sm:mb-12 sm:gap-2.5 md:mb-14"
          >
            {categories.map((category) => {
              const active = selectedCategory === category
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`btn-premium rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-[11px] ${
                    active
                      ? 'bg-ink text-on-ink shadow-premium'
                      : 'border border-ink/10 text-ink/65 hover:border-gold/50 hover:text-ink'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-ink/[0.06] pb-5 sm:mb-12 md:mb-14"
            aria-label="Filter by finish"
          >
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-ink/45">Finish</span>
            {([
              ['all', 'All finishes'],
              ['gold', 'Gold'],
              ['silver', 'Silver'],
            ] as const).map(([finish, label]) => (
              <button
                key={finish}
                type="button"
                onClick={() => setSelectedFinish(finish)}
                aria-pressed={selectedFinish === finish}
                className={`border-b pb-1.5 text-[10px] font-medium uppercase tracking-[0.17em] transition-colors sm:text-[11px] ${selectedFinish === finish ? 'border-gold-ink text-ink' : 'border-transparent text-ink/50 hover:text-ink'}`}
              >
                {label}
              </button>
            ))}
          </motion.div>

          {visibleProducts && visibleProducts.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.15 : 0.5, delay: prefersReducedMotion ? 0 : 0.15 }}
              className="mb-8 text-[10px] font-medium uppercase tracking-[0.28em] text-ink/60 sm:mb-10"
            >
              {visibleProducts.length} {visibleProducts.length === 1 ? 'piece' : 'pieces'}
              {selectedCategory !== 'All' ? ` · ${selectedCategory}` : ''}
              {selectedFinish !== 'all' ? ` · ${selectedFinish} finish` : ''}
            </motion.p>
          )}

          {!visibleProducts || visibleProducts.length === 0 ? (
            <div className="border border-dashed border-ink/10 py-20 text-center">
              <p className="font-serif text-xl font-light text-ink">No {selectedFinish === 'all' ? '' : `${selectedFinish} `}pieces here yet</p>
              <p className="mt-2 text-sm text-ink/60">Try another finish or explore the full collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-14 md:gap-x-8 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
              {visibleProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string | string[]; finish?: string | string[] }
}) {
  const queryCategory = Array.isArray(searchParams.category)
    ? searchParams.category[0]
    : searchParams.category
  const initialCategory = queryCategory && categories.includes(queryCategory)
    ? queryCategory
    : 'All'
  const finishParam = Array.isArray(searchParams.finish) ? searchParams.finish[0] : searchParams.finish
  const initialFinish: FinishFilter = finishParam === 'gold' || finishParam === 'silver' ? finishParam : 'all'

  return <ShopContent key={`${initialCategory}-${initialFinish}`} initialCategory={initialCategory} initialFinish={initialFinish} />
}
