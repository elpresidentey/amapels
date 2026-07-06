// System health checking and validation utilities

interface HealthCheck {
  name: string
  status: 'pass' | 'fail' | 'warn'
  message: string
  details?: any
}

interface SystemHealthReport {
  overall: 'healthy' | 'degraded' | 'unhealthy'
  checks: HealthCheck[]
  timestamp: string
}

// Environment validation
export async function validateEnvironment(): Promise<HealthCheck[]> {
  const checks: HealthCheck[] = []

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
      message: 'Invalid Paystack public key format'
    })
  } else {
    checks.push({
      name: 'Paystack Public Key',
      status: 'pass',
      message: 'Paystack public key configured'
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
      message: 'Invalid Paystack secret key format'
    })
  } else {
    checks.push({
      name: 'Paystack Secret Key',
      status: 'pass',
      message: 'Paystack secret key configured'
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

  return checks
}

// Network connectivity check
export async function checkNetworkConnectivity(): Promise<HealthCheck> {
  try {
    // Check if we can reach a reliable endpoint
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors'
    })

    clearTimeout(timeoutId)

    return {
      name: 'Network Connectivity',
      status: 'pass',
      message: 'Internet connection available'
    }
  } catch (error) {
    return {
      name: 'Network Connectivity',
      status: 'fail',
      message: 'No internet connection detected',
      details: error instanceof Error ? error.message : 'Unknown network error'
    }
  }
}

// Paystack service availability check
export async function checkPaystackService(): Promise<HealthCheck> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch('https://api.paystack.co/bank', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (response.ok || response.status === 401) {
      // 401 is expected without proper auth, but service is available
      return {
        name: 'Paystack Service',
        status: 'pass',
        message: 'Paystack API is reachable'
      }
    } else {
      return {
        name: 'Paystack Service',
        status: 'warn',
        message: `Paystack API returned status ${response.status}`,
        details: { status: response.status, statusText: response.statusText }
      }
    }
  } catch (error) {
    return {
      name: 'Paystack Service',
      status: 'fail',
      message: 'Cannot reach Paystack API',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Browser compatibility check
export function checkBrowserCompatibility(): HealthCheck {
  const issues: string[] = []

  // Check for required features
  if (typeof window === 'undefined') {
    return {
      name: 'Browser Compatibility',
      status: 'pass',
      message: 'Running in server environment'
    }
  }

  if (!window.localStorage) {
    issues.push('localStorage not available')
  }

  if (!window.fetch) {
    issues.push('fetch API not available')
  }

  if (!window.Promise) {
    issues.push('Promise support not available')
  }

  if (!Array.prototype.find) {
    issues.push('Array.find not supported')
  }

  // Check for Payment Request API (optional)
  const hasPaymentRequest = 'PaymentRequest' in window
  
  if (issues.length === 0) {
    return {
      name: 'Browser Compatibility',
      status: 'pass',
      message: `Browser compatible${hasPaymentRequest ? ' with Payment Request API' : ''}`,
      details: {
        userAgent: navigator.userAgent,
        hasPaymentRequest
      }
    }
  } else {
    return {
      name: 'Browser Compatibility',
      status: 'fail',
      message: 'Browser compatibility issues detected',
      details: { issues }
    }
  }
}

// Local storage availability and quota check
export function checkLocalStorage(): HealthCheck {
  if (typeof window === 'undefined') {
    return {
      name: 'Local Storage',
      status: 'pass',
      message: 'Running in server environment'
    }
  }

  try {
    const testKey = '__storage_test__'
    const testValue = 'test'
    
    localStorage.setItem(testKey, testValue)
    const retrieved = localStorage.getItem(testKey)
    localStorage.removeItem(testKey)

    if (retrieved !== testValue) {
      return {
        name: 'Local Storage',
        status: 'fail',
        message: 'localStorage read/write test failed'
      }
    }

    // Estimate available space (rough estimate)
    let estimate = 0
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
          console.log('Storage estimate:', estimate)
        }).catch(() => {
          // Ignore errors in storage estimation
        })
      }
    } catch {
      // Storage estimation not available
    }

    return {
      name: 'Local Storage',
      status: 'pass',
      message: 'localStorage working correctly',
      details: { hasQuotaAPI: 'storage' in navigator }
    }
  } catch (error) {
    return {
      name: 'Local Storage',
      status: 'fail',
      message: 'localStorage not accessible',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Database connectivity check (server-side only)
export async function checkDatabaseConnectivity(): Promise<HealthCheck> {
  try {
    const response = await fetch('/api/orders?limit=1', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.ok) {
      return {
        name: 'Database Connectivity',
        status: 'pass',
        message: 'Database connection working'
      }
    } else if (response.status >= 500) {
      return {
        name: 'Database Connectivity',
        status: 'fail',
        message: 'Database connection failed',
        details: { status: response.status }
      }
    } else {
      return {
        name: 'Database Connectivity',
        status: 'warn',
        message: 'Database accessible but query failed',
        details: { status: response.status }
      }
    }
  } catch (error) {
    return {
      name: 'Database Connectivity',
      status: 'fail',
      message: 'Cannot connect to database API',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Comprehensive system health check
export async function performSystemHealthCheck(): Promise<SystemHealthReport> {
  const checks: HealthCheck[] = []

  // Run all checks
  checks.push(...await validateEnvironment())
  checks.push(await checkNetworkConnectivity())
  checks.push(await checkPaystackService())
  checks.push(checkBrowserCompatibility())
  checks.push(checkLocalStorage())
  
  // Only check database on client side through API
  if (typeof window !== 'undefined') {
    checks.push(await checkDatabaseConnectivity())
  }

  // Determine overall health
  const failedChecks = checks.filter(check => check.status === 'fail')
  const warnChecks = checks.filter(check => check.status === 'warn')

  let overall: 'healthy' | 'degraded' | 'unhealthy'
  if (failedChecks.length === 0) {
    overall = warnChecks.length === 0 ? 'healthy' : 'degraded'
  } else {
    overall = 'unhealthy'
  }

  return {
    overall,
    checks,
    timestamp: new Date().toISOString()
  }
}

// Utility to get critical system errors that would prevent checkout
export function getCriticalErrors(healthReport: SystemHealthReport): string[] {
  const criticalErrors: string[] = []

  healthReport.checks.forEach(check => {
    if (check.status === 'fail') {
      switch (check.name) {
        case 'Paystack Public Key':
        case 'Paystack Secret Key':
        case 'Network Connectivity':
        case 'Paystack Service':
          criticalErrors.push(check.message)
          break
        case 'Browser Compatibility':
          criticalErrors.push('Your browser is not compatible with our checkout system')
          break
        case 'Local Storage':
          criticalErrors.push('Cart functionality is not available in your browser')
          break
      }
    }
  })

  return criticalErrors
}

// Export types for use in components
export type { HealthCheck, SystemHealthReport }