'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cabin } from 'next/font/google'
import { useCartStore } from '@/store/newCartStore'
import CustomerAuth from '@/components/CustomerAuth'

const cabin = Cabin({
  subsets: ['latin'],
  display: 'swap',
})

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  const { getTotalItems, isLoaded, items, toggleCart } = useCartStore()
  const [cartItemCount, setCartItemCount] = useState(0)

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '/collections' },
    { name: 'Shop All', href: '/shop' },
    { name: 'Our Story', href: '/story' },
  ]

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setScrolled(window.scrollY > 16)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mounted && isLoaded) {
      setCartItemCount(getTotalItems())
    }
  }, [mounted, isLoaded, getTotalItems])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={`${cabin.className} fixed top-0 left-0 right-0 z-50 safe-top transition-all duration-500 ease-out ${
        scrolled
          ? 'border-b border-white/[0.06] bg-black-dark/90 py-3 backdrop-blur-2xl md:py-3.5'
          : 'border-b border-transparent bg-gradient-to-b from-black-dark/70 to-transparent py-4 md:py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="group flex-shrink-0" aria-label="AMAPELS home">
            <span className="font-serif text-xl font-light tracking-[0.28em] text-white uppercase transition-opacity duration-300 group-hover:opacity-85 md:text-2xl">
              AMAPELS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-10 lg:flex xl:gap-12">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative py-1 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                    active ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              )
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-5 md:gap-6">
            <div className="hidden lg:block">
              <CustomerAuth />
            </div>

            <button
              onClick={toggleCart}
              className="relative text-white/75 transition-colors duration-300 hover:text-white"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={19} strokeWidth={1.4} />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -right-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[9px] font-semibold leading-none text-black-dark">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>

            <button
              className="text-white/90 transition-colors hover:text-white lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={22} strokeWidth={1.4} /> : <Menu size={22} strokeWidth={1.4} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/[0.06] bg-black-dark/98 backdrop-blur-2xl lg:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="space-y-1 py-8">
                {navItems.map((item, index) => (
                  <motion.div
                    key={`mobile-${item.name}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={`block border-l-2 py-3.5 pl-5 text-base font-light tracking-[0.12em] uppercase transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'border-gold text-white'
                          : 'border-transparent text-white/75 hover:border-gold/40 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <div className="mt-4 border-t border-white/[0.06] px-5 pt-6">
                  <CustomerAuth />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
