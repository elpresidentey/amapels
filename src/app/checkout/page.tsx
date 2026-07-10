'use client'

import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Lock, CreditCard, Truck, AlertCircle, WifiOff } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { 
  useCheckoutStore, 
  type ShippingData
} from '@/store/checkoutStore'
import { initializePaystackPayment, nairaToKobo, generateReference, loadPaystackScript } from '@/lib/paystack'
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
      <label className="block text-sm font-medium text-black-dark mb-2">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={handleChange}
        className={`w-full px-3 py-2.5 md:px-4 md:py-3 border rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none transition-colors text-base ${
          error ? 'border-red-400' : 'border-gold'
        }`}
        placeholder={placeholder}
        maxLength={maxLength}
        style={{ fontSize: '16px' }} // Prevents zoom on iOS
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
      <label className="block text-sm font-medium text-black-dark mb-2">
        {label} {required && '*'}
      </label>
      <select
        required={required}
        value={value}
        onChange={handleChange}
        className={`w-full px-3 py-2.5 md:px-4 md:py-3 border rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none transition-colors text-base ${
          error ? 'border-red-400' : 'border-gold'
        }`}
        style={{ fontSize: '16px' }} // Prevents zoom on iOS
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
  const [isOnline, setIsOnline] = useState(true)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paystackReady, setPaystackReady] = useState(false)
  const [systemErrors, setSystemErrors] = useState<string[]>([])
  const paymentAttemptRef = useRef(0)
  
  // Store hooks with error handling
  const { items, getTotalPrice, clearCart, isLoaded } = useCartStore()
  const {
    currentStep,
    shippingData,
    loading,
    errors,
    setStep,
    nextStep,
    updateShipping,
    setLoading,
    validateShipping,
    clearErrors,
    resetCheckout
  } = useCheckoutStore()

  // Memoized calculations for performance
  const subtotal = useMemo(() => getTotalPrice(), [getTotalPrice])
  const shipping = useMemo(() => subtotal > 0 ? 2500 : 0, [subtotal])
  const tax = useMemo(() => Math.round(subtotal * 0.075), [subtotal]) // 7.5% VAT
  const total = useMemo(() => subtotal + shipping + tax, [subtotal, shipping, tax])

  // Effects with error handling
  useEffect(() => {
    setMounted(true)
    
    // Check network connectivity
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Initial connectivity check
    setIsOnline(navigator.onLine)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Validate environment and load Paystack
  useEffect(() => {
    const initializePayment = async () => {
      const errors: string[] = []
      
      // Check Paystack configuration with detailed logging
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
      console.log('Paystack Public Key Check:', {
        exists: !!publicKey,
        length: publicKey?.length,
        prefix: publicKey?.substring(0, 7),
        isTest: publicKey?.startsWith('pk_test_'),
        isLive: publicKey?.startsWith('pk_live_')
      })
      
      if (!publicKey) {
        errors.push('Payment system configuration error: Missing public key')
      } else if (!publicKey.startsWith('pk_test_') && !publicKey.startsWith('pk_live_')) {
        errors.push('Payment system configuration error: Invalid key format')
      }
      
      try {
        const scriptLoaded = await loadPaystackScript()
        if (!scriptLoaded) {
          errors.push('Payment gateway could not be loaded. Please check your connection and try again.')
        } else {
          setPaystackReady(true)
          console.log('Paystack script loaded successfully')
        }
      } catch (error) {
        console.error('Paystack script loading error:', error)
        errors.push('Failed to initialize payment system')
      }
      
      setSystemErrors(errors)
      
      if (errors.length > 0) {
        console.error('Payment initialization errors:', errors)
      }
    }
    
    if (mounted) {
      initializePayment()
    }
  }, [mounted])

  // Redirect if cart is empty (only after hydration)
  useEffect(() => {
    if (mounted && isLoaded && items.length === 0) {
      router.push('/cart')
    }
  }, [mounted, isLoaded, items.length, router])

  // Enhanced form handlers with retry logic
  const handleShippingSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()
    
    try {
      if (validateShipping()) {
        nextStep()
      }
    } catch (error) {
      console.error('Shipping validation error:', error)
      setToastMessage('Form validation failed. Please check your information.')
      setToastType('error')
      setShowToast(true)
    }
  }, [validateShipping, nextStep, clearErrors])

  // Enhanced payment handler with comprehensive error handling
  const handlePaystackPayment = useCallback(async () => {
    // Prevent double submission
    if (paymentProcessing || loading) {
      return
    }

    // Check network connectivity
    if (!isOnline) {
      setToastMessage('❌ No internet connection. Please check your network and try again.')
      setToastType('error')
      setShowToast(true)
      return
    }

    // Check system readiness
    if (systemErrors.length > 0) {
      setToastMessage(`❌ System Error: ${systemErrors[0]}`)
      setToastType('error')
      setShowToast(true)
      return
    }

    if (!paystackReady) {
      setToastMessage('❌ Payment system is not ready. Please refresh and try again.')
      setToastType('error')
      setShowToast(true)
      return
    }

    paymentAttemptRef.current += 1
    setPaymentProcessing(true)
    setLoading(true)
    
    try {
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
      
      console.log('Payment Handler - Key Check:', {
        exists: !!publicKey,
        length: publicKey?.length,
        prefix: publicKey?.substring(0, 10),
        isTest: publicKey?.startsWith('pk_test_'),
        fullKey: publicKey // Remove this in production
      })
      
      if (!publicKey) {
        throw new Error('Payment configuration error: Missing public key')
      }
      
      if (!publicKey.startsWith('pk_test_') && !publicKey.startsWith('pk_live_')) {
        throw new Error('Payment configuration error: Invalid key format')
      }

      // Validate required data before proceeding
      if (!shippingData.email || !shippingData.firstName || !shippingData.lastName) {
        throw new Error('Missing customer information')
      }

      if (items.length === 0 || total <= 0) {
        throw new Error('Invalid order amount')
      }

      const reference = generateReference()
      
      setToastMessage('🔄 Initializing secure payment...')
      setToastType('success')
      setShowToast(true)

      await initializePaystackPayment({
        publicKey,
        email: shippingData.email.trim(),
        amount: nairaToKobo(total),
        currency: 'NGN',
        ref: reference,
        metadata: {
          customerName: `${shippingData.firstName.trim()} ${shippingData.lastName.trim()}`,
          customerPhone: shippingData.phone.trim(),
          shippingAddress: {
            street: shippingData.address.trim(),
            city: shippingData.city.trim(),
            state: shippingData.state.trim(),
            postalCode: shippingData.postalCode.trim(),
            country: shippingData.country.trim()
          },
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: parseInt(item.price.replace(/[₦,]/g, ''))
          })),
          attemptNumber: paymentAttemptRef.current
        },
        onSuccess: async (response) => {
          console.log('Payment successful:', response)
          
          setToastMessage('🎉 Payment successful! Creating your order...')
          setToastType('success')
          setShowToast(true)
          
          try {
            // Verify payment with retry logic
            let verifySuccess = false
            let verifyAttempts = 0
            const maxVerifyAttempts = 3
            
            while (!verifySuccess && verifyAttempts < maxVerifyAttempts) {
              verifyAttempts++
              
              try {
                const verifyController = new AbortController()
                const verifyTimeout = setTimeout(() => verifyController.abort(), 15000)
                
                const verifyResponse = await fetch('/api/verify-payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ reference: response.reference }),
                  signal: verifyController.signal
                })
                
                clearTimeout(verifyTimeout)
                
                if (!verifyResponse.ok) {
                  throw new Error(`Verification failed: ${verifyResponse.status}`)
                }
                
                const verifyData = await verifyResponse.json()
                
                if (verifyData.success) {
                  verifySuccess = true
                  
                  // Create order with retry logic
                  let orderSuccess = false
                  let orderAttempts = 0
                  const maxOrderAttempts = 3
                  
                  while (!orderSuccess && orderAttempts < maxOrderAttempts) {
                    orderAttempts++
                    
                    try {
                      const orderController = new AbortController()
                      const orderTimeout = setTimeout(() => orderController.abort(), 20000)
                      
                      const orderResponse = await fetch('/api/orders', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          customerName: `${shippingData.firstName.trim()} ${shippingData.lastName.trim()}`,
                          customerEmail: shippingData.email.trim(),
                          customerPhone: shippingData.phone.trim(),
                          items: items.map(item => ({
                            productId: item.id,
                            name: item.name,
                            price: parseInt(item.price.replace(/[₦,]/g, '')),
                            quantity: item.quantity,
                            image: item.image
                          })),
                          shippingAddress: {
                            street: shippingData.address.trim(),
                            city: shippingData.city.trim(),
                            state: shippingData.state.trim(),
                            postalCode: shippingData.postalCode.trim(),
                            country: shippingData.country.trim()
                          },
                          paymentReference: response.reference,
                          paymentStatus: 'paid',
                          subtotal,
                          shippingCost: shipping,
                          total,
                          metadata: {
                            paymentAttempt: paymentAttemptRef.current,
                            verifyAttempts,
                            orderAttempts
                          }
                        }),
                        signal: orderController.signal
                      })
                      
                      clearTimeout(orderTimeout)
                      
                      if (orderResponse.ok) {
                        orderSuccess = true
                        const orderResult = await orderResponse.json()
                        const orderNumber = orderResult?.order?.orderNumber || response.reference
                        const trackingNumber = `TRK-${orderNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-${Date.now().toString().slice(-6)}`
                        const amount = new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                          maximumFractionDigits: 0
                        }).format(total)
                        const confirmationParams = new URLSearchParams({
                          ref: orderNumber,
                          tracking: trackingNumber,
                          payment_ref: response.reference,
                          amount,
                          email: shippingData.email.trim()
                        })
                        
                        setToastMessage('✨ Order placed successfully! Redirecting...')
                        setToastType('success')
                        setShowToast(true)
                        
                        setTimeout(() => {
                          clearCart()
                          resetCheckout()
                          router.push(`/order-confirmation?${confirmationParams.toString()}`)
                        }, 2000)
                      } else {
                        throw new Error(`Order creation failed: ${orderResponse.status}`)
                      }
                    } catch (orderError) {
                      console.error(`Order attempt ${orderAttempts} failed:`, orderError)
                      if (orderAttempts >= maxOrderAttempts) {
                        throw new Error('Order creation failed after multiple attempts')
                      }
                      // Wait before retry
                      await new Promise(resolve => setTimeout(resolve, 1000 * orderAttempts))
                    }
                  }
                } else {
                  throw new Error(verifyData.message || 'Payment verification failed')
                }
              } catch (verifyError) {
                console.error(`Verify attempt ${verifyAttempts} failed:`, verifyError)
                if (verifyAttempts >= maxVerifyAttempts) {
                  throw new Error('Payment verification failed after multiple attempts')
                }
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 2000 * verifyAttempts))
              }
            }
          } catch (error) {
            console.error('Post-payment processing failed:', error)
            
            // More detailed error logging for debugging
            let errorDetails = 'Unknown error'
            if (error instanceof Error) {
              errorDetails = error.message
              console.error('Error stack:', error.stack)
            }
            
            // Check if it's a network error
            if (error && typeof error === 'object' && 'response' in error) {
              const axiosError = error as any
              console.error('Axios error details:', {
                status: axiosError.response?.status,
                statusText: axiosError.response?.statusText,
                data: axiosError.response?.data,
                config: axiosError.config
              })
              errorDetails = `HTTP ${axiosError.response?.status}: ${axiosError.response?.data?.error || axiosError.response?.statusText || 'Unknown server error'}`
            }
            
            setToastMessage(`❌ Payment successful but order processing failed. Reference: ${response.reference}. Error: ${errorDetails}. Please contact support.`)
            setToastType('error')
            setShowToast(true)
          } finally {
            setLoading(false)
            setPaymentProcessing(false)
          }
        },
        onClose: () => {
          setLoading(false)
          setPaymentProcessing(false)
          setToastMessage('Payment was cancelled')
          setToastType('error')
          setShowToast(true)
          console.log('Payment cancelled')
        }
      })
    } catch (error) {
      console.error('Payment initialization failed:', error)
      let errorMessage = '❌ Payment failed. '
      
      if (error instanceof Error) {
        if (error.message.includes('configuration')) {
          errorMessage += 'System configuration error. Please try again later.'
        } else if (error.message.includes('network')) {
          errorMessage += 'Network error. Please check your connection.'
        } else if (error.message.includes('customer information')) {
          errorMessage += 'Please complete all required fields.'
        } else if (error.message.includes('amount')) {
          errorMessage += 'Invalid order amount. Please refresh and try again.'
        } else {
          errorMessage += 'Please try again or contact support.'
        }
      } else {
        errorMessage += 'Please try again or contact support.'
      }
      
      setToastMessage(errorMessage)
      setToastType('error')
      setShowToast(true)
      setLoading(false)
      setPaymentProcessing(false)
    }
  }, [shippingData, items, subtotal, shipping, total, setLoading, clearCart, resetCheckout, router, isOnline, systemErrors, paystackReady, paymentProcessing, loading])

  // Optimized input change handlers using proper typing
  const handleShippingChange = useCallback((field: keyof ShippingData) => 
    (value: string) => updateShipping({ [field]: value }), [updateShipping])

  // Step navigation handlers
  const goToPayment = useCallback(() => setStep(2), [setStep])
  const goToShipping = useCallback(() => setStep(1), [setStep])

  // Enhanced loading state with error handling
  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black/70">Loading checkout...</p>
          {!isOnline && (
            <div className="flex items-center justify-center gap-2 mt-4 text-red-600">
              <WifiOff size={16} />
              <span className="text-sm">No internet connection</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Redirect if no items (after loading)
  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16">
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={5000}
      />
      
      {/* System Status Bar */}
      {(!isOnline || systemErrors.length > 0) && (
        <div className="fixed top-16 sm:top-20 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 text-sm safe-top">
          <div className="section-shell flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            {!isOnline ? (
              <span className="text-center">No internet connection. Please check your network.</span>
            ) : (
              <span className="text-center">{systemErrors[0]}</span>
            )}
          </div>
        </div>
      )}
      
      <div className="section-shell">
        <div className="mb-6 md:mb-8">
          <Link 
            href="/cart"
            className="inline-flex items-center gap-2 text-black/70 hover:text-black-dark transition-colors text-sm uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Return to Cart</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 md:mb-12">
          {/* Mobile Progress - Vertical Stack */}
          <div className="block md:hidden">
            <div className="bg-white rounded-2xl border border-gold/30 p-4 mb-6">
              <div className="text-center mb-4">
                <div className="text-lg font-medium text-black-dark">
                  Step {currentStep} of {CHECKOUT_STEPS.length}
                </div>
                <div className="text-sm text-black/70 mt-1">
                  {CHECKOUT_STEPS[currentStep - 1]?.title}
                </div>
              </div>
              <div className="w-full bg-gray-100/30 rounded-full h-2">
                <div 
                  className="bg-black h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / CHECKOUT_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Desktop Progress - Horizontal */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {CHECKOUT_STEPS.map((step, index) => {
                const IconComponent = step.icon
                const isCompleted = currentStep > step.id
                const isCurrent = currentStep === step.id
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      isCompleted || isCurrent
                        ? 'bg-black border-black text-white'
                        : 'border-gold text-black/50'
                    }`}>
                      {isCompleted ? (
                        <Check size={20} />
                      ) : (
                        <IconComponent size={20} />
                      )}
                    </div>
                    
                    {index < CHECKOUT_STEPS.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                        isCompleted ? 'bg-black' : 'bg-gray-100'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
            
            <div className="text-center mt-4">
              <p className="text-sm font-medium text-black-dark">
                {CHECKOUT_STEPS[currentStep - 1]?.title}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:gap-12 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl md:rounded-3xl border border-gold/30 p-4 md:p-8"
              >
                <h2 className="font-serif text-xl md:text-2xl text-black-dark mb-6 md:mb-8">Delivery Information</h2>
                
                <form onSubmit={handleShippingSubmit} className="space-y-4 md:space-y-6">
                  <div className="grid gap-4 md:gap-6 md:grid-cols-2">
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
                  
                  <div className="grid gap-4 md:gap-6 md:grid-cols-2">
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
                  
                  <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
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
                    className="w-full bg-black text-white py-3 md:py-4 px-4 text-sm font-medium uppercase tracking-wider hover:bg-gold transition-colors rounded-xl flex items-center justify-center gap-2"
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
                className="bg-white rounded-2xl md:rounded-3xl border border-gold/30 p-4 md:p-8"
              >
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <Lock size={18} className="md:w-5 md:h-5 text-accent-emerald" />
                  <h2 className="font-serif text-xl md:text-2xl text-black-dark">Secure Payment</h2>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                  {/* Paystack Info */}
                  <div className="bg-primary-light/10 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gold/30">
                    <div className="flex items-start gap-3 md:gap-4 mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-accent-emerald/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Lock size={16} className="md:w-5 md:h-5 text-accent-emerald" />
                      </div>
                      <div>
                        <h3 className="font-medium text-black-dark mb-2 text-sm md:text-base">Secure Payment with Paystack</h3>
                        <p className="text-xs md:text-sm text-black/70 leading-relaxed">
                          Your payment information is processed securely through Paystack, Nigeria's leading payment gateway. 
                          We never store your card details.
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid gap-2 md:gap-3 mt-4">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-black/70">
                        <Check size={14} className="md:w-4 md:h-4 text-accent-emerald" />
                        <span>Bank-grade SSL encryption</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-black/70">
                        <Check size={14} className="md:w-4 md:h-4 text-accent-emerald" />
                        <span>PCI DSS compliant</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-black/70">
                        <Check size={14} className="md:w-4 md:h-4 text-accent-emerald" />
                        <span>Supports all Nigerian banks & cards</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-white rounded-xl md:rounded-2xl border border-gold/30 p-4 md:p-6">
                    <h3 className="font-medium text-black-dark mb-4 text-sm md:text-base">Payment Summary</h3>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex justify-between text-black/70 text-sm md:text-base">
                        <span>Subtotal</span>
                        <span>₦{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-black/70 text-sm md:text-base">
                        <span>Delivery</span>
                        <span>₦{shipping.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-black/70 text-sm md:text-base">
                        <span>Tax (VAT 7.5%)</span>
                        <span>₦{tax.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-gold pt-3">
                        <div className="flex justify-between font-medium text-black-dark text-base md:text-lg">
                          <span>Total Amount</span>
                          <span>₦{total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <button
                      type="button"
                      onClick={goToShipping}
                      className="flex-1 border border-black text-black-dark py-3 md:py-4 px-4 text-sm font-medium uppercase tracking-wider hover:bg-gold hover:text-white transition-colors rounded-xl"
                    >
                      Back
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => nextStep()}
                      className="flex-1 bg-black text-white py-3 md:py-4 px-4 text-sm font-medium uppercase tracking-wider hover:bg-gold transition-colors rounded-xl flex items-center justify-center gap-2"
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
                className="bg-white rounded-2xl md:rounded-3xl border border-gold/30 p-4 md:p-8"
              >
                <h2 className="font-serif text-xl md:text-2xl text-black-dark mb-6 md:mb-8">Confirm Your Order</h2>
                
                <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                  <div className="border border-gold/30 rounded-xl p-4 md:p-6">
                    <h3 className="font-medium text-black-dark mb-3 md:mb-4 text-sm md:text-base">Delivery Address</h3>
                    <div className="text-black/80 text-sm md:text-base leading-relaxed">
                      <div className="font-medium">{shippingData.firstName} {shippingData.lastName}</div>
                      <div>{shippingData.address}</div>
                      <div>{shippingData.city}, {shippingData.state} {shippingData.postalCode}</div>
                      <div>{shippingData.country}</div>
                      <div className="text-xs md:text-sm mt-1">{shippingData.phone}</div>
                    </div>
                  </div>
                  
                  <div className="border border-gold/30 rounded-xl p-4 md:p-6">
                    <h3 className="font-medium text-black-dark mb-3 md:mb-4 text-sm md:text-base">Payment Method</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-accent-emerald/10 rounded-full flex items-center justify-center">
                        <CreditCard size={16} className="md:w-5 md:h-5 text-accent-emerald" />
                      </div>
                      <div>
                        <p className="font-medium text-black-dark text-sm md:text-base">Paystack</p>
                        <p className="text-xs md:text-sm text-black/70">Secure payment gateway</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <button
                    type="button"
                    onClick={goToPayment}
                    className="flex-1 border border-black text-black-dark py-3 md:py-4 px-4 text-sm font-medium uppercase tracking-wider hover:bg-gold hover:text-white transition-colors rounded-xl"
                  >
                    Back
                  </button>
                  
                  <button
                    onClick={handlePaystackPayment}
                    disabled={loading || paymentProcessing || !isOnline || systemErrors.length > 0 || !paystackReady}
                    className="flex-1 bg-accent-emerald text-white py-3 md:py-4 px-4 text-sm font-medium uppercase tracking-wider hover:bg-accent-emerald/90 transition-colors rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading || paymentProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Processing...</span>
                        <span className="sm:hidden">Processing</span>
                      </>
                    ) : !isOnline ? (
                      <>
                        <WifiOff size={16} />
                        <span className="hidden sm:inline">No Connection</span>
                        <span className="sm:hidden">Offline</span>
                      </>
                    ) : systemErrors.length > 0 ? (
                      <>
                        <AlertCircle size={16} />
                        <span className="hidden sm:inline">System Error</span>
                        <span className="sm:hidden">Error</span>
                      </>
                    ) : !paystackReady ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Loading Payment...</span>
                        <span className="sm:hidden">Loading</span>
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        <span className="hidden sm:inline">Pay ₦{total.toLocaleString()}</span>
                        <span className="sm:hidden">Pay ₦{total.toLocaleString()}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar - Memoized for performance */}
          <div className="lg:col-span-1">
            {/* Mobile Order Summary - Collapsible */}
            <div className="lg:hidden mb-6">
              <div className="bg-white rounded-2xl border border-gold/30 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-serif text-lg text-black-dark">Order Summary</h3>
                  <div className="text-lg font-medium text-black-dark">
                    ₦{total.toLocaleString()}
                  </div>
                </div>
                <details className="group">
                  <summary className="cursor-pointer text-black/70 text-sm flex items-center justify-between">
                    <span>View details</span>
                    <span className="group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-gold/30">
                    <div className="space-y-3 mb-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-primary-light/20 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-black-dark text-sm truncate">{item.name}</h4>
                            <p className="text-black/70 text-xs">Qty: {item.quantity}</p>
                            <p className="text-black-dark text-sm font-medium">{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2 pt-3 border-t border-gold/30">
                      <div className="flex justify-between text-black/70 text-sm">
                        <span>Subtotal</span>
                        <span>₦{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-black/70 text-sm">
                        <span>Shipping</span>
                        <span>₦{shipping.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-black/70 text-sm">
                        <span>Tax (VAT 7.5%)</span>
                        <span>₦{tax.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </div>

            {/* Desktop Order Summary - Always visible */}
            <div className="hidden lg:block bg-white rounded-3xl border border-gold/30 p-8 sticky top-32">
              <h3 className="font-serif text-xl text-black-dark mb-6">Your Selection</h3>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-primary-light/20">
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
                      <h4 className="font-medium text-black-dark text-sm">{item.name}</h4>
                      <p className="text-black/70 text-xs">Qty: {item.quantity}</p>
                      <p className="text-black-dark text-sm font-medium">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6 pt-6 border-t border-gold/30">
                <div className="flex justify-between text-black/70">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-black/70">
                  <span>Shipping</span>
                  <span>₦{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-black/70">
                  <span>Tax (VAT 7.5%)</span>
                  <span>₦{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gold pt-3">
                  <div className="flex justify-between font-medium text-black-dark text-lg">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-black/60 text-center">
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
