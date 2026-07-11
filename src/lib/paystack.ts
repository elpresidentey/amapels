// Paystack integration utility with enhanced error handling

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

// Enhanced script loading with retry logic
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

    // Remove any existing script elements
    const existingScripts = document.querySelectorAll('script[src*="paystack.co"]')
    existingScripts.forEach(script => script.remove())

    let attempts = 0
    const maxAttempts = 3

    const loadScript = () => {
      attempts++
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.async = true
      
      script.onload = () => {
        // Verify PaystackPop is actually available
        if ((window as any).PaystackPop) {
          resolve(true)
        } else {
          // Script loaded but PaystackPop not available
          if (attempts < maxAttempts) {
            console.warn(`Paystack script loaded but PaystackPop not found. Attempt ${attempts}/${maxAttempts}`)
            setTimeout(loadScript, 1000 * attempts)
          } else {
            resolve(false)
          }
        }
      }
      
      script.onerror = () => {
        console.error(`Failed to load Paystack script. Attempt ${attempts}/${maxAttempts}`)
        if (attempts < maxAttempts) {
          setTimeout(loadScript, 1000 * attempts)
        } else {
          resolve(false)
        }
      }
      
      document.head.appendChild(script)
    }

    loadScript()
  })
}

// Enhanced payment initialization with comprehensive validation
export const initializePaystackPayment = async (config: PaystackConfig) => {
  // Validate config
  if (!config.publicKey || !config.email || !config.amount) {
    throw new Error('Missing required payment configuration')
  }

  if (config.amount < 50) {
    throw new Error('Amount too small (minimum ₦0.50)')
  }

  if (config.amount > 99999999) {
    throw new Error('Amount too large (maximum ₦999,999.99)')
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(config.email)) {
    throw new Error('Invalid email address format')
  }

  // Check network connectivity
  if (!navigator.onLine) {
    throw new Error('No internet connection available')
  }

  const scriptLoaded = await loadPaystackScript()
  
  if (!scriptLoaded) {
    throw new Error('Payment system could not be loaded. This might be due to network issues or ad blockers.')
  }

  const PaystackPop = (window as any).PaystackPop
  
  if (!PaystackPop) {
    throw new Error('Paystack payment gateway is not available')
  }

  try {
    const handler = PaystackPop.setup({
      key: config.publicKey.trim(),
      email: config.email.trim().toLowerCase(),
      amount: Math.round(config.amount),
      currency: config.currency || 'NGN',
      ref: config.ref || generateReference(),
      metadata: config.metadata || {},
      callback: (response: any) => {
        console.log('Paystack callback received:', response)
        if (config.onSuccess) {
          try {
            config.onSuccess(response)
          } catch (error) {
            console.error('Error in payment success callback:', error)
          }
        }
      },
      onClose: () => {
        console.log('Paystack payment modal closed')
        if (config.onClose) {
          try {
            config.onClose()
          } catch (error) {
            console.error('Error in payment close callback:', error)
          }
        }
      }
    })

    if (!handler) {
      throw new Error('Failed to create payment handler')
    }

    // Add timeout for opening iframe
    const openTimeout = setTimeout(() => {
      throw new Error('Payment modal failed to open within timeout')
    }, 10000)

    try {
      handler.openIframe()
      clearTimeout(openTimeout)
    } catch (error) {
      clearTimeout(openTimeout)
      throw new Error('Failed to open payment modal')
    }

  } catch (error) {
    console.error('Paystack setup error:', error)
    
    // Handle browser extension interference errors
    if (error instanceof Error && error.message.includes('message channel')) {
      console.warn('Browser extension interference detected. Please disable ad blockers or privacy extensions and try again.')
      throw new Error('Payment was interrupted by a browser extension. Please disable ad blockers or privacy extensions and try again.')
    }
    
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error('Unknown error occurred while setting up payment')
    }
  }
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
