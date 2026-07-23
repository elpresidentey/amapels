'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { User, Mail, LogOut, ShoppingBag, UserCircle, CheckCircle, AlertCircle } from 'lucide-react'
import {
  customerLogin,
  customerLogout,
  isCustomerAuthenticated,
  getCachedSession,
} from '@/lib/customerAuth'
import { useCartStore } from '@/store/newCartStore'

export default function CustomerAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [loginError, setLoginError] = useState('')
  const { clearCart } = useCartStore()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    if (!showLogin) return
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowLogin(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showLogin])

  const checkAuthStatus = async () => {
    setAuthLoading(true)
    try {
      const authenticated = await isCustomerAuthenticated()
      setIsAuthenticated(authenticated)

      if (authenticated) {
        const session = getCachedSession()
        if (session) {
          setCustomerName(session.name)
        }
      }
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setLoginError('')
    setLoginSuccess(false)

    try {
      clearCart()
      const session = await customerLogin(email, name || undefined)

      setIsAuthenticated(true)
      setCustomerName(session.name)
      setLoginSuccess(true)

      // Show success briefly then close
      setTimeout(() => {
        setShowLogin(false)
        setLoginSuccess(false)
        setEmail('')
        setName('')
      }, 1500)
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await customerLogout()
    setIsAuthenticated(false)
    setCustomerName('')
    setShowLogin(false)
    clearCart()
  }

  if (authLoading) {
    return (
      <div className="flex items-center gap-2 text-white/50">
        <div className="h-3 w-3 animate-pulse rounded-full bg-white/20" />
      </div>
    )
  }

  return (
    <div className="relative">
      {!isAuthenticated ? (
        <>
          <button
            type="button"
            onClick={() => setShowLogin(!showLogin)}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm uppercase tracking-wider"
            aria-label="Login to your account"
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

                {/* Success State */}
                {loginSuccess ? (
                  <div className="flex flex-col items-center gap-3 py-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle size={24} className="text-green-600" />
                    </div>
                    <p className="font-medium text-green-700 text-sm">Signed in successfully!</p>
                    <p className="text-xs text-black/50">Redirecting to your account...</p>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    {loginError && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle size={14} className="mt-0.5 flex-shrink-0 text-red-500" />
                        <p className="text-xs text-red-700">{loginError}</p>
                      </div>
                    )}

                    <div>
                      <label htmlFor="auth-email" className="block text-sm font-medium text-black-dark mb-2">
                        Email Address *
                      </label>
                      <input
                        id="auth-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gold focus:ring-2 focus:ring-gold/20 focus:border-black outline-none transition-colors"
                        placeholder="your@email.com"
                        aria-required="true"
                      />
                    </div>

                    <div>
                      <label htmlFor="auth-name" className="block text-sm font-medium text-black-dark mb-2">
                        Your Name <span className="text-black/40">(for a personal touch)</span>
                      </label>
                      <input
                        id="auth-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gold focus:ring-2 focus:ring-gold/20 focus:border-black outline-none transition-colors"
                        placeholder="Chioma"
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
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" role="status" aria-label="Signing in" />
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
                )}

                <p className="text-xs text-black/60 text-center mt-4">
                  Email-based access. No password needed — we'll remember you.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
    <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowLogin(!showLogin)}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm tracking-wider"
            aria-label="Account menu"
          >
            <UserCircle size={16} />
            <span className="hidden md:inline">{customerName}</span>
          </button>

          <AnimatePresence>
            {showLogin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full right-0 mt-2 w-48 bg-white border border-gold/30 shadow-lg z-50"
              >
                <div className="py-2">
                  <div className="px-4 py-2 text-xs text-black/50 uppercase tracking-wider border-b border-black/5">
                    Hello, {customerName}
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setShowLogin(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-black-dark hover:bg-primary-light/20 transition-colors"
                  >
                    <UserCircle size={16} className="text-black/40" />
                    My Account
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-black-dark hover:bg-primary-light/20 transition-colors"
                  >
                    <LogOut size={16} className="text-black/40" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}