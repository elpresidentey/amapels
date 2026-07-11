'use client'

import { useEffect } from 'react'
import { initializeSession } from '@/lib/customerAuth'
import { useCartStore } from '@/store/newCartStore'

export default function SessionInitializer() {
  const clearCartOnNewSession = useCartStore(state => state.clearCartOnNewSession)

  useEffect(() => {
    // Initialize session tracking when the app starts
    initializeSession()
    
    // Clear cart on new session to prevent auto-population
    clearCartOnNewSession()
  }, [clearCartOnNewSession])

  // This component doesn't render anything, it just handles initialization
  return null
}