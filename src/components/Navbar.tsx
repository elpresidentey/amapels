'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ShoppingBag, Menu, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cabin } from 'next/font/google'
import { useCartStore } from '@/store/newCartStore'
import SearchOverlay from '@/components/SearchOverlay'
import ThemeToggle from '@/components/ThemeToggle'
import Logo from '@/components/Logo'
import { SHOP_NAV_MENUS } from '@/lib/shop-navigation'

const cabin = Cabin({
  subsets: ['latin'],
  display: 'swap',
})

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const pathname = usePathname()

  const { getTotalItems, isLoaded, items, toggleCart } = useCartStore()
  const [cartItemCount, setCartItemCount] = useState(0)

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
  }, [mounted, isLoaded, getTotalItems, items])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
    setActiveMegaMenu(null)
  }, [pathname])

  useEffect(() => {
    if (!activeMegaMenu) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveMegaMenu(null)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [activeMegaMenu])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const closeMenus = () => {
    setActiveMegaMenu(null)
    closeMenu()
  }

  return (
    <nav
      className={`${cabin.className} fixed top-0 left-0 right-0 z-50 h-[calc(56px+env(safe-area-inset-top))] safe-top transition-all duration-500 ease-out lg:h-[calc(70px+env(safe-area-inset-top))] ${
        scrolled
          ? 'border-b border-ink/[0.06] bg-chrome/90 backdrop-blur-2xl'
          : 'border-b border-transparent bg-gradient-to-b from-chrome/70 to-transparent'
      }`}
    >
      <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="flex h-full items-center justify-between">
          {/* Brand */}
          <Link href="/" className="group flex-shrink-0" aria-label="AMAPELS home">
            <Logo 
              variant="wordmark"
              className="h-5 w-36 lg:h-6 lg:w-40"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 lg:flex xl:gap-3">
            {SHOP_NAV_MENUS.map((item) => {
              const open = activeMegaMenu === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-expanded={open}
                  aria-controls={`nav-menu-${item.id}`}
                  onClick={() => setActiveMegaMenu(open ? null : item.id)}
                  className={`group relative inline-flex items-center gap-1 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] transition-colors duration-300 xl:text-[10px] ${open ? 'text-ink' : 'text-ink/70 hover:text-ink'}`}
                >
                  {item.label}
                  <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  <span className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300 ${open ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </button>
              )
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            <ThemeToggle className="hidden sm:block" />
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-ink/75 transition-colors duration-300 hover:text-ink"
              aria-label="Search products"
            >
              <Search size={19} strokeWidth={1.4} />
            </button>

            <button
              onClick={toggleCart}
              className="relative flex h-10 w-10 items-center justify-center text-ink/75 transition-colors duration-300 hover:text-ink"
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
              className="flex h-11 w-11 items-center justify-center text-ink/90 transition-colors hover:text-ink lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={22} strokeWidth={1.4} /> : <Menu size={22} strokeWidth={1.4} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeMegaMenu && !isMenuOpen && (() => {
          const menu = SHOP_NAV_MENUS.find((item) => item.id === activeMegaMenu)
          if (!menu) return null
          return (
            <motion.div
              id={`nav-menu-${menu.id}`}
              key={menu.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              onMouseLeave={() => setActiveMegaMenu(null)}
              className="pointer-events-none absolute left-0 right-0 top-full z-50 flex justify-center px-4 pt-2"
            >
              <div className="pointer-events-auto grid w-full max-w-[860px] grid-cols-2 divide-x divide-ink/10 border border-ink/10 bg-chrome/95 px-5 py-5 shadow-[0_18px_45px_rgba(25,18,12,0.14)] backdrop-blur-xl sm:px-8 sm:py-7">
                <div className={`col-span-2 grid ${menu.sections.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {menu.sections.map((section, index) => (
                    <section key={section.heading} className={`${index > 0 ? 'pl-5 sm:pl-8' : 'pr-5 sm:pr-8'} ${index < menu.sections.length - 1 ? 'border-r border-ink/10' : ''}`}>
                      <h2 className="mb-3 border-b border-gold-ink/35 pb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-ink/50 sm:mb-4">{section.heading}</h2>
                      <div className="flex flex-col items-start">
                        {section.links.map((link) => (
                          <Link key={link.label} href={link.href} onClick={closeMenus} className="w-full py-1.5 text-[13px] font-light leading-5 text-ink/75 transition-colors hover:text-gold-ink">
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[calc(100svh-5rem)] overflow-x-hidden overflow-y-auto overscroll-contain border-t border-ink/[0.06] bg-chrome/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="space-y-1 py-5">
                {SHOP_NAV_MENUS.map((item, index) => {
                  const open = activeMegaMenu === item.id
                  return (
                    <motion.div
                      key={`mobile-${item.id}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.04 }}
                    >
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setActiveMegaMenu(open ? null : item.id)}
                        className="flex w-full items-center justify-between border-l-2 border-transparent py-3 pl-5 text-left text-sm font-light uppercase tracking-[0.12em] text-ink/80 transition-colors hover:border-gold/40 hover:text-ink"
                      >
                        {item.label}
                        <ChevronDown size={15} className={`mr-2 transition-transform ${open ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-5">
                            {item.sections.map((section) => (
                              <div key={section.heading} className="border-l border-ink/10 py-3 pl-4">
                                <h2 className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-ink/45">{section.heading}</h2>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                                  {section.links.map((link) => (
                                    <Link key={link.label} href={link.href} onClick={closeMenus} className="py-1.5 text-xs text-ink/70 transition-colors hover:text-gold-ink">{link.label}</Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}

                <div className="mt-4 flex items-center gap-2 px-5">
                  <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-ink/65">
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
