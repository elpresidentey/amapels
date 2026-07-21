"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function IntroOverlay() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem("amapels_intro_seen")
    if (!seen) {
      setShow(true)
      sessionStorage.setItem("amapels_intro_seen", "1")
    }
  }, [])

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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black cursor-pointer"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] text-white mb-4"
            >
              Welcome to
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
              className="h-px w-24 md:w-32 bg-gold mx-auto mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
              className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-[0.25em] text-gold uppercase"
            >
              AMAPELS NG
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.2, ease: "easeOut" }}
              className="mt-8 text-sm md:text-base text-white/50 tracking-[0.3em] uppercase"
            >
              Modern Nigerian Elegance
            </motion.p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3 }}
            className="absolute bottom-12 text-xs text-white/30 tracking-widest uppercase animate-pulse"
          >
            Tap to enter
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
