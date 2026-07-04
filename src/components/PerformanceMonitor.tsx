'use client'

import { useEffect } from 'react'

interface PerformanceMetrics {
  lcp?: number
  fid?: number
  cls?: number
  ttfb?: number
}

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const metrics: PerformanceMetrics = {}
    
    // Track Largest Contentful Paint (LCP)
    const observeLCP = () => {
      try {
        const observer = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          
          if (lastEntry) {
            metrics.lcp = lastEntry.startTime
            console.log(`🚀 LCP: ${Math.round(lastEntry.startTime)}ms`)
            
            if (lastEntry.startTime > 2500) {
              console.warn(`⚠️ LCP is slow: ${Math.round(lastEntry.startTime)}ms (should be < 2500ms)`)
            } else if (lastEntry.startTime < 1200) {
              console.log(`✅ Excellent LCP: ${Math.round(lastEntry.startTime)}ms`)
            }
          }
        })
        
        observer.observe({ type: 'largest-contentful-paint', buffered: true })
        
        return () => observer.disconnect()
      } catch (error) {
        console.log('LCP not supported in this browser')
      }
    }

    // Track First Input Delay (FID)
    const observeFID = () => {
      try {
        const observer = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.entryType === 'first-input') {
              const fid = (entry as any).processingStart - entry.startTime
              metrics.fid = fid
              console.log(`🚀 FID: ${Math.round(fid)}ms`)
              
              if (fid > 100) {
                console.warn(`⚠️ FID is slow: ${Math.round(fid)}ms (should be < 100ms)`)
              }
            }
          }
        })
        
        observer.observe({ type: 'first-input', buffered: true })
        
        return () => observer.disconnect()
      } catch (error) {
        console.log('FID not supported in this browser')
      }
    }

    // Track Cumulative Layout Shift (CLS)
    const observeCLS = () => {
      try {
        let clsValue = 0
        
        const observer = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          }
          
          metrics.cls = clsValue
          
          if (clsValue > 0) {
            console.log(`🚀 CLS: ${clsValue.toFixed(4)}`)
            
            if (clsValue > 0.1) {
              console.warn(`⚠️ CLS is high: ${clsValue.toFixed(4)} (should be < 0.1)`)
            }
          }
        })
        
        observer.observe({ type: 'layout-shift', buffered: true })
        
        return () => observer.disconnect()
      } catch (error) {
        console.log('CLS not supported in this browser')
      }
    }

    // Track Time to First Byte (TTFB)
    const observeTTFB = () => {
      try {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as any
        
        if (navigationEntry) {
          const ttfb = navigationEntry.responseStart - navigationEntry.requestStart
          metrics.ttfb = ttfb
          console.log(`🚀 TTFB: ${Math.round(ttfb)}ms`)
          
          if (ttfb > 600) {
            console.warn(`⚠️ TTFB is slow: ${Math.round(ttfb)}ms (should be < 600ms)`)
          }
        }
      } catch (error) {
        console.log('TTFB measurement not supported')
      }
    }

    // Run observers
    const cleanupFunctions: (() => void)[] = []
    
    const lcpCleanup = observeLCP()
    const fidCleanup = observeFID()
    const clsCleanup = observeCLS()
    
    if (lcpCleanup) cleanupFunctions.push(lcpCleanup)
    if (fidCleanup) cleanupFunctions.push(fidCleanup)
    if (clsCleanup) cleanupFunctions.push(clsCleanup)

    // Observe TTFB
    observeTTFB()

    // Report all metrics after page load
    setTimeout(() => {
      console.log('📊 Final Performance Metrics:', {
        lcp: metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A',
        fid: metrics.fid ? `${Math.round(metrics.fid)}ms` : 'N/A',
        cls: metrics.cls ? metrics.cls.toFixed(4) : 'N/A',
        ttfb: metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'N/A'
      })
    }, 3000)

    // Cleanup function
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [])

  // This component doesn't render anything
  return null
}