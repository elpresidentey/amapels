'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cabin } from 'next/font/google'
import { useCartStore } from '@/store/newCartStore'
import CustomerAuth from '@/components/CustomerAuth'
import SearchOverlay from '@/components/SearchOverlay'
import ThemeToggle from '@/components/ThemeToggle'
import { isCustomerAuthenticated } from '@/lib/customerAuth'

const cabin = Cabin({
  subsets: ['latin'],
  display: 'swap',
})

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  const { getTotalItems, isLoaded, items, toggleCart } = useCartStore()
  const [cartItemCount, setCartItemCount] = useState(0)

  const checkAuth = useCallback(async () => {
    const authed = await isCustomerAuthenticated()
    setIsAuthenticated(authed)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '/collections' },
    { name: 'Shop', href: '/shop' },
    { name: 'Our Story', href: '/story' },
  ]

  useEffect(() => {
    setMounted(true)
    checkAuth()

    const handleScroll = () => {
      setScrolled(window.scrollY > 16)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [checkAuth])

  useEffect(() => {
    if (mounted && isLoaded) {
      setCartItemCount(getTotalItems())
    }
  }, [mounted, isLoaded, getTotalItems, items])

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
          ? 'border-b border-ink/[0.06] bg-chrome/90 py-3 backdrop-blur-2xl md:py-3.5'
          : 'border-b border-transparent bg-gradient-to-b from-chrome/70 to-transparent py-4 md:py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="group flex-shrink-0" aria-label="AMAPELS home">
            <span className="font-serif text-xl font-light tracking-[0.28em] text-ink uppercase transition-opacity duration-300 group-hover:opacity-85 md:text-2xl">
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
                    active ? 'text-ink' : 'text-ink/70 hover:text-ink'
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
            <ThemeToggle className="hidden sm:block" />
            <div className="hidden lg:block">
              <CustomerAuth onAuthChange={checkAuth} />
            </div>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-ink/75 transition-colors duration-300 hover:text-ink"
              aria-label="Search products"
            >
              <Search size={19} strokeWidth={1.4} />
            </button>

            <button
              onClick={toggleCart}
              className="relative p-2 text-ink/75 transition-colors duration-300 hover:text-ink"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={19} strokeWidth={1.4} />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold leading-none text-black-dark">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>

            <button
              className="p-3 text-ink/90 transition-colors hover:text-ink lg:hidden"
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
            className="border-t border-ink/[0.06] bg-chrome/98 backdrop-blur-2xl lg:hidden overflow-x-hidden"
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
                      className={`block border-l-2 py-4 pl-5 text-base font-light tracking-[0.12em] uppercase transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'border-gold text-ink'
                          : 'border-transparent text-ink/75 hover:border-gold/40 hover:text-ink'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                {isAuthenticated && (
                  <Link
                    href="/account"
                    onClick={closeMenu}
                    className="block border-l-2 border-transparent py-4 pl-5 text-base font-light tracking-[0.12em] uppercase text-ink/75 transition-colors duration-200 hover:border-gold/40 hover:text-ink"
                  >
                    Account
                  </Link>
                )}

                <div className="mt-4 border-t border-ink/[0.06] px-5 pt-6">
                  <CustomerAuth onAuthChange={checkAuth} />
                </div>

                <div className="mt-4 flex items-center gap-2 px-5">
                  <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-ink/50">
                    Appearance
                  </span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  )
}
