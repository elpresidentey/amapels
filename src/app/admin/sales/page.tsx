'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Sale {
  id: string
  product_id: string
  product_name: string
  quantity: number
  total_price: string
  customer_email: string
  customer_name: string
  status: string
  created_at: string
}

const statusConfig = {
  completed: { bg: 'bg-gold/15', text: 'text-gold-dark', border: 'border-gold/30' },
  pending: { bg: 'bg-black/5', text: 'text-black/60', border: 'border-black/10' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
}

export default function SalesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [sales, setSales] = useState<Sale[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingSale, setEditingSale] = useState<Sale | null>(null)
  const [formData, setFormData] = useState({
    product_id: '',
    product_name: '',
    quantity: 1,
    total_price: '',
    customer_email: '',
    customer_name: '',
    status: 'pending'
  })
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    checkAuth()
    fetchSales()
  }, [filterStatus])

  const checkAuth = () => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.push('/admin/login')
    }
  }

  const fetchSales = async () => {
    try {
      let query = supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }

      const { data, error } = await query

      if (error) throw error
      setSales(data || [])
    } catch (error) {
      console.error('Error fetching sales:', error)
      setError('Failed to load sales')
    } finally {
      setLoading(false)
    }
  }

  const handleShowModal = (sale?: Sale) => {
    if (sale) {
      setEditingSale(sale)
      setFormData({
        product_id: sale.product_id,
        product_name: sale.product_name,
        quantity: sale.quantity,
        total_price: sale.total_price,
        customer_email: sale.customer_email,
        customer_name: sale.customer_name,
        status: sale.status
      })
    } else {
      setEditingSale(null)
      setFormData({
        product_id: '',
        product_name: '',
        quantity: 1,
        total_price: '',
        customer_email: '',
        customer_name: '',
        status: 'pending'
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSale(null)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (editingSale) {
        const { error } = await supabase
          .from('sales')
          .update({
            product_name: formData.product_name,
            quantity: formData.quantity,
            total_price: formData.total_price,
            customer_email: formData.customer_email,
            customer_name: formData.customer_name,
            status: formData.status
          })
          .eq('id', editingSale.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('sales')
          .insert({
            product_id: formData.product_id,
            product_name: formData.product_name,
            quantity: formData.quantity,
            total_price: formData.total_price,
            customer_email: formData.customer_email,
            customer_name: formData.customer_name,
            status: formData.status
          })

        if (error) throw error
      }

      handleCloseModal()
      fetchSales()
    } catch (error) {
      console.error('Error saving sale:', error)
      setError('Failed to save sale')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sale?')) return

    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchSales()
    } catch (error) {
      console.error('Error deleting sale:', error)
      setError('Failed to delete sale')
    }
  }

  if (loading) {
    return (
      <div className="section-shell py-16">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 border-2 border-black border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="section-shell py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-light text-black-dark">Sales</h1>
        <button
          onClick={() => handleShowModal()}
          className="btn-premium bg-black text-white py-2.5 px-6 text-[10px] font-medium uppercase tracking-[0.22em] hover:bg-gold hover:text-black-dark flex items-center gap-2"
        >
          <Plus size={14} />
          Add Sale
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 mb-6 flex items-center justify-between">
          <span className="text-red-700 text-sm">{error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border border-black/10 px-4 py-2.5 text-sm font-medium text-black-dark focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto border border-black/10">
        <table className="w-full">
          <thead>
            <tr className="bg-black/5 border-b border-black/10">
              <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-black/50">Product</th>
              <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-black/50">Customer</th>
              <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-black/50">Quantity</th>
              <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-black/50">Total Price</th>
              <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-black/50">Status</th>
              <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-black/50">Date</th>
              <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-black/50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b border-black/5 hover:bg-black/3 transition-colors">
                <td className="px-4 py-4 font-medium text-black-dark">{sale.product_name}</td>
                <td className="px-4 py-4">
                  <div className="font-medium text-black-dark">{sale.customer_name || 'N/A'}</div>
                  <div className="text-xs text-black/40">{sale.customer_email || ''}</div>
                </td>
                <td className="px-4 py-4 text-black/70">{sale.quantity}</td>
                <td className="px-4 py-4 font-medium text-black-dark">{sale.total_price}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${statusConfig[sale.status as keyof typeof statusConfig]?.border || 'border-black/10'} ${statusConfig[sale.status as keyof typeof statusConfig]?.bg || 'bg-black/5'} ${statusConfig[sale.status as keyof typeof statusConfig]?.text || 'text-black/60'}`}>
                    {sale.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-black/60">{new Date(sale.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShowModal(sale)}
                      className="btn-premium border border-black/10 text-black/60 hover:border-gold hover:text-black-dark px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="btn-premium border border-red-200 text-red-600 hover:border-red-400 hover:text-red-700 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em]"
                    >
                      <Trash2 size={12} className="inline-block" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-black/50">No sales yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-sm border border-black/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
                <h2 className="font-serif text-xl font-light text-black-dark">
                  {editingSale ? 'Edit Sale' : 'Add Sale'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-black/40 hover:text-black-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 px-3 py-2 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium uppercase tracking-[0.18em] text-black/50 mb-1.5">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.product_name}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    required
                    className="w-full bg-white border border-black/10 px-3 py-2.5 text-sm text-black-dark focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
                    placeholder="Product name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-[0.18em] text-black/50 mb-1.5">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    required
                    min="1"
                    className="w-full bg-white border border-black/10 px-3 py-2.5 text-sm text-black-dark focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-[0.18em] text-black/50 mb-1.5">
                    Total Price
                  </label>
                  <input
                    type="text"
                    value={formData.total_price}
                    onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
                    required
                    className="w-full bg-white border border-black/10 px-3 py-2.5 text-sm text-black-dark focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
                    placeholder="₦250,000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-[0.18em] text-black/50 mb-1.5">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full bg-white border border-black/10 px-3 py-2.5 text-sm text-black-dark focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
                    placeholder="Customer name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-[0.18em] text-black/50 mb-1.5">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    className="w-full bg-white border border-black/10 px-3 py-2.5 text-sm text-black-dark focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
                    placeholder="customer@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-[0.18em] text-black/50 mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                    className="w-full bg-white border border-black/10 px-3 py-2.5 text-sm text-black-dark focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-black/10">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-premium border border-black/10 text-black/60 hover:border-gold hover:text-black-dark py-2.5 px-5 text-[10px] font-medium uppercase tracking-[0.18em]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-premium bg-black text-white py-2.5 px-5 text-[10px] font-medium uppercase tracking-[0.18em] hover:bg-gold hover:text-black-dark"
                  >
                    {editingSale ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}