'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, Search, X } from 'lucide-react'
import type { ProductData } from '@/lib/fallbackProducts'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const ease = [0.22, 1, 0.36, 1] as const

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return
    setQuery('')
    setError(null)
    setLoading(true)

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data || [])
        } else {
          setError('Could not load products')
        }
      })
      .catch(() => setError('Could not load products'))
      .finally(() => setLoading(false))

    inputRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return products
      .filter((p) =>
        [p.name, p.category, p.story, p.material, p.description, p.materials]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(term))
      )
      .slice(0, 8)
  }, [query, products])

  const handleSelect = (id: string) => {
    onClose()
    router.push(`/shop/${id}`)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease }}
          className="fixed inset-0 z-[80] bg-black-dark/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto mt-24 w-full max-w-xl px-4 sm:mt-32 sm:px-6"
          >
            <div className="border border-white/10 bg-black-dark/95 shadow-2xl">
              {/* Input row */}
              <div className="flex items-center gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
                <Search size={18} strokeWidth={1.5} className="shrink-0 text-gold/70" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pieces, materials, categories..."
                  aria-label="Search products"
                  className="w-full bg-transparent text-base text-white placeholder:text-white/35 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="shrink-0 p-1 text-white/50 transition-colors hover:text-white"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto">
                {loading && (
                  <p className="px-6 py-8 text-center text-sm text-white/40">Loading the collection...</p>
                )}
                {!loading && error && (
                  <p className="px-6 py-8 text-center text-sm text-white/40">{error}</p>
                )}
                {!loading && !error && query.trim() && results.length === 0 && (
                  <p className="px-6 py-8 text-center text-sm text-white/40">
                    No pieces match &ldquo;{query.trim()}&rdquo;
                  </p>
                )}
                {!loading && !error && (!query.trim() || results.length === 0) && !query.trim() && (
                  <div className="px-6 py-4">
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-white/35">
                      Browse Categories
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Earrings', 'Necklaces', 'Bracelets', 'Jewellery Sets'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setQuery(cat)}
                          className="border border-white/15 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 transition-colors hover:border-gold/50 hover:text-gold"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {!loading && !error && query.trim() && results.length > 0 && (
                  <ul className="divide-y divide-white/[0.06]">
                    {results.map((p) => (
                      <li key={p._id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(p._id)}
                          className="group flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-white/[0.04] sm:px-6"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-white/[0.04]">
                            <Image
                              src={p.images?.[0] || '/images/sabrianna-Y_bxfTa_iUA-unsplash.jpg'}
                              alt={p.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-serif text-base font-light text-white">
                              {p.name}
                            </p>
                            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white/35">
                              {p.category}
                            </p>
                          </div>
                          <span className="shrink-0 text-sm font-medium tracking-wide text-gold">
                            {p.price}
                          </span>
                          <ArrowRight
                            size={14}
                            strokeWidth={1.5}
                            className="shrink-0 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}