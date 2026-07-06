'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Eye, CheckCircle, Clock, X } from 'lucide-react'
import Toast from '@/components/Toast'

interface Order {
  _id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  shippingAddress: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  paymentReference: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  shippingCost: number
  total: number
  createdAt: string
  updatedAt: string
}

const ORDER_STATUSES = [
  'pending',
  'processing', 
  'shipped',
  'delivered',
  'cancelled'
] as const

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

const STATUS_ICONS = {
  pending: Clock,
  processing: Package,
  shipped: Package,
  delivered: CheckCircle,
  cancelled: X
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    checkAuth()
    fetchOrders()
  }, [statusFilter])

  const checkAuth = () => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.push('/admin/login')
    }
  }

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const url = statusFilter === 'all' 
        ? '/api/orders'
        : `/api/orders?status=${statusFilter}`
      
      const response = await fetch(url)
      const result = await response.json()

      if (result.orders) {
        setOrders(result.orders)
      } else {
        throw new Error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      showToastMessage('Failed to load orders', 'error')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      const result = await response.json()

      if (result.success) {
        showToastMessage('Order status updated successfully!')
        fetchOrders()
        setShowModal(false)
      } else {
        throw new Error(result.error || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      showToastMessage('Failed to update order status', 'error')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brown-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brown/70">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16">
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      <div className="section-shell">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-brown-dark">Order Management</h1>
          
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-sand rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-brown-dark outline-none text-sm"
            >
              <option value="all">All Orders</option>
              {ORDER_STATUSES.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl md:rounded-3xl border border-sand/30 overflow-hidden">
          {/* Mobile Orders */}
          <div className="block lg:hidden">
            <div className="p-4 space-y-4">
              {orders.map((order) => {
                const StatusIcon = STATUS_ICONS[order.status]
                return (
                  <div key={order._id} className="border border-sand/20 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-brown-dark text-sm mb-1">
                          {order.customerName}
                        </h3>
                        <p className="text-brown/70 text-xs mb-2">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]} flex items-center gap-1`}>
                        <StatusIcon size={12} />
                        {order.status}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-sand/20">
                      <div className="text-brown-dark font-medium text-sm">
                        {formatCurrency(order.total)}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowModal(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
              {orders.length === 0 && (
                <div className="text-center py-8 text-brown/70">
                  No orders found.
                </div>
              )}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sand/20">
                <tr>
                  <th className="px-6 py-4 text-left text-brown-dark font-medium">Order</th>
                  <th className="px-6 py-4 text-left text-brown-dark font-medium">Customer</th>
                  <th className="px-6 py-4 text-left text-brown-dark font-medium">Status</th>
                  <th className="px-6 py-4 text-left text-brown-dark font-medium">Total</th>
                  <th className="px-6 py-4 text-left text-brown-dark font-medium">Date</th>
                  <th className="px-6 py-4 text-left text-brown-dark font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const StatusIcon = STATUS_ICONS[order.status]
                  return (
                    <tr key={order._id} className="border-b border-sand/20">
                      <td className="px-6 py-4">
                        <div className="font-medium text-brown-dark text-sm">
                          #{order._id.slice(-8)}
                        </div>
                        <div className="text-brown/70 text-xs">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-brown-dark text-sm">
                          {order.customerName}
                        </div>
                        <div className="text-brown/70 text-xs">
                          {order.customerEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                          <StatusIcon size={12} />
                          {order.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-brown-dark">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4 text-brown/70 text-sm">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowModal(true)
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-brown/70">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl border border-sand/30 w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-sand/20 flex justify-between items-center">
                <h2 className="font-serif text-xl sm:text-2xl text-brown-dark">
                  Order Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-brown/70 hover:text-brown-dark hover:bg-sand/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-medium text-brown-dark mb-3">Customer Information</h3>
                  <div className="bg-sand/10 rounded-xl p-4 space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-medium text-brown-dark mb-3">Shipping Address</h3>
                  <div className="bg-sand/10 rounded-xl p-4">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-medium text-brown-dark mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-sand/10 rounded-xl">
                        <div className="w-12 h-12 bg-champagne/20 rounded-lg overflow-hidden">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-brown/70 text-xs">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="font-medium text-brown-dark mb-3">Order Summary</h3>
                  <div className="bg-sand/10 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{formatCurrency(selectedOrder.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t border-sand/30">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <h3 className="font-medium text-brown-dark mb-3">Update Status</h3>
                  <div className="flex gap-2 flex-wrap">
                    {ORDER_STATUSES.map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder._id, status)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          selectedOrder.status === status
                            ? 'bg-brown-dark text-ivory'
                            : 'bg-sand/20 text-brown-dark hover:bg-sand/40'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}