'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Package, Truck, Mail, ArrowRight, Download, Calendar, Phone } from 'lucide-react'
import Link from 'next/link'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [paymentReference, setPaymentReference] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const reference = searchParams.get('ref')
    const tracking = searchParams.get('tracking')
    const paymentRef = searchParams.get('payment_ref')
    const amount = searchParams.get('amount')
    const email = searchParams.get('email')

    if (reference) {
      setOrderNumber(reference)
    } else {
      const timestamp = Date.now()
      const random = Math.random().toString(36).substr(2, 4).toUpperCase()
      setOrderNumber(`AMP-${timestamp}-${random}`)
    }

    if (tracking) {
      setTrackingNumber(tracking)
    } else if (reference) {
      setTrackingNumber(`TRK-${reference.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-${Date.now().toString().slice(-6)}`)
    } else {
      setTrackingNumber(`TRK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`)
    }

    if (paymentRef) {
      setPaymentReference(paymentRef)
    } else {
      setPaymentReference(reference || '')
    }

    if (amount) {
      setTotalAmount(amount)
    }

    if (email) {
      setCustomerEmail(email)
    }

    setOrderDate(new Date().toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))

    setLoading(false)
  }, [searchParams, mounted])

  const handleDownloadReceipt = () => {
    const receiptContent = `
AMAPELS JEWELRY - ORDER RECEIPT
================================
Order Number: ${orderNumber}
Tracking Number: ${trackingNumber}
Payment Reference: ${paymentReference}
Order Date: ${orderDate}
Customer Email: ${customerEmail}

PAYMENT DETAILS
----------------
Payment Method: Bank Transfer / Card
Payment Reference: ${paymentReference}
Payment Status: SUCCESSFUL
Total Amount: ${totalAmount || '₦0.00'}

Thank you for your purchase!
For inquiries, contact: orders@amapels.com
    `.trim()

    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AMAPELS-Receipt-${orderNumber}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const nextSteps = [
    {
      icon: <Mail size={20} strokeWidth={1.5} />,
      title: 'Order Confirmation',
      description: 'Your confirmation email with complete order details is on its way to your inbox.',
      status: 'completed'
    },
    {
      icon: <Package size={20} strokeWidth={1.5} />,
      title: 'Artisan Preparation',
      description: 'Our artisans will carefully prepare your jewelry with meticulous attention to every detail.',
      status: 'pending',
      timeframe: '1-2 business days'
    },
    {
      icon: <Truck size={20} strokeWidth={1.5} />,
      title: 'Secure Delivery',
      description: 'Your treasures will be beautifully packaged and delivered with care to your doorstep.',
      status: 'pending',
      timeframe: '3-5 business days'
    }
  ]

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-primary pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black/50 text-sm">Loading your order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Check size={36} className="text-white" strokeWidth={2} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-light text-black-dark mb-4">
              Your Order is Confirmed
            </h1>
            <p className="text-lg text-black/55 max-w-2xl mx-auto">
              Thank you for choosing AMAPELS. We are honored to craft and deliver your exquisite jewelry with care.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white border border-gold/20 p-8 md:p-12 mb-12 text-left"
          >
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="font-serif text-xl text-black-dark mb-6">Order Details</h2>
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                      <Package size={18} className="text-black/55" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/40 mb-1">Order Number</p>
                      <p className="font-mono font-medium text-black-dark text-sm">{orderNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck size={18} className="text-black/55" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/40 mb-1">Tracking Number</p>
                      <p className="font-mono font-medium text-gold-dark text-sm">{trackingNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar size={18} className="text-black/55" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/40 mb-1">Order Date</p>
                      <p className="font-medium text-black-dark text-sm">{orderDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-black/55" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/40 mb-1">Confirmation Email</p>
                      <p className="font-medium text-black-dark text-sm">{customerEmail || 'Sent to your email'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl text-black-dark mb-6">Payment Information</h3>
                <div className="space-y-4 mb-6">
                  <div className="bg-primary-light/60 border border-gold/20 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Check size={14} className="text-gold-dark" />
                      <span className="text-sm font-medium text-black-dark">Payment Successful</span>
                    </div>
                    <p className="text-xs text-black/50">Your payment has been processed successfully</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/40 mb-1">Payment Reference</p>
                    <p className="font-mono font-medium text-black-dark text-sm">{paymentReference || 'Confirmed'}</p>
                  </div>

                  {totalAmount && (
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/40 mb-1">Total Amount</p>
                      <p className="font-medium text-xl text-black-dark">{totalAmount}</p>
                    </div>
                  )}
                </div>

                <h3 className="font-serif text-xl text-black-dark mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleDownloadReceipt}
                    className="w-full bg-black text-white py-3.5 px-6 text-[10px] font-medium uppercase tracking-[0.22em] hover:bg-gold hover:text-black-dark transition-all flex items-center justify-center gap-2.5 sm:text-[11px]"
                  >
                    <Download size={14} />
                    Download Receipt
                  </button>

                  <Link
                    href={`/track-order?orderNumber=${orderNumber}`}
                    className="w-full border border-black/15 text-black-dark py-3.5 px-6 text-[10px] font-medium uppercase tracking-[0.22em] hover:border-gold hover:text-gold-dark transition-all flex items-center justify-center gap-2.5 sm:text-[11px]"
                  >
                    Track Order
                    <ArrowRight size={13} />
                  </Link>

                  <Link
                    href="/shop"
                    className="w-full text-center text-black/45 hover:text-black-dark transition-colors text-xs font-medium uppercase tracking-[0.18em]"
                  >
                    Continue Shopping
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
            <h2 className="font-serif text-2xl md:text-3xl text-black-dark mb-8 text-center">What Happens Next?</h2>

            <div className="grid gap-6 md:grid-cols-3">
              {nextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                  className="border border-gold/20 bg-white p-6 relative"
                >
                  {step.status === 'completed' && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" strokeWidth={2} />
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    step.status === 'completed' ? 'bg-gold text-white' : 'bg-primary-light text-black/55'
                  }`}>
                    {step.icon}
                  </div>

                  <h3 className="font-serif text-lg text-black-dark mb-2">{step.title}</h3>
                  <p className="text-black/50 text-sm leading-relaxed mb-3">{step.description}</p>

                  {step.timeframe && (
                    <div className="inline-flex items-center gap-2 bg-primary-light px-3 py-1.5">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                      <span className="text-[10px] font-medium text-black/60 uppercase tracking-wider">{step.timeframe}</span>
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
            className="mt-16 bg-primary-light/50 border border-gold/15 p-8 text-center"
          >
            <h3 className="font-serif text-xl text-black-dark mb-3">We Are Here to Help</h3>
            <p className="text-black/50 text-sm mb-6 max-w-lg mx-auto">
              Our dedicated team is ready to assist you with any questions about your order or jewelry care.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-premium inline-flex items-center gap-2.5 bg-black text-white px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] hover:bg-gold hover:text-black-dark transition-all sm:text-[11px]"
              >
                <Mail size={13} />
                Contact Support
              </Link>

              <a
                href="tel:+234-809-123-4567"
                className="btn-premium inline-flex items-center gap-2.5 border border-black/15 text-black-dark px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] hover:border-gold hover:text-gold-dark transition-all sm:text-[11px]"
              >
                <Phone size={13} />
                Call Us: +234-809-123-4567
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
      <div className="min-h-screen bg-primary pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black/50 text-sm">Loading...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
