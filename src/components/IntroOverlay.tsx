"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Logo from '@/components/Logo'

export default function IntroOverlay() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)

  useEffect(() => {
    // A splash belongs on the storefront entrance, not on order, checkout,
    // account or admin deep links where it would block the page someone
    // actually came for.
    if (pathname !== "/") {
      setShow(false)
      return
    }

    const seen = sessionStorage.getItem("amapels_intro_seen")
    if (!seen) {
      setShow(true)
      sessionStorage.setItem("amapels_intro_seen", "1")
    }
  }, [pathname])

  const handleDismiss = () => setShow(false)

  return (
    <AnimatePresence onExitComplete={handleDismiss}>
      {show && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0C0A08] cursor-pointer"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
              className="font-serif text-4xl md:text-5xl lg:text-[4rem] tracking-[0.15em] text-white mb-4"
            >
              Welcome to
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.65, ease: "easeOut" }}
              className="h-px w-24 md:w-32 bg-gold mx-auto mb-6"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
              className="flex justify-center"
            >
              <Logo
                variant="wordmark"
                tone="gold"
                className="h-7 w-56 md:h-9 md:w-72 lg:h-11 lg:w-96"
                priority
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.35, ease: "easeOut" }}
              className="mt-8 text-center font-serif text-lg italic md:text-xl text-white/70 tracking-wide"
            >
              Love it. <span className="text-gold">Repeat.</span>
            </motion.p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.9 }}
            className="absolute bottom-12 text-xs text-white/60 tracking-widest uppercase animate-pulse"
          >
            Tap to enter
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
