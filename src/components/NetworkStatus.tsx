'use client'

import { useState, useEffect } from 'react'
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react'

interface NetworkStatusProps {
  onStatusChange?: (isOnline: boolean) => void
  className?: string
}

export default function NetworkStatus({ onStatusChange, className = '' }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowStatus(true)
      onStatusChange?.(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowStatus(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowStatus(true)
      onStatusChange?.(false)
    }

    // Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [onStatusChange])

  // Don't render anything if online and no status change to show
  if (isOnline && !showStatus) {
    return null
  }

  return (
    <div className={`fixed top-20 left-0 right-0 z-50 ${className}`}>
      <div className={`px-4 py-2 text-sm text-center transition-all duration-300 ${
        isOnline 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}>
        <div className="section-shell flex items-center justify-center gap-2">
          {isOnline ? (
            <>
              <CheckCircle size={16} />
              <span>Connection restored</span>
            </>
          ) : (
            <>
              <WifiOff size={16} />
              <span>No internet connection. Please check your network.</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Hook to use network status in components
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}