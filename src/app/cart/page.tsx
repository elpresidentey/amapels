'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, X, ShoppingBag, ArrowLeft, ArrowRight, Shield, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/newCartStore'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, getShipping, getTax, getTotalPrice, isLoaded } = useCartStore()

  const subtotal = getSubtotal()
  const shipping = getShipping()
  const tax = getTax()
  const total = getTotalPrice()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-primary pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12">
        <div className="section-shell">
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-black/50 text-sm">Loading your selections...</p>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-primary pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12">
        <div className="section-shell">
          <div className="text-center py-16 sm:py-20 md:py-24">
            <div className="mb-6 md:mb-8">
              <ShoppingBag size={48} className="text-black/20 mx-auto" strokeWidth={1} />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-black-dark mb-4">Your Collection Awaits</h1>
            <p className="text-black/55 mb-8 md:mb-10 px-4 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Discover handcrafted jewelry to wear, love, and cherish. Every piece tells a story.
            </p>
            <Link
              href="/shop"
              className="btn-premium inline-flex items-center gap-2.5 bg-black px-8 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-white hover:bg-gold hover:text-black-dark transition-all sm:text-[11px]"
            >
              <ArrowLeft size={14} />
              Explore the Collection
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16">
      <div className="section-shell">
        <div className="mb-6 md:mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-black/55 hover:text-black-dark transition-colors text-[10px] font-medium uppercase tracking-[0.22em] sm:text-[11px]"
          >
            <ArrowLeft size={13} />
            Continue Exploring
          </Link>
        </div>

        <div className="mb-10 border-b border-black/[0.06] pb-8 sm:mb-12 sm:pb-10 md:mb-14">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-black-dark">Your Selections</h1>
          <p className="mt-3 text-sm text-black/50">{items.length} {items.length === 1 ? 'piece' : 'pieces'} in your collection</p>
        </div>

        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1fr_380px] lg:gap-12 xl:gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-1">
            <div className="divide-y divide-black/[0.06]">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-4 py-6 first:pt-0 last:pb-0 sm:gap-5 md:gap-6"
                >
                  <Link href={`/shop/${item.id}`} className="relative w-20 h-24 rounded-sm overflow-hidden bg-primary-light flex-shrink-0 sm:w-24 sm:h-28 md:w-28 md:h-32">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-3 mb-1.5">
                        <Link href={`/shop/${item.id}`} className="font-serif text-sm sm:text-base md:text-lg font-light text-black-dark leading-snug hover:text-gold-dark transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-black/30 hover:text-black-dark transition-colors flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <X size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/35 sm:text-[11px]">{item.category}</p>
                      {(item.size || item.color) && (
                        <div className="flex items-center gap-3 mt-2 text-xs text-black/45">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-black/10">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-black/50 hover:text-black-dark hover:bg-black/[0.03] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} strokeWidth={1.5} />
                        </button>
                        <span className="w-10 text-center font-medium text-black-dark text-xs tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-black/50 hover:text-black-dark hover:bg-black/[0.03] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="font-medium text-black-dark text-sm tracking-wide">{item.price}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-1"
          >
            <div className="bg-white border border-gold/20 p-6 sm:p-8 lg:sticky lg:top-32">
              <h2 className="font-serif text-lg sm:text-xl font-light text-black-dark mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-black/60">
                  <span>Subtotal</span>
                  <span className="tabular-nums">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-black/60">
                  <span>Shipping</span>
                  <span className="tabular-nums">{shipping > 0 ? `₦${shipping.toLocaleString()}` : 'Complimentary'}</span>
                </div>
                <div className="flex justify-between text-sm text-black/60">
                  <span>VAT (7.5%)</span>
                  <span className="tabular-nums">₦{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-black/[0.06] pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-black-dark">Total</span>
                    <span className="font-medium text-black-dark tabular-nums">₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {subtotal < 50000 && (
                <div className="bg-primary-light/60 border border-gold/15 px-4 py-3 mb-6">
                  <p className="text-xs text-black/55 text-center">
                    Add ₦{(50000 - subtotal).toLocaleString()} more for complimentary shipping
                  </p>
                </div>
              )}

              <Link
                href="/checkout"
                className="btn-premium w-full bg-black text-white py-4 px-6 text-[10px] font-medium uppercase tracking-[0.22em] hover:bg-gold hover:text-black-dark transition-all flex items-center justify-center gap-2.5 sm:text-[11px]"
              >
                Proceed to Checkout
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <div className="mt-6 space-y-2.5">
                <div className="flex items-center gap-2.5 text-[10px] text-black/40 sm:text-[11px]">
                  <Shield size={12} strokeWidth={1.5} className="flex-shrink-0" />
                  <span>Secure SSL encrypted checkout</span>
                </div>
                <div className="flex items-center gap-2.5 text-[10px] text-black/40 sm:text-[11px]">
                  <Truck size={12} strokeWidth={1.5} className="flex-shrink-0" />
                  <span>Complimentary shipping on orders over ₦50,000</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
