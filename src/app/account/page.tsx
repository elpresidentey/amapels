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
      case 'paid': case 'delivered': return 'text-success bg-success-soft border-success-line'
      case 'pending': return 'text-warning bg-warning-soft border-warning-line'
      case 'cancelled': return 'text-danger bg-danger-soft border-danger-line'
      case 'shipped': return 'text-info bg-info-soft border-info-line'
      default: return 'text-ink/65 bg-ink/[0.04] border-ink/10'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease }}
      className="border border-gold/20 bg-chrome transition-all duration-300 hover:border-gold/40 hover:shadow-[0_4px_20px_-8px_rgba(196,163,90,0.12)]"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-6 py-5 text-left sm:px-8 min-h-[52px]"
        aria-expanded={expanded}
        aria-controls={`order-details-${order.id}`}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-ink/60">Order</p>
            <p className="mt-0.5 font-serif text-base font-light text-ink sm:text-lg">
              {order.orderNumber}
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <span className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] ${statusColor(order.status)}`}>
              {order.status}
            </span>
            <span className="text-[11px] text-ink/60">{createdDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="hidden font-serif text-base text-gold-ink sm:block">
            ₦{order.total.toLocaleString()}
          </p>
          {expanded ? <ChevronUp size={16} strokeWidth={1.3} className="text-ink/60" /> : <ChevronDown size={16} strokeWidth={1.3} className="text-ink/60" />}
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
            <div className="border-t border-gold/15 px-4 py-4 sm:px-8 sm:py-8">
              <div className="mb-4 space-y-3 sm:mb-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-ink/60 sm:text-[9px]">Items</p>
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-ink/70">{item.name} <span className="text-ink/60">×{item.quantity}</span></span>
                    <span className="font-medium text-ink">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="mb-6 space-y-1.5 border-t border-ink/[0.06] pt-4 text-sm">
                <div className="flex justify-between text-ink/65">
                  <span>Subtotal</span>
                  <span>₦{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium text-ink">
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

              <div className="rounded border border-ink/[0.06] bg-surface-2 px-4 py-3">
                <div className="flex items-start gap-3">
                  <MapPin size={14} strokeWidth={1.3} className="mt-0.5 shrink-0 text-ink/60" />
                  <div className="text-[11px] leading-relaxed text-ink/65">
                    <p className="font-medium text-ink">Shipping to</p>
                    <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}</p>
                  </div>
                </div>
              </div>

              {!order.trackingNumber && (
                <div className="mt-4">
                  <Link
                    href={`/track-order?orderNumber=${order.orderNumber}`}
                    className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-gold-ink hover:text-ink transition-colors"
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
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border border-ink/25 border-t-gold-ink" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper pt-24">
      {/* Header */}
      <section className="border-b border-ink/[0.06] bg-chrome px-4 py-10 sm:px-6 sm:py-16 md:px-12 md:py-20 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.38em] text-ink/60 sm:mb-4">
              My Account
            </p>
            <h1 className="font-serif text-2xl font-light text-ink sm:text-3xl md:text-4xl">
              Welcome back, {session?.name || 'Friend'}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink/65 sm:mt-4">
              Your order history and account details, all in one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4"
          >
            <div className="col-span-2 flex items-center gap-3 border border-gold/15 bg-surface-2 px-4 py-3 sm:col-span-1 sm:gap-4 sm:px-5 sm:py-4">
              <Mail size={16} strokeWidth={1.3} className="shrink-0 text-gold-ink" />
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-ink/60 sm:text-[9px]">Email</p>
                <p className="truncate text-sm text-ink">{session?.email || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border border-gold/15 bg-surface-2 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4">
              <Package size={16} strokeWidth={1.3} className="shrink-0 text-gold-ink" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-ink/60 sm:text-[9px]">Orders</p>
                <p className="text-sm text-ink">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 border border-ink/10 px-3 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-ink/65 transition-all hover:border-red/30 hover:bg-red/[0.04] hover:text-red sm:px-5 sm:py-4"
            >
              <LogOut size={14} strokeWidth={1.3} />
              Sign Out
            </button>
          </motion.div>
        </div>
      </section>

      {/* Order History */}
      <section className="px-4 py-12 sm:px-6 sm:py-20 md:px-12 md:py-24 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="mb-6 flex flex-col gap-3 border-b border-ink/[0.06] pb-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:pb-8"
          >
            <div>
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.38em] text-ink/60 sm:mb-3">
                Order History
              </p>
              <h2 className="font-serif text-xl font-light text-ink sm:text-3xl">
                Pieces you&apos;ve loved
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-ink transition-colors hover:text-gold-ink"
            >
              Continue Shopping
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {loading || ordersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse border border-gold/20 px-6 py-5 sm:px-8">
                  <div className="mb-2 h-3 w-48 rounded-full bg-ink/[0.04]" />
                  <div className="h-3 w-32 rounded-full bg-ink/[0.04]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 rounded border border-dashed border-ink/10 py-10 text-center sm:py-16">
              <AlertCircle size={24} strokeWidth={1.3} className="text-ink/60" />
              <p className="text-sm text-ink/65">{error}</p>
              <button
                type="button"
                onClick={fetchOrders}
                className="text-[10px] font-medium uppercase tracking-[0.22em] text-gold-ink underline underline-offset-4"
              >
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="flex flex-col items-center gap-6 rounded border border-dashed border-gold/20 py-12 text-center sm:py-20"
            >
              <ShoppingBag size={32} strokeWidth={1.2} className="text-gold-ink/60" />
              <div>
                <p className="font-serif text-xl font-light text-ink">No orders yet</p>
                <p className="mt-2 text-sm text-ink/60">Your order history will appear here once you make your first purchase.</p>
              </div>
              <Link
                href="/shop"
                className="btn-premium inline-flex items-center gap-2 bg-ink px-6 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-on-ink transition-all hover:bg-ink/90"
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