'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, LogOut, ShoppingBag } from 'lucide-react'
import { 
  customerLogin, 
  customerLogout, 
  getCustomerSession, 
  isCustomerAuthenticated 
} from '@/lib/customerAuth'
import { useCartStore } from '@/store/newCartStore'

export default function CustomerAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(false)
  const { clearCart } = useCartStore()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    const authenticated = isCustomerAuthenticated()
    setIsAuthenticated(authenticated)
    
    if (authenticated) {
      const session = getCustomerSession()
      if (session) {
        setCustomerName(session.name)
      }
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    
    try {
      // Clear cart before login (this is what you requested)
      clearCart()
      
      // Create customer session
      const session = customerLogin(email, name || undefined)
      
      setIsAuthenticated(true)
      setCustomerName(session.name)
      setShowLogin(false)
      setEmail('')
      setName('')
      
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    customerLogout()
    setIsAuthenticated(false)
    setCustomerName('')
    setShowLogin(false)
    
    // Clear cart on logout
    clearCart()
  }

  return (
    <div className="relative">
      {!isAuthenticated ? (
        <>
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="flex items-center gap-2 text-champagne hover:text-white transition-colors text-sm uppercase tracking-wider"
          >
            <User size={16} />
            <span className="hidden md:inline">Login</span>
          </button>

          <AnimatePresence>
            {showLogin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full right-0 mt-2 w-80 bg-white border border-gold/30 shadow-lg p-6 z-50"
              >
                <h3 className="font-serif text-lg text-black-dark mb-4">Welcome Back</h3>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black-dark mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gold focus:ring-2 focus:ring-gold/20 focus:border-black outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black-dark mb-2">
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gold focus:ring-2 focus:ring-gold/20 focus:border-black outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="bg-primary-light/10 rounded-xl p-3 border border-gold/30">
                    <div className="flex items-start gap-2 text-xs text-black/70">
                      <ShoppingBag size={14} className="mt-0.5 flex-shrink-0" />
                      <p>
                        <strong>Note:</strong> Logging in will clear your current cart items. 
                        This ensures a fresh shopping session.
                      </p>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="w-full bg-black text-white py-2.5 px-4 text-sm font-medium uppercase tracking-wider hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-ivory border-t-transparent rounded-full animate-spin"></div>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <Mail size={16} />
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                <p className="text-xs text-black/60 text-center mt-4">
                  Simple email-based login. No password required for this demo.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-sm text-champagne/80 hidden md:inline">
            Hello, {customerName}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-champagne hover:text-white transition-colors text-sm uppercase tracking-wider"
            title="Logout"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}
