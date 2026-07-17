'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const collections = [
  {
    id: 'earrings',
    name: 'Statement Earrings',
    description: 'Luminous earrings that frame your face with grace and draw admiration with every turn.',
    image: '/images/pexels-gabriela-brasiliano-515209300-32225451.jpg',
    href: '/shop?category=Earrings',
  },
  {
    id: 'bracelets',
    name: 'Bracelets & Bangles',
    description: 'Radiant wrist adornments crafted with exquisite detail — elegant, refined, and perfect for gifting.',
    image: '/images/edgar-soto-o87CUS_uDiQ-unsplash.jpg',
    href: '/shop?category=Bracelets',
  },
  {
    id: 'necklaces',
    name: 'Necklaces & Pendants',
    description: 'Graceful chains and striking pendants that rest close to your heart and complete every ensemble.',
    image: '/images/pexels-vedat-28933799.jpg',
    href: '/shop?category=Necklaces',
  },
  {
    id: 'gift-edit',
    name: 'The Gift Edit',
    description: 'Treasured pieces chosen for birthdays, anniversaries, celebrations, and heartfelt gifting.',
    image: '/images/brian-wangenheim--5T5yMvZ2-E-unsplash.jpg',
    href: '/shop?category=Jewellery Sets',
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-primary pt-24">
      <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-24 lg:px-24 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="mb-14 border-b border-black/[0.06] pb-10 sm:mb-16 sm:pb-12 md:mb-20"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-black/40">
                  Curated for You
                </p>
                <h1 className="font-serif text-4xl font-light tracking-tight text-black-dark sm:text-5xl md:text-6xl">
                  Collections
                </h1>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-black/55 md:text-right">
                Artisan-crafted edits for everyday elegance, milestone celebrations, and treasured gifts.
              </p>
            </div>
          </motion.div>

          <div className="space-y-5 sm:space-y-6 md:space-y-7">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: index * 0.08, ease }}
                className="group"
              >
                <Link href={collection.href} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[21/9]">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      sizes="100vw"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,10,8,0.72)_0%,rgba(12,10,8,0.35)_55%,rgba(12,10,8,0.2)_100%)] transition-opacity duration-500 group-hover:opacity-95" />
                    <div className="absolute inset-0 flex items-end p-6 sm:items-center sm:p-10 md:p-12 lg:p-14">
                      <div className="max-w-lg text-white">
                        <div className="mb-3 h-px w-8 bg-gold/70 transition-all duration-500 group-hover:w-14" />
                        <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/45">
                          {String(index + 1).padStart(2, '0')}
                        </p>
                        <h2 className="mt-2 font-serif text-2xl font-light sm:text-3xl md:text-4xl">
                          {collection.name}
                        </h2>
                        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
                          {collection.description}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-gold/90">
                          Shop Collection
                          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
