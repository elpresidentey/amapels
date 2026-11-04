'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Gift, PackageCheck, Sparkles } from 'lucide-react'
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard'
import NewsletterSignup from '@/components/NewsletterSignup'
import { useProducts } from '@/hooks/useProducts'
import { matchesFinish, type FinishFilter } from '@/lib/productFinish'

const collections = [
  {
    name: 'Necklaces', note: 'The finishing touch you keep on.', image: '/images/julie-sd--Njp0M9Rzhc-unsplash.webp', href: '/shop?category=Necklaces',
  },
  {
    name: 'Earrings', note: 'A little light, close to the face.', image: '/images/godfred-kwakye-fOcFLNzGtd0-unsplash.webp', href: '/shop?category=Earrings',
  },
  {
    name: 'Bracelets', note: 'Made for the everyday, and then some.', image: '/images/k-studios-hbCWaqLnD_s-unsplash.webp', href: '/shop?category=Bracelets',
  },
  {
    name: 'Rings', note: 'Small details. Quite a statement.', image: '/images/pexels-vedat-28933799.webp', href: '/shop?category=Rings',
  },
]

const heroSlides = [
  {
    id: 'gold',
    image: '/images/pexels-gabriela-brasiliano-515209300-32225451.webp',
    alt: 'A woman wearing sculptural gold earrings among tropical leaves',
    position: '58% 48%',
    eyebrow: 'Checked, worn, approved',
    title: 'Say It in Gold',
    description: 'They notice it before you say a word. So we only list what we would happily wear ourselves — no green skin, no dull days.',
    accent: "Only what we'd wear.",
  },
  {
    id: 'everyday',
    image: '/images/pexels-ben-iwara-1033992193-27152278.webp',
    alt: 'A woman wearing a statement flower earring in a black and white portrait',
    position: '67% 45%',
    eyebrow: 'Everyday pieces',
    title: 'Made to stay',
    description: "Won't tarnish, won't fade. Earrings, chains and bangles that survive work, church, traffic and weddings — the whole weekend.",
    accent: "Won't tarnish. Won't fade.",
  },
  {
    id: 'gift',
    image: '/images/mayank-gehlot-lsxBmX8Hmwc-unsplash.webp',
    alt: 'A pair of sparkling gold earrings against a dark background',
    position: '66% 57%',
    eyebrow: 'Ready to give',
    title: 'Give them something to keep',
    description: 'For your wife, sister, or best friend — even the one who says “don’t buy me anything.” Packed in Abuja, delivered nationwide.',
    accent: 'Wrapped and ready to give.',
  },
]

const assurances = [
  { icon: Sparkles, title: 'Chosen with care', text: 'Every piece is reviewed before it earns a place in the collection.' },
  { icon: PackageCheck, title: 'Packed in Abuja', text: 'Your order is carefully prepared and tracked on its way to you.' },
  { icon: Gift, title: 'Ready to give', text: 'A thoughtful find, beautifully packed for someone special.' },
]

const ease = [0.22, 1, 0.36, 1] as const

