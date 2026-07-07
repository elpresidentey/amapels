'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getAdminSession, clearAdminSession } from '@/lib/auth'
import { Home, Package, ShoppingCart, BarChart3, LogOut, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import '../globals.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Sales', href: '/admin/sales', icon: BarChart3 }
  ]

  useEffect(() => {
    const checkAuth = () => {
      const session = getAdminSession()
      
      if (!session) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(true)
        if (pathname === '/admin/login') {
          // Delay redirect to avoid React error #423
          setTimeout(() => router.push('/admin'), 100)
        }
      }
      setLoading(false)
    }

    checkAuth()
    
    // Check auth status every minute
    const interval = setInterval(checkAuth, 60000)
    
    return () => clearInterval(interval)
  }, [router, pathname])

  const handleLogout = () => {
    clearAdminSession()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <html lang="en">
        <body>
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-black/70">Loading...</p>
            </div>
          </div>
        </body>
      </html>
    )
  }

  // Show login page without admin layout
  if (pathname === '/admin/login') {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <html lang="en">
      <head>
        <title>AMAPELS Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body>
        <div className="min-h-screen bg-white">
          {/* Admin Navbar */}
          <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-ivory/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16 sm:h-20">
                {/* Logo */}
                <Link href="/admin" className="flex items-center gap-3">
                  <div className="font-serif text-lg sm:text-xl font-light tracking-[0.25em] text-white uppercase">
                    AMAPELS
                  </div>
                  <span className="hidden sm:inline text-white/40 text-xs font-medium uppercase tracking-wider">
                    / Admin
                  </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-white/10 text-white'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon size={16} />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Link
                    href="/"
                    className="hidden sm:inline-flex text-xs text-white/70 hover:text-white transition-colors uppercase tracking-wider"
                  >
                    View Store
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                  
                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden border-t border-ivory/10 bg-black/98 backdrop-blur-xl"
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
                              ? 'bg-white/10 text-white'
                              : 'text-white/70 hover:text-white hover:bg-white/5'
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

          {/* Main Content */}
          <main className="pt-16 sm:pt-20">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

