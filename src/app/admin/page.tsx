'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Package, ShoppingCart, DollarSign, TrendingUp, ArrowRight, Eye } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getAdminAuthHeaders } from '@/lib/admin-api'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  recentOrders: any[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  })

  useEffect(() => {
    checkAuth()
    fetchStats()
  }, [])

  const checkAuth = () => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.push('/admin/login')
    }
  }

  const fetchStats = async () => {
    try {
      // Fetch products
      const productsRes = await fetch('/api/products')
      const productsData = await productsRes.json()
      const totalProducts = productsData.success ? productsData.data.length : 0

      // Fetch orders
      const ordersRes = await fetch('/api/orders', { headers: getAdminAuthHeaders() })
      const ordersData = await ordersRes.json()
      const orders = ordersData.success ? ordersData.data : []
      
      // Calculate revenue
      const totalRevenue = orders.reduce((sum: number, order: any) => {
        return sum + (order.total || 0)
      }, 0)

      // Get recent orders (last 5)
      const recentOrders = orders
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

      setStats({
        totalProducts,
        totalOrders: orders.length,
        totalRevenue,
        recentOrders
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black/70">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="section-shell py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-black-dark mb-3">
            Admin Dashboard
          </h1>
          <p className="text-black/70 text-sm sm:text-base">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-4 lg:gap-6 xl:gap-8">
          {/* Total Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl sm:rounded-2xl border border-gold/30 p-5 sm:p-6 hover:shadow-lg transition-shadow min-h-[140px] flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="p-2.5 sm:p-3 bg-blue-50 rounded-lg sm:rounded-xl">
                <Package className="text-blue-600" size={20} />
              </div>
              <Link
                href="/admin/products"
                className="text-black/60 hover:text-black-dark transition-colors p-1"
              >
                <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
              </Link>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-black-dark mb-1">
                {stats.totalProducts}
              </h3>
              <p className="text-black/70 text-xs sm:text-sm">Total Products</p>
            </div>
          </motion.div>

          {/* Total Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl sm:rounded-2xl border border-gold/30 p-5 sm:p-6 hover:shadow-lg transition-shadow min-h-[140px] flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="p-2.5 sm:p-3 bg-green-50 rounded-lg sm:rounded-xl">
                <ShoppingCart className="text-green-600" size={20} />
              </div>
              <Link
                href="/admin/orders"
                className="text-black/60 hover:text-black-dark transition-colors p-1"
              >
                <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
              </Link>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-black-dark mb-1">
                {stats.totalOrders}
              </h3>
              <p className="text-black/70 text-xs sm:text-sm">Total Orders</p>
            </div>
          </motion.div>

          {/* Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl sm:rounded-2xl border border-gold/30 p-5 sm:p-6 hover:shadow-lg transition-shadow min-h-[140px] flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="p-2.5 sm:p-3 bg-accent-emerald/10 rounded-lg sm:rounded-xl">
                <DollarSign className="text-accent-emerald" size={20} />
              </div>
              <Link
                href="/admin/sales"
                className="text-black/60 hover:text-black-dark transition-colors p-1"
              >
                <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
              </Link>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black-dark mb-1 break-words">
                ₦{stats.totalRevenue.toLocaleString()}
              </h3>
              <p className="text-black/70 text-xs sm:text-sm">Total Revenue</p>
            </div>
          </motion.div>

          {/* Growth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl sm:rounded-2xl border border-gold/30 p-5 sm:p-6 hover:shadow-lg transition-shadow min-h-[140px] flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="p-2.5 sm:p-3 bg-accent-orange/10 rounded-lg sm:rounded-xl">
                <TrendingUp className="text-accent-orange" size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black-dark mb-1 break-words">
                ₦{stats.totalOrders > 0 ? '' : ''}
                {((stats.totalRevenue / Math.max(stats.totalOrders, 1))).toLocaleString('en-NG', { maximumFractionDigits: 0 })}
              </h3>
              <p className="text-black/70 text-xs sm:text-sm">Avg Order Value</p>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3">
          <Link
            href="/admin/products"
            className="bg-white rounded-xl border border-gold/30 p-5 sm:p-6 hover:border-black transition-all group min-h-[100px] flex items-center"
          >
            <div className="flex items-center justify-between w-full gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-black-dark mb-1 text-sm sm:text-base">Manage Products</h3>
                <p className="text-black/70 text-xs sm:text-sm">Add, edit, or remove products</p>
              </div>
              <ArrowRight className="text-black/40 group-hover:text-black-dark group-hover:translate-x-1 transition-all flex-shrink-0" size={18} />
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white rounded-xl border border-gold/30 p-5 sm:p-6 hover:border-black transition-all group min-h-[100px] flex items-center"
          >
            <div className="flex items-center justify-between w-full gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-black-dark mb-1 text-sm sm:text-base">View Orders</h3>
                <p className="text-black/70 text-xs sm:text-sm">Track and manage customer orders</p>
              </div>
              <ArrowRight className="text-black/40 group-hover:text-black-dark group-hover:translate-x-1 transition-all flex-shrink-0" size={18} />
            </div>
          </Link>

          <Link
            href="/admin/sales"
            className="bg-white rounded-xl border border-gold/30 p-5 sm:p-6 hover:border-black transition-all group min-h-[100px] flex items-center sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between w-full gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-black-dark mb-1 text-sm sm:text-base">Sales Reports</h3>
                <p className="text-black/70 text-xs sm:text-sm">View sales analytics and trends</p>
              </div>
              <ArrowRight className="text-black/40 group-hover:text-black-dark group-hover:translate-x-1 transition-all flex-shrink-0" size={18} />
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl border border-gold/30 overflow-hidden"
        >
          <div className="p-6 border-b border-gold/20 flex justify-between items-center">
            <h2 className="font-serif text-xl sm:text-2xl text-black-dark">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-black-dark hover:text-black transition-colors flex items-center gap-1"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-black-dark">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-black-dark">Customer</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-black-dark hidden sm:table-cell">Items</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-black-dark">Total</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-black-dark">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order, index) => (
                  <tr key={order._id || index} className="border-b border-gold/10 hover:bg-gray-100/5 transition-colors">
                    <td className="px-4 py-4 text-xs sm:text-sm text-black-dark font-mono">
                      #{order._id?.slice(-6) || 'N/A'}
                    </td>
                    <td className="px-4 py-4 text-xs sm:text-sm text-black/80">
                      {order.customerName || order.customerEmail || 'Guest'}
                    </td>
                    <td className="px-4 py-4 text-xs sm:text-sm text-black/80 hidden sm:table-cell">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-4 py-4 text-xs sm:text-sm text-black-dark font-medium">
                      ₦{(order.total || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-50 text-green-700'
                          : order.paymentStatus === 'pending'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {order.paymentStatus || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
                {stats.recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-black/70 text-sm">
                      No orders yet. Orders will appear here once customers start making purchases.
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

