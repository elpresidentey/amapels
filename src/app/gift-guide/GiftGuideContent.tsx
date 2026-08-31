'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Star, Gift, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import type { ProductData } from '@/lib/fallbackProducts'

const FALLBACK_IMAGE = '/images/sabrianna-Y_bxfTa_iUA-unsplash.webp'

// ---------- price helpers ----------

function parsePrice(price: string): number {
  const value = Number(price.replace(/[^\d.]/g, ''))
  return Number.isFinite(value) ? value : 0
}

function formatNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString('en-NG')}`
}

function normalizePrice(product: ProductData): string {
  return formatNaira(parsePrice(product.price))
}

// ---------- occasion curation (driven by live shop data) ----------

interface Occasion {
  title: string
  description: string
  /** Preferred categories to pull from (first fallback after keyword matching) */
  categories?: string[]
  /** Keywords matched against product name/story/description/material */
  keywords?: string[]
  /** 'cheapest' sorts ascending by price instead of featured-first */
  strategy?: 'cheapest'
}

const occasions: Occasion[] = [
  {
    title: 'For Her Birthday',
    description: 'Celebrate her special day with jewelry as unique as she is',
    categories: ['Earrings'],
  },
  {
    title: 'Anniversary Gifts',
    description: 'Mark your milestones with timeless pieces that tell your story',
    keywords: ['love', 'romance', 'bridal', 'eternity'],
    categories: ['Jewellery Sets'],
  },
  {
    title: 'Graduation Success',
    description: 'Commemorate achievements with jewelry for the next chapter',
    categories: ['Bracelets'],
  },
  {
    title: "Mother's Day",
    description: 'Show appreciation with elegant pieces that reflect her grace',
    keywords: ['pearl'],
    categories: ['Necklaces', 'Jewellery Sets'],
  },
  {
    title: 'Self-Love Treats',
    description: 'Because you deserve beautiful things just because',
    strategy: 'cheapest',
  },
  {
    title: 'New Job Celebration',
    description: 'Professional pieces that add confidence to every meeting',
    keywords: ['stud', 'minimalist', 'chain'],
    categories: ['Earrings', 'Necklaces'],
  },
]

function matchesKeywords(product: ProductData, keywords: string[]): boolean {
  const haystack = `${product.name} ${product.story} ${product.description} ${product.material}`.toLowerCase()
  return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()))
}

function sortForOccasion(products: ProductData[], occasion: Occasion): ProductData[] {
  return [...products].sort((a, b) => {
    if (occasion.strategy === 'cheapest') {
      return parsePrice(a.price) - parsePrice(b.price)
    }
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return parsePrice(b.price) - parsePrice(a.price)
  })
}

/**
 * Pick `count` products for one occasion from the pool it may use.
 * Relevance chain: keyword matches -> category matches -> whole pool.
 * Partial matches are topped up with the best remaining pieces so every
 * card is full without repeating pieces across cards.
 */
function pickOccasionProducts(pool: ProductData[], occasion: Occasion, count: number): ProductData[] {
  if (count <= 0 || pool.length === 0) return []

  let matches: ProductData[] = []
  if (occasion.keywords?.length) {
    matches = pool.filter((product) => matchesKeywords(product, occasion.keywords!))
  }
  if (matches.length === 0 && occasion.categories?.length) {
    matches = pool.filter((product) => occasion.categories!.includes(product.category))
  }
  if (matches.length === 0) {
    return sortForOccasion(pool, occasion).slice(0, count)
  }
  if (matches.length >= count) {
    return sortForOccasion(matches, occasion).slice(0, count)
  }

  const matchIds = new Set(matches.map((product) => product._id))
  const rest = sortForOccasion(
    pool.filter((product) => !matchIds.has(product._id)),
    occasion
  )
  return [...sortForOccasion(matches, occasion), ...rest].slice(0, count)
}

/**
 * Assign products to occasions so every product appears on at most one card.
 * With a small inventory the slots are shared out evenly instead of letting the
 * first occasions hoard all the pieces (which made the cards repetitive).
 */
function assignOccasionProducts(products: ProductData[], occasionList: Occasion[]): { occasion: Occasion; picks: ProductData[] }[] {
  const total = products.length
  const base = Math.floor(total / occasionList.length)
  const remainder = total % occasionList.length

  const used = new Set<string>()

  return occasionList.map((occasion, index) => {
    // Evenly distributed quota, capped at 3 items per card
    let quota = Math.min(base + (index < remainder ? 1 : 0), 3)

    let available = products.filter((product) => !used.has(product._id))
    let picks = pickOccasionProducts(available, occasion, quota)
    picks.forEach((product) => used.add(product._id))

    // Inventory smaller than the number of occasions: reuse is unavoidable,
    // but keep it to a single item so cards still differ from each other.
    if (picks.length === 0) {
      available = [...products].sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
      picks = pickOccasionProducts(available, occasion, 1)
      picks.forEach((product) => used.add(product._id))
    }

    return { occasion, picks }
  })
}

/** "Shop Collection" link derived from the actual picks, so it never points at an empty category. */
function shopLinkFor(picks: ProductData[]): string {
  if (picks.length > 0 && picks.every((product) => product.category === picks[0].category)) {
    return `/shop?category=${encodeURIComponent(picks[0].category)}`
  }
  return '/shop'
}

function priceRangeFor(products: ProductData[]): string {
  const prices = products.map((product) => parsePrice(product.price)).filter((price) => price > 0)
  if (prices.length === 0) return 'Enquire in store'
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) return formatNaira(min)
  return `${formatNaira(min)} - ${formatNaira(max)}`
}

// ---------- budget tiers (computed from live shop prices) ----------

interface BudgetTier {
  range: string
  icon: LucideIcon
  description: string
  min: number
  max: number
}

const budgetTierDescriptions = [
  'Thoughtful pieces that make beautiful everyday accessories',
  'Statement pieces perfect for special occasions',
  'Premium pieces that become treasured heirlooms',
  'Luxury investment pieces for life\u2019s most important moments',
]

function buildBudgetTiers(products: ProductData[]): (BudgetTier & { items: ProductData[] })[] {
  const prices = products
    .map((product) => parsePrice(product.price))
    .filter((price) => price > 0)
    .sort((a, b) => a - b)
  if (prices.length === 0) return []

  const min = prices[0]
  const max = prices[prices.length - 1]
  const step = (max - min) / 4
  const roundUp = (value: number) => Math.ceil(value / 5000) * 5000

  const t1 = roundUp(min + step)
  const t2 = roundUp(min + step * 2)
  const t3 = roundUp(min + step * 3)

  const tiers: BudgetTier[] = [
    { range: `Under ${formatNaira(t1)}`, icon: Heart, description: budgetTierDescriptions[0], min: 0, max: t1 },
    { range: `${formatNaira(t1)} - ${formatNaira(t2)}`, icon: Star, description: budgetTierDescriptions[1], min: t1, max: t2 },
    { range: `${formatNaira(t2)} - ${formatNaira(t3)}`, icon: Gift, description: budgetTierDescriptions[2], min: t2, max: t3 },
    { range: `${formatNaira(t3)}+`, icon: Sparkles, description: budgetTierDescriptions[3], min: t3, max: Infinity },
  ]

  return tiers.map((tier) => ({
    ...tier,
    items: products
      .filter((product) => {
        const price = parsePrice(product.price)
        return price > tier.min && price <= tier.max
      })
      .sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
      .slice(0, 4),
  }))
}

// ---------- page ----------

export default function GiftGuideContent() {
  const { products, loading, error } = useProducts()

  if (loading) {
    return <GiftGuideSkeleton />
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="max-w-md px-6 text-center">
          <p className="mb-3 font-serif text-2xl font-light text-black-dark">Something went wrong</p>
          <p className="mb-6 text-sm text-black/55">{error}</p>
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-gold transition-colors"
          >
            Browse the Shop
          </Link>
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="max-w-md px-6 text-center">
          <p className="mb-3 font-serif text-2xl font-light text-black-dark">Our gift guide is being restocked</p>
          <p className="mb-6 text-sm text-black/55">No pieces are available right now — check back soon.</p>
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-gold transition-colors"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    )
  }

  const occasionCards = assignOccasionProducts(products, occasions)

  const budgetTiers = buildBudgetTiers(products)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-shell pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-black-dark mb-6 lg:mb-8">
            The Perfect Gift
          </h1>
          <p className="text-lg sm:text-xl text-black/70 leading-relaxed mb-4">
            Discover jewelry that speaks to the heart. Our curated gift guide helps you 
            find meaningful pieces for every person and occasion.
          </p>
          <p className="text-sm text-black/50 mb-8">
            Featuring {products.length} piece{products.length === 1 ? '' : 's'} from the shop &middot;{' '}
            {priceRangeFor(products)}
          </p>
          <Link 
            href="/shop"
            className="inline-flex items-center px-8 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-gold transition-colors btn-mobile"
          >
            Shop All Gifts
          </Link>
        </div>
      </section>

      {/* Gift Occasions */}
      <section className="section-shell pb-16 lg:pb-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-2xl lg:text-3xl font-light text-black-dark mb-4">
            Shop by Occasion
          </h2>
          <p className="text-black/70 max-w-2xl mx-auto">
            Find the perfect piece for life&apos;s special moments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {occasionCards.map(({ occasion, picks }, index) => (
            <div key={index} className="group">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4">
                <Image
                  src={picks[0]?.images?.[0] || FALLBACK_IMAGE}
                  alt={occasion.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif text-xl font-light text-black-dark mb-2">
                {occasion.title}
              </h3>
              <p className="text-black/70 text-sm leading-relaxed mb-3">
                {occasion.description}
              </p>
              <div className="space-y-1 mb-3">
                {picks.map((product) => (
                  <Link
                    key={product._id}
                    href={`/shop/${product._id}`}
                    className="flex items-baseline justify-between gap-3 text-xs text-black/60 hover:text-black-dark transition-colors"
                  >
                    <span className="truncate">&bull; {product.name}</span>
                    <span className="shrink-0 font-medium text-black-dark">{normalizePrice(product)}</span>
                  </Link>
                ))}
              </div>
              <p className="text-sm font-medium text-black-dark mb-4">
                {priceRangeFor(picks)}
              </p>
              <Link 
                href={shopLinkFor(picks)}
                className="text-sm font-medium text-black-dark hover:text-black transition-colors"
              >
                Shop Collection →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Budget Guide */}
      <section className="bg-black text-white section-shell py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-2xl lg:text-3xl font-light mb-4">
            Shop by Budget
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Beautiful jewelry at every price point
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {budgetTiers.map((tier, index) => {
            const Icon = tier.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">
                  {tier.range}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {tier.description}
                </p>
                <ul className="space-y-1">
                  {tier.items.map((item) => (
                    <li key={item._id} className="text-xs text-white/60">
                      &bull; {item.name} &middot; {normalizePrice(item)}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Gift Services */}
      <section className="section-shell py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl lg:text-3xl font-light text-black-dark mb-4">
              Gift Services
            </h2>
            <p className="text-black/70">
              We make gifting effortless with our complimentary services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black-light/5 rounded-full mb-4">
                <Gift size={24} className="text-black-dark" />
              </div>
              <h3 className="font-semibold text-lg text-black-dark mb-2">
                Gift Wrapping
              </h3>
              <p className="text-black/70 text-sm leading-relaxed">
                Complimentary luxury gift wrapping with every purchase
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black-light/5 rounded-full mb-4">
                <Heart size={24} className="text-black-dark" />
              </div>
              <h3 className="font-semibold text-lg text-black-dark mb-2">
                Personal Message
              </h3>
              <p className="text-black/70 text-sm leading-relaxed">
                Include a handwritten note with your heartfelt message
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black-light/5 rounded-full mb-4">
                <Sparkles size={24} className="text-black-dark" />
              </div>
              <h3 className="font-semibold text-lg text-black-dark mb-2">
                Gift Consultation
              </h3>
              <p className="text-black/70 text-sm leading-relaxed">
                Not sure what to choose? Our team is here to help
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-shell pb-16 lg:pb-24">
        <div className="bg-black-light/5 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="font-serif text-2xl lg:text-3xl font-light text-black-dark mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-black/70 mb-6 max-w-2xl mx-auto">
            Our jewelry specialists are here to help you find the perfect gift. 
            Contact us for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-black text-white text-sm font-medium hover:bg-gold transition-colors btn-mobile"
            >
              Get Expert Advice
            </Link>
            <Link 
              href="/shop"
              className="inline-flex items-center px-8 py-3 border border-black text-black-dark text-sm font-medium hover:bg-gold hover:text-white transition-colors btn-mobile"
            >
              Browse All Jewelry
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function GiftGuideSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <section className="section-shell pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 h-10 w-64 animate-pulse rounded-full bg-black/[0.04]" />
          <div className="mx-auto mb-8 h-4 w-full max-w-xl animate-pulse rounded-full bg-black/[0.04]" />
          <div className="mx-auto h-11 w-40 animate-pulse rounded-md bg-black/[0.04]" />
        </div>
      </section>
      <section className="section-shell pb-16 lg:pb-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse" role="status" aria-label="Loading gift suggestions">
              <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-lg bg-black/[0.04]" />
              <div className="mb-2 h-5 w-1/2 rounded-full bg-black/[0.04]" />
              <div className="mb-3 h-3 w-3/4 rounded-full bg-black/[0.04]" />
              <div className="h-3 w-2/3 rounded-full bg-black/[0.04]" />
              <span className="sr-only">Loading gift suggestions</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
