'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const timeline = [
  {
    year: '2009',
    title: 'The First Shelf',
    description:
      'AMAPELS started small in Abuja, with one rule: nothing leaves unless it survives being worn. We sold what we would wear ourselves, and the customers kept coming back for the same reason.',
  },
  {
    year: '2012',
    title: 'Learning The Market',
    description:
      'Every season taught us something — which finishes survive Nigerian weather, which styles get worn past Sunday, which pieces end up bought twice. We kept notes. The shelf got tighter and better.',
  },
  {
    year: '2016',
    title: 'Sourcing Further Afield',
    description:
      'We started travelling for stock and building relationships with suppliers in Kano, in Abeokuta, and beyond. Not for a supply-chain story, just to find pieces worth putting our name on.',
  },
  {
    year: '2020',
    title: 'Staying Open',
    description:
      'When everything else shut, jewellery did not stop being bought. We kept orders moving, kept our promises on delivery, and came out the other side with customers who trusted us.',
  },
  {
    year: '2024',
    title: 'A Proper Shop',
    description:
      'Today AMAPELS is a full jewellery shop in Abuja — earrings, necklaces, bracelets and sets — shipped nationwide and wrapped for gifting. Still picky. Still a small team. Still counting every order.',
  },
]

const values = [
  {
    title: 'Curated',
    description:
      'Every piece is checked before it reaches you. We buy from trusted suppliers and independent makers across Nigeria, vet the finish and the setting, and only list what survives real wear. You decide how it makes you feel; we handle the vetting.',
    icon: '✦',
  },
  {
    title: 'Honest',
    description:
      "We say what a piece is, and we say where it comes from. No 'gold' that is not gold. No 'won\'t tarnish' that turns your skin green by Friday. If a piece will not last, we tell you. If it will, we tell you that too.",
    icon: '❖',
  },
  {
    title: 'Heritage',
    description:
      'Nigeria is not just where we sell — it is the lens. The bold geometry of Benin bronzes. The tender curves of Nok terracotta. The warm gold of an Abuja evening. We choose pieces that carry that feeling.',
    icon: '◈',
  },
  {
    title: 'Delivered',
    description:
      'Ordered in the morning, on your lap the same day inside the FCT. Wrapped, tracked, and answered for — because a shop you can call is worth more than a feed you can scroll.',
    icon: '∞',
  },
]

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-primary pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden bg-chrome text-ink">
        <div className="absolute inset-0">
          <Image
            src="/images/andres-vera-202NAwjisYA-unsplash.webp"
            alt="AMAPELS jewellery detail"
            fill
            priority
            sizes="100vw"
            quality={90}
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgb(var(--color-wash)/0.95)_0%,rgb(var(--color-wash)/0.75)_50%,rgb(var(--color-wash)/0.4)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-32 sm:px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
            className="max-w-3xl"
          >
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.38em] text-gold/85">
              The Brand Story
            </p>
            <h1 className="font-serif text-3xl font-light leading-[1.1] sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              Live in Abuja. Worn everywhere.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/65 sm:text-lg">
              AMAPELS is a Nigerian jewellery shop in Abuja. We go looking, we buy carefully, we
              sell honestly. This is how it started.
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
            <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.38em] text-ink/55">
              The Beginning
            </p>
            <h2 className="font-serif text-2xl font-light leading-[1.15] text-ink sm:text-3xl md:text-4xl">
              It started with a pair of earrings.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/60 sm:text-lg">
              <p>
                In Abuja, buying jewellery used to be a gamble. A pair would look perfect in the
                shop and turn your skin green by Friday. So we started doing it differently —
                buying in small batches, testing pieces ourselves, and keeping only the ones that
                still looked good after a week of actual life.
              </p>
              <p>
                That became a small stall. Then a proper shop. Today AMAPELS stocks earrings,
                necklaces, bracelets and sets for every day, every budget, and the gift you keep
                postponing — wrapped in Abuja and delivered nationwide.
              </p>
              <p className="text-gold-dark/80 font-serif text-xl italic">
                &ldquo;We don&apos;t make jewellery. We find the ones worth wearing — and we stand
                behind every single one.&rdquo;
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-primary-light/50 px-4 py-24 sm:py-28 md:px-12 md:py-32 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="mb-16 text-center"
          >
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-ink/55">
              The Journey
            </p>
            <h2 className="font-serif text-2xl font-light text-ink sm:text-3xl md:text-4xl">
              From one small shelf to a full shop.
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
                <span className="mb-2 block font-serif text-2xl font-light text-gold/85">
                  {item.year}
                </span>
                <h3 className="mb-3 font-serif text-xl font-light text-ink sm:text-2xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink/65">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-24 sm:py-28 md:px-12 md:py-32 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="mb-16 text-center"
          >
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-ink/55">
              What We Stand For
            </p>
            <h2 className="font-serif text-2xl font-light text-ink sm:text-3xl md:text-4xl">
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
                className="group border border-gold/20 bg-base px-8 py-10 transition-all duration-500 hover:border-gold/40 hover:shadow-[0_12px_40px_-12px_rgba(196,163,90,0.15)]"
              >
                <span className="mb-6 block font-serif text-3xl text-gold/85">{value.icon}</span>
                <h3 className="mb-4 font-serif text-2xl font-light text-ink">{value.title}</h3>
                <p className="text-sm leading-relaxed text-ink/65">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-chrome px-4 py-24 sm:py-28 md:px-12 md:py-32 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="mx-auto max-w-3xl text-center text-ink"
        >
          <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.38em] text-gold/85">
            Come through
          </p>
          <h2 className="font-serif text-2xl font-light leading-[1.15] sm:text-3xl md:text-4xl">
            Every piece has a story. <br />
            <span className="text-gold/90">What will yours be?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-ink/65">
            Whether you&apos;re celebrating a milestone, treating yourself, or finally buying that
            gift — our pieces are waiting to become part of your story.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/shop"
              className="btn-premium group inline-flex items-center justify-center gap-2.5 bg-ink px-8 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-on-ink transition-all hover:bg-ink/85 sm:text-[11px]"
            >
              Explore the Collection
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/collections"
              className="btn-premium inline-flex items-center justify-center gap-2.5 border border-ink/25 bg-ink/[0.04] px-8 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-ink backdrop-blur-sm transition-all hover:border-ink/45 hover:bg-ink/10 sm:text-[11px]"
            >
              View Collections
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
