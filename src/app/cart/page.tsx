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
      <div className="min-h-screen bg-ivory pt-28 pb-16">
        <div className="section-shell">
          <div className="text-center py-20">
            <div className="mb-8">
              <ShoppingBag size={64} className="text-brown/30 mx-auto" />
            </div>
            <h1 className="font-serif text-3xl font-light text-brown-dark mb-4">Begin Your Collection</h1>
            <p className="text-brown/70 mb-8">Timeless treasures await your discovery - explore pieces to wear, love, and cherish.</p>
            <Link 
              href="/shop"
              className="inline-flex items-center gap-2 bg-brown-dark text-ivory px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-brown transition-colors"
            >
              <ArrowLeft size={16} />
              Discover Treasures
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory pt-28 pb-16">
      <div className="section-shell">
        <div className="mb-8">
          <Link 
            href="/shop"
            className="inline-flex items-center gap-2 text-brown/70 hover:text-brown-dark transition-colors text-sm uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            Continue Exploring
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="font-serif text-3xl font-light text-brown-dark mb-8">Your Selections</h1>
            
            <div className="space-y-6">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-6 p-6 bg-white rounded-2xl border border-sand/30"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-champagne/20">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg text-brown-dark">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-brown/50 hover:text-brown-dark transition-colors"
                        aria-label="Remove item"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-brown/70 mb-4">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-sand flex items-center justify-center text-brown hover:bg-sand/30 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-medium text-brown-dark">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-sand flex items-center justify-center text-brown hover:bg-sand/30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-medium text-brown-dark">{item.price}</p>
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
            <div className="bg-white rounded-2xl border border-sand/30 p-8 sticky top-32">
              <h2 className="font-serif text-xl text-brown-dark mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-brown/70">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-brown/70">
                  <span>Shipping</span>
                  <span>₦{shipping.toLocaleString()}</span>
                </div>
                <div className="border-t border-sand pt-4">
                  <div className="flex justify-between font-medium text-brown-dark text-lg">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <Link 
                href="/checkout"
                className="w-full bg-brown-dark text-ivory py-4 text-sm font-medium uppercase tracking-wider hover:bg-brown transition-colors rounded-xl flex items-center justify-center"
              >
                Proceed to Checkout
              </Link>
              
              <p className="text-xs text-brown/60 text-center mt-4">
                Secure checkout protected with SSL encryption
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}