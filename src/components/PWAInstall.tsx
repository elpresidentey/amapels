'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISSED_KEY = 'amapels_pwa_install_dismissed'
const SHOW_DELAY_MS = 4000

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (typeof window === 'undefined') return

    // Already installed as an app — no prompt needed
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
    if (standalone) return

    if (localStorage.getItem(DISMISSED_KEY)) return

    // Register the service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined)
    }

    // iOS Safari does not fire beforeinstallprompt — show manual instructions instead
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    let timer: ReturnType<typeof setTimeout> | undefined

    const show = () => setVisible(true)

    const onInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
      if (!timer) timer = setTimeout(show, SHOW_DELAY_MS)
    }

    const onInstalled = () => {
      setVisible(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', onInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)

    if (iOS) {
      timer = setTimeout(show, SHOW_DELAY_MS)
    }

    return () => {
      if (timer) clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', onInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (isIOS) {
      setShowInstructions(true)
      return
    }
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setVisible(false)
    if (outcome === 'dismissed') {
      localStorage.setItem(DISMISSED_KEY, '1')
    }
  }

  const handleDismiss = () => {
    setVisible(false)
    localStorage.setItem(DISMISSED_KEY, '1')
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="pwa-install"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[900] px-4 pb-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-sm"
          role="dialog"
          aria-label="Install the AMAPELS app"
        >
          <div className="flex items-start gap-4 border border-gold/40 bg-black/95 p-4 shadow-editorial-lg backdrop-blur rounded-lg">
            <Image
              src="/icons/icon-192.png"
              alt=""
              width={44}
              height={44}
              className="flex-shrink-0 rounded-md"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gold-light">
                Install AMAPELS
              </p>
              {showInstructions ? (
                <p className="mt-1.5 text-xs leading-relaxed text-white/70">
                  Tap the <span className="text-white">Share</span> button in your browser, then
                  choose <span className="text-white">Add to Home Screen</span>.
                </p>
              ) : (
                <p className="mt-1.5 text-xs leading-relaxed text-white/70">
                  Add our app to your home screen for faster shopping and easy access, even
                  offline.
                </p>
              )}
              {!showInstructions && (
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={handleInstall}
                    className="bg-gold text-black px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] hover:bg-gold-light transition-colors rounded"
                  >
                    Install
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="text-[10px] uppercase tracking-[0.18em] text-white/70 hover:text-white/70 transition-colors"
                  >
                    Not now
                  </button>
                </div>
              )}
              {showInstructions && (
                <button
                  onClick={handleDismiss}
                  className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/70 hover:text-white/70 transition-colors"
                >
                  Got it
                </button>
              )}
            </div>
            <button
              onClick={handleDismiss}
              aria-label="Close install prompt"
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
