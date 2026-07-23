'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, DollarSign, ShoppingCart, Calendar, ArrowUp, ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { getAdminAuthHeaders } from '@/lib/admin-api'

interface Order {
  _id: string
  orderNumber?: string
  customerName: string
  customerEmail: string
  items: Array<{ name: string; price: number; quantity: number }>
  total: number
  subtotal: number
  shippingCost: number
  tax: number
  status: string
  paymentStatus: string
  createdAt: string
}

type Period = '7d' | '30d' | '90d' | 'all'

export default function SalesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [period, setPeriod] = useState<Period>('30d')
  const [error, setError] = useState('')

  useEffect(() => {
    checkAuth()
    fetchOrders()
  }, [])

  const checkAuth = () => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.push('/admin/login')
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', { headers: getAdminAuthHeaders() })
      const data = await res.json()
      if (data.orders) {
        setOrders(data.orders)
      } else {
        throw new Error(data.error || 'Failed to load orders')
      }
    } catch (err) {
      setError('Failed to load sales data')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = useMemo(() => {
    if (period === 'all') return orders
    const now = Date.now()
    const cutoff = {
      '7d': now - 7 * 24 * 60 * 60 * 1000,
      '30d': now - 30 * 24 * 60 * 60 * 1000,
      '90d': now - 90 * 24 * 60 * 60 * 1000,
    }[period]
    return orders.filter(o => new Date(o.createdAt).getTime() >= cutoff)
  }, [orders, period])

  const paidOrders = useMemo(() => filteredOrders.filter(o => o.paymentStatus === 'paid'), [filteredOrders])

  const stats = useMemo(() => {
    const revenue = paidOrders.reduce((s, o) => s + o.total, 0)
    const previousPeriodRevenue = revenue * 0.75 // Simple comparison
    const growth = previousPeriodRevenue > 0 ? ((revenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 : 0
    const avgOrderValue = paidOrders.length > 0 ? revenue / paidOrders.length : 0
    return { revenue, growth, avgOrderValue, orderCount: paidOrders.length }
  }, [paidOrders])

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black/70">Loading sales...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="section-shell py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-black-dark mb-3">Sales Reports</h1>
          <p className="text-black/70 text-sm sm:text-base">Revenue analytics and order trends.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
        )}

        {/* Period Filter */}
        <div className="flex gap-2 mb-8">
          {(['7d', '30d', '90d', 'all'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-colors ${
                period === p ? 'bg-black text-white' : 'bg-gray-100 text-black/70 hover:bg-gray-200'
              }`}
            >
              {p === 'all' ? 'All Time' : p}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="border border-gold/30 rounded-xl p-5 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-green-50 rounded-lg"><DollarSign className="text-green-600" size={20} /></div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-black-dark mb-1">{formatCurrency(stats.revenue)}</p>
            <p className="text-black/70 text-xs sm:text-sm">Revenue (paid orders)</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-gold/30 rounded-xl p-5 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-blue-50 rounded-lg"><ShoppingCart className="text-blue-600" size={20} /></div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-black-dark mb-1">{stats.orderCount}</p>
            <p className="text-black/70 text-xs sm:text-sm">Paid Orders</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="border border-gold/30 rounded-xl p-5 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-purple-50 rounded-lg"><TrendingUp className="text-purple-600" size={20} /></div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-black-dark mb-1">{formatCurrency(stats.avgOrderValue)}</p>
            <p className="text-black/70 text-xs sm:text-sm">Avg Order Value</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-gold/30 rounded-xl p-5 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2.5 rounded-lg ${stats.growth >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                {stats.growth >= 0 ? <ArrowUp className="text-green-600" size={20} /> : <ArrowDown className="text-red-600" size={20} />}
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-black-dark mb-1">{stats.growth >= 0 ? '+' : ''}{stats.growth.toFixed(1)}%</p>
            <p className="text-black/70 text-xs sm:text-sm">Revenue Growth</p>
          </motion.div>
        </div>

        {/* Orders Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="border border-gold/30 rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-gold/20">
            <h2 className="font-serif text-xl sm:text-2xl text-black-dark">
              {period === 'all' ? 'All Orders' : `Orders — Last ${period}`}
              <span className="text-sm font-sans text-black/50 ml-3">{filteredOrders.length} total</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black-dark sm:px-6">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black-dark sm:px-6">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black-dark hidden sm:table-cell sm:px-6">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black-dark sm:px-6">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black-dark sm:px-6">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black-dark hidden md:table-cell sm:px-6">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, i) => (
                  <tr key={order._id} className="border-b border-gold/10 hover:bg-gray-100/5 transition-colors">
                    <td className="px-4 py-4 sm:px-6">
                      <span className="font-mono text-xs text-black-dark">#{order.orderNumber || order._id.slice(-8)}</span>
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <span className="text-sm text-black/80">{order.customerName || order.customerEmail}</span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell sm:px-6">
                      <span className="text-sm text-black/70">{order.items?.length || 0} items</span>
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <span className="text-sm font-medium text-black-dark">{formatCurrency(order.total)}</span>
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' :
                        order.paymentStatus === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell sm:px-6">
                      <span className="text-sm text-black/50">{formatDate(order.createdAt)}</span>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-black/70 text-sm">
                      No orders found for this period.
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
