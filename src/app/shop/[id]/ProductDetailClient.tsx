'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { Heart, ShoppingBag, ArrowLeft, Check, Package } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useProduct, useProducts } from '@/hooks/useProducts'
import { useCartStore } from '@/store/newCartStore'
import ProductCard from '@/components/ProductCard'

const ease = [0.22, 1, 0.36, 1] as const

export default function ProductPage() {
  const params = useParams<{ id: string }>()
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const { product, loading, error } = useProduct(params.id)
  const { products: relatedProducts } = useProducts(product?.category || undefined)
  const { addItem, openCart } = useCartStore()

  const shopTheLook = useMemo(
    () => relatedProducts.filter((p) => p._id !== product?._id).slice(0, 3),
    [relatedProducts, product]
  )

  useEffect(() => {
    if (product) {
      setSelectedImage(0)
    }
  }, [product])

  const handleAddToCart = () => {
    if (!product) return
    if (product.available === false || product.stock === 0) return

    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/images/sabrianna-Y_bxfTa_iUA-unsplash.webp',
      category: product.category,
      size: 'Standard',
      color: 'Default',
    })

    setAddedToCart(true)
    openCart()
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-32">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border border-ink/25 border-t-gold-ink" />
          <p className="text-sm text-ink/65">Loading piece&hellip;</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-32">
        <div className="max-w-md px-6 text-center">
          <p className="mb-3 font-serif text-2xl font-light text-ink">Piece not found</p>
          <p className="mb-8 text-sm text-ink/65">{error || 'This product may no longer be available.'}</p>
          <Link
            href="/shop"
            className="btn-premium inline-flex items-center gap-2 bg-ink px-6 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-on-ink"
          >
            <ArrowLeft size={14} />
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper pt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-12 lg:px-24 lg:py-20">
        <Link
          href="/shop"
          className="mb-10 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink/60 transition-colors hover:text-ink sm:mb-14"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.7, ease }}
          >
            <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-surface-2 sm:mb-5">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={85}
                className="object-cover"
                priority
                fetchPriority="high"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden transition-all duration-300 ${
                      selectedImage === index
                        ? 'ring-1 ring-gold-ink ring-offset-2 ring-offset-paper'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 25vw, 12vw"
                      quality={75}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product info */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.7, delay: prefersReducedMotion ? 0 : 0.08, ease }}
            className="flex flex-col lg:pt-4"
          >
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.32em] text-ink/60">
              {product.category}
            </p>
            <h1 className="font-serif text-2xl font-light leading-snug text-ink sm:text-3xl md:text-[2.2rem]">
              {product.name}
            </h1>
            <p className="mt-4 text-xl font-medium tracking-wide text-gold-ink sm:text-2xl">
              {product.price}
            </p>

            {/* Inventory status */}
            {(product.available === false || product.stock === 0) && (
              <p className="mt-3 inline-flex items-center gap-2 border border-ink/10 bg-ink/[0.04] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-ink/70">
                {product.available === false ? 'Currently unavailable' : 'Sold out'}
              </p>
            )}
            {product.available !== false && product.stock !== null && product.stock !== undefined && product.stock > 0 && product.stock <= 3 && (
              <p className="mt-3 inline-flex items-center gap-2 border border-gold/30 bg-gold/[0.06] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-gold-ink">
                Only {product.stock} left in stock
              </p>
            )}
            {product.available !== false && product.stock !== null && product.stock !== undefined && product.stock > 3 && (
              <p className="mt-3 inline-flex items-center gap-2 border border-success/30 bg-success/[0.08] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-success">
                In stock · {product.stock} available
              </p>
            )}

            {/* Gift packaging callout */}
            <div className="mt-5 flex items-center gap-3 rounded border border-gold/20 bg-gold/[0.04] px-4 py-3">
              <Package size={16} strokeWidth={1.3} className="shrink-0 text-gold-ink" />
              <p className="text-[11px] leading-relaxed text-ink/60">
                Each order comes beautifully packaged with our signature AMAPELS box, drawstring pouch, and a handwritten gift note — complimentary with every purchase.
              </p>
            </div>

            <div className="my-8 h-px w-full bg-ink/10 sm:my-10" />

            <p className="text-base leading-relaxed text-ink/60">
              {product.description}
            </p>

            {/* The Inspiration */}
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-35px' }}
              transition={{ duration: prefersReducedMotion ? 0.15 : 0.55, ease }}
              className="mt-8 border-l-2 border-gold/40 bg-surface-2 px-5 py-5 sm:px-6 sm:py-6"
            >
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-gold-ink">
                The Inspiration
              </p>
              <p className="text-sm leading-relaxed italic text-ink/65">
                {product.materials
                  ? `Inspired by the interplay of ${product.materials.toLowerCase()}, this piece captures the essence of Nigerian elegance — where tradition meets the contemporary woman who moves through the world with grace and intention.`
                  : `Every curve and contour of this piece is a conversation between heritage and the modern woman — picked for moments that deserve to be remembered.`}
              </p>
            </motion.div>

            {/* Add to cart */}
            <div className="mt-10 flex gap-3 sm:mt-12">
              <button
                onClick={handleAddToCart}
                disabled={addedToCart || product.available === false || product.stock === 0}
                className={`btn-premium flex flex-1 items-center justify-center gap-2.5 py-4 text-[10px] font-medium uppercase tracking-[0.22em] transition-colors sm:py-5 sm:text-[11px] ${
                  product.available === false || product.stock === 0
                    ? 'cursor-not-allowed bg-ink/[0.06] text-ink/45'
                    : 'bg-ink text-on-ink hover:bg-ink/90 disabled:bg-gold disabled:text-black-dark'
                }`}
              >
                {product.available === false || product.stock === 0 ? (
                  <>
                    <ShoppingBag size={16} strokeWidth={1.5} />
                    {product.available === false ? 'Unavailable' : 'Sold out'}
                  </>
                ) : addedToCart ? (
                  <>
                    <Check size={16} strokeWidth={1.75} />
                    Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} strokeWidth={1.5} />
                    Add to Bag
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setWishlisted((v) => !v)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`flex h-14 w-14 items-center justify-center border transition-all duration-300 sm:h-[3.75rem] sm:w-[3.75rem] ${
                  wishlisted
                    ? 'border-gold-ink bg-gold/10 text-gold-ink'
                    : 'border-ink/15 text-ink/65 hover:border-ink/40 hover:text-ink'
                }`}
              >
                <Heart size={18} strokeWidth={1.5} className={wishlisted ? 'fill-gold' : ''} />
              </button>
            </div>

            {/* Details accordion */}
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-35px' }}
              transition={{ duration: prefersReducedMotion ? 0.15 : 0.6, ease }}
              className="mt-12 space-y-6 border-t border-ink/[0.06] pt-10 sm:mt-14"
            >
              {/* Specs */}
              <div>
                <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.28em] text-ink/60">
                  Product Details
                </h3>
                <div className="space-y-2.5 text-sm text-ink/60">
                  <div className="flex gap-4">
                    <span className="w-28 shrink-0 text-[10px] font-medium uppercase tracking-[0.16em] text-ink/60">Category</span>
                    <span>{product.category}</span>
                  </div>
                  {product.materials && (
                    <div className="flex gap-4">
                      <span className="w-28 shrink-0 text-[10px] font-medium uppercase tracking-[0.16em] text-ink/60">Materials</span>
                      <span>{product.materials}</span>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <span className="w-28 shrink-0 text-[10px] font-medium uppercase tracking-[0.16em] text-ink/60">Ships From</span>
                    <span>Abuja, Nigeria</span>
                  </div>
                </div>
              </div>

              {/* Details list */}
              <div>
                <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.28em] text-ink/60">
                  Features
                </h3>
                <ul className="space-y-3 text-sm text-ink/60">
                  {(product.details && product.details.length > 0
                    ? product.details
                    : [
                        'Premium quality materials',
                        'Elegant design perfect for any occasion',
                        'Beautiful gift packaging included',
                      ]
                  ).map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Care */}
              {product.care && (
                <div>
                  <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-ink/60">
                    Care
                  </h3>
                  <p className="text-sm leading-relaxed text-ink/65">{product.care}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Shop The Look */}
        {shopTheLook.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.7, ease }}
            className="mt-20 border-t border-ink/[0.06] pt-14 sm:mt-24 sm:pt-16 md:mt-28 md:pt-20"
          >
            <div className="mb-12 flex flex-col gap-5 border-b border-ink/[0.06] pb-8 sm:mb-14 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-ink/60">
                  Complete The Look
                </p>
                <h2 className="font-serif text-2xl font-light text-ink sm:text-3xl">
                  Shop the edit
                </h2>
              </div>
              <Link
                href={`/shop?category=${product.category}`}
                className="group inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors hover:text-gold-ink"
              >
                View All {product.category}
                <ArrowLeft size={14} strokeWidth={1.5} className="rotate-180 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-10">
              {shopTheLook.map((piece, index) => (
                <ProductCard key={piece._id} product={piece} index={index} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}