export default function Home() {
  const { products, loading } = useProducts()
  const [journalPosts, setJournalPosts] = useState<any[]>([])
  const [arrivalFinish, setArrivalFinish] = useState<FinishFilter>('all')
  const [activeHeroSlide, setActiveHeroSlide] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const storyRef = useRef<HTMLElement>(null)
  const { scrollYProgress: pageProgress } = useScroll()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const heroTextY = useTransform(scrollYProgress, [0, 0.82], [0, 72])
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.25])
  const { scrollYProgress: storyProgress } = useScroll({ target: storyRef, offset: ['start end', 'end start'] })
  const storyScale = useTransform(storyProgress, [0, 1], [1, 1.1])
  const activeSlide = heroSlides[activeHeroSlide]
  const pieces = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .reduce<typeof products>((selected, product) => {
      if (!selected.some((item) => item.category === product.category)) selected.push(product)
      return selected
    }, [])
    .slice(0, 4)
  const visiblePieces = pieces.filter((product) => matchesFinish(product, arrivalFinish))

  useEffect(() => {
    fetch('/api/blog?limit=3')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setJournalPosts(Array.isArray(data.posts) ? data.posts : []))
      .catch(() => setJournalPosts([]))
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return
    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [activeHeroSlide, prefersReducedMotion])

  return (
    <div className="bg-paper text-ink">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gold-ink"
        style={{ scaleX: prefersReducedMotion ? 0 : pageProgress }}
      />
      {/* The original AMAPELS campaign copy paired with landscape jewellery photography. */}
      <section
        ref={heroRef}
        aria-label="AMAPELS campaign images"
        aria-roledescription="carousel"
        className="relative isolate flex min-h-[min(860px,calc(100svh-5rem))] w-full items-end overflow-hidden bg-[#211912] text-white"
      >
        <motion.div className="absolute inset-0 -z-10" style={{ scale: prefersReducedMotion ? 1 : heroScale }}>
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={activeSlide.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.035 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: prefersReducedMotion ? 0.15 : 0.8 }, scale: { duration: prefersReducedMotion ? 0 : 7.2, ease: 'linear' } }}
            >
              <Image
                src={activeSlide.image}
                alt={activeSlide.alt}
                fill
                priority={activeHeroSlide === 0}
                fetchPriority={activeHeroSlide === 0 ? 'high' : 'auto'}
                sizes="100vw"
                quality={88}
                style={{ objectPosition: activeSlide.position }}
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,12,10,0.84)_0%,rgba(15,12,10,0.68)_35%,rgba(15,12,10,0.3)_68%,rgba(15,12,10,0.08)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(15,12,10,0.52)_0%,transparent_50%)]" />
        </motion.div>

        <div className="mx-auto flex min-h-[min(860px,calc(100svh-5rem))] w-full max-w-[1600px] flex-col justify-end px-5 pb-8 pt-28 sm:px-10 sm:pb-12 md:px-16 md:pb-14 lg:px-24 lg:pb-16">
          <motion.div className="mb-12 min-h-[310px] max-w-[1280px] sm:mb-16 sm:min-h-[340px] md:min-h-[390px]" style={{ y: prefersReducedMotion ? 0 : heroTextY, opacity: prefersReducedMotion ? 1 : heroTextOpacity }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
                transition={{ duration: prefersReducedMotion ? 0.15 : 0.45, ease }}
                className="max-w-[1200px] text-left"
              >
                <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.32em] text-[#e8cc91] sm:mb-6 sm:text-[11px]">{activeSlide.eyebrow}</p>
                <h1 className={`max-w-[1200px] text-balance font-serif font-light leading-[0.96] tracking-[-0.045em] text-white ${activeSlide.id === 'gift' ? 'text-[clamp(1.9rem,4.6vw,4.6rem)] md:whitespace-nowrap' : 'text-[clamp(3rem,7vw,6.6rem)]'}`}>
                  {activeSlide.id === 'gift' ? <>Give them something<br className="md:hidden" />{' '}to keep</> : activeSlide.title}
                </h1>
                <p className="mt-5 max-w-[530px] text-sm leading-7 text-white/90 sm:mt-7 sm:text-base sm:leading-8">
                  {activeSlide.description}
                </p>
                <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#e8cc91] sm:mt-5 sm:text-[11px]">{activeSlide.accent}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 sm:mt-8">
              <Link href="/shop" className="group inline-flex min-h-12 items-center gap-4 border-b border-[#e5c98c] pb-2 text-[10px] font-medium uppercase tracking-[0.24em] text-white transition-colors hover:text-[#e5c98c] sm:text-[11px]">
                Shop the collection <ArrowRight size={15} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/gift-guide" className="inline-flex min-h-12 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white sm:text-[11px]">
                Find a gift <ArrowUpRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
          </motion.div>

          <div className="flex items-center justify-between gap-6 border-t border-white/30 pt-4 sm:pt-5">
            <a href="#new-in" className="inline-flex min-h-11 items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white sm:text-[10px]">
              Discover the edit <ArrowDown size={13} strokeWidth={1.4} />
            </a>
            <div className="flex items-center gap-4 sm:gap-5" aria-label="Campaign slide controls">
              <span className="hidden text-[10px] tabular-nums tracking-[0.2em] text-white/75 sm:inline">{String(activeHeroSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}</span>
              <div className="flex items-center gap-2" role="group" aria-label="Choose hero image">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveHeroSlide(index)}
                    aria-label={`Show “${slide.title}” campaign slide`}
                    aria-current={activeHeroSlide === index ? 'true' : undefined}
                    className="group flex h-11 items-center px-1"
                  >
                    <span className={`block h-[2px] transition-all duration-500 ${activeHeroSlide === index ? 'w-9 bg-[#e8cc91]' : 'w-5 bg-white/45 group-hover:bg-white/80'}`} />
                  </button>
                ))}
              </div>
              <div className="flex items-center border-l border-white/30 pl-3 sm:pl-4">
                <button type="button" onClick={() => setActiveHeroSlide((activeHeroSlide + heroSlides.length - 1) % heroSlides.length)} aria-label="Previous hero image" className="flex h-11 w-10 items-center justify-center text-white/80 transition-colors hover:text-[#e8cc91]">
                  <ChevronLeft size={19} strokeWidth={1.4} />
                </button>
                <button type="button" onClick={() => setActiveHeroSlide((activeHeroSlide + 1) % heroSlides.length)} aria-label="Next hero image" className="flex h-11 w-10 items-center justify-center text-white/80 transition-colors hover:text-[#e8cc91]">
                  <ChevronRight size={19} strokeWidth={1.4} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A concise service promise helps shoppers decide with confidence. */}
      <section aria-label="Shopping with AMAPELS" className="border-b border-ink/10 bg-chrome">
        <div className="mx-auto grid max-w-7xl divide-y divide-ink/10 px-5 py-2 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-16">
          {assurances.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: prefersReducedMotion ? 0.15 : 0.55, delay: prefersReducedMotion ? 0 : index * 0.08, ease }}
              className="flex items-center gap-4 py-5 sm:px-6 sm:py-7 lg:px-10"
            >
              <Icon className="shrink-0 text-gold-ink" size={20} strokeWidth={1.3} />
              <div>
                <h2 className="text-[10px] font-medium uppercase tracking-[0.17em]">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-ink/60">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live products put the route to purchase close to the first screen. */}
      <section id="new-in" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.65, ease }}
            className="mb-8 border-b border-ink/10 pb-6 sm:mb-10 sm:pb-8"
          >
            <div>
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-gold-ink sm:text-[11px]">Just added</p>
              <h2 className="font-serif text-3xl font-light tracking-tight sm:text-4xl md:text-[3.25rem]">New arrivals.</h2>
            </div>
          </motion.div>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 sm:mb-10">
            <div className="flex items-center gap-5" aria-label="Filter new arrivals by finish">
              {([
                ['all', 'All pieces'],
                ['gold', 'Gold'],
                ['silver', 'Silver'],
              ] as const).map(([finish, label]) => (
                <button
                  key={finish}
                  type="button"
                  onClick={() => setArrivalFinish(finish)}
                  aria-pressed={arrivalFinish === finish}
                  className={`border-b pb-2 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors sm:text-[11px] ${arrivalFinish === finish ? 'border-gold-ink text-ink' : 'border-transparent text-ink/50 hover:text-ink'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <Link href={`/shop${arrivalFinish === 'all' ? '' : `?finish=${arrivalFinish}`}`} className="group inline-flex items-center gap-2 border-b border-ink/30 pb-2 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors hover:border-gold-ink hover:text-gold-ink">
              Explore {arrivalFinish === 'all' ? 'the shop' : `${arrivalFinish} pieces`} <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-7 md:grid-cols-4 md:gap-x-6 lg:gap-x-9">
              {[0, 1, 2, 3].map((item) => <ProductCardSkeleton key={item} />)}
            </div>
          ) : visiblePieces.length ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-7 md:grid-cols-4 md:gap-x-6 lg:gap-x-9">
              {visiblePieces.map((piece, index) => <ProductCard key={piece._id} product={piece} index={index} />)}
            </div>
          ) : (
            <div className="grid items-center gap-8 py-5 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
              <div>
                <p className="font-serif text-2xl font-light">No {arrivalFinish} arrivals just yet.</p>
                <p className="mt-3 max-w-sm text-sm leading-6 text-ink/60">Explore the full collection and find a piece that feels like yours.</p>
                <Link href="/shop" className="group mt-6 inline-flex items-center gap-3 border-b border-gold-ink pb-2 text-[10px] font-medium uppercase tracking-[0.2em]">Explore all jewellery <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></Link>
              </div>
              <div className="relative aspect-[16/8] overflow-hidden">
                <Image src="/images/julie-sd--Njp0M9Rzhc-unsplash.webp" alt="A close detail of a pearl and gold necklace" fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover" />
              </div>
            </div>
          )}
          <Link href="/shop" className="group mt-9 inline-flex items-center gap-2 border-b border-ink/30 pb-2 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors hover:border-gold-ink hover:text-gold-ink sm:hidden">
            Shop all pieces <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Product categories use one image anchor and a quieter supporting grid. */}
      <section className="bg-[#eee7dc] px-5 py-20 text-[#211b15] sm:px-8 sm:py-24 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.65, ease }}
            className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end"
          >
            <div>
              <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.32em] text-[#80602a] sm:text-[10px]">Find your feeling</p>
              <h2 className="font-serif text-3xl font-light tracking-tight sm:text-4xl md:text-[3.25rem]">A piece for every day.</h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-[#211b15]/65">The small rituals, the big entrances, and all the days in between.</p>
          </motion.div>

          <div className="grid grid-cols-2 auto-rows-[minmax(150px,28vw)] gap-3 sm:gap-5 lg:auto-rows-[minmax(180px,17vw)] lg:grid-cols-12 lg:gap-6">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.name}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: prefersReducedMotion ? 0.15 : 0.7, delay: prefersReducedMotion ? 0 : index * 0.07, ease }}
                className={index === 0 ? 'col-span-2 row-span-2 lg:col-span-7 lg:row-span-2' : index === 1 ? 'lg:col-span-5' : index === 2 ? 'lg:col-span-2' : 'col-span-2 lg:col-span-3'}
              >
                <Link href={collection.href} className={`group relative block h-full min-h-[150px] overflow-hidden bg-[#ded5c9] ${index === 0 ? 'min-h-[310px]' : ''}`}>
                  <Image src={collection.image} alt={`${collection.name} jewellery`} fill sizes={index === 1 ? '(max-width: 1024px) 100vw, 58vw' : '(max-width: 1024px) 50vw, 42vw'} className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17120f]/75 via-[#17120f]/10 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-6 sm:bottom-6">
                    <div>
                      <h3 className="font-serif text-2xl font-light text-white sm:text-3xl lg:text-4xl">{collection.name}</h3>
                      <p className="mt-1 max-w-xs text-xs leading-5 text-white/80 sm:text-sm">{collection.note}</p>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/60 text-white transition-colors group-hover:border-[#d7bd83] group-hover:bg-[#d7bd83] group-hover:text-ink"><ArrowUpRight size={16} strokeWidth={1.4} /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The maker's point of view, grounded in the Abuja shop. */}
      <section ref={storyRef} className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:px-16 lg:py-36">
        <div className="mx-auto grid max-w-7xl items-center gap-10 sm:gap-14 md:grid-cols-[1.05fr_0.95fr] md:gap-16 lg:gap-24">
          <motion.div style={{ scale: prefersReducedMotion ? 1 : storyScale }} className="relative aspect-[4/5] overflow-hidden bg-surface-2 md:aspect-[0.9/1]">
            <Image src="/images/pexels-gabriela-brasiliano-515209300-32225451.webp" alt="A woman wearing statement earrings" fill sizes="(max-width: 768px) 100vw, 48vw" quality={88} className="object-cover object-center" />
            <div className="absolute bottom-4 left-4 border border-white/60 px-3 py-2 text-[9px] uppercase tracking-[0.22em] text-white drop-shadow sm:bottom-6 sm:left-6">The AMAPELS woman</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: prefersReducedMotion ? 0.15 : 0.8, ease }} className="py-2 md:py-8">
            <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.32em] text-gold-ink sm:text-[10px]">A point of view from Abuja</p>
            <h2 className="max-w-lg font-serif text-3xl font-light leading-[1.24] tracking-tight sm:text-4xl md:text-[3.35rem] md:leading-[1.3]">Good jewellery should feel like <span className="italic text-gold-ink">yourself,</span> only more so.</h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-ink/65 sm:mt-8 sm:text-base sm:leading-8">We started AMAPELS because finding a piece you love shouldn’t mean wondering how long it will last. We try, wear and choose every piece with real life in mind — then pack it with care here in Abuja.</p>
            <Link href="/story" className="group mt-7 inline-flex min-h-11 items-center gap-3 border-b border-gold-ink pb-1 text-[10px] font-medium uppercase tracking-[0.2em] sm:mt-9">Meet AMAPELS <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></Link>
            <div className="mt-11 grid grid-cols-2 gap-6 border-t border-ink/10 pt-6 sm:mt-14 sm:pt-7">
              <div><p className="font-serif text-2xl font-light">Abuja</p><p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-ink/55">Chosen & packed</p></div>
              <div><p className="font-serif text-2xl font-light">Nigeria</p><p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-ink/55">Nationwide delivery</p></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service details and policies are one tap away before checkout. */}
      <section className="border-y border-ink/10 bg-chrome px-5 py-16 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.65, ease }}
          >
            <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.32em] text-gold-ink sm:text-[10px]">The details matter</p>
            <h2 className="font-serif text-3xl font-light sm:text-4xl">Shop with ease.</h2>
          </motion.div>
          <div className="grid grid-cols-2 border-t border-ink/10 sm:grid-cols-4 sm:border-l sm:border-t-0">
            {[
              { title: 'Shipping', href: '/shipping-returns' },
              { title: 'Returns', href: '/shipping-returns' },
              { title: 'Jewellery care', href: '/care-guide' },
              { title: 'FAQs', href: '/faq' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: prefersReducedMotion ? 0.15 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.06, ease }}
                className="border-b border-r border-ink/10 last:border-r-0"
              >
                <Link href={item.href} className="group flex min-h-16 items-center justify-between px-3 py-4 text-xs transition-colors hover:bg-paper sm:min-h-20 sm:px-4 lg:px-5">
                  <span>{item.title}</span><ArrowUpRight size={14} className="text-ink/45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-ink" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* A gift-focused image and direct route to the gift guide. */}
      <section className="relative isolate min-h-[440px] overflow-hidden bg-[#251d17] text-white sm:min-h-[520px]">
        <Image src="/images/pexels-sheilabox-235376934-12184920.webp" alt="Gold jewellery arranged in warm afternoon light" fill sizes="100vw" className="-z-10 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(20,15,12,0.78)_0%,rgba(20,15,12,0.35)_60%,rgba(20,15,12,0.18)_100%)]" />
        <div className="mx-auto flex min-h-[440px] max-w-7xl items-center px-5 py-16 sm:min-h-[520px] sm:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.8, ease }}
            className="max-w-lg"
          >
            <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.34em] text-[#e5c98c] sm:text-[10px]">When you want to get it just right</p>
            <h2 className="font-serif text-4xl font-light leading-[1.06] sm:text-5xl md:text-6xl">A lovely thing, <span className="italic text-[#e5c98c]">well chosen.</span></h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/80">For birthdays, celebrations, and the person who deserves a little extra thought.</p>
            <Link href="/gift-guide" className="group mt-7 inline-flex min-h-12 items-center gap-4 border-b border-[#e5c98c] pb-2 text-[10px] font-medium uppercase tracking-[0.22em] transition-colors hover:text-[#e5c98c] sm:mt-9">Explore the gift guide <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></Link>
          </motion.div>
        </div>
      </section>

      {journalPosts.length > 0 && (
        <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-9 flex items-end justify-between gap-5 border-b border-ink/10 pb-6 sm:mb-11 sm:pb-8">
              <motion.div initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: prefersReducedMotion ? 0.15 : 0.6, ease }}><p className="mb-3 text-[9px] font-medium uppercase tracking-[0.32em] text-gold-ink sm:text-[10px]">Notes on getting dressed</p><h2 className="font-serif text-3xl font-light sm:text-4xl">From the journal.</h2></motion.div>
              <Link href="/journal" className="group hidden items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] sm:inline-flex">All stories <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
            </div>
            <div className="grid divide-y divide-ink/10 md:grid-cols-3 md:divide-x md:divide-y-0">
              {journalPosts.slice(0, 3).map((article: any, index: number) => (
                <motion.div key={article._id} initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: prefersReducedMotion ? 0.15 : 0.6, delay: prefersReducedMotion ? 0 : index * 0.08, ease }} className="py-6 md:px-6 md:py-1 md:first:pl-0 md:last:pr-0">
                  <Link href={`/journal/${article.slug}`} className="group block">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-ink/50">{String(index + 1).padStart(2, '0')} {article.publishedAt ? `· ${new Date(article.publishedAt).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })}` : ''}</p>
                    <h3 className="mt-4 font-serif text-xl font-light leading-snug transition-colors group-hover:text-gold-ink sm:text-2xl">{article.title}</h3>
                    {article.excerpt && <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/60">{article.excerpt}</p>}
                    <span className="mt-5 inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] text-ink/70">Read the story <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" /></span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <NewsletterSignup />
    </div>
  )
}
