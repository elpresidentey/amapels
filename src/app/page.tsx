'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Gift, PackageCheck, Sparkles } from 'lucide-react'
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard'
import NewsletterSignup from '@/components/NewsletterSignup'
import { useProducts } from '@/hooks/useProducts'
import { matchesFinish, type FinishFilter } from '@/lib/productFinish'

const collections = [
  {
    name: 'Necklaces', note: 'The finishing touch you keep on.', image: '/images/hero-necklaces.webp', position: 'center 58%', href: '/shop?category=Necklaces',
  },
  {
    name: 'Earrings', note: 'A little light, close to the face.', image: '/images/hero-earrings.webp', position: '62% center', href: '/shop?category=Earrings',
  },
  {
    name: 'Bracelets', note: 'Made for the everyday, and then some.', image: '/images/pexels-vedat-29043373.webp', position: 'center 48%', href: '/shop?category=Bracelets',
  },
  {
    name: 'Rings', note: 'Small details. Quite a statement.', image: '/images/hero-rings.webp', position: 'center 54%', href: '/shop?category=Rings',
  },
]

const heroFrames = [
  { image: '/images/hero-model.webp', position: '58% center' },
  { image: '/images/pexels-gabriela-brasiliano-515209300-32225451.webp', position: '58% center' },
  { image: '/images/pexels-ben-iwara-1033992193-27152278.webp', position: '65% center' },
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
  const [activeHeroFrame, setActiveHeroFrame] = useState(0)
  const [bestsellerIds, setBestsellerIds] = useState<string[]>([])
  const [bestsellersLoading, setBestsellersLoading] = useState(true)
  const prefersReducedMotion = useReducedMotion()
  const storyRef = useRef<HTMLElement>(null)
  const { scrollYProgress: pageProgress } = useScroll()
  const { scrollYProgress: storyProgress } = useScroll({ target: storyRef, offset: ['start end', 'end start'] })
  const storyScale = useTransform(storyProgress, [0, 1], [1, 1.1])
  const newestPieces = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)
  const featuredPieces = products.filter((product) => product.featured).slice(0, 4)
  const visiblePieces = newestPieces.filter((product) => matchesFinish(product, arrivalFinish))
  const bestsellerPieces = bestsellerIds
    .map((id) => products.find((product) => product._id === id))
    .filter((product): product is (typeof products)[number] => Boolean(product))

  useEffect(() => {
    fetch('/api/blog?limit=3')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setJournalPosts(Array.isArray(data.posts) ? data.posts : []))
      .catch(() => setJournalPosts([]))
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return
    const timer = window.setInterval(() => {
      setActiveHeroFrame((current) => (current + 1) % heroFrames.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [prefersReducedMotion])

  useEffect(() => {
    let ignore = false
    fetch('/api/products/bestsellers')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => {
        if (!ignore) setBestsellerIds(Array.isArray(data.productIds) ? data.productIds : [])
      })
      .catch(() => {
        if (!ignore) setBestsellerIds([])
      })
      .finally(() => {
        if (!ignore) setBestsellersLoading(false)
      })
    return () => { ignore = true }
  }, [])

  return (
    <div className="bg-paper text-ink">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gold-ink"
        style={{ scaleX: prefersReducedMotion ? 0 : pageProgress }}
      />
      <section className="pt-[calc(3.5rem+env(safe-area-inset-top))] lg:pt-[calc(4.375rem+env(safe-area-inset-top))]">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.15 : 0.7, ease }}
          className="relative flex min-h-[calc(100svh-3.5rem-env(safe-area-inset-top))] items-center overflow-hidden bg-[#28190f] px-5 py-8 text-white sm:px-10 sm:py-10 lg:min-h-[calc(100svh-4.375rem-env(safe-area-inset-top))] lg:px-[8vw]"
        >
          <div aria-hidden="true" className="absolute inset-0">
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={heroFrames[activeHeroFrame].image}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.035 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: prefersReducedMotion ? 0.15 : 0.8 }, scale: { duration: prefersReducedMotion ? 0 : 7.2, ease: 'linear' } }}
              >
                <Image
                  src={heroFrames[activeHeroFrame].image}
                  alt=""
                  fill
                  priority={activeHeroFrame === 0}
                  fetchPriority={activeHeroFrame === 0 ? 'high' : 'auto'}
                  sizes="100vw"
                  quality={88}
                  style={{ objectPosition: heroFrames[activeHeroFrame].position }}
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,14,10,0.84)_0%,rgba(20,14,10,0.67)_42%,rgba(20,14,10,0.26)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(20,14,10,0.45)_0%,transparent_52%)]" />
          </div>

          <motion.div className="relative z-10 w-full min-w-0 max-w-[570px] -translate-y-6 sm:-translate-y-8 lg:translate-y-0">
            <p className="mb-5 text-[9px] font-medium uppercase tracking-[0.3em] text-[#e8cc91] sm:mb-7 sm:text-[10px]">Style it. Love it. Repeat.</p>
            <h1 className="text-balance font-serif text-[clamp(2rem,9vw,3.5rem)] font-light leading-[0.98] tracking-[-0.035em] lg:text-[clamp(2.5rem,5vw,4rem)]">
              Give them<br /> <span className="text-[#e8cc91]">something to keep.</span>
            </h1>
            <p className="mt-5 max-w-[480px] text-sm leading-7 text-white/75 sm:mt-7 sm:text-base sm:leading-8">
              From Monday meetings to Saturday owambe, pieces that keep up with you.
            </p>
            <p className="mt-5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#d8c3a2] sm:mt-7 sm:text-[10px]">
              Won&apos;t tarnish · Won&apos;t fade · Won&apos;t disappoint
            </p>
            <Link href="/shop" className="group mt-7 inline-flex min-h-12 items-center gap-4 bg-[#e8c27e] px-6 text-[9px] font-medium uppercase tracking-[0.18em] text-[#24170e] transition-colors hover:bg-[#f1d49f] sm:mt-9 sm:text-[10px]">
              Shop the collection <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured products lead the shopping edit. */}
      <section id="featured" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.65, ease }}
            className="mb-8 border-b border-ink/10 pb-6 sm:mb-10 sm:pb-8"
          >
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-gold-ink sm:text-[11px]">The AMAPELS edit</p>
            <h2 className="font-serif text-3xl font-light tracking-tight sm:text-4xl md:text-[3.25rem]">Featured collection.</h2>
          </motion.div>
          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-7 md:grid-cols-4 md:gap-x-6 lg:gap-x-9">
              {[0, 1, 2, 3].map((item) => <ProductCardSkeleton key={item} />)}
            </div>
          ) : featuredPieces.length ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-7 md:grid-cols-4 md:gap-x-6 lg:gap-x-9">
              {featuredPieces.map((piece, index) => <ProductCard key={piece._id} product={piece} index={index} />)}
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
              <p className="text-sm text-ink/60">Our featured pieces are being curated.</p>
              <Link href="/shop" className="inline-flex items-center gap-2 border-b border-ink/30 pb-2 text-[10px] font-medium uppercase tracking-[0.18em]">Explore the shop <ArrowUpRight size={14} /></Link>
            </div>
          )}
        </div>
      </section>

      {/* The newest collection stays close to the top of the page. */}
      <section id="new-in" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
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
              <h2 className="font-serif text-3xl font-light tracking-tight sm:text-4xl md:text-[3.25rem]">Newest collection.</h2>
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

      {/* Purchase history ranks bestsellers by units from paid orders. */}
      <section id="bestsellers" data-theme="light" className="scroll-mt-24 bg-[#eee7dc] px-5 py-16 text-[#211b15] sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-[#211b15]/15 pb-6 sm:mb-10 sm:pb-8">
            <div>
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-[#80602a] sm:text-[11px]">Loved by our customers</p>
              <h2 className="font-serif text-3xl font-light tracking-tight sm:text-4xl md:text-[3.25rem]">Bestsellers.</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 border-b border-[#211b15]/40 pb-2 text-[10px] font-medium uppercase tracking-[0.18em]">Shop all <ArrowUpRight size={14} /></Link>
          </div>
          {bestsellersLoading || loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-7 md:grid-cols-4 md:gap-x-6 lg:gap-x-9">
              {[0, 1, 2, 3].map((item) => <ProductCardSkeleton key={item} />)}
            </div>
          ) : bestsellerPieces.length ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-7 md:grid-cols-4 md:gap-x-6 lg:gap-x-9">
              {bestsellerPieces.map((piece, index) => <ProductCard key={piece._id} product={piece} index={index} />)}
            </div>
          ) : (
            <p className="py-4 text-sm text-[#211b15]/65">Our customer favourites are taking shape. Browse the full collection in the meantime.</p>
          )}
        </div>
      </section>

      {/* A concise service promise helps shoppers decide with confidence. */}
      <section aria-label="Shopping with AMAPELS" className="border-y border-ink/10 bg-chrome">
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
                  <Image src={collection.image} alt={`${collection.name} jewellery`} fill sizes={index === 1 ? '(max-width: 1024px) 100vw, 58vw' : '(max-width: 1024px) 50vw, 42vw'} style={{ objectPosition: collection.position }} className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]" />
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
