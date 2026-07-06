#!/usr/bin/env node

import { config } from 'dotenv'
import mongoose from 'mongoose'

// Load environment variables
config()

interface ValidationResult {
  passed: boolean
  message: string
  category: 'Environment' | 'Database' | 'Payment'
}

class MVPValidator {
  private results: ValidationResult[] = []

  private addResult(category: ValidationResult['category'], passed: boolean, message: string) {
    this.results.push({ category, passed, message })
  }

  async validateEnvironment(): Promise<void> {
    console.log('🔍 Validating environment variables...')

    // Check MongoDB URI
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      this.addResult('Environment', false, 'MONGODB_URI is not set')
    } else if (mongoUri.includes('mongodb://') || mongoUri.includes('mongodb+srv://')) {
      this.addResult('Environment', true, 'MONGODB_URI is properly formatted')
    } else {
      this.addResult('Environment', false, 'MONGODB_URI format is invalid')
    }

    // Check Paystack public key
    const paystackPublic = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    if (!paystackPublic) {
      this.addResult('Environment', false, 'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not set')
    } else if (paystackPublic.startsWith('pk_test_') || paystackPublic.startsWith('pk_live_')) {
      this.addResult('Environment', true, 'Paystack public key is properly formatted')
    } else {
      this.addResult('Environment', false, 'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY format is invalid')
    }

    // Check Paystack secret key
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecret) {
      this.addResult('Environment', false, 'PAYSTACK_SECRET_KEY is not set')
    } else if (paystackSecret.startsWith('sk_test_') || paystackSecret.startsWith('sk_live_')) {
      this.addResult('Environment', true, 'Paystack secret key is properly formatted')
    } else {
      this.addResult('Environment', false, 'PAYSTACK_SECRET_KEY format is invalid')
    }
  }

  async validateDatabase(): Promise<void> {
    console.log('🗄️  Validating database connection...')

    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      this.addResult('Database', false, 'Cannot test database - MONGODB_URI not set')
      return
    }

    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000, // 5 second timeout
      })
      this.addResult('Database', true, 'Successfully connected to MongoDB')
      await mongoose.disconnect()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.addResult('Database', false, `Database connection failed: ${errorMessage}`)
    }
  }

  async validatePaystack(): Promise<void> {
    console.log('💳 Validating Paystack configuration...')

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecret) {
      this.addResult('Payment', false, 'Cannot test Paystack - PAYSTACK_SECRET_KEY not set')
      return
    }

    try {
      // Test Paystack API connection
      const response = await fetch('https://api.paystack.co/bank', {
        headers: {
          'Authorization': `Bearer ${paystackSecret}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        this.addResult('Payment', true, 'Paystack API connection successful')
      } else if (response.status === 401) {
        this.addResult('Payment', false, 'Paystack secret key is invalid')
      } else {
        this.addResult('Payment', false, `Paystack API returned status: ${response.status}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.addResult('Payment', false, `Paystack API test failed: ${errorMessage}`)
    }
  }

  printResults(): void {
    console.log('\n' + '='.repeat(50))
    console.log('📊 VALIDATION RESULTS')
    console.log('='.repeat(50))

    const categories: Record<string, ValidationResult[]> = {}
    this.results.forEach(result => {
      if (!categories[result.category]) {
        categories[result.category] = []
      }
      categories[result.category].push(result)
    })

    let allPassed = true
    Object.entries(categories).forEach(([category, results]) => {
      console.log(`\n${category}:`)
      results.forEach(result => {
        const icon = result.passed ? '✅' : '❌'
        console.log(`  ${icon} ${result.message}`)
        if (!result.passed) allPassed = false
      })
    })

    console.log('\n' + '='.repeat(50))
    if (allPassed) {
      console.log('🎉 ALL CHECKS PASSED! Your MVP is ready to go.')
      console.log('👉 Run "npm run dev" to start the application')
    } else {
      console.log('⚠️  SOME CHECKS FAILED. Please fix the issues above.')
      console.log('📖 Check setup-mvp.md for detailed setup instructions')
    }
    console.log('='.repeat(50))
  }

  async run(): Promise<void> {
    console.log('🚀 AMAPELS MVP Validation')
    console.log('Checking if your environment is ready...\n')

    await this.validateEnvironment()
    await this.validateDatabase()
    await this.validatePaystack()

    this.printResults()
  }
}

// Run validation if this file is executed directly
if (require.main === module) {
  const validator = new MVPValidator()
  validator.run().catch((error) => {
    console.error('❌ Validation script failed:', error)
    process.exit(1)
  })
}

export default MVPValidator