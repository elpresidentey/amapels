import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: string
  image: string
  quantity: number
  size?: string
  color?: string
  category: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  isLoaded: boolean
  error: string | null
  sessionId: string | null
  addItem: (product: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  clearCartOnNewSession: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  toggleCart: () => void
  closeCart: () => void
  openCart: () => void
  setLoaded: () => void
  setError: (error: string | null) => void
}

// Validation functions
const validateCartItem = (item: any): item is Omit<CartItem, 'quantity'> => {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'string' &&
    typeof item.image === 'string' &&
    typeof item.category === 'string' &&
    item.id.length > 0 &&
    item.name.length > 0 &&
    item.price.length > 0
  )
}

const sanitizeCartItem = (item: Omit<CartItem, 'quantity'>): Omit<CartItem, 'quantity'> => {
  return {
    id: String(item.id).trim(),
    name: String(item.name).trim(),
    price: String(item.price).trim(),
    image: String(item.image).trim(),
    category: String(item.category).trim(),
    size: item.size ? String(item.size).trim() : undefined,
    color: item.color ? String(item.color).trim() : undefined,
  }
}

const parsePrice = (price: string): number => {
  try {
    // Remove currency symbols and commas, then parse
    const numericPrice = price.replace(/[₦,\s]/g, '')
    const parsed = parseFloat(numericPrice)
    return isNaN(parsed) ? 0 : parsed
  } catch {
    return 0
  }
}

// Safe localStorage operations
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null
      return localStorage.getItem(key)
    } catch (error) {
      console.error('localStorage.getItem failed:', error)
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('localStorage.setItem failed:', error)
      // Handle quota exceeded or other localStorage errors
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window === 'undefined') return
      localStorage.removeItem(key)
    } catch (error) {
      console.error('localStorage.removeItem failed:', error)
    }
  },
}

const useCartStoreBase = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoaded: false,
      error: null,
      sessionId: null,

      addItem: (product) => {
        try {
          if (!validateCartItem(product)) {
            console.error('Invalid cart item:', product)
            set({ error: 'Invalid product data' })
            return
          }

          const sanitizedProduct = sanitizeCartItem(product)
          
          set((state) => {
            const existingItem = state.items.find(item => item.id === sanitizedProduct.id)
            
            if (existingItem) {
              // Check for maximum quantity (prevent overflow)
              const newQuantity = Math.min(existingItem.quantity + 1, 999)
              return {
                items: state.items.map(item =>
                  item.id === sanitizedProduct.id
                    ? { ...item, quantity: newQuantity }
                    : item
                ),
                error: null
              }
            }
            
            // Check for maximum cart size
            if (state.items.length >= 50) {
              return {
                error: 'Cart is full (maximum 50 items)'
              }
            }
            
            return {
              items: [...state.items, { ...sanitizedProduct, quantity: 1 }],
              error: null
            }
          })
        } catch (error) {
          console.error('Error adding item to cart:', error)
          set({ error: 'Failed to add item to cart' })
        }
      },

      removeItem: (id) => {
        try {
          if (!id || typeof id !== 'string') {
            set({ error: 'Invalid item ID' })
            return
          }

          set((state) => ({
            items: state.items.filter(item => item.id !== id.trim()),
            error: null
          }))
        } catch (error) {
          console.error('Error removing item from cart:', error)
          set({ error: 'Failed to remove item from cart' })
        }
      },

      updateQuantity: (id, quantity) => {
        try {
          if (!id || typeof id !== 'string' || typeof quantity !== 'number') {
            set({ error: 'Invalid parameters for quantity update' })
            return
          }

          const sanitizedQuantity = Math.max(0, Math.min(Math.floor(quantity), 999))
          
          set((state) => {
            if (sanitizedQuantity <= 0) {
              return {
                items: state.items.filter(item => item.id !== id.trim()),
                error: null
              }
            }
            
            return {
              items: state.items.map(item =>
                item.id === id.trim() ? { ...item, quantity: sanitizedQuantity } : item
              ),
              error: null
            }
          })
        } catch (error) {
          console.error('Error updating quantity:', error)
          set({ error: 'Failed to update item quantity' })
        }
      },

      clearCart: () => {
        try {
          set({ items: [], error: null })
        } catch (error) {
          console.error('Error clearing cart:', error)
          set({ error: 'Failed to clear cart' })
        }
      },

      clearCartOnNewSession: () => {
        try {
          // Only run on client side
          if (typeof window === 'undefined') return
          
          const currentSessionId = sessionStorage.getItem('cart_session_id')
          const storedSessionId = get().sessionId
          
          // Generate new session ID if none exists
          if (!currentSessionId) {
            const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`
            sessionStorage.setItem('cart_session_id', newSessionId)
            
            // First visit - clear any existing cart data
            if (get().items.length > 0) {
              console.log('First visit detected, clearing cart')
              set({ 
                items: [], 
                error: null, 
                sessionId: newSessionId 
              })
            } else {
              set({ sessionId: newSessionId })
            }
            return
          }
          
          // If session IDs don't match, clear cart (new session detected)
          if (storedSessionId && currentSessionId !== storedSessionId) {
            console.log('New session detected, clearing cart')
            set({ 
              items: [], 
              error: null, 
              sessionId: currentSessionId 
            })
          } else {
            // Update session ID
            set({ sessionId: currentSessionId })
          }
        } catch (error) {
          console.error('Error checking session:', error)
        }
      },

      getTotalItems: () => {
        try {
          const state = get()
          return state.items.reduce((total, item) => {
            const quantity = typeof item.quantity === 'number' ? item.quantity : 0
            return total + quantity
          }, 0)
        } catch (error) {
          console.error('Error calculating total items:', error)
          return 0
        }
      },

      getTotalPrice: () => {
        try {
          const state = get()
          return state.items.reduce((total, item) => {
            const price = parsePrice(item.price)
            const quantity = typeof item.quantity === 'number' ? item.quantity : 0
            return total + (price * quantity)
          }, 0)
        } catch (error) {
          console.error('Error calculating total price:', error)
          return 0
        }
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      closeCart: () => set({ isOpen: false }),
      openCart: () => set({ isOpen: true }),
      setLoaded: () => set({ isLoaded: true, error: null }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'amapels-cart',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ 
        items: state.items.filter(item => validateCartItem(item)), // Only persist valid items
        sessionId: state.sessionId // Persist session ID
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Cart rehydration failed:', error)
          // Reset to empty cart on rehydration failure
          state?.setLoaded()
          state?.clearCart()
          state?.setError('Cart data was corrupted and has been reset')
        } else {
          state?.setLoaded()
          // Check for new session and clear cart if needed
          state?.clearCartOnNewSession()
        }
      },
      // Add migration for future schema changes
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from version 0 to 1 (if needed in future)
          return persistedState
        }
        return persistedState
      },
    }
  )
)

// Create a safe hook that handles SSR and errors
export const useCartStore = () => {
  const store = useCartStoreBase()
  
  // Return safe defaults during SSR
  if (typeof window === 'undefined') {
    return {
      ...store,
      items: [],
      isLoaded: false,
      error: null,
      getTotalItems: () => 0,
      getTotalPrice: () => 0,
    }
  }
  
  return store
}