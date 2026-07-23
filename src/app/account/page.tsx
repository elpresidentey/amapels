'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, Mail, Package, Clock, ChevronRight, ArrowRight, LogOut,
  ShoppingBag, MapPin, CreditCard, AlertCircle, ChevronDown, ChevronUp, Truck, ExternalLink
} from 'lucide-react'
import {
  getCachedSession,
  customerLogout,
  isCustomerAuthenticated,
  getServerSession,
} from '@/lib/customerAuth'

const ease = [0.22, 1, 0.36, 1] as const

interface OrderSummary {
  id: string
  orderNumber: string
  items: Array<{ name: string; quantity: number; price: number; image?: string }>
  total: number
  subtotal: number
  status: string
  paymentStatus: string
  trackingNumber?: string
  createdAt: string
  shippingAddress: {
    street: string
    city: string
    state: string
    country: string
  }
}

function OrderCard({ order, index }: { order: OrderSummary; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const createdDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const statusColor = (status: string) => {
    switch (status) {
      case 'paid': case 'delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-200'
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200'
      case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-black/50 bg-black/[0.04] border-black/10'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease }}
      className="border border-gold/20 bg-white transition-all duration-300 hover:border-gold/40 hover:shadow-[0_4px_20px_-8px_rgba(196,163,90,0.12)]"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-6 py-5 text-left sm:px-8"
        aria-expanded={expanded}
        aria-controls={`order-details-${order.id}`}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-black/40">Order</p>
            <p className="mt-0.5 font-serif text-base font-light text-black-dark sm:text-lg">
              {order.orderNumber}
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.18em] ${statusColor(order.status)}`}>
              {order.status}
            </span>
            <span className="text-[11px] text-black/45">{createdDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="hidden font-serif text-base text-gold-dark sm:block">
            ₦{order.total.toLocaleString()}
          </p>
          {expanded ? <ChevronUp size={16} strokeWidth={1.3} className="text-black/30" /> : <ChevronDown size={16} strokeWidth={1.3} className="text-black/30" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            id={`order-details-${order.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden"
          >
            <div className="border-t border-gold/15 px-6 py-6 sm:px-8 sm:py-8">
              <div className="mb-6 space-y-3">
                <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-black/40">Items</p>
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-black/70">{item.name} <span className="text-black/40">×{item.quantity}</span></span>
                    <span className="font-medium text-black-dark">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="mb-6 space-y-1.5 border-t border-black/[0.06] pt-4 text-sm">
                <div className="flex justify-between text-black/50">
                  <span>Subtotal</span>
                  <span>₦{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium text-black-dark">
                  <span>Total</span>
                  <span>₦{order.total.toLocaleString()}</span>
                </div>
              </div>

              {order.trackingNumber && (
                <div className="mb-4 rounded border border-purple/10 bg-purple-50/30 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <Truck size={14} strokeWidth={1.3} className="mt-0.5 shrink-0 text-purple-600" />
                    <div className="text-[11px] leading-relaxed">
                      <p className="font-medium text-purple-800">Tracking Number</p>
                      <p className="font-mono text-purple-700 mt-0.5">{order.trackingNumber}</p>
                      <Link
                        href={`/track-order?orderNumber=${order.orderNumber}&trackingNumber=${order.trackingNumber}`}
                        className="inline-flex items-center gap-1 mt-2 text-[10px] font-medium uppercase tracking-wider text-purple-700 hover:text-purple-900 underline underline-offset-2"
                      >
                        Track Package <ExternalLink size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded border border-black/[0.06] bg-[#faf8f5] px-4 py-3">
                <div className="flex items-start gap-3">
                  <MapPin size={14} strokeWidth={1.3} className="mt-0.5 shrink-0 text-black/40" />
                  <div className="text-[11px] leading-relaxed text-black/55">
                    <p className="font-medium text-black-dark">Shipping to</p>
                    <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}</p>
                  </div>
                </div>
              </div>

              {!order.trackingNumber && (
                <div className="mt-4">
                  <Link
                    href={`/track-order?orderNumber=${order.orderNumber}`}
                    className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-gold-dark hover:text-black-dark transition-colors"
                  >
                    <Truck size={12} strokeWidth={1.5} />
                    Track Order <ArrowRight size={11} />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AccountPage() {
  const router = useRouter()
  const [session, setSession] = useState<{ email: string; name: string } | null>(null)
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const init = async () => {
      const authenticated = await isCustomerAuthenticated()
      if (!authenticated) {
        router.push('/')
        return
      }
      const s = getCachedSession() || await getServerSession()
      setSession(s)
      setCheckingAuth(false)
    }
    init()
  }, [router])

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true)
    try {
      const res = await fetch('/api/orders/customer', { credentials: 'include' })
      const data = await res.json()
      if (res.ok) {
        setOrders(data.orders || [])
      } else {
        setError(data.error || 'Failed to load orders')
      }
    } catch {
      setError('Could not load your order history')
    } finally {
      setOrdersLoading(false)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!checkingAuth && session) fetchOrders()
  }, [fetchOrders, checkingAuth, session])

  const handleLogout = async () => {
    await customerLogout()
    router.push('/')
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border border-gold/30 border-t-gold" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary pt-24">
      {/* Header */}
      <section className="border-b border-black/[0.06] bg-white px-4 py-12 sm:px-6 sm:py-16 md:px-12 md:py-20 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.38em] text-black/40">
              My Account
            </p>
            <h1 className="font-serif text-3xl font-light text-black-dark sm:text-4xl md:text-5xl">
              Welcome back, {session?.name || 'Friend'}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-black/55">
              Your order history and account details, all in one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="mt-8 grid gap-4 sm:grid-cols-3"
          >
            <div className="flex items-center gap-4 border border-gold/15 bg-[#faf8f5] px-5 py-4">
              <Mail size={16} strokeWidth={1.3} className="shrink-0 text-gold-dark" />
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-black/40">Email</p>
                <p className="text-sm text-black-dark">{session?.email || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border border-gold/15 bg-[#faf8f5] px-5 py-4">
              <Package size={16} strokeWidth={1.3} className="shrink-0 text-gold-dark" />
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-black/40">Orders</p>
                <p className="text-sm text-black-dark">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 border border-black/10 px-5 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-black/50 transition-all hover:border-red/30 hover:bg-red/[0.04] hover:text-red"
            >
              <LogOut size={14} strokeWidth={1.3} />
              Sign Out
            </button>
          </motion.div>
        </div>
      </section>

      {/* Order History */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-24 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="mb-10 flex flex-col gap-4 border-b border-black/[0.06] pb-8 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.38em] text-black/40">
                Order History
              </p>
              <h2 className="font-serif text-2xl font-light text-black-dark sm:text-3xl">
                Pieces you&apos;ve loved
              </h2>
            </div>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black-dark transition-colors hover:text-gold-dark"
            >
              Continue Shopping
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {loading || ordersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse border border-gold/20 px-6 py-5 sm:px-8">
                  <div className="mb-2 h-3 w-48 rounded-full bg-black/[0.04]" />
                  <div className="h-3 w-32 rounded-full bg-black/[0.04]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 rounded border border-dashed border-black/10 py-16 text-center">
              <AlertCircle size={24} strokeWidth={1.3} className="text-black/30" />
              <p className="text-sm text-black/55">{error}</p>
              <button
                type="button"
                onClick={fetchOrders}
                className="text-[10px] font-medium uppercase tracking-[0.22em] text-gold-dark underline underline-offset-4"
              >
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="flex flex-col items-center gap-6 rounded border border-dashed border-gold/20 py-20 text-center"
            >
              <ShoppingBag size={32} strokeWidth={1.2} className="text-gold/40" />
              <div>
                <p className="font-serif text-xl font-light text-black-dark">No orders yet</p>
                <p className="mt-2 text-sm text-black/45">Your order history will appear here once you make your first purchase.</p>
              </div>
              <Link
                href="/shop"
                className="btn-premium inline-flex items-center gap-2 bg-black-dark px-6 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all hover:bg-black"
              >
                <ShoppingBag size={13} strokeWidth={1.5} />
                Shop Now
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {orders.map((order, index) => (
                <OrderCard key={order.id} order={order} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}