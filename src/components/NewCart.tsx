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
    getTotalPrice
  } = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-md lg:max-w-lg bg-white z-50 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-sand/30">
              <div className="flex items-center gap-2 sm:gap-3">
                <ShoppingBag size={20} className="sm:w-6 sm:h-6 text-brown-dark" />
                <h2 className="font-serif text-lg sm:text-xl text-brown-dark">
                  Cart ({itemCount})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-sand/20 rounded-full transition-colors"
              >
                <X size={18} className="sm:w-5 sm:h-5 text-brown/70" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 text-center">
                  <ShoppingBag size={48} className="sm:w-16 sm:h-16 text-sand mb-3 sm:mb-4" />
                  <h3 className="font-serif text-lg sm:text-xl text-brown-dark mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-brown/60 mb-4 sm:mb-6 text-sm sm:text-base">
                    Discover our beautiful jewelry collection
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="bg-brown-dark text-ivory px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium uppercase tracking-wider hover:bg-brown transition-colors text-sm sm:text-base"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-champagne/5 rounded-xl sm:rounded-2xl">
                      {/* Product Image */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden bg-champagne/20 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 64px, 80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-brown-dark text-sm mb-1 line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-brown/60 text-xs mb-2">{item.category}</p>
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <span className="font-medium text-brown-dark text-sm sm:text-base">
                            {item.price}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                          >
                            <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-sand hover:bg-sand/20 transition-colors"
                          >
                            <Minus size={12} className="sm:w-3.5 sm:h-3.5" />
                          </button>
                          <span className="font-medium text-brown-dark min-w-[1.5rem] sm:min-w-[2rem] text-center text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-sand hover:bg-sand/20 transition-colors"
                          >
                            <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Order Summary & Checkout */}
            {items.length > 0 && (
              <div className="border-t border-sand/30 p-6 bg-champagne/5">
                {/* Order Summary */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-brown/70">Subtotal</span>
                    <span className="text-brown-dark">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brown/70">Shipping</span>
                    <span className="text-brown-dark">₦{shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brown/70">Tax (VAT 7.5%)</span>
                    <span className="text-brown-dark">₦{tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-sand pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-brown-dark">Total</span>
                      <span className="text-brown-dark">₦{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full bg-brown-dark text-ivory py-3 px-4 rounded-xl font-medium uppercase tracking-wider hover:bg-brown transition-colors text-center block"
                  >
                    Proceed to Checkout
                  </Link>
                  <div className="flex gap-3">
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="flex-1 border border-brown-dark text-brown-dark py-2 px-4 rounded-xl font-medium text-center hover:bg-brown-dark hover:text-ivory transition-colors"
                    >
                      View Cart
                    </Link>
                    <button
                      onClick={clearCart}
                      className="flex-1 border border-red-300 text-red-500 py-2 px-4 rounded-xl font-medium hover:bg-red-50 transition-colors"
                    >
                      Clear All
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