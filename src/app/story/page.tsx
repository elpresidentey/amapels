'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const timeline = [
  {
    year: '2009',
    title: 'A Seed Is Planted',
    description:
      'In the heart of Lagos, a young designer began shaping wire and beads on her kitchen table — not yet knowing she was shaping a legacy. What started as a whisper of curiosity became an calling: to create jewellery that carried the soul of Nigeria into the world.',
  },
  {
    year: '2012',
    title: 'The First Collection',
    description:
      'Seven pieces, each named after a Lagos street. They sold out in three days. Women didn\'t just wear them — they told stories about them. The name of the street where they found their first love. The market where their mother haggled for yams. AMAPELS became more than jewellery: it became memory.',
  },
  {
    year: '2016',
    title: 'Finding Our Voice',
    description:
      'We began working directly with artisan communities across Nigeria — in Abeokuta, in Benin, in Kano. Not as a supply chain, but as a partnership built on dignity, fair wages, and the belief that African craftsmanship deserves a global stage. Each piece we create carries the fingerprint of its maker.',
  },
  {
    year: '2020',
    title: 'Roots Run Deep',
    description:
      'While the world paused, we doubled down. We invested in our artisans, in sustainable practices, in the stories that had always been the heartbeat of our brand. We emerged with a clarity: AMAPELS is not just about jewellery. It is about who we are, where we come from, and the beauty we bring into the world.',
  },
  {
    year: '2024',
    title: 'The World Beckons',
    description:
      'Today, AMAPELS ships to over twenty countries. Our pieces grace necklines from Lagos to London, from Accra to New York. But we remain what we have always been: a small, passionate team driven by craft, meaning, and the stubborn belief that jewellery should feel like home.',
  },
]

const values = [
  {
    title: 'Craft',
    description:
      'Every piece passes through eight hands before it reaches yours. Our artisans are masters of their trade — metalworkers who learned from their fathers, beadweavers carrying techniques passed down through four generations. We don\'t mass-produce. We create.',
    icon: '✦',
  },
  {
    title: 'Heritage',
    description:
      'Nigeria is not just where we make our jewellery — it is the muse. The bold geometry of Benin bronzes. The tender curves of Nok terracotta. The sun-drenched gold of a Lagos evening. Every collection is a love letter to the culture that shaped us.',
    icon: '♦',
  },
  {
    title: 'Meaning',
    description:
      'Jewellery is intimate. It sits against your skin, catches the light as you move, becomes part of your story. We design pieces that mean something — for the woman buying her first gold chain, for the mother passing down an heirloom, for the friend saying "I see you."',
    icon: '∞',
  },
  {
    title: 'Sustainability',
    description:
      'Beauty should not come at a cost to the earth. We use recycled metals, ethically sourced gemstones, and packaging made from biodegradable materials. Slow fashion is not a trend — it is our responsibility.',
    icon: '○',
  },
]

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-primary pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden bg-black-dark text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/andres-vera-202NAwjisYA-unsplash.jpg"
            alt="AMAPELS craftsmanship"
            fill
            priority
            sizes="100vw"
            quality={90}
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(12,10,8,0.95)_0%,rgba(12,10,8,0.75)_50%,rgba(12,10,8,0.4)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-32 sm:px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
            className="max-w-3xl"
          >
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.38em] text-gold/70">
              The Brand Story
            </p>
            <h1 className="font-serif text-4xl font-light leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl">
              Where heritage meets the handmade.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
              Every piece of AMAPELS jewellery carries a story — of Lagos streets, of artisan hands,
              of women who wear their confidence like gold. This is our story.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Origin narrative */}
      <section className="px-4 py-24 sm:px-6 sm:py-28 md:px-12 md:py-32 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
          >
            <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.38em] text-black/40">
              The Beginning
            </p>
            <h2 className="font-serif text-3xl font-light leading-[1.15] text-black-dark sm:text-4xl md:text-5xl">
              It started with a single bead.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-black/60 sm:text-lg">
              <p>
                On a quiet street in Surulere, Lagos, a woman sat at her window, threading beads
                by the afternoon light. She was not trying to start a brand. She was trying to
                capture a feeling — the warmth of a Lagos sunset, the rhythm of market chatter,
                the way gold catches the eye across a crowded room.
              </p>
              <p>
                That feeling became a necklace. The necklace became a collection. And that
                collection became AMAPELS — a name whispered among friends, then strangers, then
                women across the world who recognized in our pieces something they had been
                searching for: jewellery that felt like them.
              </p>
              <p className="text-gold-dark/80 font-serif text-xl italic">
                &ldquo;We don&apos;t just make jewellery. We craft heirlooms in the making — pieces
                designed to be passed down, worn through seasons of life, and remembered.&rdquo;
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-primary-light/50 px-4 py-24 sm:px-6 sm:py-28 md:px-12 md:py-32 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="mb-16 text-center"
          >
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-black/40">
              The Journey
            </p>
            <h2 className="font-serif text-3xl font-light text-black-dark sm:text-4xl md:text-5xl">
              From a kitchen table to the world.
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-6 top-0 h-full w-px bg-gold/30 md:left-1/2 md:-translate-x-px" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease }}
                className={`relative mb-16 pl-16 last:mb-0 md:mb-20 md:w-1/2 md:pl-0 ${
                  index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:ml-auto md:pl-16'
                }`}
              >
                <div
                  className={`absolute left-6 top-1 h-3 w-3 rounded-full border-2 border-gold bg-primary md:left-auto ${
                    index % 2 === 0 ? 'md:right-[-6.5px]' : 'md:left-[-6.5px]'
                  }`}
                />
                <span className="mb-2 block font-serif text-3xl font-light text-gold/60">
                  {item.year}
                </span>
                <h3 className="mb-3 font-serif text-xl font-light text-black-dark sm:text-2xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-black/55">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-24 sm:px-6 sm:py-28 md:px-12 md:py-32 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="mb-16 text-center"
          >
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-black/40">
              What We Stand For
            </p>
            <h2 className="font-serif text-3xl font-light text-black-dark sm:text-4xl md:text-5xl">
              Four pillars, one purpose.
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.08, ease }}
                className="group border border-gold/20 bg-white px-8 py-10 transition-all duration-500 hover:border-gold/40 hover:shadow-[0_12px_40px_-12px_rgba(196,163,90,0.15)]"
              >
                <span className="mb-6 block font-serif text-3xl text-gold/60">{value.icon}</span>
                <h3 className="mb-4 font-serif text-2xl font-light text-black-dark">{value.title}</h3>
                <p className="text-sm leading-relaxed text-black/55">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black-dark px-4 py-24 sm:px-6 sm:py-28 md:px-12 md:py-32 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="mx-auto max-w-3xl text-center text-white"
        >
          <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.38em] text-gold/60">
            Join the story
          </p>
          <h2 className="font-serif text-3xl font-light leading-[1.15] sm:text-4xl md:text-5xl">
            Every piece has a story. <br />
            <span className="text-gold/80">What will yours be?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-white/55">
            Whether you&apos;re celebrating a milestone, treating yourself, or searching for the perfect
            gift — our pieces are waiting to become part of your story.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/shop"
              className="btn-premium group inline-flex items-center gap-2.5 bg-white px-8 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-black-dark transition-all hover:bg-primary-light sm:text-[11px]"
            >
              Explore the Collection
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/collections"
              className="btn-premium inline-flex items-center gap-2.5 border border-white/25 bg-white/[0.04] px-8 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-sm transition-all hover:border-white/45 hover:bg-white/10 sm:text-[11px]"
            >
              View Collections
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}