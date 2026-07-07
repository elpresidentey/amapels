'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/newCartStore'
import CustomerAuth from '@/components/CustomerAuth'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  
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
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update cart count when store changes
  useEffect(() => {
    if (mounted && isLoaded) {
      setCartItemCount(getTotalItems())
    }
  }, [mounted, isLoaded, getTotalItems])

  // Listen for cart changes by checking items length
  const itemsLength = items?.length ?? 0
  useEffect(() => {
    if (mounted && isLoaded) {
      setCartItemCount(getTotalItems())
    }
  }, [itemsLength, mounted, isLoaded, getTotalItems])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-top ${
        scrolled 
          ? 'bg-black/95 backdrop-blur-xl py-3 md:py-3.5' 
          : 'bg-black/80 backdrop-blur-sm py-4 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="flex items-center justify-between">
          {/* Brand Logo - Cleaner */}
          <Link href="/" className="flex-shrink-0">
            <span className="font-serif text-xl font-light tracking-[0.25em] text-white uppercase md:text-2xl">
              AMAPELS
            </span>
          </Link>

          {/* Desktop Navigation - Better Spacing */}
          <div className="hidden lg:flex items-center space-x-12">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className="text-xs font-medium uppercase tracking-[0.15em] text-champagne/90 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Actions - Simplified and Cleaner */}
          <div className="flex items-center gap-6">
            {/* Customer Auth - Desktop Only */}
            <div className="hidden lg:block">
              <CustomerAuth />
            </div>
            
            {/* Cart Button - Cleaner Design */}
            <button 
              onClick={toggleCart}
              className="text-champagne hover:text-white transition-colors duration-200 relative"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-orange text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="text-white lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Cleaner */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-black/98 backdrop-blur-xl border-t border-ivory/10 lg:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="py-6 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={`mobile-${item.name}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Link 
                      href={item.href}
                      onClick={closeMenu}
                      className="block text-lg font-light uppercase tracking-wide text-champagne hover:text-white transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-white/5"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Customer Auth */}
                <div className="pt-4 border-t border-ivory/10 px-4">
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

