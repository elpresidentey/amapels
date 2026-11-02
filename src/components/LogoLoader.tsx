'use client'

import { motion } from 'framer-motion'
import Logo from './Logo'

interface LogoLoaderProps {
  message?: string
  className?: string
}

/**
 * Animated logo loading component
 * Useful for loading states, page transitions, etc.
 */
export default function LogoLoader({ message = 'Loading...', className = '' }: LogoLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
      >
        <motion.div
          animate={{
            opacity: [1, 0.6, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Logo 
            variant="mark" 
            className="h-20 w-20 sm:h-24 sm:w-24"
            priority 
          />
        </motion.div>
      </motion.div>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[10px] font-medium uppercase tracking-[0.28em] text-ink/65"
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}
