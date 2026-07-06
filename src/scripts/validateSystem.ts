/**
 * System validation script to check all critical components
 * Run with: npm run validate-system or npx tsx src/scripts/validateSystem.ts
 */

import { config } from 'dotenv'

// Load environment variables
config()

async function main() {
  console.log('🔍 Starting system validation...\n')

  const checks: Array<{name: string, status: 'pass' | 'fail', message: string}> = []

  // Check Paystack configuration
  const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

  if (!paystackPublicKey) {
    checks.push({
      name: 'Paystack Public Key',
      status: 'fail',
      message: 'Missing NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY environment variable'
    })
  } else if (!paystackPublicKey.startsWith('pk_')) {
    checks.push({
      name: 'Paystack Public Key',
      status: 'fail',
      message: 'Invalid Paystack public key format (should start with pk_)'
    })
  } else {
    checks.push({
      name: 'Paystack Public Key',
      status: 'pass',
      message: `Paystack public key configured (${paystackPublicKey.substring(0, 10)}...)`
    })
  }

  if (!paystackSecretKey) {
    checks.push({
      name: 'Paystack Secret Key',
      status: 'fail',
      message: 'Missing PAYSTACK_SECRET_KEY environment variable'
    })
  } else if (!paystackSecretKey.startsWith('sk_')) {
    checks.push({
      name: 'Paystack Secret Key',
      status: 'fail',
      message: 'Invalid Paystack secret key format (should start with sk_)'
    })
  } else {
    checks.push({
      name: 'Paystack Secret Key',
      status: 'pass',
      message: `Paystack secret key configured (${paystackSecretKey.substring(0, 10)}...)`
    })
  }

  // Check MongoDB configuration
  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    checks.push({
      name: 'Database Configuration',
      status: 'fail',
      message: 'Missing MONGODB_URI environment variable'
    })
  } else if (!mongoUri.startsWith('mongodb')) {
    checks.push({
      name: 'Database Configuration',
      status: 'fail',
      message: 'Invalid MongoDB URI format'
    })
  } else {
    checks.push({
      name: 'Database Configuration',
      status: 'pass',
      message: 'Database URI configured'
    })
  }

  // Print results
  console.log('📋 Configuration Check Results:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  const failedChecks = checks.filter(check => check.status === 'fail')
  
  checks.forEach(check => {
    const statusIcon = check.status === 'pass' ? '✅' : '❌'
    console.log(`${statusIcon} ${check.name}: ${check.message}`)
  })

  console.log('\n')

  if (failedChecks.length === 0) {
    console.log('✨ All configuration checks passed! Your system should work correctly.')
  } else {
    console.log('🚨 Configuration Issues Found:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    failedChecks.forEach((check, index) => {
      console.log(`${index + 1}. ${check.message}`)
      
      // Provide fix instructions
      switch (check.name) {
        case 'Paystack Public Key':
          console.log('   → Add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_... to your .env file')
          break
        case 'Paystack Secret Key':
          console.log('   → Add PAYSTACK_SECRET_KEY=sk_test_... to your .env file')
          break
        case 'Database Configuration':
          console.log('   → Add MONGODB_URI=mongodb://localhost:27017/amapels-ng to your .env file')
          break
      }
      console.log('')
    })
  }

  // Exit with appropriate code
  process.exit(failedChecks.length > 0 ? 1 : 0)
}

// Run the script
main().catch(error => {
  console.error('❌ Validation failed:', error)
  process.exit(1)
})