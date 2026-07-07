'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useProducts } from '@/hooks/useProducts'

const heroSlides = [
  {
    id: 1,
    src: '/images/evie-martinez-mCjEVrBS1bM-unsplash.jpg',
    alt: 'Amapels crystal bracelet close-up',
    eyebrow: 'Everyday Radiance',
    title: 'Where Elegance Meets Artistry',
    description:
      'Exquisite jewelry crafted in Lagos to celebrate your most treasured moments, from quiet confidence to joyful celebrations.',
    accent: 'Crystal brilliance and luminous detail',
    ticker: 'Crystal radiance, timeless elegance, crafted for every cherished moment.'
  },
  {
    id: 2,
    src: '/images/sabrianna-Y_bxfTa_iUA-unsplash.jpg',
    alt: 'Amapels gold stud earrings close-up',
    eyebrow: 'Timeless Treasures',
    title: 'Grace In Every Detail',
    description:
      'From delicate studs to striking accents, each piece is designed to make you feel extraordinary every single day.',
    accent: 'Luminous gold, artisan-crafted',
    ticker: 'Refined gold treasures for moments that matter most.'
  },
  {
    id: 3,
    src: '/images/andres-vera-202NAwjisYA-unsplash.jpg',
    alt: 'AMAPELS occasion jewellery portrait',
    eyebrow: 'Celebrate In Style',
    title: 'Jewelry That Marks The Moment',
    description:
      'Artfully designed for life\'s milestones: birthdays, weddings, anniversaries. Each piece becomes a lasting memory.',
    accent: 'Statement pieces, timeless elegance',
    ticker: 'Treasured designs for celebrations, gifting, and unforgettable evenings.'
  }
]

const featuredCollections = [
  {
    title: 'Statement Earrings',
    description: 'Luminous designs that frame your face with grace and capture every glance with effortless elegance.',
    image: '/images/gabriel-ogulu-r0bH4hAVBmk-unsplash.jpg',
    span: 'md:col-span-2'
  },
  {
    title: 'Bracelets & Shine',
    description: 'Radiant adornments that dance with your every movement, crafted with exquisite detail.',
    image: '/images/lisa-marie-theck-pxg9jOgPzK4-unsplash.jpg',
    span: ''
  },
  {
    title: 'Treasured Occasions',
    description: 'Exceptional pieces chosen for celebrations, gifting moments, and memories that last forever.',
    image: '/images/julie-sd--Njp0M9Rzhc-unsplash.jpg',
    span: ''
  },
  {
    title: 'Necklaces & Sets',
    description: 'Graceful chains and harmonious collections that rest close to your heart and complete your story.',
    image: '/images/andres-vera-202NAwjisYA-unsplash.jpg',
    span: 'md:col-span-2'
  }
]

