'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

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

export default function JournalPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params.slug) return
    fetch(`/api/blog/slug/${params.slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((data) => {
        if (data.post) setPost(data.post)
        else router.push('/journal')
      })
      .catch(() => router.push('/journal'))
      .finally(() => setLoading(false))
  }, [params.slug, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary pt-24">
        <Loader2 size={24} className="animate-spin text-gold-dark" />
      </div>
    )
  }

  if (!post) return null

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <div className="min-h-screen bg-primary pt-24">
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <Link
            href="/journal"
            className="mb-8 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black/40 transition-colors hover:text-gold-dark"
          >
            <ArrowLeft size={12} />
            Back to Journal
          </Link>

          {post.image && (
            <div className="mb-8 overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full object-cover" />
            </div>
          )}

          <div className="mb-4 flex items-center gap-4">
            <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-gold/70">
              {post.category}
            </span>
            <span className="h-px flex-1 bg-gold/20" />
            {date && (
              <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-black/30">
                {date}
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl font-light leading-[1.1] text-black-dark sm:text-4xl md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-3 text-sm text-black/40">
            By {post.author}
          </p>

          <div className="mt-10 border-t border-gold/15 pt-8 text-base leading-relaxed text-black/70 sm:text-lg sm:leading-relaxed">
            {post.content.split('\n').map((paragraph, i) => (
              paragraph.trim() ? <p key={i} className="mb-5">{paragraph}</p> : null
            ))}
          </div>
        </motion.div>
      </article>
    </div>
  )
}