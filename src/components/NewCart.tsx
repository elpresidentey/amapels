'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/newCartStore'

export default function NewCart() {
  const [mounted, setMounted] = useState(false)
  const {
    items,
    isOpen,
    isLoaded,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
    getShipping,
    getTax,
    getTotalPrice,
  } = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when cart is open
  useEffect(() => {
    if (!mounted) return
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, mounted])

  if (!mounted || !isLoaded) {
    return null
  }

  const subtotal = getSubtotal()
  const shipping = getShipping()
  const tax = getTax()
  const total = getTotalPrice()
  const itemCount = getTotalItems()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black-dark/40 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full flex-col overflow-hidden bg-primary shadow-editorial-lg sm:max-w-md lg:max-w-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-5 sm:px-7 sm:py-6">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/40">
                  Your Selection
                </p>
                <h2 className="mt-1 font-serif text-xl font-light text-black-dark sm:text-2xl">
                  Cart{itemCount > 0 ? ` · ${itemCount}` : ''}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black/50 transition-colors hover:border-black/25 hover:text-black-dark"
                aria-label="Close cart"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-black/8">
                    <ShoppingBag size={24} strokeWidth={1.25} className="text-black/30" />
                  </div>
                  <h3 className="font-serif text-xl font-light text-black-dark">Your cart is empty</h3>
                  <p className="mt-2 max-w-xs text-sm text-black/50">
                    Discover our collection of refined Nigerian jewelry.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="btn-premium mt-8 bg-black-dark px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:bg-black"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-1 px-4 py-4 sm:px-6 sm:py-5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-black/[0.05] py-4 last:border-0"
                    >
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-primary-light sm:h-24 sm:w-20">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-black/40">
                              {item.category}
                            </p>
                            <h4 className="mt-1 line-clamp-2 font-serif text-base font-light text-black-dark">
                              {item.name}
                            </h4>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="shrink-0 p-1.5 text-black/30 transition-colors hover:text-black-dark"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-medium text-gold-dark">{item.price}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center border border-black/10 text-black/50 transition-colors hover:border-black/25 hover:text-black-dark"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} strokeWidth={1.5} />
                            </button>
                            <span className="min-w-[1.25rem] text-center text-sm text-black-dark">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center border border-black/10 text-black/50 transition-colors hover:border-black/25 hover:text-black-dark"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-black/[0.06] bg-primary-light/40 px-5 py-5 sm:px-7 sm:py-6">
                <div className="mb-5 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black/50">Subtotal</span>
                    <span className="text-black-dark">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Shipping</span>
                    <span className="text-black-dark">₦{shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Tax (VAT 7.5%)</span>
                    <span className="text-black-dark">₦{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-black/[0.06] pt-3 font-medium">
                    <span className="text-black-dark">Total</span>
                    <span className="text-black-dark">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="btn-premium block w-full bg-black-dark py-3.5 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:bg-black"
                  >
                    Proceed to Checkout
                  </Link>
                  <div className="flex gap-2.5">
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="btn-premium flex-1 border border-black/15 py-2.5 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-black-dark transition-colors hover:border-black/30"
                    >
                      View Cart
                    </Link>
                    <button
                      onClick={clearCart}
                      className="flex-1 border border-black/10 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-black/45 transition-colors hover:border-black/20 hover:text-black-dark"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
