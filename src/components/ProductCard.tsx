'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, Check, Eye, Heart, ShoppingCart, Star } from 'lucide-react'
import type { ProductData } from '@/lib/fallbackProducts'
import { useCartStore } from '@/store/newCartStore'

interface ProductCardProps {
  product: ProductData
  index?: number
  variant?: 'shop' | 'curated'
}

const FALLBACK_IMAGE = '/images/sabrianna-Y_bxfTa_iUA-unsplash.jpg'

export function ProductCardSkeleton({ variant = 'shop' }: { variant?: 'shop' | 'curated' }) {
  if (variant === 'curated') {
    return (
      <div className="animate-pulse">
        <div className="relative aspect-[4/5] rounded-[30px] bg-black/5" />
        <div className="mt-6 space-y-3">
          <div className="h-2.5 w-1/4 rounded bg-black/5" />
          <div className="h-5 w-3/4 rounded bg-black/5" />
          <div className="h-4 w-1/5 rounded bg-black/5" />
        </div>
      </div>
    )
  }

  return (
    <div className="animate-pulse">
      <div className="relative aspect-[3/4] rounded-2xl bg-black/5 sm:rounded-3xl md:rounded-[32px]" />
      <div className="mt-4 space-y-3 px-1">
        <div className="flex justify-between">
          <div className="h-2.5 w-1/4 rounded bg-black/5" />
          <div className="h-2.5 w-16 rounded bg-black/5" />
        </div>
        <div className="h-5 w-4/5 rounded bg-black/5" />
        <div className="flex justify-between">
          <div className="h-5 w-1/4 rounded bg-black/5" />
          <div className="h-3 w-20 rounded bg-black/5" />
        </div>
      </div>
    </div>
  )
}

export default function ProductCard({ product, index = 0, variant = 'shop' }: ProductCardProps) {
  const router = useRouter()
  const { addItem, openCart } = useCartStore()
  const [isHovered, setIsHovered] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const productHref = `/shop/${product._id}`
  const primaryImage = product.images?.[0] || FALLBACK_IMAGE
  const secondaryImage = product.images?.[1]
  const detailLine = product.material || product.story

  const handleToggleWishlist = () => {
    setWishlisted((prev) => !prev)
  }

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: primaryImage,
      category: product.category,
      size: 'Standard',
      color: 'Default',
    })
    setAddedToCart(true)
    openCart()
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleQuickView = () => {
    router.push(productHref)
  }

  if (variant === 'curated') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, delay: index * 0.12 }}
        className="group hover-lift card-premium"
      >
        <Link href={productHref} className="block">
          <div className="relative overflow-hidden rounded-[30px] border border-transparent bg-white shadow-premium transition-all duration-500 group-hover:border-gold/25 group-hover:shadow-gold">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover img-premium"
              />
              {secondaryImage && (
                <Image
                  src={secondaryImage}
                  alt={`${product.name} alternate view`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            {product.featured && (
              <span className="absolute top-4 left-4 z-10 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black-dark shadow-lg">
                Featured
              </span>
            )}
            <span className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/85 text-black-dark opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <div className="mt-6 border-t border-gold/20 pt-5">
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/50 transition-colors group-hover:text-gold">
                  {product.category}
                </p>
                <h3 className="mt-2 font-serif text-xl font-medium text-black-dark transition-colors group-hover:text-gold">
                  {product.name}
                </h3>
                {detailLine && (
                  <p className="mt-2 line-clamp-1 text-xs uppercase tracking-[0.18em] text-black/45">
                    {detailLine}
                  </p>
                )}
              </div>
              <p className="shrink-0 pt-1 text-sm font-semibold text-gradient-gold">{product.price}</p>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 45 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.12 }}
      className="group w-full hover-lift card-premium"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-transparent bg-white shadow-premium transition-all duration-500 group-hover:border-gold/20 group-hover:shadow-gold sm:rounded-3xl md:rounded-[32px]"
        style={{ aspectRatio: '3/4' }}
      >
        <Link href={productHref} className="absolute inset-0 z-0 block" aria-label={`View ${product.name}`}>
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover img-premium"
            />
            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt={`${product.name} alternate view`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>

        {product.featured && (
          <span className="pointer-events-none absolute top-4 left-4 z-20 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black-dark shadow-lg">
            Featured
          </span>
        )}

        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 sm:h-10 sm:w-10 ${
            wishlisted ? 'bg-red-50' : 'bg-white/90 hover:bg-white'
          }`}
        >
          <Heart
            size={16}
            className={`sm:h-5 sm:w-5 transition-colors ${
              wishlisted ? 'fill-red-500 text-red-500' : 'text-black/60'
            }`}
          />
        </button>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.28 }}
              className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-4 pb-4 pt-10"
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  aria-label="Add to cart"
                  className="btn-premium inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-black-dark shadow-lg transition-colors hover:bg-gold sm:px-5"
                >
                  {addedToCart ? <Check size={14} /> : <ShoppingCart size={14} />}
                  <span className="hidden sm:inline">{addedToCart ? 'Added' : 'Add'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleQuickView}
                  aria-label="Quick view"
                  className="btn-premium inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white hover:text-black-dark sm:px-5"
                >
                  <Eye size={14} />
                  <span className="hidden sm:inline">View</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Link href={productHref} className="mt-5 block border-t border-gold/15 px-1 pt-4">
        <div className="mb-2 flex items-start justify-between gap-2">
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
        <h3 className="mb-1 line-clamp-2 font-serif text-base font-medium text-black-dark transition-colors group-hover:text-gold sm:text-lg md:text-xl">
          {product.name}
        </h3>
        {detailLine && (
          <p className="mb-3 line-clamp-1 text-[11px] uppercase tracking-[0.16em] text-black/45">
            {detailLine}
          </p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-gradient-gold sm:text-xl">{product.price}</p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold transition-colors group-hover:text-black">
            {addedToCart ? (
              <>
                <Check size={12} />
                Added
              </>
            ) : (
              <>
                View Details
                <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </>
            )}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
