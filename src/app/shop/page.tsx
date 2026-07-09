'use client'

import { Suspense, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useProducts } from '@/hooks/useProducts'
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react'

const categories = ['All', 'Earrings', 'Necklaces', 'Bracelets', 'Jewellery Sets']

function ShopContent() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())

  useEffect(() => {
    const categoryFromQuery = searchParams.get('category')
    if (categoryFromQuery && categories.includes(categoryFromQuery)) {
      setSelectedCategory(categoryFromQuery)
      return
    }
    setSelectedCategory('All')
  }, [searchParams])

  const { products, loading, error } = useProducts(selectedCategory)

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlist(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

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
                  className="group cursor-pointer w-full"
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <Link href={`/shop/${product._id}`}>
                    <div className="relative w-full overflow-hidden rounded-2xl bg-white shadow-lg sm:rounded-3xl md:rounded-[32px] transition-all duration-500 group-hover:shadow-2xl" style={{ aspectRatio: '3/4' }}>
                      {/* Badge */}
                      {product.featured && (
                        <div className="absolute top-3 left-3 z-20 bg-gold text-black-dark px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-lg">
                          Featured
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => toggleWishlist(e, product._id)}
                        className="absolute top-3 right-3 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 sm:w-10 sm:h-10"
                      >
                        <Heart 
                          size={16} 
                          className={`sm:w-5 sm:h-5 transition-colors ${
                            wishlist.has(product._id) ? 'fill-red-500 text-red-500' : 'text-black/60'
                          }`}
                        />
                      </button>

                      {/* Quick Actions Overlay */}
                      <AnimatePresence>
                        {hoveredProduct === product._id && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                          >
                            <div className="flex gap-2 justify-center">
                              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold transition-colors sm:w-12 sm:h-12">
                                <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                              </button>
                              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold transition-colors sm:w-12 sm:h-12">
                                <Eye size={18} className="sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Product Image */}
                      <div className="relative w-full h-full">
                        <Image 
                          src={product.images?.[0] || '/images/sabrianna-Y_bxfTa_iUA-unsplash.jpg'}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Secondary Image on Hover */}
                        {product.images?.[1] && (
                          <Image
                            src={product.images[1]}
                            alt={`${product.name} alternate view`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          />
                        )}
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Product Info */}
                    <div className="mt-4 px-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-black/50 transition-colors group-hover:text-gold">
                          {product.category}
                        </p>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              className={`fill-gold text-gold ${i < 4 ? '' : 'text-gold/30'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <h3 className="font-serif text-base font-medium text-black-dark mb-2 line-clamp-2 sm:text-lg md:text-xl transition-colors group-hover:text-gold">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-black-dark sm:text-xl text-gradient-gold">
                          {product.price}
                        </p>
                        <button className="text-xs text-gold font-semibold uppercase tracking-wider hover:text-black transition-colors">
                          View Details
                        </button>
                      </div>
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

