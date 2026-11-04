'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { verifyAdminSession, logoutAdmin } from '@/lib/auth'
import { Home, Package, ShoppingCart, BarChart3, FileText, Mail, LogOut, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import OrderNotifications from '@/components/admin/OrderNotifications'
import Logo from '@/components/Logo'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const IDLE_TIMEOUT_MS = 2 * 60 * 1000

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Sales', href: '/admin/sales', icon: BarChart3 },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Newsletter', href: '/admin/subscribers', icon: Mail }
  ]

  useEffect(() => {
    let cancelled = false

    const checkAuth = async () => {
      const authenticated = await verifyAdminSession()

      if (cancelled) return

      if (!authenticated) {
        if (pathname !== '/admin/login') {
          setIsAuthenticated(false)
          setLoading(false)
          router.push('/admin/login')
          return
        }
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(true)
        if (pathname === '/admin/login') {
          setTimeout(() => router.push('/admin'), 100)
        }
      }
      setLoading(false)
    }

    checkAuth()
    const interval = setInterval(checkAuth, 60000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [router, pathname])

  useEffect(() => {
    if (pathname === '/admin/login') return

    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        logoutAdmin()
        router.push('/admin/login')
      }, IDLE_TIMEOUT_MS)
    }

    const events: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach((event) => window.addEventListener(event, resetIdleTimer))
    resetIdleTimer()

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetIdleTimer))
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [pathname, router])

  const handleLogout = () => {
    logoutAdmin()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div data-theme="light" className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black/70">Loading...</p>
        </div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return (
      <div data-theme="light" className="min-h-screen bg-white">
        {children}
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div data-theme="light" className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-ivory/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/admin" className="flex items-center gap-3">
              <Logo variant="wordmark" tone="gold" className="h-6 w-40" priority />
              <span className="hidden sm:inline text-white/40 text-xs font-medium uppercase tracking-wider">
                / Admin
              </span>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gold text-black-dark'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon size={16} />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center gap-2">
              <OrderNotifications />
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden lg:inline">Logout</span>
              </button>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-ivory/10 bg-black/98 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-gold text-black-dark'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon size={18} />
                      {item.name}
                    </Link>
                  )
                })}
                
                <div className="border-t border-ivory/10 pt-2 mt-2 space-y-2">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    View Store
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-16 sm:pt-20">
        {children}
      </main>
    </div>
  )
}
