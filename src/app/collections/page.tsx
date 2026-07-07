'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const collections = [
  {
    id: 'earrings',
    name: 'STATEMENT EARRINGS',
    description: 'Luminous earrings that frame your face with grace and draw admiration with every turn.',
    image: '/images/pexels-gabriela-brasiliano-515209300-32225451.jpg',
    href: '/shop?category=Earrings'
  },
  {
    id: 'bracelets',
    name: 'BRACELETS & BANGLES',
    description: 'Radiant wrist adornments crafted with exquisite detail - elegant, refined, and perfect for gifting.',
    image: '/images/edgar-soto-o87CUS_uDiQ-unsplash.jpg',
    href: '/shop?category=Bracelets'
  },
  {
    id: 'necklaces',
    name: 'NECKLACES & PENDANTS',
    description: 'Graceful chains and striking pendants that rest close to your heart and complete every ensemble.',
    image: '/images/pexels-vedat-28933799.jpg',
    href: '/shop?category=Necklaces'
  },
  {
    id: 'gift-edit',
    name: 'THE GIFT EDIT',
    description: 'Treasured pieces artfully chosen for birthdays, anniversaries, celebrations, and heartfelt gifting.',
    image: '/images/brian-wangenheim--5T5yMvZ2-E-unsplash.jpg',
    href: '/shop?category=Jewellery Sets'
  }
]

export default function CollectionsPage() {
  return (
    <div className="pt-24 min-h-screen">
      <section className="py-28 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center mb-24"
          >
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.45em] text-black/50">CURATED FOR YOU</p>
            <h1 className="font-serif text-5xl font-light leading-[1.1] text-black-dark md:text-6xl lg:text-7xl">COLLECTIONS</h1>
            <p className="mt-8 text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
              Explore our artisan-crafted collections, curated for everyday elegance, milestone celebrations, and treasured gifts.
            </p>
          </motion.div>

          <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 45 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: index * 0.18 }}
                className="group hover-lift card-premium"
              >
                <Link href={collection.href}>
                  <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/10] lg:aspect-[21/9] overflow-hidden mb-5 rounded-2xl sm:mb-6 sm:rounded-3xl md:mb-7 md:rounded-[36px] shadow-premium">
                    <Image 
                      src={collection.image}
                      alt={collection.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 90vw"
                      className="object-cover img-premium"
                    />
                    <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-all duration-300 flex items-center justify-center">
                      <div className="text-center text-white px-4 sm:px-6 md:px-8">
                        <h2 className="font-serif text-xl font-light sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-3 sm:mb-4 md:mb-5">{collection.name}</h2>
                        <p className="text-sm opacity-85 max-w-xl mx-auto leading-relaxed sm:text-base md:text-lg">{collection.description}</p>
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
