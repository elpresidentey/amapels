'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard'
import { useProducts } from '@/hooks/useProducts'

const heroSlides = [
  {
    id: 1,
    src: '/images/evie-martinez-mCjEVrBS1bM-unsplash.jpg',
    alt: 'Amapels crystal bracelet close-up',
    eyebrow: 'Lagos Crafted Excellence',
    title: 'Nigerian Artistry, Global Elegance',
    description:
      'Handcrafted in Lagos with passion and precision, each piece tells a story of heritage transformed into contemporary luxury.',
    accent: 'Crystal brilliance and luminous detail',
    ticker: 'Crystal radiance, timeless elegance, crafted for every cherished moment.',
    width: 1920,
    height: 1080
  },
  {
    id: 2,
    src: '/images/sabrianna-Y_bxfTa_iUA-unsplash.jpg',
    alt: 'Amapels gold stud earrings close-up',
    eyebrow: 'African Luxury Redefined',
    title: 'Wear Your Story',
    description:
      'More than jewelry—each piece is a conversation starter, a confidence builder, and a celebration of who you are.',
    accent: 'Luminous gold, artisan-crafted',
    ticker: 'Refined gold treasures for moments that matter most.',
    width: 1920,
    height: 1080
  },
  {
    id: 3,
    src: '/images/andres-vera-202NAwjisYA-unsplash.jpg',
    alt: 'AMAPELS occasion jewellery portrait',
    eyebrow: 'Moments Made Memorable',
    title: 'Celebrate With AMAPELS',
    description:
      'From intimate gatherings to grand celebrations, our pieces become part of your most cherished memories.',
    accent: 'Statement pieces, timeless elegance',
    ticker: 'Treasured designs for celebrations, gifting, and unforgettable evenings.',
    width: 1920,
    height: 1080
  }
]

const featuredCollections = [
  {
    title: 'Lagos Luxe Earrings',
    description: 'Bold designs crafted with Nigerian artistry, framing your face with confidence.',
    image: '/images/gabriel-ogulu-r0bH4hAVBmk-unsplash.jpg',
    link: '/shop?category=Earrings',
    span: 'md:col-span-2'
  },
  {
    title: 'Radiant Bracelets',
    description: 'Handcrafted adornments that dance with your every movement.',
    image: '/images/lisa-marie-theck-pxg9jOgPzK4-unsplash.jpg',
    link: '/shop?category=Bracelets',
    span: ''
  },
  {
    title: 'Celebration Pieces',
    description: 'Exceptional designs for life\'s milestones and treasured memories.',
    image: '/images/julie-sd--Njp0M9Rzhc-unsplash.jpg',
    link: '/shop',
    span: ''
  },
  {
    title: 'Heritage Necklaces',
    description: 'Graceful chains that rest close to the heart, completing your story.',
    image: '/images/andres-vera-202NAwjisYA-unsplash.jpg',
    link: '/shop?category=Necklaces',
    span: 'md:col-span-2'
  }
]

const brandPillars = [
  'Handcrafted in Lagos, Nigeria',
  'African Artisan Excellence',
  'Premium Gift Packaging',
  'Global Shipping Available'
]

