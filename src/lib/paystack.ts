// Paystack integration utility

export interface PaystackConfig {
  publicKey: string
  email: string
  amount: number // in kobo (smallest currency unit)
  currency?: string
  ref?: string
  metadata?: Record<string, any>
  onSuccess?: (response: any) => void
  onClose?: () => void
}

// Load Paystack inline script
export const loadPaystackScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }

    // Check if already loaded
    if ((window as any).PaystackPop) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// Initialize Paystack payment
export const initializePaystackPayment = async (config: PaystackConfig) => {
  const scriptLoaded = await loadPaystackScript()
  
  if (!scriptLoaded) {
    throw new Error('Failed to load Paystack script')
  }

  const PaystackPop = (window as any).PaystackPop
  
  if (!PaystackPop) {
    throw new Error('Paystack is not available')
  }

  const handler = PaystackPop.setup({
    key: config.publicKey,
    email: config.email,
    amount: config.amount,
    currency: config.currency || 'NGN',
    ref: config.ref || generateReference(),
    metadata: config.metadata,
    callback: (response: any) => {
      if (config.onSuccess) {
        config.onSuccess(response)
      }
    },
    onClose: () => {
      if (config.onClose) {
        config.onClose()
      }
    }
  })

  handler.openIframe()
}

// Generate unique transaction reference
export const generateReference = (): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `AMP-${timestamp}-${random}`.toUpperCase()
}

// Convert Naira to Kobo (Paystack requires amount in kobo)
export const nairaToKobo = (naira: number): number => {
  return Math.round(naira * 100)
}

// Convert Kobo to Naira
export const koboToNaira = (kobo: number): number => {
  return kobo / 100
}

// Verify payment on backend
export const verifyPayment = async (reference: string): Promise<any> => {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reference }),
    })

    if (!response.ok) {
      throw new Error('Payment verification failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Payment verification error:', error)
    throw error
  }
}
