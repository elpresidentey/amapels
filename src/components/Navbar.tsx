'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X, Search, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const { getTotalItems, isLoaded, items } = useCartStore()
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled 
          ? 'bg-brown-dark/95 backdrop-blur-xl py-3' 
          : 'bg-brown-dark/80 backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-serif text-xl md:text-2xl font-light tracking-[0.25em] text-ivory uppercase">
              AMAPELS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-16">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className="text-[9px] font-medium uppercase tracking-[0.3em] text-champagne hover:text-ivory transition-colors duration-150"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-champagne hover:text-ivory transition-colors duration-150">
              <Search size={18} strokeWidth={1.3} />
            </button>
            <button className="hidden text-champagne hover:text-ivory transition-colors duration-150 sm:inline-flex">
              <Heart size={18} strokeWidth={1.3} />
            </button>
            <Link href="/cart" className="text-champagne hover:text-ivory transition-colors duration-150 relative">
              <ShoppingBag size={18} strokeWidth={1.3} />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
            <button 
              className="text-ivory md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={22} strokeWidth={1.3} /> : <Menu size={22} strokeWidth={1.3} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-brown-dark/98 backdrop-blur-xl border-t border-ivory/20 md:hidden"
          >
            <div className="space-y-10 px-6 py-14">
              {navItems.map((item, index) => (
                <motion.div
                  key={`mobile-${item.name}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Link 
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-xl font-light uppercase tracking-[0.35em] text-champagne hover:text-ivory transition-colors duration-150"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
