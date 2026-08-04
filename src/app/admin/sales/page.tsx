'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DollarSign, ShoppingCart, TrendingUp, Wallet, Package, Search } from 'lucide-react'
import { motion } from 'framer-motion'

interface SaleItem {
  name: string
  price: number
  quantity: number
  image?: string
}

interface SaleOrder {
  _id: string
  orderNumber?: string
  customerName: string
  customerEmail: string
  items: SaleItem[]
  total: number
  status: string
  paymentStatus: string
  createdAt: string
}

interface ProductStat {
  name: string
  quantity: number
  revenue: number
  image?: string
}

const ORDER_STATUSES = ['all', 'pending', 'paid', 'shipped', 'delivered', 'cancelled']

const toNumber = (value: any): number => {
  const n = typeof value === 'string' ? parseFloat(value.replace(/[₦,]/g, '')) : Number(value)
  return isNaN(n) ? 0 : n
}

const formatNaira = (value: number) => `₦${Math.round(value).toLocaleString()}`

export default function SalesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<SaleOrder[]>([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  const checkAuth = useCallback(() => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.push('/admin/login')
    }
  }, [router])

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch('/api/orders?limit=100')
      if (!res.ok) throw new Error('Failed to load orders')
      const data = await res.json()
      setOrders(data.orders || [])
    } catch {
      setError('Could not load sales data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
    fetchOrders()
  }, [checkAuth, fetchOrders])

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === 'all' || order.paymentStatus === filter || order.status === filter
    if (!matchesFilter) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      order.customerName?.toLowerCase().includes(q) ||
      order.customerEmail?.toLowerCase().includes(q) ||
      (order.items || []).some((item) => item.name.toLowerCase().includes(q))
    )
  })

  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid')
  const totalRevenue = paidOrders.reduce((sum, o) => sum + toNumber(o.total), 0)
  const totalOrders = orders.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const now = new Date()
  const thisMonthOrders = orders.filter((o) => {
    const d = new Date(o.createdAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const thisMonthRevenue = thisMonthOrders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + toNumber(o.total), 0)

  const productMap = new Map<string, ProductStat>()
  orders.forEach((order) => {
    ;(order.items || []).forEach((item) => {
      const key = item.name
      const price = toNumber(item.price)
      const qty = Math.max(toNumber(item.quantity), 1)
      const prev = productMap.get(key)
      if (prev) {
        prev.quantity += qty
        prev.revenue += price * qty
      } else {
        productMap.set(key, {
          name: key,
          quantity: qty,
          revenue: price * qty,
          image: item.image,
        })
      }
    })
  })
  const productStats = Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue)

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      paid: 'bg-green-50 text-green-700 border-green-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      shipped: 'bg-blue-50 text-blue-700 border-blue-200',
      delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
    }
    return (
      <span className={`inline-block border px-2.5 py-1 rounded-full text-xs font-medium ${map[status] || 'bg-gray-50 text-black/60 border-black/10'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black/70">Loading sales reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="section-shell py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-black-dark mb-3">
            Sales Reports
          </h1>
          <p className="text-black/70 text-sm sm:text-base">
            Revenue, top pieces, and transaction history at a glance.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
            <button onClick={fetchOrders} className="ml-3 underline underline-offset-2">Retry</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-4 lg:gap-6 xl:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl sm:rounded-2xl border border-gold/30 p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2.5 sm:p-3 bg-green-50 rounded-lg sm:rounded-xl">
                <DollarSign className="text-green-600" size={20} />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black-dark mb-1 break-words">
              {formatNaira(totalRevenue)}
            </h3>
            <p className="text-black/70 text-xs sm:text-sm">Total Revenue (Paid)</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl sm:rounded-2xl border border-gold/30 p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2.5 sm:p-3 bg-blue-50 rounded-lg sm:rounded-xl">
                <ShoppingCart className="text-blue-600" size={20} />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-black-dark mb-1">
              {totalOrders}
            </h3>
            <p className="text-black/70 text-xs sm:text-sm">Total Orders</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl sm:rounded-2xl border border-gold/30 p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2.5 sm:p-3 bg-accent-orange/10 rounded-lg sm:rounded-xl">
                <TrendingUp className="text-accent-orange" size={20} />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black-dark mb-1 break-words">
              {formatNaira(avgOrderValue)}
            </h3>
            <p className="text-black/70 text-xs sm:text-sm">Avg Order Value</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl sm:rounded-2xl border border-gold/30 p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2.5 sm:p-3 bg-accent-emerald/10 rounded-lg sm:rounded-xl">
                <Wallet className="text-accent-emerald" size={20} />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black-dark mb-1 break-words">
              {formatNaira(thisMonthRevenue)}
            </h3>
            <p className="text-black/70 text-xs sm:text-sm">This Month ({now.toLocaleDateString('en-US', { month: 'long' })})</p>
          </motion.div>
        </div>

        {/* Sales by Product */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white rounded-2xl border border-gold/30 overflow-hidden mb-8"
        >
          <div className="p-6 border-b border-gold/20">
            <h2 className="font-serif text-xl sm:text-2xl text-black-dark">Sales by Product</h2>
            <p className="text-black/60 text-xs sm:text-sm mt-1">Best-selling pieces and their revenue</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-black-dark">Product</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-black-dark">Units Sold</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-black-dark">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-black-dark hidden md:table-cell">Share</th>
                </tr>
              </thead>
              <tbody>
                {productStats.map((stat, index) => {
                  const share = totalRevenue > 0 ? (stat.revenue / totalRevenue) * 100 : 0
                  return (
                    <tr key={stat.name} className="border-b border-gold/10 hover:bg-gray-100/5 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {stat.image && (
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={stat.image} alt={stat.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <span className="text-xs sm:text-sm text-black-dark font-medium">{stat.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs sm:text-sm text-black/80">{stat.quantity}</td>
                      <td className="px-4 py-4 text-xs sm:text-sm text-black-dark font-medium">{formatNaira(stat.revenue)}</td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 rounded-full bg-gold/15 overflow-hidden">
                            <div className="h-full rounded-full bg-gold" style={{ width: `${Math.min(share, 100)}%` }} />
                          </div>
                          <span className="text-xs text-black/50">{share.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {productStats.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-black/70 text-sm">
                      No sales yet. Revenue will appear here once orders come in.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="bg-white rounded-2xl border border-gold/30 overflow-hidden"
        >
          <div className="p-6 border-b border-gold/20 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-black-dark">Transactions</h2>
              <p className="text-black/60 text-xs sm:text-sm mt-1">All customer orders</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customer or product..."
                  className="w-full sm:w-56 pl-9 pr-3 py-2 border border-gold rounded-lg text-sm focus:ring-2 focus:ring-brown/20 focus:border-black outline-none"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gold rounded-lg focus:ring-2 focus:ring-brown/20 focus:border-black outline-none text-sm"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-black-dark">Customer</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-black-dark hidden sm:table-cell">Items</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-black-dark">Total</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-black-dark">Payment</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-black-dark">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order._id || index} className="border-b border-gold/10 hover:bg-gray-100/5 transition-colors">
                    <td className="px-4 py-4">
                      <p className="text-xs sm:text-sm text-black-dark font-medium">{order.customerName || 'Guest'}</p>
                      <p className="text-xs text-black/50 hidden md:block">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-4 text-xs sm:text-sm text-black/80 hidden sm:table-cell">
                      {order.items?.map((item) => item.name).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-4 text-xs sm:text-sm text-black-dark font-medium">
                      {formatNaira(toNumber(order.total))}
                    </td>
                    <td className="px-4 py-4">{statusBadge(order.paymentStatus || order.status)}</td>
                    <td className="px-4 py-4 text-xs sm:text-sm text-black/60 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-black/70 text-sm">
                      <Package size={24} className="mx-auto mb-2 text-black/20" />
                      No transactions match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
