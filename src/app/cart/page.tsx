'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore()

  const subtotal = getTotalPrice()
  const shipping = subtotal > 0 ? 2500 : 0
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory pt-16 pb-6 sm:pt-20 sm:pb-8 md:pt-24 md:pb-12 lg:pt-28 lg:pb-16">
        <div className="section-shell">
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="mb-6 md:mb-8">
              <ShoppingBag size={48} className="sm:w-16 sm:h-16 text-brown/30 mx-auto" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-light text-brown-dark mb-4">Begin Your Collection</h1>
            <p className="text-brown/70 mb-6 md:mb-8 px-4 text-sm sm:text-base">Timeless treasures await your discovery - explore pieces to wear, love, and cherish.</p>
            <Link 
              href="/shop"
              className="inline-flex items-center gap-2 bg-brown-dark text-ivory px-6 py-3 sm:px-8 sm:py-4 text-sm font-medium uppercase tracking-wider hover:bg-brown transition-colors rounded-xl btn-mobile"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Discover Treasures</span>
              <span className="sm:hidden">Shop Now</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16">
      <div className="section-shell">
        <div className="mb-6 md:mb-8">
          <Link 
            href="/shop"
            className="inline-flex items-center gap-2 text-brown/70 hover:text-brown-dark transition-colors text-sm uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Continue Exploring</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        <div className="grid gap-8 sm:gap-10 md:gap-12 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="font-serif text-2xl font-light text-brown-dark mb-6 sm:text-3xl sm:mb-8">Your Selections</h1>
            
            <div className="space-y-4 sm:space-y-6">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-3 p-4 bg-white rounded-xl border border-sand/30 sm:gap-4 sm:p-5 md:gap-5 md:p-6 md:rounded-2xl lg:gap-6"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-champagne/20 flex-shrink-0 sm:w-20 sm:h-20 sm:rounded-xl md:w-24 md:h-24">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1.5 sm:mb-2 gap-2">
                      <h3 className="font-serif text-sm text-brown-dark line-clamp-2 sm:text-base md:text-lg">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-brown/50 hover:text-brown-dark transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <X size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-brown/70 mb-3 sm:gap-4 sm:text-sm sm:mb-4">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-sand flex items-center justify-center text-brown hover:bg-sand/30 transition-colors sm:w-8 sm:h-8"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} className="sm:w-[14px] sm:h-[14px]" />
                        </button>
                        <span className="w-6 text-center font-medium text-brown-dark text-sm sm:w-8 sm:text-base">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-sand flex items-center justify-center text-brown hover:bg-sand/30 transition-colors sm:w-8 sm:h-8"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} className="sm:w-[14px] sm:h-[14px]" />
                        </button>
                      </div>
                      <p className="font-medium text-brown-dark text-sm sm:text-base">{item.price}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl border border-sand/30 p-4 sticky top-24 sm:p-5 sm:top-28 md:rounded-2xl md:p-6 lg:p-8 md:top-32">
              <h2 className="font-serif text-base text-brown-dark mb-4 sm:text-lg sm:mb-5 md:text-xl md:mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-5 sm:space-y-4 sm:mb-6">
                <div className="flex justify-between text-sm text-brown/70 sm:text-base">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-brown/70 sm:text-base">
                  <span>Shipping</span>
                  <span>₦{shipping.toLocaleString()}</span>
                </div>
                <div className="border-t border-sand pt-3 sm:pt-4">
                  <div className="flex justify-between font-medium text-brown-dark text-base sm:text-lg">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <Link 
                href="/checkout"
                className="w-full bg-brown-dark text-ivory py-3 text-xs font-medium uppercase tracking-wider hover:bg-brown transition-colors rounded-xl flex items-center justify-center btn-mobile sm:py-3.5 sm:text-sm md:py-4"
              >
                Proceed to Checkout
              </Link>
              
              <p className="text-[10px] text-brown/60 text-center mt-3 sm:text-xs sm:mt-4">
                Secure checkout protected with SSL encryption
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}