const ease = [0.22, 1, 0.36, 1] as const

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentPillar, setCurrentPillar] = useState(0)
  const { products, loading } = useProducts()
  const curatedPieces = products.filter((p) => p.featured).slice(0, 3)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPillar((prev) => (prev + 1) % brandPillars.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const activeSlide = heroSlides[currentSlide]

  const goToSlide = (index: number) => setCurrentSlide(index)
  const goToPrevious = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden bg-black-dark text-white">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease }}
              className="absolute inset-0"
            >
              <Image
                src={activeSlide.src}
                alt={activeSlide.alt}
                fill
                priority
                sizes="100vw"
                quality={85}
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCgAB//Z"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(12,10,8,0.92)_0%,rgba(12,10,8,0.72)_48%,rgba(12,10,8,0.45)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,163,90,0.08),transparent_50%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-4 pb-8 pt-24 sm:px-6 sm:pb-12 sm:pt-28 md:px-12 md:pb-16 lg:px-24 lg:pb-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_320px] lg:items-end lg:gap-16">
            <div className="max-w-3xl">
              <motion.p
                key={`${activeSlide.id}-eyebrow`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease }}
                className="mb-4 text-[10px] font-medium uppercase tracking-[0.4em] text-gold/80 sm:mb-6 sm:text-[11px]"
              >
                {activeSlide.eyebrow}
              </motion.p>
              <motion.h1
                key={`${activeSlide.id}-title`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.08, ease }}
                className="font-serif text-3xl font-light leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem]"
              >
                {activeSlide.title}
              </motion.h1>
              <motion.p
                key={`${activeSlide.id}-desc`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.16, ease }}
                className="mt-4 max-w-lg text-sm leading-relaxed text-white/70 sm:mt-6 sm:text-base md:text-lg"
              >
                {activeSlide.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.24, ease }}
                className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-4"
              >
                <Link
                  href="/collections"
                  className="btn-premium group inline-flex items-center justify-center gap-2.5 bg-white px-7 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-black-dark transition-all hover:bg-primary-light sm:text-[11px]"
                >
                  Discover Collection
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/shop"
                  className="btn-premium inline-flex items-center justify-center gap-2.5 border border-white/25 bg-white/[0.04] px-7 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-sm transition-all hover:border-white/45 hover:bg-white/10 sm:text-[11px]"
                >
                  View Shop
                </Link>
              </motion.div>
            </div>

            {/* Desktop highlight card */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease }}
              className="hidden border border-white/10 bg-white/[0.05] p-7 backdrop-blur-md lg:block"
            >
              <div className="mb-10 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.32em] text-white/45">
                <span>Current Edit</span>
                <span className="text-gold/80">{String(currentSlide + 1).padStart(2, '0')} / 03</span>
              </div>
              <p className="text-xs tracking-wide text-gold/70">{activeSlide.accent}</p>
              <h2 className="mt-3 font-serif text-2xl font-light leading-snug">
                {activeSlide.eyebrow}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/55">
                Thoughtfully composed to showcase craftsmanship and details you&apos;ll love wearing.
              </p>
              <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={goToPrevious}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-all hover:border-gold/40 hover:bg-white/8"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={16} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-all hover:border-gold/40 hover:bg-white/8"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
                  Amapels NG
                </span>
              </div>
            </motion.div>
          </div>

          {/* Slide strip */}
          <div className="mt-8 border border-white/10 bg-white/[0.04] p-3 backdrop-blur-md sm:mt-10 sm:p-4 lg:mt-14">
            <div className="grid gap-3 lg:grid-cols-[auto_1fr] lg:items-stretch">
              <div className="flex items-center justify-center gap-2 lg:flex-col lg:justify-center">
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-all hover:bg-white/10 lg:h-10 lg:w-10"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={15} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-all hover:bg-white/10 lg:h-10 lg:w-10"
                  aria-label="Next slide"
                >
                  <ChevronRight size={15} strokeWidth={1.5} />
                </button>
              </div>

              <div className="grid gap-2 sm:gap-3 md:grid-cols-3">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={`group border px-4 py-4 text-left transition-all duration-300 sm:px-5 sm:py-5 ${
                      currentSlide === index
                        ? 'border-gold/30 bg-white/[0.08]'
                        : 'border-white/8 bg-transparent hover:border-white/18 hover:bg-white/[0.04]'
                    }`}
                    aria-label={`Go to ${slide.eyebrow}`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/45 sm:text-[10px]">
                        {slide.eyebrow}
                      </p>
                      <span className="text-[9px] font-medium tracking-[0.2em] text-white/30 sm:text-[10px]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="mb-3 h-px bg-white/10">
                      <motion.div
                        animate={{ width: currentSlide === index ? '100%' : '0%' }}
                        transition={{ duration: 0.45, ease }}
                        className="h-full bg-gold"
                      />
                    </div>
                    <p className="font-serif text-base font-light leading-snug text-white sm:text-lg">
                      {slide.title}
                    </p>
                    <p className="mt-2 line-clamp-1 text-[11px] text-white/50 sm:text-xs">
                      {slide.ticker}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand pillars */}
      <section className="border-y border-gold/20 bg-primary-light/60">
        <div className="mx-auto max-w-7xl px-6 py-5 md:px-12 lg:px-24">
          <div className="relative h-7 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPillar}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <p className="text-center text-[10px] font-medium uppercase tracking-[0.36em] text-black/55">
                  {brandPillars[currentPillar]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-3 flex justify-center gap-1.5">
            {brandPillars.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPillar(index)}
                className={`h-px transition-all duration-300 ${
                  currentPillar === index ? 'w-8 bg-gold' : 'w-3 bg-black/15'
                }`}
                aria-label={`Go to pillar ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Brand perspective */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-28 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease }}
            >
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.38em] text-black/40">
                Brand Perspective
              </p>
              <h2 className="font-serif text-3xl font-light leading-[1.15] text-black-dark sm:text-4xl md:text-[2.75rem]">
                Exquisite jewelry, artfully crafted to celebrate every woman who loves to shine.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-black/60">
                We create timeless pieces that make you feel radiant and confident — for everyday grace and milestone celebrations.
              </p>
              <div className="mt-10 space-y-6">
                <div className="border-l border-gold/50 pl-5">
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-black/40">Our Philosophy</p>
                  <p className="text-sm leading-relaxed text-black/65">
                    Artisan craftsmanship, luminous designs, and quiet elegance that lets each piece tell its own story.
                  </p>
                </div>
                <div className="border-l border-gold/50 pl-5">
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-black/40">Growing With You</p>
                  <p className="text-sm leading-relaxed text-black/65">
                    As our collection grows, we continue to discover treasures that celebrate your unique journey and style.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.1, ease }}
              className="grid gap-4 md:grid-cols-2"
            >
              <div className="relative overflow-hidden md:col-span-2">
                <div className="relative aspect-[16/10]">
                  <Image
                    src="/images/pexels-vedat-28933799.jpg"
                    alt="Amapels bracelet detail"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={85}
                    className="object-cover transition-transform duration-1000 hover:scale-[1.03]"
                  />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(12,10,8,0.82)_100%)]" />
                <div className="absolute bottom-0 left-0 p-7 text-white sm:p-8">
                  <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-gold/70">Signature Mood</p>
                  <h3 className="mt-3 font-serif text-xl font-light sm:text-2xl">Close-up luxury with unmistakable shine</h3>
                </div>
              </div>
              <div className="bg-black-dark px-7 py-8 text-white">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">Aesthetic</p>
                <p className="mt-4 font-serif text-xl font-light leading-snug sm:text-2xl">
                  Less clutter. More clarity and light.
                </p>
              </div>
              <div className="border border-gold/30 bg-white px-7 py-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/40">Craft</p>
                <p className="mt-4 font-serif text-xl font-light leading-snug text-black-dark sm:text-2xl">
                  Every detail considered — from metalwork to the final polish.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured collections */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-24 lg:px-24 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 border-b border-black/[0.06] pb-8 sm:mb-12 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-black/40">
                Featured Collections
              </p>
              <h2 className="max-w-xl font-serif text-3xl font-light text-black-dark sm:text-4xl md:text-5xl">
                Crafted for every style, moment, and celebration.
              </h2>
            </div>
            <Link
              href="/collections"
              className="group inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-black-dark transition-colors hover:text-gold-dark"
            >
              Explore All
              <ArrowUpRight size={14} strokeWidth={1.5} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid gap-4 md:auto-rows-[380px] md:grid-cols-3 md:gap-5 lg:auto-rows-[420px]">
            {featuredCollections.map((collection, index) => (
              <motion.div
                key={collection.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: index * 0.08, ease }}
                className={`group relative overflow-hidden ${collection.span}`}
              >
                <Link href={collection.link} className="block h-full">
                  <div className="relative aspect-[4/5] md:aspect-auto md:h-full">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      priority={index < 2}
                      sizes={collection.span ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
                      quality={85}
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,8,0.1)_0%,rgba(12,10,8,0.75)_100%)] transition-opacity duration-500 group-hover:opacity-95" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-7 md:p-8">
                    <div className="mb-3 h-px w-8 bg-gold/70 transition-all duration-500 group-hover:w-14" />
                    <h3 className="font-serif text-xl font-light sm:text-2xl">{collection.title}</h3>
                    <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-white/60">
                      {collection.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-gold/90">
                      Explore
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated pieces */}
      <section className="bg-primary-light/50 px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-28 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-5 border-b border-black/[0.06] pb-8 sm:mb-14 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-black/40">
                Curated Pieces
              </p>
              <h2 className="font-serif text-3xl font-light text-black-dark sm:text-4xl md:text-5xl">
                Treasures to wear, treasures to give.
              </h2>
            </div>
            <div className="flex flex-col items-start gap-4 md:items-end">
              <p className="max-w-sm text-sm leading-relaxed text-black/55 md:text-right">
                Selected jewelry for those who appreciate quiet elegance and the perfect gift.
              </p>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-black-dark transition-colors hover:text-gold-dark"
              >
                View All Pieces
                <ArrowUpRight size={14} strokeWidth={1.5} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-10 md:grid-cols-3 md:gap-8">
              {[1, 2, 3].map((i) => (
                <ProductCardSkeleton key={i} variant="curated" />
              ))}
            </div>
          ) : curatedPieces.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-10">
              {curatedPieces.map((piece, index) => (
                <ProductCard key={piece._id} product={piece} index={index} variant="curated" />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-black/10 py-16 text-center">
              <p className="text-sm text-black/50">No featured products yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Brand story CTA */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-28 lg:px-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="mx-auto grid max-w-6xl gap-10 border border-gold/25 bg-white px-8 py-12 sm:px-10 sm:py-14 md:grid-cols-[1.15fr_0.85fr] md:gap-14 md:px-14 md:py-16"
        >
          <div>
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.38em] text-black/40">
              The Brand Story
            </p>
            <h2 className="font-serif text-3xl font-light leading-snug text-black-dark sm:text-4xl md:text-[2.6rem]">
              More than jewelry — a celebration of your story, style, and moments.
            </h2>
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-sm leading-relaxed text-black/60 sm:text-base">
              A place to discover timeless treasures, find the perfect gift, and celebrate beauty with confidence.
            </p>
            <div className="mt-8">
              <Link
                href="/story"
                className="group inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-black-dark transition-colors hover:text-gold-dark"
              >
                Discover Our Story
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
