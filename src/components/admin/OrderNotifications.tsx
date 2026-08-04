'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Bell, ShoppingBag } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface NotificationOrder {
  _id: string
  orderNumber?: string
  customerName: string
  total: number
  createdAt: string
  status: string
}

const STORAGE_KEY = 'amapels_last_seen_order'

export default function OrderNotifications() {
  const [orders, setOrders] = useState<NotificationOrder[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getLastSeen = useCallback((): string => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem(STORAGE_KEY) || ''
  }, [])

  const setLastSeen = useCallback((createdAt: string) => {
    localStorage.setItem(STORAGE_KEY, createdAt)
  }, [])

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders?limit=8')
      if (!res.ok) return
      const data = await res.json()
      const list: NotificationOrder[] = (data.orders || []).map((o: any) => ({
        _id: o._id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        total: o.total,
        createdAt: o.createdAt,
        status: o.status,
      }))

      setOrders(list)
      setLoading(false)

      if (list.length > 0) {
        const lastSeen = getLastSeen()
        const newest = list[0].createdAt
        if (!lastSeen || newest > lastSeen) {
          setUnreadCount(list.filter((o) => o.createdAt > lastSeen).length)
        } else {
          setUnreadCount(0)
        }
      }
    } catch {
      setLoading(false)
    }
  }, [getLastSeen])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleOpen = () => {
    setOpen(!open)
    if (!open && orders.length > 0) {
      setUnreadCount(0)
      setLastSeen(orders[0].createdAt)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleOpen}
        className="relative p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} new)` : ''}`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-black/10 shadow-xl rounded-xl overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/5">
              <h3 className="text-sm font-semibold text-black">New Orders</h3>
              <Link
                href="/admin/orders"
                onClick={() => setOpen(false)}
                className="text-xs text-black/60 hover:text-black transition-colors"
              >
                View all
              </Link>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="px-4 py-6 text-center text-sm text-black/50">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                  <ShoppingBag size={20} className="text-black/20" />
                  <p className="text-sm text-black/50">No orders yet</p>
                </div>
              ) : (
                orders.map((order, index) => (
                  <Link
                    key={order._id}
                    href="/admin/orders"
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-black/[0.03] ${
                      index < unreadCount ? 'bg-red-50/60' : ''
                    } ${index > 0 ? 'border-t border-black/[0.04]' : ''}`}
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-black/5">
                      <ShoppingBag size={15} className="text-black/50" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-black">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-black/50">
                        {order.orderNumber ? `${order.orderNumber} · ` : ''}
                        ₦{order.total.toLocaleString()}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] text-black/40">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
