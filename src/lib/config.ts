// Environment configuration and validation
export const config = {
  // Database
  mongodbUri: process.env.MONGODB_URI || '',
  
  // App
  nodeEnv: process.env.NODE_ENV || 'development',
  nextPublicUrl: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  
  // Payment (when implemented)
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || '',
  paystackPublicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  
  // Email (when implemented)
  emailUser: process.env.EMAIL_USER || '',
  emailPassword: process.env.EMAIL_PASSWORD || '',
  
  // Security
  jwtSecret: process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production',
  
  // Features flags
  features: {
    enablePayments: false, // Set to true when Paystack is integrated
    enableEmails: false,   // Set to true when email service is set up
    enableAnalytics: false, // Set to true when analytics is added
  }
}

// Validate required environment variables
export function validateConfig() {
  const errors: string[] = []
  
  if (!config.mongodbUri) {
    errors.push('MONGODB_URI is required')
  }
  
  if (config.nodeEnv === 'production') {
    if (config.jwtSecret === 'your-fallback-secret-key-change-in-production') {
      errors.push('JWT_SECRET must be set in production')
    }
    
    if (config.features.enablePayments && !config.paystackSecretKey) {
      errors.push('PAYSTACK_SECRET_KEY is required when payments are enabled')
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n${errors.join('\n')}`)
  }
}

// Initialize configuration validation
if (typeof window === 'undefined') {
  try {
    validateConfig()
  } catch (error) {
    console.error('Configuration validation failed:', error)
    if (config.nodeEnv === 'production') {
      process.exit(1)
    }
  }
}