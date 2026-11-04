'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { CUSTOMER_LOGIN_EVENT } from '@/lib/customerAuth'
import { useCartStore } from '@/store/newCartStore'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISSED_AT_KEY = 'amapels_pwa_install_dismissed_at'
const LEGACY_DISMISSED_KEY = 'amapels_pwa_install_dismissed'
const DISMISS_WINDOW_MS = 14 * 24 * 60 * 60 * 1000
const GUEST_SHOW_DELAY_MS = 6000
const LOGIN_SHOW_DELAY_MS = 1600

function isStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function isPhoneOrTablet() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(max-width: 1024px)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  )
}

function isIOSDevice() {
  if (typeof navigator === 'undefined') return false
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [installed, setInstalled] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()
  const cartOpen = useCartStore((state) => state.isOpen)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (typeof window === 'undefined') return

    // Register the service worker on every device so repeat visits stay fast
    // and the store keeps working offline.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined)
    }

    // Only ask on phones and tablets, and never when already installed.
    // Desktop browsers keep their own native install UI.
    if (!isPhoneOrTablet() || isStandalone()) return

    setIsIOS(isIOSDevice())

    // The old flag blocked the prompt forever. Clear it so people who
    // previously tapped "Not now" get another chance.
    localStorage.removeItem(LEGACY_DISMISSED_KEY)

    const onInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }

    const onInstalled = () => {
      setInstalled(true)
      setVisible(false)
      setDeferredPrompt(null)
      localStorage.removeItem(DISMISSED_AT_KEY)
    }

    window.addEventListener('beforeinstallprompt', onInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)

    const dismissedAt = Number(localStorage.getItem(DISMISSED_AT_KEY) || 0)
    const recentlyDismissed =
      dismissedAt > 0 && Date.now() - dismissedAt < DISMISS_WINDOW_MS

    const schedule = (delay: number) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setShowInstructions(false)
        setVisible(true)
      }, delay)
    }

    if (!recentlyDismissed) {
      schedule(GUEST_SHOW_DELAY_MS)
    }

    // Signing in on a phone is a strong signal of intent, so surface the
    // prompt soon after — even if it was dismissed earlier.
    const onLogin = () => {
      if (!isStandalone()) schedule(LOGIN_SHOW_DELAY_MS)
    }
    window.addEventListener(CUSTOMER_LOGIN_EVENT, onLogin)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      window.removeEventListener(CUSTOMER_LOGIN_EVENT, onLogin)
      window.removeEventListener('beforeinstallprompt', onInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setShowInstructions(true)
      return
    }

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      setDeferredPrompt(null)
      setVisible(false)
      if (outcome === 'dismissed') {
        localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()))
      }
    } catch {
      // Some browsers refuse the prompt after it has expired — fall back
      // to the manual instructions instead of leaving a dead button.
      setShowInstructions(true)
    }
  }

  const handleDismiss = () => {
    setVisible(false)
    localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()))
  }

  if (installed) return null

  // Keep admin and checkout clear so the prompt never blocks a task.
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/checkout')) {
    return null
  }

  // Keep the storefront entrance clear; installation can be offered after
  // the shopper has moved into the catalogue or another supporting page.
  if (pathname === '/') return null

  const show = visible && !cartOpen
  const installLabel = deferredPrompt ? 'Install app' : 'How to install'

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="pwa-install"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[900] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-sm"
          role="dialog"
          aria-label="Install the AMAPELS app"
        >
          <div className="flex items-start gap-4 rounded-lg border border-gold/40 bg-black/95 p-4 shadow-editorial-lg backdrop-blur">
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
                <p className="mt-1.5 text-xs leading-relaxed text-white/75">
                  {isIOS ? (
                    <>
                      Tap the <span className="font-medium text-white">Share</span> button, then
                      choose <span className="font-medium text-white">Add to Home Screen</span>.
                    </>
                  ) : (
                    <>
                      Open your browser menu and choose{' '}
                      <span className="font-medium text-white">Install app</span> or{' '}
                      <span className="font-medium text-white">Add to Home screen</span>.
                    </>
                  )}
                </p>
              ) : (
                <p className="mt-1.5 text-xs leading-relaxed text-white/75">
                  Add the AMAPELS app to your phone for faster checkout, order updates and
                  offline browsing.
                </p>
              )}
              {!showInstructions && (
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleInstall}
                    className="rounded bg-gold px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-black transition-colors hover:bg-gold-light"
                  >
                    {installLabel}
                  </button>
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="text-[10px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white"
                  >
                    Not now
                  </button>
                </div>
              )}
              {showInstructions && (
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white"
                >
                  Got it
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close install prompt"
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-white/70 transition-colors hover:text-white"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
