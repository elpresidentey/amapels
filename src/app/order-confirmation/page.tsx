'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Package, Truck, Mail, ArrowRight, Download, Calendar } from 'lucide-react'
import Link from 'next/link'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const reference = searchParams.get('ref')
    
    if (reference) {
      setOrderNumber(reference)
    } else {
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
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 bg-accent-emerald rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Check size={40} className="text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-light text-black mb-4">
              Your Order is Confirmed!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Thank you for choosing Amapels. We're honored to craft and deliver your exquisite jewelry with care.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-3xl border border-gold/30 p-8 md:p-12 mb-12 text-left"
          >
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="font-serif text-2xl text-black mb-6">Order Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Package size={20} className="text-black" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Number</p>
                      <p className="font-mono font-medium text-black">{orderNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Calendar size={20} className="text-black" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-medium text-black">{orderDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Mail size={20} className="text-black" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Confirmation Email</p>
                      <p className="font-medium text-black">Sent to your email address</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl text-black mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <button className="w-full bg-black text-white py-4 px-6 rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-gold hover:text-black transition-colors flex items-center justify-center gap-2 border border-gold">
                    <Download size={16} />
                    Download Receipt
                  </button>
                  
                  <Link 
                    href="/shop"
                    className="w-full border-2 border-gold text-black py-4 px-6 rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-gold transition-colors flex items-center justify-center gap-2"
                  >
                    Continue Exploring
                    <ArrowRight size={16} />
                  </Link>
                  
                  <Link 
                    href="/contact"
                    className="w-full text-center text-gray-600 hover:text-black transition-colors text-sm"
                  >
                    Need help? Contact us
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-left"
          >
            <h2 className="font-serif text-3xl text-black mb-8 text-center">What Happens Next?</h2>
            
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
                    step.status === 'completed' ? 'bg-accent-emerald text-white' : 'bg-gray-100 text-black'
                  }`}>
                    {step.icon}
                  </div>
                  
                  <h3 className="font-serif text-xl text-black mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{step.description}</p>
                  
                  {step.timeframe && (
                    <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-accent-orange rounded-full"></div>
                      <span className="text-xs font-medium text-black">{step.timeframe}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-16 bg-gray-50 rounded-2xl p-8 text-center"
          >
            <h3 className="font-serif text-xl text-black mb-4">We're Here to Help</h3>
            <p className="text-gray-600 mb-6">
              Our dedicated team is ready to assist you with any questions about your order or jewelry care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gold hover:text-black transition-colors border border-gold"
              >
                <Mail size={16} />
                Contact Support
              </Link>
              
              <a 
                href="tel:+2348123456789"
                className="inline-flex items-center gap-2 border-2 border-gold text-black px-6 py-3 rounded-xl text-sm font-medium hover:bg-gold transition-colors"
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

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white pt-28 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [showPrint, setShowPrint] = useState(false)
  useEffect(() => {
    const reference = searchParams.get('ref')
    const itemsParam = searchParams.get('items')
    
    if (reference) {
      setOrderNumber(reference)
    } else {
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
    
    // Parse items from URL parameter if available
    if (itemsParam) {
      try {
        const parsedItems = JSON.parse(itemsParam)
        setOrderItems(parsedItems)
      } catch (error) {
        console.error('Error parsing order items:', error)
      }
    }
    
    setLoading(false)
  }, [searchParams])
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Mail size={20} className="text-black" />
              </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items Section */}
              {orderItems.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gold/30">
                  <h2 className="font-serif text-2xl text-black mb-6">Your Order Items</h2>
                  <div className="space-y-4">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || '/images/sabrianna-Y_bxfTa_iUA-unsplash.jpg'}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-black">{item.name}</h3>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium text-black mt-1">
                            ₦{parseInt(item.price).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right font-medium text-black">
                          ₦{(parseInt(item.price) * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-left"
          >
            <h2 className="font-serif text-3xl text-black mb-8 text-center">What You Ordered</h2>
            <h2 className="font-serif text-3xl text-black mb-8 text-center">What Happens Next?</h2>
  // Print receipt
  const handlePrint = () => {
    window.print()
  }
  
  if (loading) {
              <div>
                <h3 className="font-serif text-xl text-black mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <button 
                    onClick={handlePrint}
                    className="w-full bg-black text-white py-4 px-6 rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-gold hover:text-black transition-colors flex items-center justify-center gap-2 border border-gold"
                  >
                    <Download size={16} />
                    Download Receipt
                  </button>
                  <p className="text-xs text-center text-gray-600">Click to print your order summary</p>
      </div>
    </div>

    {/* Print Styles */}
    <style>{`
      @media print {
        body * {
          visibility: hidden;
        }
        .printable-area, .printable-area * {
          visibility: visible;
        }
        .printable-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          background: white;
        }
        .no-print {
          display: none !important;
        }
      }
    `}</style>