const brandPillars = [
  'Handcrafted in Lagos',
  'Artisan Craftsmanship',
  'Luxury Gift Presentation',
  'Worldwide Delivery'
]

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
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const activeSlide = heroSlides[currentSlide]

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-black text-white">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <Image
                src={activeSlide.src}
                alt={activeSlide.alt}
                fill
                priority={true}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,15,10,0.95) 0%,rgba(20,15,10,0.85) 45%,rgba(20,15,10,0.65) 100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle at top right,rgba(212,175,55,0.06),transparent 40%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-4 pb-8 pt-20 sm:px-6 sm:pb-12 sm:pt-28 md:px-12 md:pb-16 md:pt-32 lg:px-24 lg:pb-24 lg:pt-36">
          <div className="grid gap-8 sm:gap-12 lg:gap-16 lg:grid-cols-[minmax(0,1.2fr)_360px] lg:items-end">
            <div className="max-w-3xl">
              <motion.p
                key={`${activeSlide.id}-eyebrow`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                className="mb-3 sm:mb-5 md:mb-7 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.35em] sm:tracking-[0.45em] text-white/70"
              >
                {activeSlide.eyebrow}
              </motion.p>
              <motion.h1
                key={`${activeSlide.id}-title`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1 }}
                className="font-serif text-2xl font-light leading-[1.1] tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[5.2rem]"
              >
                {activeSlide.title}
              </motion.h1>
              <motion.p
                key={`${activeSlide.id}-desc`}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 max-w-xl text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-white/75"
              >
                {activeSlide.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="mt-5 sm:mt-6 md:mt-8 lg:mt-10 flex flex-col gap-2 sm:gap-3 md:flex-row md:gap-4"
              >
                <Link
                  href="/collections"
                  className="group btn-premium inline-flex items-center justify-center gap-2 sm:gap-3 bg-white px-5 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-black-dark transition-all hover:bg-primary-light hover:shadow-gold"
                >
                  <span className="hidden sm:inline">Discover Your Treasure</span>
                  <span className="sm:hidden">Shop Collection</span>
                  <ArrowRight size={14} className="sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/shop"
                  className="btn-premium inline-flex items-center justify-center gap-2 sm:gap-3 border border-white/40 bg-white/8 px-5 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white backdrop-blur-sm transition-all hover:bg-white/16 hover:border-white/60"
                >
                  <span className="hidden sm:inline">View Most Loved Pieces</span>
                  <span className="sm:hidden">View Shop</span>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.35 }}
              className="hidden rounded-[32px] border border-white/12 bg-white/8 p-6 backdrop-blur-md lg:block"
            >
              <div className="mb-12 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.35em] text-white/60">
                <span>Current Highlight</span>
                <span>{String(currentSlide + 1).padStart(2, '0')}</span>
              </div>
              <p className="text-sm text-white/60">{activeSlide.accent}</p>
              <h2 className="mt-4 font-serif text-2xl font-light leading-snug">
                {activeSlide.eyebrow}
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-white/70">
                Thoughtfully designed to showcase beautiful craftsmanship and details you'll love wearing.
              </p>
              <div className="mt-12 flex items-center justify-between">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={goToPrevious}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/18 text-white transition-all hover:bg-white/12 hover:border-white/30"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/18 text-white transition-all hover:bg-white/12 hover:border-white/30"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/55">
                  Amapels NG
                </span>
              </div>
            </motion.div>
          </div>

          <div className="mt-5 sm:mt-6 md:mt-8 lg:mt-12 rounded-xl sm:rounded-2xl lg:rounded-[30px] border border-white/12 bg-white/8 p-2 sm:p-3 md:p-4 lg:p-5 backdrop-blur-md">
            <div className="grid gap-2 sm:gap-3 md:gap-4 lg:grid-cols-[auto_1fr] lg:items-center">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="inline-flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-full border border-white/18 text-white transition-all hover:bg-white/12 hover:border-white/30"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="inline-flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-full border border-white/18 text-white transition-all hover:bg-white/12 hover:border-white/30"
                  aria-label="Next slide"
                >
                  <ChevronRight size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
                </button>
              </div>

              <div className="grid gap-2 sm:gap-2 md:gap-3 md:grid-cols-3">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className={`group rounded-xl sm:rounded-2xl md:rounded-[24px] border px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5 text-left transition-all ${
                    currentSlide === index
                      ? 'border-white/25 bg-white/12'
                      : 'border-white/8 bg-black/10 hover:border-white/18 hover:bg-white/8'
                  }`}
                  aria-label={`Go to ${slide.eyebrow}`}
                >
                  <div className="mb-2 sm:mb-3 flex items-center justify-between gap-2">
                    <p className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-white/55 transition-colors group-hover:text-white/75">
                      {slide.eyebrow}
                    </p>
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.28em] sm:tracking-[0.32em] text-white/40">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="mb-2 sm:mb-3 md:mb-4 h-px bg-white/18">
                    <motion.div
                      animate={{ width: currentSlide === index ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-white"
                    />
                  </div>
                  <p className="font-serif text-sm sm:text-base md:text-lg lg:text-xl font-light text-white leading-tight">
                    {slide.title}
                  </p>
                  <p className="mt-1 sm:mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-[10px] sm:text-xs md:text-sm text-white/65">
                    {slide.ticker}
                  </p>
                </button>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Pillars */}
      <section className="border-y border-gold/35 bg-white/40">
        <div className="mx-auto max-w-7xl px-6 py-6 md:px-12 lg:px-24">
          <div className="relative h-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPillar}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <p className="text-center text-[10px] font-semibold uppercase tracking-[0.38em] text-black/65">
                  {brandPillars[currentPillar]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center gap-2 mt-3">
            {brandPillars.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPillar(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentPillar === index ? 'w-6 bg-black' : 'w-1.5 bg-gray-100/50'
                }`}
                aria-label={`Go to pillar ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Perspective */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-24 lg:px-24 lg:py-28 xl:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.4em] text-black/50">
                Brand Perspective
              </p>
              <h2 className="font-serif text-2xl font-light leading-snug text-black-dark sm:text-3xl md:text-4xl lg:text-5xl">
                Exquisite jewelry, artfully crafted to celebrate every woman who loves to shine.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-black/78 sm:mt-6 sm:text-lg md:mt-7">
                We create timeless pieces that make you feel radiant and confident, whether it's for everyday grace or milestone celebrations.
              </p>
              <div className="mt-8 space-y-4 sm:mt-10 sm:space-y-5 md:mt-12 md:space-y-6">
                <div className="border-l border-gold pl-6">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-black/50">Our Philosophy</p>
                  <p className="text-black/78">Artisan craftsmanship, luminous designs, and timeless elegance that lets each piece tell its own story.</p>
                </div>
                <div className="border-l border-gold pl-6">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-black/50">Growing With You</p>
                  <p className="text-black/78">As our collection grows, we continue to discover treasures that celebrate your unique journey and style.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="grid gap-6 md:grid-cols-2"
            >
              <div className="relative overflow-hidden rounded-[32px] md:col-span-2">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src="/images/pexels-vedat-28933799.jpg"
                      alt="Amapels bracelet detail"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent 40%,rgba(20,15,10,0.85) 100%)]" />
                  <div className="absolute bottom-0 left-0 p-9 text-white">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-white/55">Signature Mood</p>
                    <h3 className="mt-4 font-serif text-2xl font-light">Close-up luxury with unmistakable shine</h3>
                  </div>
                </div>
              <div className="rounded-[32px] bg-black px-8 py-9 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/50">Aesthetic</p>
                <p className="mt-5 font-serif text-2xl font-light leading-snug">Less clutter, more shine and clarity.</p>
              </div>
              <div className="rounded-[32px] border border-gold bg-white px-8 py-9">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/50">Next Upgrade</p>
                <p className="mt-5 font-serif text-2xl font-light leading-snug text-black-dark">
                  More product close-ups will make this feel even more luxurious.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-28 lg:px-24 lg:py-32 xl:pb-40">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:gap-5 md:flex-row md:items-end md:justify-between lg:mb-14">
            <div>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.4em] text-black/50">
                Featured Collections
              </p>
              <h2 className="font-serif text-4xl font-light text-black-dark md:text-5xl">
                Collections crafted for every style, moment, and celebration.
              </h2>
            </div>
            <Link
              href="/collections"
              className="group inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-black-dark transition-colors hover:text-accent-orange"
            >
              Explore All Collections
              <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-7 md:grid-cols-3 lg:grid-rows-[400px_400px] md:auto-rows-[400px]">
            {/* Statement Earrings - spans 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0 }}
              className="group relative overflow-hidden rounded-[34px] md:col-span-2 hover-lift card-premium"
            >
              <div className="relative aspect-[4/5] md:aspect-auto md:h-full">
                <Image
                  src={featuredCollections[0].image}
                  alt={featuredCollections[0].title}
                  fill
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  className="object-cover img-premium"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,15,10,0.25) 0%,rgba(20,15,10,0.92) 100%)]" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="font-serif text-2xl font-light">{featuredCollections[0].title}</h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
                  {featuredCollections[0].description}
                </p>
              </div>
            </motion.div>

            {/* Bracelets & Shine - single column */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.12 }}
              className="group relative overflow-hidden rounded-[34px] hover-lift card-premium"
            >
              <div className="relative aspect-[4/5] md:aspect-auto md:h-full">
                <Image
                  src={featuredCollections[1].image}
                  alt={featuredCollections[1].title}
                  fill
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover img-premium"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,15,10,0.25) 0%,rgba(20,15,10,0.92) 100%)]" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="font-serif text-2xl font-light">{featuredCollections[1].title}</h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
                  {featuredCollections[1].description}
                </p>
              </div>
            </motion.div>

            {/* Occasion Favourites - single column */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.24 }}
              className="group relative overflow-hidden rounded-[34px] hover-lift card-premium"
            >
              <div className="relative aspect-[4/5] md:aspect-auto md:h-full">
                <Image
                  src={featuredCollections[2].image}
                  alt={featuredCollections[2].title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover img-premium"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,15,10,0.25) 0%,rgba(20,15,10,0.92) 100%)]" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="font-serif text-2xl font-light">{featuredCollections[2].title}</h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
                  {featuredCollections[2].description}
                </p>
              </div>
            </motion.div>

            {/* Necklaces & Sets - spans 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.36 }}
              className="group relative overflow-hidden rounded-[34px] md:col-span-2 hover-lift card-premium"
            >
              <div className="relative aspect-[4/5] md:aspect-auto md:h-full">
                <Image
                  src={featuredCollections[3].image}
                  alt={featuredCollections[3].title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  className="object-cover img-premium"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,15,10,0.25) 0%,rgba(20,15,10,0.92) 100%)]" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="font-serif text-2xl font-light">{featuredCollections[3].title}</h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
                  {featuredCollections[3].description}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Curated Pieces */}
      <section className="bg-primary-light/25 px-6 py-32 md:px-12 lg:px-24 lg:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.4em] text-black/50">
                Curated Pieces
              </p>
              <h2 className="font-serif text-4xl font-light text-black-dark md:text-5xl">
                Treasures to wear, treasures to give.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-black/70">
              Artfully curated jewelry for those who appreciate timeless elegance, meaningful moments, and the perfect gift.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-10 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="relative aspect-[4/5] bg-gray-100/30 rounded-[30px] mb-6"></div>
                  <div className="h-3 bg-gray-100/30 rounded w-1/3 mb-2"></div>
                  <div className="h-5 bg-gray-100/30 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-100/30 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : curatedPieces.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-3">
              {curatedPieces.map((piece, index) => (
                <motion.div
                  key={piece._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.85, delay: index * 0.12 }}
                  className="group hover-lift card-premium"
                >
                  <Link href={`/shop/${piece._id}`}>
                    <div className="relative overflow-hidden rounded-[30px] bg-white shadow-premium">
                      <div className="relative aspect-[4/5]">
                        <Image
                          src={piece.images?.[0] || '/images/sabrianna-Y_bxfTa_iUA-unsplash.jpg'}
                          alt={piece.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover img-premium"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex items-start justify-between gap-5">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/50">{piece.category}</p>
                        <h3 className="mt-2 font-serif text-xl font-medium text-black-dark">{piece.name}</h3>
                      </div>
                      <p className="pt-1 text-sm font-medium text-black-dark">{piece.price}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-black/60">No featured products yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Brand Story CTA */}
      <section className="px-6 py-32 md:px-12 lg:px-24 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
          className="mx-auto grid max-w-6xl gap-14 rounded-[40px] border border-gold/55 bg-white px-9 py-14 md:grid-cols-[1.1fr_0.9fr] md:px-14 md:py-16"
        >
          <div>
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.4em] text-black/50">The Brand Story</p>
            <h2 className="font-serif text-4xl font-light leading-snug text-black-dark md:text-5xl">
              More than jewelry: a celebration of your story, your style, your moments.
            </h2>
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-base leading-relaxed text-black/75">
              We're creating a place where you discover timeless treasures, find the perfect gift, and celebrate the beauty of every moment with confidence.
            </p>
            <div className="mt-10">
              <Link
                href="/story"
                className="group inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-black-dark transition-colors hover:text-accent-orange"
              >
                Discover Our Story
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

