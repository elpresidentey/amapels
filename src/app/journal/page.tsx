'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const articles = [
  {
    title: 'The Art of Adornment: Why We Wear What We Wear',
    excerpt:
      'From the courts of Benin to the streets of Lagos, jewellery has always been more than decoration. It is identity, it is power, it is poetry. We explore the deep-rooted tradition of adornment in Nigerian culture and how it shapes everything we create at AMAPELS.',
    date: 'Coming Soon',
    category: 'Culture',
  },
  {
    title: 'A Guide to Choosing Gold: Karats, Craft, and Care',
    excerpt:
      'Not all gold is created equal. From the warm glow of 18ct to the everyday resilience of gold plating, our founder shares everything she wishes every woman knew before buying her first piece of fine jewellery.',
    date: 'Coming Soon',
    category: 'Craft',
  },
  {
    title: 'Behind the Piece: The Journey of a Single Necklace',
    excerpt:
      'From sketch to skin — follow the journey of one AMAPELS necklace as it travels through the hands of six artisans, across three Nigerian cities, and into the life of the woman who will wear it for years to come.',
    date: 'Coming Soon',
    category: 'Behind the Scenes',
  },
  {
    title: 'Gifting With Intention: Choosing Jewellery That Means Something',
    excerpt:
      'The best gifts are the ones that say "I know you." Whether it is a birthday, an anniversary, or a gesture with no occasion at all — we share how to choose a piece that tells the right story.',
    date: 'Coming Soon',
    category: 'Gifting',
  },
]

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-primary pt-24">
      <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-24 lg:px-24 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="mb-14 border-b border-black/[0.06] pb-10 sm:mb-16 sm:pb-12 md:mb-20"
          >
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-black/40">
              The Journal
            </p>
            <h1 className="font-serif text-4xl font-light leading-[1.08] text-black-dark sm:text-5xl md:text-6xl">
              Stories that shape us.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-black/55 sm:text-lg">
              Thoughts on craft, culture, and the beautiful ways jewellery intersects with our
              lives. A space for the curious and the thoughtful.
            </p>
          </motion.div>

          <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
            {articles.map((article, index) => (
              <motion.article
                key={article.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.08, ease }}
                className="group cursor-pointer border border-transparent p-6 transition-all duration-500 hover:border-gold/20 hover:bg-white sm:p-8"
              >
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-gold/70">
                    {article.category}
                  </span>
                  <span className="h-px flex-1 bg-gold/20" />
                  <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-black/30">
                    {article.date}
                  </span>
                </div>
                <h2 className="font-serif text-xl font-light leading-snug text-black-dark transition-colors duration-300 group-hover:text-gold-dark sm:text-2xl">
                  {article.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-black/55">{article.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black/40 transition-colors duration-300 group-hover:text-gold-dark">
                  Read More
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </span>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="mt-16 border-t border-black/[0.06] pt-12 text-center sm:mt-20"
          >
            <p className="font-serif text-lg font-light italic text-black/40">
              More stories are being written. Visit again soon.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}