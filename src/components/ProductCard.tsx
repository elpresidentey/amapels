'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, Check, Eye, Heart, ShoppingCart } from 'lucide-react'
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
        <div className="relative aspect-[4/5] rounded-sm bg-black/[0.04]" />
        <div className="mt-6 space-y-3">
          <div className="h-2 w-1/4 rounded-full bg-black/[0.04]" />
          <div className="h-5 w-3/4 rounded-full bg-black/[0.04]" />
          <div className="h-3.5 w-1/5 rounded-full bg-black/[0.04]" />
        </div>
      </div>
    )
  }

  return (
    <div className="animate-pulse">
      <div className="relative aspect-[3/4] rounded-sm bg-black/[0.04]" />
      <div className="mt-5 space-y-3">
        <div className="h-2 w-1/4 rounded-full bg-black/[0.04]" />
        <div className="h-5 w-4/5 rounded-full bg-black/[0.04]" />
        <div className="flex justify-between">
          <div className="h-4 w-1/4 rounded-full bg-black/[0.04]" />
          <div className="h-3 w-16 rounded-full bg-black/[0.04]" />
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
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="group"
      >
        <Link href={productHref} className="block">
          <div className="relative overflow-hidden rounded-sm bg-primary-light">
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
                  className="absolute inset-0 object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            {product.featured && (
              <span className="absolute left-3 top-3 z-10 border border-gold/40 bg-white/95 px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.2em] text-black-dark backdrop-blur-sm sm:left-4 sm:top-4 sm:px-2.5 sm:py-0.5">
                Featured
              </span>
            )}
            <span className="absolute bottom-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/90 text-black-dark opacity-0 shadow-premium backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
              <ArrowUpRight size={14} strokeWidth={1.5} />
            </span>
          </div>
          <div className="mt-5 pt-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/40 transition-colors group-hover:text-gold-dark">
              {product.category}
            </p>
            <div className="mt-2 flex items-baseline justify-between gap-4">
              <h3 className="min-w-0 font-serif text-lg font-light leading-snug text-black-dark transition-colors group-hover:text-black sm:text-xl">
                {product.name}
              </h3>
              <p className="shrink-0 text-sm font-medium tracking-wide text-gold-dark">
                {product.price}
              </p>
            </div>
            {detailLine && (
              <p className="mt-2 line-clamp-1 text-[11px] tracking-[0.08em] text-black/40">
                {detailLine}
              </p>
            )}
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.08, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative w-full overflow-hidden rounded-sm bg-primary-light"
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
                className="absolute inset-0 object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>

        {product.featured && (
          <span className="pointer-events-none absolute left-2 top-2 z-20 border border-gold/40 bg-white/95 px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.2em] text-black-dark backdrop-blur-sm sm:left-3 sm:top-3 sm:px-2.5">
            Featured
          </span>
        )}

        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-black/5 shadow-premium backdrop-blur-sm transition-all duration-300 hover:scale-105 sm:right-4 sm:top-4 sm:h-10 sm:w-10 ${
            wishlisted ? 'bg-white' : 'bg-white/90 hover:bg-white'
          }`}
        >
          <Heart
            size={15}
            strokeWidth={1.5}
            className={`transition-colors ${
              wishlisted ? 'fill-gold text-gold-dark' : 'text-black/50'
            }`}
          />
        </button>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-3.5 pt-12 sm:px-4 sm:pb-4"
            >
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  aria-label="Add to cart"
                  className="btn-premium inline-flex items-center gap-2 bg-white px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-black-dark shadow-premium transition-colors hover:bg-gold hover:text-black-dark sm:px-5"
                >
                  {addedToCart ? <Check size={13} strokeWidth={1.75} /> : <ShoppingCart size={13} strokeWidth={1.5} />}
                  <span className="hidden sm:inline">{addedToCart ? 'Added' : 'Add'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleQuickView}
                  aria-label="Quick view"
                  className="btn-premium inline-flex items-center gap-2 border border-white/30 bg-white/10 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black-dark sm:px-5"
                >
                  <Eye size={13} strokeWidth={1.5} />
                  <span className="hidden sm:inline">View</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Link href={productHref} className="mt-4 block px-0.5 pt-1 sm:mt-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/40 transition-colors group-hover:text-gold-dark">
          {product.category}
        </p>
        <h3 className="mt-1.5 line-clamp-2 font-serif text-base font-light leading-snug text-black-dark transition-colors sm:text-lg md:text-xl">
          {product.name}
        </h3>
        {detailLine && (
          <p className="mt-1.5 line-clamp-1 text-[11px] tracking-[0.06em] text-black/40">
            {detailLine}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-base font-medium tracking-wide text-gold-dark sm:text-lg">
            {product.price}
          </p>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.18em] text-black/40 transition-colors group-hover:text-black-dark">
            {addedToCart ? (
              <>
                <Check size={11} strokeWidth={1.75} />
                Added
              </>
            ) : (
              <>
                Details
                <ArrowUpRight size={11} strokeWidth={1.5} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </>
            )}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
