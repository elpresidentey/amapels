'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function StoryPage() {
  return (
    <div className="pt-24 min-h-screen">
      <section className="py-28 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center mb-24"
          >
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.45em] text-black/50">OUR JOURNEY</p>
            <h1 className="font-serif text-5xl font-light md:text-6xl lg:text-7xl text-black-dark">OUR STORY</h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="relative aspect-[21/9] overflow-hidden mb-20 rounded-[36px]"
          >
            <Image 
              src="/images/pexels-sheilabox-235376934-12184920.jpg"
              alt="Amapels jewellery detail"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 90vw"
              className="object-cover"
            />
          </motion.div>

          <div className="space-y-24">
            <motion.section
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
            >
              <h2 className="font-serif text-3xl font-light md:text-4xl text-black-dark mb-7">THE FOUNDER'S VISION</h2>
              <p className="text-lg text-black/75 leading-relaxed mb-6">
                Amapels was born from a passion for jewelry that feels beautiful, deeply personal, and profoundly meaningful.
                Founded in the heart of Lagos, our brand exists to create pieces that celebrate your confidence, grace,
                and the unique story only you can tell.
              </p>
              <p className="text-lg text-black/75 leading-relaxed">
                Every design is chosen with intention: balancing timeless elegance, artisan craftsmanship, and the kind of
                luminous detail that transforms jewelry into cherished heirlooms.
              </p>
            </motion.section>

            <div className="grid md:grid-cols-2 gap-10">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.35 }}
                className="relative aspect-square overflow-hidden rounded-[36px]"
              >
                <Image 
                  src="/images/pexels-vedat-29043373.jpg"
                  alt="Jewellery craftsmanship"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.45 }}
                className="flex flex-col justify-center"
              >
                <h2 className="font-serif text-3xl font-light md:text-4xl text-black-dark mb-7">ARTISAN CRAFTSMANSHIP</h2>
                <p className="text-lg text-black/75 leading-relaxed mb-6">
                  We believe jewelry should radiate beauty from every angle: captivating from across the room and exquisite up close.
                  That's why Amapels focuses on luminous finishes, graceful proportions, and meticulous attention to every detail.
                </p>
                <p className="text-lg text-black/75 leading-relaxed">
                  From statement earrings to heirloom-worthy sets, every piece is crafted to feel elegant, wearable,
                  and destined to become a treasured part of your story.
                </p>
              </motion.div>
            </div>

            <motion.section
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55 }}
            >
              <h2 className="font-serif text-3xl font-light md:text-4xl text-black-dark mb-7">NIGERIAN HERITAGE</h2>
              <p className="text-lg text-black/75 leading-relaxed mb-6">
                Nigeria's vibrant culture, rich traditions, and love of celebration inspire everything we create at Amapels.
                Our pieces embody presence, confidence, and the profound way jewelry completes a look with meaning and pride.
              </p>
              <p className="text-lg text-black/75 leading-relaxed">
                We translate these influences into contemporary designs that feel modern yet deeply rooted: jewelry that carries
                warmth, individuality, and the timeless spirit of Nigerian artistry.
              </p>
            </motion.section>

            <motion.div
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.65 }}
              className="bg-primary-light/25 py-16 px-8 md:px-12 text-center rounded-[36px] border border-gold/40"
            >
              <blockquote className="font-serif text-2xl md:text-3xl font-light italic mb-6 text-black-dark">
                &ldquo;Jewelry is more than adornment. It's memory, legacy, and the radiant expression of who you are.&rdquo;
              </blockquote>
              <p className="text-lg text-black/75">Founder, Amapels</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
