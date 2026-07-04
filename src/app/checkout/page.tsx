'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Lock, CreditCard, Truck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { 
  useCheckoutStore, 
  type ShippingData,
  type PaymentData 
} from '@/store/checkoutStore'
import { initializePaystackPayment, nairaToKobo, generateReference } from '@/lib/paystack'
import Toast from '@/components/Toast'

// Memoized step configuration
const CHECKOUT_STEPS = [
  { id: 1, title: 'Delivery Information', icon: Truck },
  { id: 2, title: 'Payment Details', icon: CreditCard },
  { id: 3, title: 'Review Your Order', icon: Check }
] as const

// Nigerian states for dropdown
const NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Kano', 'Rivers', 'Ogun', 'Kaduna', 'Oyo', 
  'Delta', 'Edo', 'Anambra', 'Imo', 'Enugu', 'Abia', 'Akwa Ibom'
] as const

// Memoized input field component for better performance
const OptimizedInput = memo<{
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
  maxLength?: number
  error?: string
}>((props) => {
  const { label, type = 'text', value, onChange, required, placeholder, maxLength, error } = props
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }, [onChange])

  return (
    <div>
      <label className="block text-sm font-medium text-brown-dark mb-2">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={handleChange}
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-brown-dark outline-none transition-colors ${
          error ? 'border-red-400' : 'border-sand'
        }`}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
})
OptimizedInput.displayName = 'OptimizedInput'

// Memoized select field component
const OptimizedSelect = memo<{
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  options: readonly string[]
  placeholder?: string
  error?: string
}>((props) => {
  const { label, value, onChange, required, options, placeholder, error } = props
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }, [onChange])

  return (
    <div>
      <label className="block text-sm font-medium text-brown-dark mb-2">
        {label} {required && '*'}
      </label>
      <select
        required={required}
        value={value}
        onChange={handleChange}
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-brown-dark outline-none transition-colors ${
          error ? 'border-red-400' : 'border-sand'
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
})
OptimizedSelect.displayName = 'OptimizedSelect'

export default function CheckoutPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  
  // Store hooks
  const { items, getTotalPrice, clearCart, isLoaded } = useCartStore()
  const {
    currentStep,
    shippingData,
    paymentData,
    loading,
    errors,
    setStep,
    nextStep,
    prevStep,
    updateShipping,
    updatePayment,
    setLoading,
    validateShipping,
    validatePayment,
    clearErrors,
    resetCheckout
  } = useCheckoutStore()

  // Memoized calculations for performance
  const subtotal = useMemo(() => getTotalPrice(), [getTotalPrice])
  const shipping = useMemo(() => subtotal > 0 ? 2500 : 0, [subtotal])
  const tax = useMemo(() => Math.round(subtotal * 0.075), [subtotal]) // 7.5% VAT
  const total = useMemo(() => subtotal + shipping + tax, [subtotal, shipping, tax])

  // Effects
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if cart is empty (only after hydration)
  useEffect(() => {
    if (mounted && isLoaded && items.length === 0) {
      router.push('/cart')
    }
  }, [mounted, isLoaded, items.length, router])

  // Form handlers
  const handleShippingSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()
    
    if (validateShipping()) {
      nextStep()
    }
  }, [validateShipping, nextStep, clearErrors])

  const handlePaymentSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()
    
    // Skip card validation, go directly to review
    nextStep()
  }, [nextStep, clearErrors])

  const handlePaystackPayment = useCallback(async () => {
    setLoading(true)
    
    try {
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
      
      if (!publicKey) {
        throw new Error('Paystack configuration error')
      }

      const reference = generateReference()
      
      await initializePaystackPayment({
        publicKey,
        email: shippingData.email,
        amount: nairaToKobo(total),
        currency: 'NGN',
        ref: reference,
        metadata: {
          customerName: `${shippingData.firstName} ${shippingData.lastName}`,
          customerPhone: shippingData.phone,
          shippingAddress: {
            street: shippingData.address,
            city: shippingData.city,
            state: shippingData.state,
            postalCode: shippingData.postalCode,
            country: shippingData.country
          },
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: parseInt(item.price.replace(/[₦,]/g, ''))
          }))
        },
        onSuccess: async (response) => {
          console.log('Payment successful:', response)
          
          // Show success message immediately
          setToastMessage('🎉 Payment successful! Creating your order...')
          setToastType('success')
          setShowToast(true)
          
          // Verify payment on backend
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reference: response.reference })
            })
            
            const verifyData = await verifyResponse.json()
            
            if (verifyData.success) {
              // Create order in database
              await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  customerName: `${shippingData.firstName} ${shippingData.lastName}`,
                  customerEmail: shippingData.email,
                  customerPhone: shippingData.phone,
                  items: items.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: parseInt(item.price.replace(/[₦,]/g, '')),
                    quantity: item.quantity,
                    image: item.image
                  })),
                  shippingAddress: {
                    street: shippingData.address,
                    city: shippingData.city,
                    state: shippingData.state,
                    postalCode: shippingData.postalCode,
                    country: shippingData.country
                  },
                  paymentReference: response.reference,
                  paymentStatus: 'paid',
                  subtotal,
                  shippingCost: shipping,
                  total
                })
              })
              
              // Show final success message
              setToastMessage('✨ Order placed successfully! Redirecting...')
              setToastType('success')
              setShowToast(true)
              
              // Wait a moment for user to see the success message
              setTimeout(() => {
                clearCart()
                resetCheckout()
                router.push('/order-confirmation')
              }, 1500)
            } else {
              setToastMessage('❌ Payment verification failed. Please contact support.')
              setToastType('error')
              setShowToast(true)
            }
          } catch (error) {
            console.error('Order creation failed:', error)
            setToastMessage('❌ Order processing failed. Please contact support with your payment reference.')
            setToastType('error')
            setShowToast(true)
          } finally {
            setLoading(false)
          }
        },
        onClose: () => {
          setLoading(false)
          setToastMessage('Payment was cancelled')
          setToastType('error')
          setShowToast(true)
          console.log('Payment cancelled')
        }
      })
    } catch (error) {
      console.error('Payment initialization failed:', error)
      setToastMessage('❌ Failed to initialize payment. Please try again.')
      setToastType('error')
      setShowToast(true)
      setLoading(false)
    }
  }, [shippingData, items, subtotal, shipping, total, setLoading, clearCart, resetCheckout, router])

  // Optimized input change handlers using proper typing
  const handleShippingChange = useCallback((field: keyof ShippingData) => 
    (value: string) => updateShipping({ [field]: value }), [updateShipping])

  // Step navigation handlers
  const goToPayment = useCallback(() => setStep(2), [setStep])
  const goToShipping = useCallback(() => setStep(1), [setStep])
  const goToReview = useCallback(() => setStep(3), [setStep])

  // Don't render until mounted and cart is loaded
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

  // Redirect if no items (after loading)
  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-ivory pt-28 pb-16">
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={5000}
      />
      
      <div className="section-shell">
        <div className="mb-8">
          <Link 
            href="/cart"
            className="inline-flex items-center gap-2 text-brown/70 hover:text-brown-dark transition-colors text-sm uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            Return to Cart
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {CHECKOUT_STEPS.map((step, index) => {
              const IconComponent = step.icon
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    isCompleted || isCurrent
                      ? 'bg-brown-dark border-brown-dark text-ivory'
                      : 'border-sand text-brown/50'
                  }`}>
                    {isCompleted ? (
                      <Check size={20} />
                    ) : (
                      <IconComponent size={20} />
                    )}
                  </div>
                  
                  {index < CHECKOUT_STEPS.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                      isCompleted ? 'bg-brown-dark' : 'bg-sand'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm font-medium text-brown-dark">
              {CHECKOUT_STEPS[currentStep - 1]?.title}
            </p>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl border border-sand/30 p-8"
              >
                <h2 className="font-serif text-2xl text-brown-dark mb-8">Delivery Information</h2>
                
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <OptimizedInput
                      label="First Name"
                      value={shippingData.firstName}
                      onChange={handleShippingChange('firstName')}
                      required
                      error={errors.firstName}
                    />
                    
                    <OptimizedInput
                      label="Last Name"
                      value={shippingData.lastName}
                      onChange={handleShippingChange('lastName')}
                      required
                      error={errors.lastName}
                    />
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <OptimizedInput
                      label="Email Address"
                      type="email"
                      value={shippingData.email}
                      onChange={handleShippingChange('email')}
                      required
                      error={errors.email}
                    />
                    
                    <OptimizedInput
                      label="Phone Number"
                      type="tel"
                      value={shippingData.phone}
                      onChange={handleShippingChange('phone')}
                      required
                      placeholder="+234 801 234 5678"
                      error={errors.phone}
                    />
                  </div>
                  
                  <OptimizedInput
                    label="Street Address"
                    value={shippingData.address}
                    onChange={handleShippingChange('address')}
                    required
                    placeholder="123 Main Street, Apartment, suite, etc."
                    error={errors.address}
                  />
                  
                  <div className="grid gap-6 md:grid-cols-3">
                    <OptimizedInput
                      label="City"
                      value={shippingData.city}
                      onChange={handleShippingChange('city')}
                      required
                      placeholder="Lagos"
                      error={errors.city}
                    />
                    
                    <OptimizedSelect
                      label="State"
                      value={shippingData.state}
                      onChange={handleShippingChange('state')}
                      required
                      options={NIGERIAN_STATES}
                      placeholder="Select State"
                      error={errors.state}
                    />
                    
                    <OptimizedInput
                      label="Postal Code"
                      value={shippingData.postalCode}
                      onChange={handleShippingChange('postalCode')}
                      required
                      placeholder="100001"
                      error={errors.postalCode}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-brown-dark text-ivory py-4 text-sm font-medium uppercase tracking-wider hover:bg-brown transition-colors rounded-xl flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <ArrowRight size={16} />
                  </button>
                </form>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl border border-sand/30 p-8"
              >
                <div className="flex items-center gap-3 mb-8">
                  <Lock size={20} className="text-accent-emerald" />
                  <h2 className="font-serif text-2xl text-brown-dark">Secure Payment</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Paystack Info */}
                  <div className="bg-champagne/10 rounded-2xl p-6 border border-sand/30">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-accent-emerald/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Lock size={20} className="text-accent-emerald" />
                      </div>
                      <div>
                        <h3 className="font-medium text-brown-dark mb-2">Secure Payment with Paystack</h3>
                        <p className="text-sm text-brown/70 leading-relaxed">
                          Your payment information is processed securely through Paystack, Nigeria's leading payment gateway. 
                          We never store your card details.
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid gap-3 mt-4">
                      <div className="flex items-center gap-2 text-sm text-brown/70">
                        <Check size={16} className="text-accent-emerald" />
                        <span>Bank-grade SSL encryption</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-brown/70">
                        <Check size={16} className="text-accent-emerald" />
                        <span>PCI DSS compliant</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-brown/70">
                        <Check size={16} className="text-accent-emerald" />
                        <span>Supports all Nigerian banks & cards</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-white rounded-2xl border border-sand/30 p-6">
                    <h3 className="font-medium text-brown-dark mb-4">Payment Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-brown/70">
                        <span>Subtotal</span>
                        <span>₦{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-brown/70">
                        <span>Delivery</span>
                        <span>₦{shipping.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-brown/70">
                        <span>Tax (VAT 7.5%)</span>
                        <span>₦{tax.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-sand pt-3">
                        <div className="flex justify-between font-medium text-brown-dark text-lg">
                          <span>Total Amount</span>
                          <span>₦{total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={goToShipping}
                      className="flex-1 border border-brown-dark text-brown-dark py-4 text-sm font-medium uppercase tracking-wider hover:bg-brown-dark hover:text-ivory transition-colors rounded-xl"
                    >
                      Back
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => nextStep()}
                      className="flex-1 bg-brown-dark text-ivory py-4 text-sm font-medium uppercase tracking-wider hover:bg-brown transition-colors rounded-xl flex items-center justify-center gap-2"
                    >
                      Review Order
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl border border-sand/30 p-8"
              >
                <h2 className="font-serif text-2xl text-brown-dark mb-8">Confirm Your Order</h2>
                
                <div className="space-y-6 mb-8">
                  <div className="border border-sand/30 rounded-xl p-6">
                    <h3 className="font-medium text-brown-dark mb-4">Delivery Address</h3>
                    <p className="text-brown/80">
                      {shippingData.firstName} {shippingData.lastName}<br />
                      {shippingData.address}<br />
                      {shippingData.city}, {shippingData.state} {shippingData.postalCode}<br />
                      {shippingData.country}<br />
                      <span className="text-sm">{shippingData.phone}</span>
                    </p>
                  </div>
                  
                  <div className="border border-sand/30 rounded-xl p-6">
                    <h3 className="font-medium text-brown-dark mb-4">Payment Method</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent-emerald/10 rounded-full flex items-center justify-center">
                        <CreditCard size={20} className="text-accent-emerald" />
                      </div>
                      <div>
                        <p className="font-medium text-brown-dark">Paystack</p>
                        <p className="text-sm text-brown/70">Secure payment gateway</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={goToPayment}
                    className="flex-1 border border-brown-dark text-brown-dark py-4 text-sm font-medium uppercase tracking-wider hover:bg-brown-dark hover:text-ivory transition-colors rounded-xl"
                  >
                    Back
                  </button>
                  
                  <button
                    onClick={handlePaystackPayment}
                    disabled={loading}
                    className="flex-1 bg-accent-emerald text-white py-4 text-sm font-medium uppercase tracking-wider hover:bg-accent-emerald/90 transition-colors rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : (
                      <>
                        <Lock size={16} />
                        Pay ₦{total.toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar - Memoized for performance */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-sand/30 p-8 sticky top-32">
              <h3 className="font-serif text-xl text-brown-dark mb-6">Your Selection</h3>
              
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
                        loading="lazy"
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
              
              <div className="space-y-3 mb-6 pt-6 border-t border-sand/30">
                <div className="flex justify-between text-brown/70">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-brown/70">
                  <span>Shipping</span>
                  <span>₦{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-brown/70">
                  <span>Tax (VAT 7.5%)</span>
                  <span>₦{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-sand pt-3">
                  <div className="flex justify-between font-medium text-brown-dark text-lg">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-brown/60 text-center">
                <Lock size={12} className="inline mr-1" />
                Protected by secure SSL encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}