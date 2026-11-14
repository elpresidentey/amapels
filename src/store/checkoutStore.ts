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

interface CheckoutStore {
  currentStep: number
  shippingData: ShippingData
  loading: boolean
  errors: Record<string, string>

  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateShipping: (data: Partial<ShippingData>) => void
  setLoading: (loading: boolean) => void
  setErrors: (errors: Record<string, string>) => void
  clearErrors: () => void
  resetCheckout: () => void

  // Validation
  validateShipping: () => boolean
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

export const useCheckoutStore = create<CheckoutStore>()(
  subscribeWithSelector((set, get) => ({
    currentStep: 1,
    shippingData: initialShippingData,
    loading: false,
    errors: {},

    setStep: (step) => set({ currentStep: step }),

    nextStep: () => set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 2)
    })),

    prevStep: () => set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1)
    })),

    updateShipping: (data) => set((state) => ({
      shippingData: { ...state.shippingData, ...data }
    })),

    setLoading: (loading) => set({ loading }),

    setErrors: (errors) => set({ errors }),

    clearErrors: () => set({ errors: {} }),

    resetCheckout: () => set({
      currentStep: 1,
      shippingData: initialShippingData,
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
      // Postal code is optional — many Nigerian addresses don't have one handy.

      set({ errors })
      return Object.keys(errors).length === 0
    }
  }))
)
