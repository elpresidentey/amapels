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

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoaded: boolean
  
  // Actions
  addItem: (product: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  
  // UI
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  setLoaded: (loaded: boolean) => void
  
  // Computed
  getTotalItems: () => number
  getTotalPrice: () => number
  getSubtotal: () => number
  getShipping: () => number
  getTax: () => number
}

const parsePrice = (price: string): number => {
  try {
    return parseFloat(price.replace(/[₦,\s]/g, ''))
  } catch {
    return 0
  }
}

const safeLocalStorage = {
  getItem: (name: string) => {
    try {
      if (typeof window === 'undefined') return null
      return localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string) => {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(name, value)
    } catch {
      // Silent fail
    }
  },
  removeItem: (name: string) => {
    try {
      if (typeof window === 'undefined') return
      localStorage.removeItem(name)
    } catch {
      // Silent fail
    }
  },
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoaded: false,

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id)
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
                  : item
              )
            }
          }
          
          return {
            items: [...state.items, { ...product, quantity: 1 }]
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.id === id
              ? { ...item, quantity: Math.min(Math.max(1, quantity), 99) }
              : item
          )
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setLoaded: (loaded) => set({ isLoaded: loaded }),

      getTotalItems: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        const state = get()
        return state.items.reduce((total, item) => {
          return total + (parsePrice(item.price) * item.quantity)
        }, 0)
      },

      getShipping: () => {
        const subtotal = get().getSubtotal()
        return subtotal > 0 ? 2500 : 0
      },

      getTax: () => {
        const subtotal = get().getSubtotal()
        return Math.round(subtotal * 0.075) // 7.5% VAT
      },

      getTotalPrice: () => {
        const state = get()
        return state.getSubtotal() + state.getShipping() + state.getTax()
      },
    }),
    {
      name: 'amapels-cart',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        items: state.items,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Cart rehydration error:', error)
          return
        }
        
        // Simple post-rehydration setup
        if (state) {
          state.closeCart()
          state.setLoaded(true)
        }
      },
    }
  )
)