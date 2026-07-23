'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/newCartStore'

export default function SessionInitializer() {
  const clearCartOnNewSession = useCartStore(state => state.clearCartOnNewSession)

  useEffect(() => {
    clearCartOnNewSession()
  }, [clearCartOnNewSession])

  return null
}