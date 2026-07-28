'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

interface BlogPost {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  category: string
  image: string
  publishedAt?: string
  createdAt: string
}

export default function JournalPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) setPosts(data.posts)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-gold-dark" />
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="border-t border-black/[0.06] pt-12 text-center"
            >
              <p className="font-serif text-lg font-light italic text-black/40">
                More stories are being written. Visit again soon.
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
              {posts.map((post, index) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.08, ease }}
                  className="group cursor-pointer border border-transparent p-6 transition-all duration-500 hover:border-gold/20 hover:bg-white sm:p-8"
                >
                  {post.image && (
                    <div className="mb-5 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="mb-4 flex items-center gap-4">
                    <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-gold/70">
                      {post.category}
                    </span>
                    <span className="h-px flex-1 bg-gold/20" />
                    <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-black/30">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : ''}
                    </span>
                  </div>
                  <Link href={`/journal/${post.slug}`}>
                    <h2 className="font-serif text-xl font-light leading-snug text-black-dark transition-colors duration-300 group-hover:text-gold-dark sm:text-2xl">
                      {post.title}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-black/55">{post.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black/40 transition-colors duration-300 group-hover:text-gold-dark">
                      Read More
                      <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}