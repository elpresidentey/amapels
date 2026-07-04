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
  addItem: (product: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  toggleCart: () => void
  closeCart: () => void
  openCart: () => void
  setLoaded: () => void
}

const useCartStoreBase = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoaded: false,

      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id)
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            }
          }
          
          return {
            items: [...state.items, { ...product, quantity: 1 }]
          }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        })),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(item => item.id !== id)
            }
          }
          
          return {
            items: state.items.map(item =>
              item.id === id ? { ...item, quantity } : item
            )
          }
        }),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        const state = get()
        return state.items.reduce((total, item) => {
          const price = parseInt(item.price.replace(/[₦,]/g, ''))
          return total + (price * item.quantity)
        }, 0)
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      closeCart: () => set({ isOpen: false }),
      openCart: () => set({ isOpen: true }),
      setLoaded: () => set({ isLoaded: true }),
    }),
    {
      name: 'amapels-cart',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setLoaded()
      },
    }
  )
)

// Create a safe hook that handles SSR
export const useCartStore = () => {
  const store = useCartStoreBase()
  
  // Return safe defaults during SSR
  if (typeof window === 'undefined') {
    return {
      ...store,
      items: [],
      isLoaded: false,
      getTotalItems: () => 0,
      getTotalPrice: () => 0,
    }
  }
  
  return store
}