/**
 * Manual checkout testing script
 * Run with: npx tsx src/scripts/testCheckout.ts
 */

import { config } from 'dotenv'

config()

interface TestResult {
  test: string
  status: 'PASS' | 'FAIL' | 'WARN'
  message: string
  details?: any
}

async function runTests(): Promise<TestResult[]> {
  const results: TestResult[] = []

  console.log('🧪 Running Checkout System Tests...\n')

  // Test 1: Environment Configuration
  console.log('1️⃣ Testing Environment Configuration...')
  try {
    const paystackPubKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    const paystackSecKey = process.env.PAYSTACK_SECRET_KEY
    const mongoUri = process.env.MONGODB_URI

    if (!paystackPubKey || !paystackSecKey || !mongoUri) {
      results.push({
        test: 'Environment Configuration',
        status: 'FAIL',
        message: 'Missing required environment variables',
        details: {
          paystackPubKey: !!paystackPubKey,
          paystackSecKey: !!paystackSecKey,
          mongoUri: !!mongoUri
        }
      })
    } else {
      results.push({
        test: 'Environment Configuration',
        status: 'PASS',
        message: 'All environment variables present'
      })
    }
  } catch (error) {
    results.push({
      test: 'Environment Configuration',
      status: 'FAIL',
      message: 'Error checking environment',
      details: error
    })
  }

  // Test 2: Health API Endpoint
  console.log('2️⃣ Testing Health API...')
  try {
    const response = await fetch('http://localhost:3000/api/health')
    const data = await response.json()

    if (response.ok && data.overall) {
      results.push({
        test: 'Health API',
        status: data.overall === 'healthy' ? 'PASS' : 'WARN',
        message: `Health API responding - Status: ${data.overall}`,
        details: data
      })
    } else {
      results.push({
        test: 'Health API',
        status: 'FAIL',
        message: 'Health API not responding correctly',
        details: { status: response.status, data }
      })
    }
  } catch (error) {
    results.push({
      test: 'Health API',
      status: 'FAIL',
      message: 'Cannot reach health API (server may not be running)',
      details: error
    })
  }

  // Test 3: Orders API
  console.log('3️⃣ Testing Orders API...')
  try {
    const response = await fetch('http://localhost:3000/api/orders?limit=1')
    
    if (response.ok) {
      results.push({
        test: 'Orders API',
        status: 'PASS',
        message: 'Orders API responding correctly'
      })
    } else {
      results.push({
        test: 'Orders API',
        status: 'WARN',
        message: `Orders API returned status ${response.status}`,
        details: { status: response.status }
      })
    }
  } catch (error) {
    results.push({
      test: 'Orders API',
      status: 'FAIL',
      message: 'Cannot reach orders API',
      details: error
    })
  }

  // Test 4: Payment Verification API (with invalid reference)
  console.log('4️⃣ Testing Payment Verification API...')
  try {
    const response = await fetch('http://localhost:3000/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference: 'invalid-ref-test' })
    })

    if (response.status === 400) {
      results.push({
        test: 'Payment Verification API',
        status: 'PASS',
        message: 'API correctly rejects invalid reference format'
      })
    } else {
      results.push({
        test: 'Payment Verification API',
        status: 'WARN',
        message: `Unexpected response to invalid reference: ${response.status}`
      })
    }
  } catch (error) {
    results.push({
      test: 'Payment Verification API',
      status: 'FAIL',
      message: 'Cannot reach payment verification API',
      details: error
    })
  }

  // Test 5: Paystack Service Connectivity
  console.log('5️⃣ Testing Paystack Service...')
  try {
    const response = await fetch('https://api.paystack.co/bank', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.status === 401 || response.ok) {
      // 401 is expected without auth, but service is reachable
      results.push({
        test: 'Paystack Service',
        status: 'PASS',
        message: 'Paystack API is reachable'
      })
    } else {
      results.push({
        test: 'Paystack Service',
        status: 'WARN',
        message: `Paystack API returned unexpected status: ${response.status}`
      })
    }
  } catch (error) {
    results.push({
      test: 'Paystack Service',
      status: 'FAIL',
      message: 'Cannot reach Paystack API',
      details: error
    })
  }

  return results
}

async function main() {
  const results = await runTests()

  console.log('\n📊 Test Results Summary:')
  console.log('═'.repeat(60))

  let passCount = 0
  let warnCount = 0
  let failCount = 0

  results.forEach((result, index) => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'WARN' ? '⚠️' : '❌'
    console.log(`${icon} ${result.test}: ${result.message}`)
    
    if (result.details && process.env.NODE_ENV !== 'production') {
      console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`)
    }

    if (result.status === 'PASS') passCount++
    else if (result.status === 'WARN') warnCount++
    else failCount++
  })

  console.log('\n📈 Summary:')
  console.log(`✅ Passed: ${passCount}`)
  console.log(`⚠️  Warnings: ${warnCount}`)
  console.log(`❌ Failed: ${failCount}`)

  if (failCount === 0) {
    console.log('\n🎉 All critical tests passed! Your checkout system is ready.')
  } else {
    console.log('\n🚨 Some tests failed. Please address the issues above before using the checkout system.')
  }

  console.log('\n💡 Next Steps:')
  if (failCount > 0) {
    console.log('1. Fix any failed tests above')
    console.log('2. Make sure your development server is running: npm run dev')
    console.log('3. Check your environment variables in .env')
  }
  console.log('4. Test the checkout flow manually in your browser')
  console.log('5. Run the full validation: npm run validate-system')

  process.exit(failCount > 0 ? 1 : 0)
}

main().catch(error => {
  console.error('❌ Test runner failed:', error)
  process.exit(1)
})