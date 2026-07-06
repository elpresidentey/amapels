'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Lock, CreditCard, Truck, MapPin, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/newCartStore'

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface ShippingAddress {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface FormErrors {
  [key: string]: string
}

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
]

const steps = [
  { id: 1, title: 'Customer Info', icon: User },
  { id: 2, title: 'Shipping', icon: Truck },
  { id: 3, title: 'Payment', icon: CreditCard },
  { id: 4, title: 'Review', icon: Check }
]

export default function NewCheckoutPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  
  const { 
    items, 
    isLoaded, 
    clearCart,
    getSubtotal,
    getShipping,
    getTax,
    getTotalPrice
  } = useCartStore()

  // Form data
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria'
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if cart is empty
  useEffect(() => {
    if (mounted && isLoaded && items.length === 0) {
      router.push('/shop')
    }
  }, [mounted, isLoaded, items.length, router])

  const validateCustomerInfo = useCallback(() => {
    const newErrors: FormErrors = {}
    
    if (!customerInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!customerInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [customerInfo])

  const validateShippingAddress = useCallback(() => {
    const newErrors: FormErrors = {}
    
    if (!shippingAddress.street.trim()) {
      newErrors.street = 'Street address is required'
    }
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!shippingAddress.state.trim()) {
      newErrors.state = 'State is required'
    }
    if (!shippingAddress.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [shippingAddress])

  const handleNextStep = useCallback(() => {
    setErrors({})
    
    if (currentStep === 1) {
      if (validateCustomerInfo()) {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      if (validateShippingAddress()) {
        setCurrentStep(3)
      }
    } else if (currentStep === 3) {
      setCurrentStep(4)
    }
  }, [currentStep, validateCustomerInfo, validateShippingAddress])

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }, [currentStep])

  const createOrder = useCallback(async (paymentReference: string) => {
    try {
      const orderData = {
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: parseInt(item.price.replace(/[₦,]/g, '')),
          quantity: item.quantity,
          image: item.image
        })),
        shippingAddress,
        paymentReference,
        paymentStatus: 'paid',
        subtotal: getSubtotal(),
        shippingCost: getShipping(),
        tax: getTax(),
        total: getTotalPrice()
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        clearCart()
        router.push(`/order-confirmation?ref=${paymentReference}`)
      } else {
        throw new Error('Order creation failed')
      }
    } catch (error) {
      console.error('Order creation error:', error)
    }
  }, [customerInfo, items, shippingAddress, getSubtotal, getShipping, getTax, getTotalPrice, clearCart, router])

  const handlePayment = useCallback(async () => {
    setLoading(true)
    
    try {
      // Initialize Paystack payment
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
      
      if (!publicKey) {
        throw new Error('Payment system not configured')
      }

      // Load Paystack script
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.onload = () => {
        const handler = (window as any).PaystackPop.setup({
          key: publicKey,
          email: customerInfo.email,
          amount: getTotalPrice() * 100, // Convert to kobo
          currency: 'NGN',
          ref: `AMP-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          metadata: {
            custom_fields: [
              {
                display_name: 'Customer Name',
                variable_name: 'customer_name',
                value: `${customerInfo.firstName} ${customerInfo.lastName}`
              }
            ]
          },
          callback: function(response: any) {
            // Payment successful
            console.log('Payment successful:', response)
            
            // Create order
            createOrder(response.reference)
          },
          onClose: function() {
            setLoading(false)
            console.log('Payment cancelled')
          }
        })
        
        handler.openIframe()
      }
      
      document.head.appendChild(script)
      
    } catch (error) {
      console.error('Payment error:', error)
      setLoading(false)
    }
  }, [customerInfo, getTotalPrice, createOrder])

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-ivory pt-28 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brown-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brown/70">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  const subtotal = getSubtotal()
  const shipping = getShipping()
  const tax = getTax()
  const total = getTotalPrice()

  return (
    <div className="min-h-screen bg-ivory pt-16 pb-6 sm:pt-20 sm:pb-8 md:pt-24 md:pb-12 lg:pt-28 lg:pb-16">
      <div className="section-shell">
        {/* Back Link */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Link 
            href="/cart"
            className="inline-flex items-center gap-2 text-brown/70 hover:text-brown-dark transition-colors text-xs sm:text-sm uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="flex items-center justify-center max-w-2xl mx-auto px-4">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                    <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300 ${
                      isCompleted || isCurrent
                        ? 'bg-brown-dark border-brown-dark text-ivory'
                        : 'border-sand text-brown/50'
                    }`}>
                      {isCompleted ? (
                        <Check size={14} className="sm:w-4 sm:h-4" />
                      ) : (
                        <IconComponent size={14} className="sm:w-4 sm:h-4" />
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs mt-1 sm:mt-2 text-center font-medium text-brown-dark max-w-[60px] sm:max-w-none">
                      {step.title}
                    </p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-all duration-300 ${
                      isCompleted ? 'bg-brown-dark' : 'bg-sand'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl border border-sand/30 p-4 sm:p-6 md:p-8">
              
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <User size={20} className="sm:w-6 sm:h-6 text-brown-dark" />
                    <h2 className="font-serif text-lg sm:text-xl md:text-2xl text-brown-dark">Customer Information</h2>
                  </div>
                  
                  <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-brown-dark mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.firstName}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-brown-dark outline-none transition-colors ${
                          errors.firstName ? 'border-red-400' : 'border-sand'
                        }`}
                        placeholder="John"
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-brown-dark mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.lastName}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-brown-dark outline-none transition-colors ${
                          errors.lastName ? 'border-red-400' : 'border-sand'
                        }`}
                        placeholder="Doe"
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-brown-dark mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-brown-dark outline-none transition-colors ${
                        errors.email ? 'border-red-400' : 'border-sand'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-brown-dark mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-brown-dark outline-none transition-colors ${
                        errors.phone ? 'border-red-400' : 'border-sand'
                      }`}
                      placeholder="+234 801 234 5678"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Shipping Address */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin size={24} className="text-brown-dark" />
                    <h2 className="font-serif text-xl md:text-2xl text-brown-dark">Shipping Address</h2>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-brown-dark mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-brown-dark outline-none transition-colors ${
                        errors.street ? 'border-red-400' : 'border-sand'
                      }`}
                      placeholder="123 Main Street"
                    />
                    {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                  </div>
                  
                  <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-brown-dark mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-brown-dark outline-none transition-colors ${
                          errors.city ? 'border-red-400' : 'border-sand'
                        }`}
                        placeholder="Lagos"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-brown-dark mb-2">
                        State *
                      </label>
                      <select
                        required
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-brown-dark outline-none transition-colors ${
                          errors.state ? 'border-red-400' : 'border-sand'
                        }`}
                      >
                        <option value="">Select State</option>
                        {NIGERIAN_STATES.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-brown-dark mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-brown-dark outline-none transition-colors ${
                        errors.postalCode ? 'border-red-400' : 'border-sand'
                      }`}
                      placeholder="100001"
                    />
                    {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard size={24} className="text-brown-dark" />
                    <h2 className="font-serif text-xl md:text-2xl text-brown-dark">Payment Method</h2>
                  </div>
                  
                  <div className="bg-champagne/10 rounded-xl p-6 border border-sand/30">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-accent-emerald/10 rounded-full flex items-center justify-center">
                        <Lock size={20} className="text-accent-emerald" />
                      </div>
                      <div>
                        <h3 className="font-medium text-brown-dark">Secure Payment with Paystack</h3>
                        <p className="text-sm text-brown/70">
                          Pay safely with your debit card, credit card, or bank transfer
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review Order */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Check size={24} className="text-brown-dark" />
                    <h2 className="font-serif text-xl md:text-2xl text-brown-dark">Review Your Order</h2>
                  </div>
                  
                  {/* Customer Info Review */}
                  <div className="border border-sand/30 rounded-xl p-6">
                    <h3 className="font-medium text-brown-dark mb-4">Customer Information</h3>
                    <div className="text-brown/80 space-y-1">
                      <p className="font-medium">{customerInfo.firstName} {customerInfo.lastName}</p>
                      <p>{customerInfo.email}</p>
                      <p>{customerInfo.phone}</p>
                    </div>
                  </div>
                  
                  {/* Shipping Address Review */}
                  <div className="border border-sand/30 rounded-xl p-6">
                    <h3 className="font-medium text-brown-dark mb-4">Shipping Address</h3>
                    <div className="text-brown/80 space-y-1">
                      <p>{shippingAddress.street}</p>
                      <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                      <p>{shippingAddress.country}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={handlePreviousStep}
                    className="flex-1 border border-brown-dark text-brown-dark py-3 px-4 rounded-xl font-medium uppercase tracking-wider hover:bg-brown-dark hover:text-ivory transition-colors"
                  >
                    Back
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-brown-dark text-ivory py-3 px-4 rounded-xl font-medium uppercase tracking-wider hover:bg-brown transition-colors flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="flex-1 bg-accent-emerald text-white py-3 px-4 rounded-xl font-medium uppercase tracking-wider hover:bg-accent-emerald/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        Pay ₦{total.toLocaleString()}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl md:rounded-3xl border border-sand/30 p-6 md:p-8 sticky top-32">
              <h3 className="font-serif text-xl text-brown-dark mb-6">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-champagne/20">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-brown-dark text-sm">{item.name}</h4>
                      <p className="text-brown/70 text-xs">Qty: {item.quantity}</p>
                      <p className="text-brown-dark text-sm font-medium">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Totals */}
              <div className="space-y-3 pt-6 border-t border-sand/30">
                <div className="flex justify-between">
                  <span className="text-brown/70">Subtotal</span>
                  <span className="text-brown-dark">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brown/70">Shipping</span>
                  <span className="text-brown-dark">₦{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brown/70">Tax (VAT 7.5%)</span>
                  <span className="text-brown-dark">₦{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-sand pt-3">
                  <div className="flex justify-between font-medium text-brown-dark text-lg">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-brown/60 text-center mt-6 flex items-center justify-center gap-1">
                <Lock size={12} />
                Secured by 256-bit SSL encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}