'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, Check, Eye, Heart, ShoppingCart } from 'lucide-react'
import type { ProductData } from '@/lib/fallbackProducts'
import { useCartStore } from '@/store/newCartStore'

interface ProductCardProps {
  product: ProductData
  index?: number
}

const FALLBACK_IMAGE = '/images/sabrianna-Y_bxfTa_iUA-unsplash.jpg'
const ease = [0.22, 1, 0.36, 1] as const

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse" role="status" aria-label="Loading product">
      <div className="relative aspect-[3/4] overflow-hidden bg-black/[0.04]" />
      <div className="mt-5 space-y-3">
        <div className="h-2 w-1/4 rounded-full bg-black/[0.04]" />
        <div className="h-5 w-4/5 rounded-full bg-black/[0.04]" />
        <div className="flex justify-between">
          <div className="h-4 w-1/4 rounded-full bg-black/[0.04]" />
          <div className="h-3 w-16 rounded-full bg-black/[0.04]" />
        </div>
      </div>
      <span className="sr-only">Loading product details</span>
    </div>
  )
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const router = useRouter()
  const { addItem, openCart } = useCartStore()
  const [isHovered, setIsHovered] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })
  const imageParallax = useTransform(scrollYProgress, [0, 1], [1, 1.06])

  const productHref = `/shop/${product._id}`
  const primaryImage = product.images?.[0] || FALLBACK_IMAGE
  const secondaryImage = product.images?.[1]
  const detailLine = product.material || product.story

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted((prev) => !prev)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(productHref)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: Math.min(index * 0.08, 0.4), ease }}
      className="group w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`${product.name}, ${product.category}, ${product.price}`}
    >
      <div className="relative w-full overflow-hidden bg-primary-light" style={{ aspectRatio: '3/4' }}>
        <Link
          href={productHref}
          className="absolute inset-0 z-0 block"
          aria-label={`View ${product.name} — ${product.price}`}
          tabIndex={0}
        >
          <motion.div className="relative h-full w-full overflow-hidden" style={{ scale: imageParallax }}>
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              loading={index < 4 ? 'eager' : 'lazy'}
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
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        </Link>

        {product.featured && (
          <span className="pointer-events-none absolute left-3 top-3 z-20 border border-gold/40 bg-white/95 px-2.5 py-0.5 text-[8px] font-medium uppercase tracking-[0.2em] text-black-dark backdrop-blur-sm sm:left-4 sm:top-4">
            Featured
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
              className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-14"
            >
              <div className="flex items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  aria-label={addedToCart ? 'Added to cart' : 'Add to cart'}
                  className="inline-flex items-center gap-2 bg-white px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-black-dark shadow-sm transition-all duration-300 hover:bg-gold hover:text-black-dark hover:shadow-[0_4px_16px_rgba(196,163,90,0.3)] active:scale-95"
                >
                  {addedToCart ? <Check size={13} strokeWidth={1.75} /> : <ShoppingCart size={13} strokeWidth={1.5} />}
                  <span>{addedToCart ? 'Added' : 'Add to Bag'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleQuickView}
                  aria-label="Quick view product details"
                  className="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black-dark active:scale-95"
                >
                  <Eye size={13} strokeWidth={1.5} />
                  <span>View</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Link href={productHref} className="mt-4 block px-0.5 pt-1 focus-visible:outline-2 focus-visible:outline-gold sm:mt-5" tabIndex={-1} aria-hidden="true">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/40 transition-colors duration-300 group-hover:text-gold-dark">
          {product.category}
        </p>
        <h3 className="mt-1.5 line-clamp-2 font-serif text-base font-light leading-snug text-black-dark transition-colors duration-300 group-hover:text-black sm:text-lg md:text-xl">
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
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-black/40 transition-colors duration-300 group-hover:text-black-dark">
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