'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard'
import { useProducts } from '@/hooks/useProducts'

const heroSlides = [
  {
    id: 1,
    src: '/images/evie-martinez-mCjEVrBS1bM-unsplash.webp',
    alt: 'Amapels crystal bracelet close-up',
    eyebrow: 'Checked, worn, approved',
    title: 'Say It in Gold',
    description:
      'They notice it before you say a word. So we only list what we would happily wear ourselves — no green skin, no dull days.',
    accent: 'Only what we\'d wear.',
    width: 1920,
    height: 1080
  },
  {
    id: 2,
    src: '/images/sabrianna-Y_bxfTa_iUA-unsplash.webp',
    alt: 'Amapels gold stud earrings close-up',
    eyebrow: 'Everyday pieces',
    title: 'Made to stay',
    description:
      "Won't tarnish, won't fade. Earrings, chains and bangles that survive work, church, traffic and weddings — the whole weekend.",
    accent: "Won't tarnish. Won't fade.",
    width: 1920,
    height: 1080
  },
  {
    id: 3,
    src: '/images/andres-vera-202NAwjisYA-unsplash.webp',
    alt: 'AMAPELS occasion jewellery portrait',
    eyebrow: 'Ready to give',
    title: 'Give them something to keep',
    description:
      'For your wife, your sister, your best friend, and the one who always says "don\'t buy me anything." Packed in Abuja, delivered nationwide.',
    accent: 'Wrapped and ready to give.',
    width: 1920,
    height: 1080
  }
]

const featuredCollections = [
  {
    title: 'Earrings',
    description: 'Tiny studs for Monday. Big drops for Saturday. Pick your mood.',
    image: '/images/godfred-kwakye-fOcFLNzGtd0-unsplash.webp',
    link: '/shop?category=Earrings',
    span: 'md:col-span-2'
  },
  {
    title: 'Bracelets',
    description: 'Stack them, mix them, then forget you\'re even wearing them.',
    image: '/images/k-studios-hbCWaqLnD_s-unsplash.webp',
    link: '/shop?category=Bracelets',
    span: ''
  },
  {
    title: 'Necklaces',
    description: 'The little chain you never take off, and the one that starts conversations.',
    image: '/images/prahant-studio-h0evAOsNNtg-unsplash.webp',
    link: '/shop?category=Necklaces',
    span: 'md:col-span-2'
  },
  {
    title: 'Rings',
    description: 'The small glints that pull a whole look together.',
    image: '/images/muhammad-taha-ibrahim-DWcGIvmI30Y-unsplash.webp',
    link: '/shop?category=Rings',
    span: ''
  }
]

const brandPillars = [
  'Won\'t Tarnish',
  'Won\'t Fade',
  'Won\'t Disappoint',
  'Delivery Across Nigeria'
]

