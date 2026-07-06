'use client'

import { useEffect } from 'react'
import { initializeSession } from '@/lib/customerAuth'
import { useCartStore } from '@/store/newCartStore'

export default function SessionInitializer() {
  useEffect(() => {
    // Initialize session tracking when the app starts
    initializeSession()
  }, [])

  // This component doesn't render anything, it just handles initialization
  return null
}