'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Package, Truck, Mail, ArrowRight, Download, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get reference from URL
    const reference = searchParams.get('ref')
    
    if (reference) {
      setOrderNumber(reference)
    } else {
      // Fallback: Generate order number if no reference
      const timestamp = Date.now()
      const random = Math.random().toString(36).substr(2, 4).toUpperCase()
      setOrderNumber(`AMP-${timestamp}-${random}`)
    }
    
    setOrderDate(new Date().toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))
    
    setLoading(false)
  }, [searchParams])

  const nextSteps = [
    {
      icon: <Mail size={24} />,
      title: 'Order Confirmation',
      description: 'Your confirmation email with complete order details is on its way to your inbox.',
      status: 'completed'
    },
    {
      icon: <Package size={24} />,
      title: 'Artisan Preparation',
      description: 'Our artisans will carefully prepare your jewelry with meticulous attention to every detail.',
      status: 'pending',
      timeframe: '1-2 business days'
    },
    {
      icon: <Truck size={24} />,
      title: 'Secure Delivery',
      description: 'Your treasures will be beautifully packaged and delivered with care to your doorstep.',
      status: 'pending',
      timeframe: '3-5 business days'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-800-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black/70">Loading your order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-16">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 bg-accent-emerald rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Check size={40} className="text-white" />
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-light text-black-dark mb-4">
              Your Order is Confirmed!
            </h1>
            <p className="text-lg text-black/70 max-w-2xl mx-auto">
              Thank you for choosing Amapels. We're honored to craft and deliver your exquisite jewelry with care.
            </p>
          </motion.div>

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-3xl border border-gold/30 p-8 md:p-12 mb-12 text-left"
          >
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="font-serif text-2xl text-black-dark mb-6">Order Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-light/30 rounded-full flex items-center justify-center">
                      <Package size={20} className="text-black-dark" />
                    </div>
                    <div>
                      <p className="text-sm text-black/70">Order Number</p>
                      <p className="font-mono font-medium text-black-dark">{orderNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-light/30 rounded-full flex items-center justify-center">
                      <Calendar size={20} className="text-black-dark" />
                    </div>
                    <div>
                      <p className="text-sm text-black/70">Order Date</p>
                      <p className="font-medium text-black-dark">{orderDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-light/30 rounded-full flex items-center justify-center">
                      <Mail size={20} className="text-black-dark" />
                    </div>
                    <div>
                      <p className="text-sm text-black/70">Confirmation Email</p>
                      <p className="font-medium text-black-dark">Sent to your email address</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl text-black-dark mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <button className="w-full bg-black-light-dark text-white py-4 px-6 rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-gold transition-colors flex items-center justify-center gap-2">
                    <Download size={16} />
                    Download Receipt
                  </button>
                  
                  <Link 
                    href="/shop"
                    className="w-full border border-gray-800-dark text-black-dark py-4 px-6 rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-gold hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    Continue Exploring
                    <ArrowRight size={16} />
                  </Link>
                  
                  <Link 
                    href="/contact"
                    className="w-full text-center text-black/70 hover:text-black-dark transition-colors text-sm"
                  >
                    Need help? Contact us
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-left"
          >
            <h2 className="font-serif text-3xl text-black-dark mb-8 text-center">What Happens Next?</h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              {nextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                  className="bg-white rounded-2xl border border-gold/30 p-6 relative"
                >
                  {step.status === 'completed' && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-accent-emerald rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    step.status === 'completed' ? 'bg-accent-emerald text-white' : 'bg-primary-light/30 text-black-dark'
                  }`}>
                    {step.icon}
                  </div>
                  
                  <h3 className="font-serif text-xl text-black-dark mb-3">{step.title}</h3>
                  <p className="text-black/70 text-sm leading-relaxed mb-3">{step.description}</p>
                  
                  {step.timeframe && (
                    <div className="inline-flex items-center gap-2 bg-primary-light/20 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-accent-orange rounded-full"></div>
                      <span className="text-xs font-medium text-black-dark">{step.timeframe}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-16 bg-primary-light/20 rounded-2xl p-8 text-center"
          >
            <h3 className="font-serif text-xl text-black-dark mb-4">We're Here to Help</h3>
            <p className="text-black/70 mb-6">
              Our dedicated team is ready to assist you with any questions about your order or jewelry care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 bg-black-light-dark text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gold transition-colors"
              >
                <Mail size={16} />
                Contact Support
              </Link>
              
              <a 
                href="tel:+2348123456789"
                className="inline-flex items-center gap-2 border border-gray-800-dark text-black-dark px-6 py-3 rounded-xl text-sm font-medium hover:bg-gold hover:text-white transition-colors"
              >
                Call Us: +234 812 345 6789
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}