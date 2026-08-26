'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

const SHOW_AFTER = 480

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white/95 shadow-[0_4px_16px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-colors duration-300 hover:bg-gold hover:text-black-dark sm:bottom-6 sm:right-6 sm:h-12 sm:w-12"
        >
          <ArrowUp size={18} strokeWidth={1.75} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
