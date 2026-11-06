'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Gift, PackageCheck, Sparkles } from 'lucide-react'
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
  const prefersReducedMotion = useReducedMotion()
  const storyRef = useRef<HTMLElement>(null)
  const { scrollYProgress: pageProgress } = useScroll()
  const { scrollYProgress: storyProgress } = useScroll({ target: storyRef, offset: ['start end', 'end start'] })
  const storyScale = useTransform(storyProgress, [0, 1], [1, 1.1])
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

  return (
    <div className="bg-paper text-ink">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gold-ink"
        style={{ scaleX: prefersReducedMotion ? 0 : pageProgress }}
      />
      <section className="pb-8 pt-16 sm:pb-12 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.15 : 0.7, ease }}
          className="relative flex min-h-[650px] items-center overflow-hidden bg-[#28190f] px-5 py-12 text-white sm:min-h-[620px] sm:px-10 lg:min-h-[650px] lg:px-[8vw]"
        >
          <div aria-hidden="true" className="absolute inset-0 lg:hidden">
            <Image src="/images/hero-model.webp" alt="" fill priority sizes="100vw" className="object-cover object-[58%_center]" />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(35,19,12,0.96)_0%,rgba(35,19,12,0.88)_48%,rgba(35,19,12,0.3)_100%)] lg:hidden" />

          <div role="group" aria-label="AMAPELS jewelry campaign photographs" className="absolute inset-y-0 right-0 hidden w-[58%] grid-cols-[1.3fr_0.7fr] grid-rows-3 gap-[3px] bg-[#28190f] lg:grid">
            <div className="relative row-span-3 overflow-hidden">
              <Image src="/images/hero-model.webp" alt="Model wearing gold AMAPELS jewelry" fill sizes="(max-width: 1200px) 52vw, 46vw" className="object-cover object-[50%_center]" />
            </div>
            <div className="relative overflow-hidden"><Image src="/images/hero-earrings.webp" alt="Gold hoops and delicate diamond earrings" fill sizes="22vw" className="object-cover" /></div>
            <div className="relative overflow-hidden"><Image src="/images/hero-rings.webp" alt="Gold rings styled on hand" fill sizes="22vw" className="object-cover" /></div>
            <div className="relative overflow-hidden"><Image src="/images/hero-necklaces.webp" alt="Layered gold necklaces with pendants" fill sizes="22vw" className="object-cover" /></div>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#28190f_0%,rgba(40,25,15,0.98)_30%,rgba(40,25,15,0.82)_48%,rgba(40,25,15,0.1)_70%,transparent_100%)] lg:block" />

          <motion.div className="relative z-10 max-w-[570px]">
            <p className="mb-5 text-[9px] font-medium uppercase tracking-[0.3em] text-[#e8cc91] sm:mb-7 sm:text-[10px]">Style it. Love it. Repeat.</p>
            <h1 className="text-balance font-serif text-[clamp(2.5rem,5vw,4rem)] font-light leading-[0.98] tracking-[-0.035em]">
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
            <div aria-hidden="true" className="mt-8 flex gap-2 lg:hidden">
              {[
                ['/images/hero-earrings.webp', 'Gold earrings'],
                ['/images/hero-rings.webp', 'Gold rings'],
                ['/images/hero-necklaces.webp', 'Layered necklaces'],
              ].map(([src, label]) => (
                <div key={src} className="relative h-16 w-16 overflow-hidden border border-white/35">
                  <Image src={src} alt={label} fill sizes="64px" className="object-cover" />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
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
