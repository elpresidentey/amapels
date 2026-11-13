'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, Check, Eye, Heart, Minus, Plus, ShoppingCart } from 'lucide-react'
import type { ProductData } from '@/lib/productTypes'
import { useCartStore } from '@/store/newCartStore'

interface ProductCardProps {
  product: ProductData
  index?: number
}

const FALLBACK_IMAGE = '/images/sabrianna-Y_bxfTa_iUA-unsplash.webp'
const ease = [0.22, 1, 0.36, 1] as const

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse" role="status" aria-label="Loading product">
      <div className="relative aspect-[3/4] overflow-hidden bg-ink/[0.04]" />
      <div className="mt-5 space-y-3">
        <div className="h-2 w-1/4 rounded-full bg-ink/[0.04]" />
        <div className="h-5 w-4/5 rounded-full bg-ink/[0.04]" />
        <div className="flex justify-between">
          <div className="h-4 w-1/4 rounded-full bg-ink/[0.04]" />
          <div className="h-3 w-16 rounded-full bg-ink/[0.04]" />
        </div>
      </div>
      <span className="sr-only">Loading product details</span>
    </div>
  )
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const router = useRouter()
  const { addItem, openCart } = useCartStore()
  const prefersReducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const cardRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })
  const imageParallax = useTransform(scrollYProgress, [0, 1], [1, 1.06])

  const productHref = `/shop/${product._id}`
  const primaryImage = product.images?.[0] || FALLBACK_IMAGE
  const otherImage = product.images?.slice(1).find((img) => img && img !== primaryImage)
  const hoverImage = otherImage || primaryImage
  const hasSwap = Boolean(otherImage)
  const detailLine = product.material || product.story
  // Inventory: unavailable is the admin's manual switch; sold out is stock = 0.
  const unavailable = product.available === false
  const soldOut = !unavailable && product.stock === 0
  const notPurchasable = unavailable || soldOut

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted((prev) => !prev)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (notPurchasable) return
    addItem(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        image: primaryImage,
        category: product.category,
        size: 'Standard',
        color: 'Default',
      },
      quantity
    )
    setAddedToCart(true)
    openCart()
    setTimeout(() => {
      setAddedToCart(false)
      setQuantity(1)
    }, 2000)
  }

  const handleQuantityChange = (delta: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuantity((prev) => Math.min(99, Math.max(1, prev + delta)))
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(productHref)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: prefersReducedMotion ? 0.15 : 0.6, delay: prefersReducedMotion ? 0 : Math.min(index * 0.06, 0.3), ease }}
      className="group relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`${product.name}, ${product.category}, ${product.price}`}
    >
      <div className="relative w-full overflow-hidden bg-surface-2" style={{ aspectRatio: '3/4' }}>
        <Link
          href={productHref}
          className="absolute inset-0 z-0 block"
          aria-label={`View ${product.name} — ${product.price}`}
          tabIndex={0}
        >
          <motion.div className="absolute inset-0 overflow-hidden" style={{ scale: prefersReducedMotion ? 1 : imageParallax }}>
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover', objectPosition: 'center' }}
              className={`transition-all duration-700 ease-out group-hover:scale-[1.06] ${hasSwap ? 'group-hover:opacity-0' : ''}`}
              loading={index < 4 ? 'eager' : 'lazy'}
              quality={80}
            />
            {hasSwap ? (
              <Image
                src={hoverImage}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover', objectPosition: 'center' }}
                className="opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:opacity-100"
                loading="lazy"
                quality={80}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </motion.div>
        </Link>

        {product.featured && (
          <span className="pointer-events-none absolute left-1.5 top-1.5 z-20 border border-gold/40 bg-white/95 px-1 py-[2px] text-[5px] font-medium uppercase tracking-[0.1em] text-black-dark backdrop-blur-sm sm:left-2 sm:top-2 sm:px-1.5 sm:py-[3px] sm:text-[6px] sm:tracking-[0.12em]">
            Featured
          </span>
        )}

        {notPurchasable && (
          <span
            className={`pointer-events-none absolute left-1.5 z-20 border px-1 py-[2px] text-[5px] font-medium uppercase tracking-[0.1em] backdrop-blur-sm sm:left-2 sm:px-1.5 sm:py-[3px] sm:text-[6px] sm:tracking-[0.12em] ${
              product.featured ? 'top-7 sm:top-9' : 'top-1.5 sm:top-2'
            } ${soldOut ? 'border-black/10 bg-black/85 text-white' : 'border-red-300/50 bg-red-600/90 text-white'}`}
          >
            {soldOut ? 'Sold out' : 'Unavailable'}
          </span>
        )}

        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-black/5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 sm:right-4 sm:top-4 sm:h-10 sm:w-10 ${
            wishlisted ? 'bg-white shadow-[0_0_12px_rgba(196,163,90,0.3)]' : 'bg-white/90 hover:bg-white'
          }`}
        >
          <Heart
            size={15}
            strokeWidth={1.5}
            className={`transition-colors duration-300 ${
              wishlisted ? 'fill-gold text-gold-dark' : 'text-black/50'
            }`}
          />
        </button>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease }}
              className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-3 pt-14"
            >
              <div className="flex flex-col items-center justify-end gap-2">
                {!notPurchasable ? (
                  <div className="flex items-stretch justify-center gap-2">
                    <div
                      className="flex items-stretch bg-white/95 shadow-sm backdrop-blur-sm"
                      role="group"
                      aria-label={`Quantity for ${product.name}`}
                    >
                      <button
                        type="button"
                        onClick={handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                        className="flex w-8 items-center justify-center text-black/55 transition-colors duration-200 hover:bg-gold hover:text-black-dark disabled:pointer-events-none disabled:opacity-30 sm:w-9"
                      >
                        <Minus size={12} strokeWidth={2} />
                      </button>
                      <span
                        className="flex min-w-[1.5rem] items-center justify-center border-x border-black/10 px-1 text-[11px] font-medium tabular-nums text-black-dark"
                        aria-live="polite"
                      >
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={handleQuantityChange(1)}
                        disabled={quantity >= 99}
                        aria-label="Increase quantity"
                        className="flex w-8 items-center justify-center text-black/55 transition-colors duration-200 hover:bg-gold hover:text-black-dark disabled:pointer-events-none disabled:opacity-30 sm:w-9"
                      >
                        <Plus size={12} strokeWidth={2} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      aria-label={addedToCart ? 'Added to bag' : 'Add to bag'}
                      className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap bg-white px-2 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-black-dark shadow-sm transition-all duration-300 hover:bg-gold hover:text-black-dark hover:shadow-[0_4px_16px_rgba(196,163,90,0.3)] active:scale-95"
                    >
                      {addedToCart ? <Check size={13} strokeWidth={1.75} /> : <ShoppingCart size={13} strokeWidth={1.5} />}
                      <span>{addedToCart ? 'Added' : 'Add to Bag'}</span>
                    </button>
                  </div>
                ) : (
                  <span className="flex w-full items-center justify-center gap-2 bg-black/85 px-2 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                    <ShoppingCart size={13} strokeWidth={1.5} />
                    <span>{soldOut ? 'Sold out' : 'Unavailable'}</span>
                  </span>
                )}
              <button
                type="button"
                onClick={handleQuickView}
                aria-label="Quick view product details"
                className="mt-2 flex w-full items-center justify-center gap-2 whitespace-nowrap border border-white/35 bg-white/10 px-2 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white/55 hover:bg-white/20 active:scale-95"
              >
                <Eye size={13} strokeWidth={1.5} />
                <span>View</span>
              </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Link href={productHref} className="mt-4 flex min-h-[146px] flex-col px-0.5 pt-1 focus-visible:outline-2 focus-visible:outline-gold sm:mt-5" tabIndex={-1} aria-hidden="true">
        <p className="h-4 text-[10px] font-medium uppercase tracking-[0.24em] text-ink/60 transition-colors duration-300 group-hover:text-gold-ink">
          {product.category}
        </p>
        <h3 className="mt-2 min-h-12 line-clamp-2 font-serif text-base font-light leading-6 text-ink transition-colors duration-300 group-hover:text-ink sm:text-lg md:min-h-14 md:text-xl md:leading-7">
          {product.name}
        </h3>
        <p aria-hidden={!detailLine} className="mt-1.5 min-h-4 line-clamp-1 text-[11px] leading-4 tracking-[0.04em] text-ink/60">
          {detailLine || '\u00a0'}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <p className="text-base font-medium tracking-wide text-gold-ink sm:text-lg">
            {product.price}
          </p>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-ink/60 transition-colors duration-300 group-hover:text-ink">
            {addedToCart ? (
              <>
                <Check size={11} strokeWidth={1.75} />
                Added
              </>
            ) : (
              <>
                Details
                <ArrowUpRight size={11} strokeWidth={1.5} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </>
            )}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