const ease = [0.22, 1, 0.36, 1] as const

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentPillar, setCurrentPillar] = useState(0)
  const { products, loading } = useProducts()
  const [journalPosts, setJournalPosts] = useState<any[]>([])
  const [journalLoading, setJournalLoading] = useState(true)
  const curatedPieces = products.filter((p) => p.featured).slice(0, 3)

  useEffect(() => {
    fetch('/api/blog?limit=3')
      .then((res) => {
        if (!res.ok) throw new Error('API error')
        return res.json()
      })
      .then((data) => {
        if (data.posts) setJournalPosts(data.posts)
      })
      .catch(() => {})
      .finally(() => setJournalLoading(false))
  }, [])

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.5])
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100])

  const storyRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ['start end', 'end start'],
  })
  const storyImageParallax = useTransform(storyProgress, [0, 1], [1, 1.08])

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
    <div className="min-h-screen bg-paper">
      {/* Curated pieces */}
      <section className="bg-chrome px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-28 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-5 border-b border-ink/[0.06] pb-8 sm:mb-14 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-ink/65">
                Curated Pieces
              </p>
              <h2 className="font-serif text-2xl font-light text-ink sm:text-3xl md:text-4xl">
                Pieces we&apos;re loving right now.
              </h2>
            </div>
            <div className="flex flex-col items-start gap-4 md:items-end">
              <p className="max-w-sm text-sm leading-relaxed text-ink/65 md:text-right">
                Selected for people who like quiet elegance — and for the gift you keep
                meaning to buy.
              </p>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors hover:text-gold-ink"
              >
                View All Pieces
                <ArrowUpRight size={14} strokeWidth={1.5} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-10 md:grid-cols-3 md:gap-8">
              {[1, 2, 3].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : curatedPieces.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-10">
              {curatedPieces.map((piece, index) => (
                <ProductCard key={piece._id} product={piece} index={index} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-ink/10 py-16 text-center">
              <p className="text-sm text-ink/60">New pieces are coming. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Hero — Cinematic parallax */}
      <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden bg-chrome text-ink">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={false}
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
                fetchPriority="high"
                sizes="100vw"
                quality={85}
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCgAB//Z"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 hero-wash" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,163,90,0.08),transparent_50%)]" />
        </motion.div>

        <motion.div
          style={{ y: heroY }}
          className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-5 pt-16 sm:px-6 sm:pb-10 sm:pt-24 md:px-12 md:pb-12 lg:px-24 lg:pb-12"
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-stretch lg:gap-16">
            <div className="max-w-3xl">
              <motion.h1
                key={`${activeSlide.id}-title`}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.08, ease }}
                className="font-serif text-3xl font-light leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.4rem]"
              >
                {activeSlide.title}
              </motion.h1>
              <motion.p
                key={`${activeSlide.id}-desc`}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.16, ease }}
                className="mt-4 max-w-lg text-sm leading-relaxed text-ink sm:mt-6 sm:text-base md:text-lg"
              >
                {activeSlide.description}
              </motion.p>
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.24, ease }}
                className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4"
              >
                <Link
                  href="/collections"
                  className="btn-premium group inline-flex items-center justify-center gap-2.5 bg-ink px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-on-ink transition-all hover:bg-ink/85 sm:py-4 sm:text-[11px]"
                >
                  Shop Now
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/shop"
                  className="btn-premium inline-flex items-center justify-center gap-2.5 border border-ink/50 bg-chrome/60 px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-ink backdrop-blur-sm transition-all hover:border-ink/70 hover:bg-chrome sm:py-4 sm:text-[11px]"
                >
                  Shop Gifts
                </Link>
              </motion.div>
            </div>

            {/* Desktop highlight card */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease }}
              className="hidden border border-ink/10 bg-chrome/95 p-6 backdrop-blur-xl lg:flex lg:flex-col"
            >
              <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.32em] text-ink/70">
                <span>This Week&apos;s Picks</span>
                <span className="text-gold-ink">{String(currentSlide + 1).padStart(2, '0')} / 03</span>
              </div>
              <div className="mt-8 flex-1">
                {activeSlide.accent ? (
                  <p className="text-xs tracking-wide text-gold-ink">{activeSlide.accent}</p>
                ) : null}
                <h2 className="mt-3 font-serif text-2xl font-light leading-snug">
                  {activeSlide.eyebrow}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">
                  Picked because we&apos;d happily wear them ourselves.
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-ink/10 pt-5">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={goToPrevious}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/25 text-ink transition-all hover:border-gold-ink/60 hover:bg-ink/[0.06]"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={16} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/25 text-ink transition-all hover:border-gold-ink/60 hover:bg-ink/[0.06]"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-ink/70">
                  AMAPELS NG
                </span>
              </div>
            </motion.div>
          </div>

          {/* Mobile slide controls */}
          <div className="mt-6 flex items-center justify-between border border-ink/10 bg-chrome/95 px-3 py-2.5 backdrop-blur-xl sm:mt-8 md:hidden">
            <button
              type="button"
              onClick={goToPrevious}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/25 text-ink transition-all hover:bg-ink/[0.06]"
              aria-label="Previous slide"
            >
              <ChevronLeft size={15} strokeWidth={1.5} />
            </button>
            <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-ink/70">
              <span className="text-gold-ink">{String(currentSlide + 1).padStart(2, '0')}</span>
              <span className="mx-1.5 text-ink/70">/</span>
              <span className="text-ink/70">{String(heroSlides.length).padStart(2, '0')}</span>
            </span>
            <button
              type="button"
              onClick={goToNext}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/25 text-ink transition-all hover:bg-ink/[0.06]"
              aria-label="Next slide"
            >
              <ChevronRight size={15} strokeWidth={1.5} />
            </button>
          </div>

          {/* Slide strip */}
          <div className="mt-6 hidden border border-ink/10 bg-chrome/95 p-3 backdrop-blur-xl sm:mt-8 sm:p-4 md:block lg:mt-10">
            <div className="grid grid-cols-[auto_1fr] items-stretch gap-2 sm:gap-3">
              <div className="flex flex-col items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/25 text-ink transition-all hover:bg-ink/[0.06] lg:h-10 lg:w-10"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={15} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/25 text-ink transition-all hover:bg-ink/[0.06] lg:h-10 lg:w-10"
                  aria-label="Next slide"
                >
                  <ChevronRight size={15} strokeWidth={1.5} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={`group flex h-full flex-col border px-2.5 py-3 text-left transition-all duration-300 sm:px-4 sm:py-4 lg:px-5 lg:py-5 ${
                      currentSlide === index
                        ? 'border-gold-ink/40 bg-ink/[0.06]'
                        : 'border-ink/12 bg-transparent hover:border-ink/25 hover:bg-ink/[0.04]'
                    }`}
                    aria-label={`Go to ${slide.eyebrow}`}
                  >
                    <div className="mb-2.5 flex items-center justify-between gap-2 sm:mb-3">
                      <p className="hidden truncate text-[9px] font-medium uppercase tracking-[0.28em] text-ink/70 md:block sm:text-[10px]">
                        {slide.eyebrow}
                      </p>
                      <span className="ml-auto shrink-0 text-[9px] font-medium tracking-[0.2em] text-ink/70 sm:text-[10px]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="mb-2 h-px shrink-0 bg-ink/10 sm:mb-3">
                      <motion.div
                        animate={{ width: currentSlide === index ? '100%' : '0%' }}
                        transition={{ duration: 0.45, ease }}
                        className="h-full bg-gold"
                      />
                    </div>
                    <p className="line-clamp-2 min-h-[2.75em] font-serif text-base font-light leading-snug text-ink sm:text-lg">
                      {slide.title}
                    </p>
                    {slide.accent ? (
                      <p className="mt-2 hidden line-clamp-1 text-[11px] text-ink/70 sm:block sm:text-xs">
                        {slide.accent}
                      </p>
                    ) : (
                      <span className="mt-2 hidden sm:block" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Brand pillars */}
      <section className="border-y border-gold/20 bg-chrome">
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
                <p className="text-center text-[10px] font-medium uppercase tracking-[0.36em] text-ink/65">
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
                  currentPillar === index ? 'w-8 bg-gold' : 'w-3 bg-ink/15'
                }`}
                aria-label={`Go to pillar ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section ref={storyRef} className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-28 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease }}
            >
              <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-ink/65">
                Our Story
              </p>
              <h2 className="font-serif text-2xl font-light leading-[1.15] text-ink sm:text-3xl md:text-[2.2rem]">
                Your jewellery speaks before you do
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/60">
                <p>
                  You know that feeling when you finally find earrings you love, wear them twice,
                  and they start changing colour? We got tired of it too. So we started shopping
                  properly — testing pieces, comparing finishes, keeping only the ones that hold up
                  to Nigerian life: work, church, traffic, weddings, the whole weekend.
                </p>
                <p>
                  That&apos;s the shop. Every pair, chain and bangle we list has been worn, checked
                  and approved by us before you ever see it. If we wouldn&apos;t wear it ourselves,
                  we don&apos;t list it — whether it&apos;s for you or for someone you love.
                </p>
              </div>
              <div className="mt-10 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2, ease }}
                  className="border-l border-gold/50 pl-5"
                >
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-ink/65">Nigerian-Owned</p>
                  <p className="text-sm leading-relaxed text-ink/65">
                    Run in Abuja by Nigerians, for Nigerian life — and shipped nationwide, so your
                    order arrives the way it was packed.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.35, ease }}
                  className="border-l border-gold/50 pl-5"
                >
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-ink/65">Delivered With Care</p>
                  <p className="text-sm leading-relaxed text-ink/65">
                    Picked, checked and wrapped by hand in Abuja, then tracked to your door — same
                    day inside the FCT, nationwide after that.
                  </p>
                </motion.div>
              </div>
              <Link
                href="/story"
                className="group mt-10 inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors hover:text-gold-ink"
              >
                Read the Full Story
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease }}
              className="relative lg:h-[600px]"
            >
              <motion.div className="relative aspect-[4/5] overflow-hidden lg:absolute lg:inset-0" style={{ scale: storyImageParallax }}>
                <Image
                  src="/images/pexels-vedat-28933799.webp"
                  alt="AMAPELS jewellery detail"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={90}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgb(var(--color-wash)/0.3)_0%,transparent_60%)]" />
                <div className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(180deg,transparent_0%,rgb(var(--color-wash)/0.55)_28%,rgb(var(--color-wash)/0.88)_55%,rgb(var(--color-wash)/0.96)_100%)] p-8 text-ink">
                  <p className="mb-2 font-serif text-2xl font-light italic text-gold-ink">&ldquo;If it turns your finger green, we&apos;ve failed. Simple.&rdquo;</p>
                  <p className="text-xs text-ink/70">- The AMAPELS team</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cinematic editorial break */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-chrome sm:h-[80vh]">
        <motion.div
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease }}
          className="absolute inset-0"
        >
          <Image
            src="/images/usman-umar-nbF4Iks4Ujc-unsplash.webp"
            alt="AMAPELS jewellery detail"
            fill
            sizes="100vw"
            quality={90}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(var(--color-wash)/0.85)_0%,rgb(var(--color-wash)/0.5)_50%,rgb(var(--color-wash)/0.75)_100%)]" />
        </motion.div>
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 sm:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease }}
            className="max-w-2xl"
          >
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-gold-ink">
              The AMAPELS Philosophy
            </p>
            <blockquote className="font-serif text-2xl font-light leading-[1.2] text-ink sm:text-3xl md:text-4xl">
              &ldquo;Your jewellery speaks before you do.
              <br />
              <span className="text-gold-ink">We just make sure it says something worth hearing.</span>&rdquo;
            </blockquote>
            <div className="mt-8 h-px w-16 bg-gold/50" />
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-ink/85">
              Chosen in Abuja. Worn by women who move through the world with grace,
              confidence, and an unshakable sense of who they are.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured collections */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-24 lg:px-24 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 border-b border-ink/[0.06] pb-8 sm:mb-12 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-ink/65">
                Featured Collections
              </p>
              <h2 className="max-w-xl font-serif text-2xl font-light text-ink sm:text-3xl md:text-4xl">
                Find your kind of shine.
              </h2>
            </div>
            <Link
              href="/collections"
              className="group inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors hover:text-gold-ink"
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
                      className={`object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]`}
                    />
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--color-wash)/0.15)_0%,rgb(var(--color-wash)/0.6)_40%,rgb(var(--color-wash)/0.9)_100%)] transition-opacity duration-500 group-hover:opacity-95" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-ink sm:p-7 md:p-8">
                    <div className="mb-3 h-px w-8 bg-gold/70 transition-all duration-500 group-hover:w-14" />
                    <h3 className="font-serif text-xl font-light sm:text-2xl">{collection.title}</h3>
                    <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-ink/75">
                      {collection.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-gold-ink">
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

      {/* Jewellery With Meaning */}
      <section className="bg-chrome px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-28 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
            className="mb-16 text-center"
          >
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-gold-ink">
              Jewellery With Meaning
            </p>
            <h2 className="font-serif text-2xl font-light leading-[1.15] text-ink sm:text-3xl md:text-4xl">
              Because it&apos;s never
              <br />
              <span className="text-gold-ink">just jewellery.</span>
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease }}
              className="mx-auto mt-6 h-px w-16 bg-gold/40"
            />
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            {[
              {
                icon: '✦',
                title: 'For the Milestones',
                description:
                  'The new job. The graduation. The day you finally did the thing. Get yourself something that remembers it with you.',
              },
              {
                icon: '♦',
                title: 'For the Everyday',
                description:
                  'Not every day needs a reason. Some pieces are just for school runs, meetings, and grabbing suya on the way home.',
              },
              {
                icon: '∞',
                title: 'For the Gifting',
                description:
                  'Your sister\'s birthday, your bestie\'s wedding, that one person who\'s impossible to buy for. Give them something that still looks new long after the party.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.15 + index * 0.12, ease }}
                className="group border border-ink/[0.08] bg-ink/[0.03] px-7 py-10 backdrop-blur-sm transition-all duration-500 hover:border-gold/20 hover:bg-ink/[0.06] sm:px-8 sm:py-12"
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.12, ease }}
                  className="mb-6 block font-serif text-4xl text-gold-ink"
                >
                  {item.icon}
                </motion.span>
                <h3 className="mb-4 font-serif text-xl font-light text-ink sm:text-2xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink/65">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* From Our Journal */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-28 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="mb-14 flex flex-col gap-5 border-b border-ink/[0.06] pb-10 sm:mb-16 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-ink/65">
                From Our Journal
              </p>
              <h2 className="max-w-xl font-serif text-2xl font-light text-ink sm:text-3xl md:text-4xl">
                Style tips, gift ideas, and the stories behind what we wear.
              </h2>
            </div>
            <Link
              href="/journal"
              className="group inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ink transition-colors hover:text-gold-ink"
            >
              Read the Journal
              <ArrowUpRight size={14} strokeWidth={1.5} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {journalLoading ? (
            <div className="grid gap-8 md:grid-cols-3 md:gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse border border-transparent p-6 sm:p-8">
                  <div className="mb-4 h-3 w-20 rounded bg-ink/[0.04]" />
                  <div className="mb-2 h-5 w-full rounded bg-ink/[0.04]" />
                  <div className="mb-2 h-5 w-3/4 rounded bg-ink/[0.04]" />
                  <div className="mt-3 h-12 w-full rounded bg-ink/[0.04]" />
                </div>
              ))}
            </div>
          ) : journalPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-3 md:gap-10">
              {journalPosts.map((article: any, index: number) => (
                <motion.div
                  key={article._id}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: index * 0.12, ease }}
                  className="group cursor-default border border-transparent p-6 transition-all duration-500 hover:border-gold/20 hover:bg-ink/[0.03] sm:p-8"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <motion.span
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.12, ease }}
                      className="h-px flex-1 origin-left bg-gold/40"
                    />
                    <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-ink/65">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                        : ''}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-light leading-snug text-ink transition-colors duration-300 group-hover:text-gold-ink sm:text-xl">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{article.excerpt}</p>
                  <Link href={`/journal/${article.slug}`}>
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.12, ease }}
                      className="mt-4 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-ink/65 transition-colors duration-300 group-hover:text-gold-ink"
                    >
                      Read More
                      <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-20 sm:px-6 sm:pb-24 md:px-12 md:pb-28 lg:px-24 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="mx-auto grid max-w-6xl gap-10 border border-gold/25 bg-chrome px-8 py-12 sm:px-10 sm:py-14 md:grid-cols-[1.15fr_0.85fr] md:gap-14 md:px-14 md:py-16"
        >
          <div>
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-ink/65">
              Ready to find your piece?
            </p>
            <h2 className="font-serif text-2xl font-light leading-snug text-ink sm:text-3xl md:text-[2.2rem]">
              So, which one&apos;s
              <br />
              <span className="text-gold-ink">calling you?</span>
            </h2>
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-sm leading-relaxed text-ink/60 sm:text-base">
              Go on. Your jewellery has something to say.
            </p>
            <div className="mt-8">
              <Link
                href="/shop"
                className="btn-premium group inline-flex items-center gap-2.5 bg-chrome px-7 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-ink transition-all hover:bg-ink sm:text-[11px]"
              >
                Start Shopping
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
