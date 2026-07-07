import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateEnvironment, checkPaystackService } from '@/lib/systemHealth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const check = searchParams.get('check') || 'all'

    const checks: any[] = []

    // Environment validation
    if (check === 'all' || check === 'env') {
      const envChecks = await validateEnvironment()
      checks.push(...envChecks)
    }

    // Database connectivity
    if (check === 'all' || check === 'db') {
      try {
        if (!supabase) {
          throw new Error('Supabase client not initialized')
        }
        // Test Supabase connection with a simple query
        const { error } = await supabase.from('products').select('count').limit(1)
        if (error) throw error
        
        checks.push({
          name: 'Database Connection',
          status: 'pass',
          message: 'Database connected successfully'
        })
      } catch (error) {
        checks.push({
          name: 'Database Connection',
          status: 'fail',
          message: 'Database connection failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // Paystack service availability
    if (check === 'all' || check === 'paystack') {
      const paystackCheck = await checkPaystackService()
      checks.push(paystackCheck)
    }

    // Calculate overall status
    const failedChecks = checks.filter(c => c.status === 'fail')
    const warnChecks = checks.filter(c => c.status === 'warn')

    let overall: 'healthy' | 'degraded' | 'unhealthy'
    if (failedChecks.length === 0) {
      overall = warnChecks.length === 0 ? 'healthy' : 'degraded'
    } else {
      overall = 'unhealthy'
    }

    // Don't expose sensitive details in production
    const isProduction = process.env.NODE_ENV === 'production'
    const sanitizedChecks = isProduction 
      ? checks.map(check => ({
          name: check.name,
          status: check.status,
          message: check.status === 'pass' ? check.message : 'Service unavailable'
        }))
      : checks

    return NextResponse.json({
      overall,
      checks: sanitizedChecks,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      { 
        overall: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}