import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface ShippingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface PaymentData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardName: string
  billingAddress: {
    sameAsShipping: boolean
    address?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
}

interface CheckoutStore {
  currentStep: number
  shippingData: ShippingData
  paymentData: PaymentData
  loading: boolean
  errors: Record<string, string>
  
  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateShipping: (data: Partial<ShippingData>) => void
  updatePayment: (data: Partial<PaymentData>) => void
  setLoading: (loading: boolean) => void
  setErrors: (errors: Record<string, string>) => void
  clearErrors: () => void
  resetCheckout: () => void
  
  // Validation
  validateShipping: () => boolean
  validatePayment: () => boolean
}

const initialShippingData: ShippingData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Nigeria'
}

const initialPaymentData: PaymentData = {
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardName: '',
  billingAddress: {
    sameAsShipping: true
  }
}

export const useCheckoutStore = create<CheckoutStore>()(
  subscribeWithSelector((set, get) => ({
    currentStep: 1,
    shippingData: initialShippingData,
    paymentData: initialPaymentData,
    loading: false,
    errors: {},

    setStep: (step) => set({ currentStep: step }),
    
    nextStep: () => set((state) => ({ 
      currentStep: Math.min(state.currentStep + 1, 3) 
    })),
    
    prevStep: () => set((state) => ({ 
      currentStep: Math.max(state.currentStep - 1, 1) 
    })),

    updateShipping: (data) => set((state) => ({
      shippingData: { ...state.shippingData, ...data }
    })),

    updatePayment: (data) => set((state) => ({
      paymentData: { ...state.paymentData, ...data }
    })),

    setLoading: (loading) => set({ loading }),
    
    setErrors: (errors) => set({ errors }),
    
    clearErrors: () => set({ errors: {} }),

    resetCheckout: () => set({
      currentStep: 1,
      shippingData: initialShippingData,
      paymentData: initialPaymentData,
      loading: false,
      errors: {}
    }),

    validateShipping: () => {
      const { shippingData } = get()
      const errors: Record<string, string> = {}
      
      if (!shippingData.firstName.trim()) errors.firstName = 'First name is required'
      if (!shippingData.lastName.trim()) errors.lastName = 'Last name is required'
      if (!shippingData.email.trim()) errors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.email)) {
        errors.email = 'Please enter a valid email'
      }
      if (!shippingData.phone.trim()) errors.phone = 'Phone number is required'
      if (!shippingData.address.trim()) errors.address = 'Address is required'
      if (!shippingData.city.trim()) errors.city = 'City is required'
      if (!shippingData.state.trim()) errors.state = 'State is required'
      if (!shippingData.postalCode.trim()) errors.postalCode = 'Postal code is required'
      
      set({ errors })
      return Object.keys(errors).length === 0
    },

    validatePayment: () => {
      const { paymentData } = get()
      const errors: Record<string, string> = {}
      
      if (!paymentData.cardNumber.trim()) errors.cardNumber = 'Card number is required'
      else if (paymentData.cardNumber.replace(/\s/g, '').length < 16) {
        errors.cardNumber = 'Card number must be 16 digits'
      }
      
      if (!paymentData.expiryDate.trim()) errors.expiryDate = 'Expiry date is required'
      else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
        errors.expiryDate = 'Please enter MM/YY format'
      }
      
      if (!paymentData.cvv.trim()) errors.cvv = 'CVV is required'
      else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
        errors.cvv = 'CVV must be 3-4 digits'
      }
      
      if (!paymentData.cardName.trim()) errors.cardName = 'Cardholder name is required'
      
      set({ errors })
      return Object.keys(errors).length === 0
    }
  }))
)

// Helper functions for form formatting
export const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = matches && matches[0] || ''
  const parts = []
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }
  if (parts.length) {
    return parts.join(' ')
  } else {
    return v
  }
}

export const formatExpiryDate = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  if (v.length >= 2) {
    return `${v.substring(0, 2)}/${v.substring(2, 4)}`
  }
  return v
}

export const formatCVV = (value: string) => {
  return value.replace(/[^0-9]/g, '').substring(0, 4)
}