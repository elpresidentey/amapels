'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, Search, Filter, Download, Copy, ChevronDown, ChevronUp } from 'lucide-react'
import Toast from '@/components/Toast'
import ImageUpload from '@/components/ImageUpload'

interface Product {
  _id?: string
  name: string
  price: string
  category: string
  description: string
  images: string[]
  featured?: boolean
  story?: string
  material?: string
  details?: string[]
  materials?: string
  care?: string
  options?: string[]
  createdAt?: string
  updatedAt?: string
}

const CATEGORIES = ['Earrings', 'Necklaces', 'Bracelets', 'Jewellery Sets']

const initialFormData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  price: '',
  category: 'Earrings',
  description: '',
  images: [''],
  featured: false,
  story: 'Handcrafted with care',
  material: 'Gold-tone alloy',
        details: ['Handcrafted quality', 'Polished finish', 'Ideal for gifting'],
        materials: 'Premium materials with artisan attention to detail',
        care: 'Store in a dry place and wipe gently with a soft cloth after wearing.',
        options: ['Gold Finish', 'Gift Box']
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Omit<Product, '_id' | 'createdAt' | 'updatedAt'>>(initialFormData)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [featuredFilter, setFeaturedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    checkAuth()
    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, categoryFilter, featuredFilter, sortBy, sortOrder])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter, featuredFilter, sortBy, sortOrder])
  const checkAuth = () => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.push('/admin/login')
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }

    // Featured filter
    if (featuredFilter !== 'all') {
      filtered = filtered.filter(product =>
        featuredFilter === 'featured' ? product.featured : !product.featured
      )
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'price':
          comparison = a.price.localeCompare(b.price)
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
        case 'featured':
          comparison = (a.featured ? 1 : 0) - (b.featured ? 1 : 0)
          break
        default:
          comparison = 0
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    setFilteredProducts(filtered)
  }

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      const result = await response.json()

      if (result.success) {
        setProducts(result.data || [])
        setFilteredProducts(result.data || [])
      } else {
        throw new Error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      showToastMessage('Failed to load products', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleShowModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        images: [...product.images],
        featured: product.featured || false,
        story: product.story || 'Handcrafted with care',
        material: product.material || 'Gold-tone alloy',
        details: product.details || ['Lightweight and comfortable', 'Elegant design', 'Perfect for any occasion'],
        materials: product.materials || 'Premium materials with attention to detail',
        care: product.care || 'Store in a dry place and wipe gently with a soft cloth after wearing.',
        options: product.options || ['Standard Size', 'Gift Box']
      })
    } else {
      setEditingProduct(null)
      setFormData(initialFormData)
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
  }
  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = (): string[] => {
    const errors: string[] = []
    
    if (!formData.name.trim()) errors.push('Product name is required')
    if (!formData.price.trim()) errors.push('Price is required')
    if (!formData.description.trim()) errors.push('Description is required')
    if (formData.images.every(i => !i.trim())) errors.push('At least one image is required')

    return errors
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (errors.length > 0) {
      showToastMessage(errors.join(', '), 'error')
      return
    }

    setSaving(true)

    try {
      // Clean up array fields (remove empty items)
      const cleanedData = {
        ...formData,
        details: formData.details && formData.details.length > 0 ? formData.details.filter(d => d.trim()) : ['Handcrafted quality', 'Polished finish', 'Ideal for gifting'],
        options: formData.options && formData.options.length > 0 ? formData.options.filter(o => o.trim()) : ['Gold Finish', 'Gift Box'],
        images: formData.images.filter(i => i.trim()),
        story: formData.story || 'Handcrafted with care',
        material: formData.material || 'Gold-tone alloy',
        materials: formData.materials || 'Premium materials with artisan attention to detail',
        care: formData.care || 'Store in a dry place and wipe gently with a soft cloth after wearing.'
      }

      const url = editingProduct 
        ? `/api/products/${editingProduct._id}`
        : '/api/products'
      
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanedData)
      })

      const result = await response.json()

      if (result.success) {
        showToastMessage(
          editingProduct ? 'Product updated successfully!' : 'Product created successfully!'
        )
        handleCloseModal()
        fetchProducts()
      } else {
        throw new Error(result.error || 'Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      showToastMessage(
        error instanceof Error ? error.message : 'Failed to save product',
        'error'
      )
    } finally {
      setSaving(false)
    }
  }
  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return

    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        showToastMessage('Product deleted successfully!')
        fetchProducts()
      } else {
        throw new Error(result.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      showToastMessage('Failed to delete product', 'error')
    }
  }

  const toggleFeatured = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...product,
          featured: !product.featured
        })
      })

      const result = await response.json()

      if (result.success) {
        showToastMessage(
          `Product ${!product.featured ? 'featured' : 'unfeatured'} successfully!`
        )
        fetchProducts()
      } else {
        throw new Error(result.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      showToastMessage('Failed to update product', 'error')
    }
  }

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p._id!)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return
    if (!window.confirm(`Are you sure you want to delete ${selectedProducts.size} products?`)) return

    try {
      const promises = Array.from(selectedProducts).map(id =>
        fetch(`/api/products/${id}`, { method: 'DELETE' })
      )
      await Promise.all(promises)
      showToastMessage(`${selectedProducts.size} products deleted successfully!`)
      setSelectedProducts(new Set())
      fetchProducts()
    } catch (error) {
      console.error('Error deleting products:', error)
      showToastMessage('Failed to delete products', 'error')
    }
  }

  const handleDuplicate = async (product: Product) => {
    if (!window.confirm(`Duplicate "${product.name}"?`)) return

    try {
      const { _id, createdAt, updatedAt, ...productData } = product
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...productData,
          name: `${product.name} (Copy)`
        })
      })

      const result = await response.json()

      if (result.success) {
        showToastMessage('Product duplicated successfully!')
        fetchProducts()
      } else {
        throw new Error(result.error || 'Failed to duplicate product')
      }
    } catch (error) {
      console.error('Error duplicating product:', error)
      showToastMessage('Failed to duplicate product', 'error')
    }
  }

  const handleExportCSV = () => {
    const headers = ['Name', 'Price', 'Category', 'Description', 'Featured']
    const rows = filteredProducts.map(p => [
      p.name,
      p.price,
      p.category,
      p.description.replace(/,/g, ';'),
      p.featured ? 'Yes' : 'No'
    ])

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    showToastMessage('Products exported successfully!')
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black/70">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16">
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      <div className="section-shell">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-black-dark">Product Management</h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleExportCSV}
              className="bg-white border border-gold text-black-dark px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-medium hover:bg-gold/10 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              title="Export to CSV"
            >
              <Download size={16} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => handleShowModal()}
              className="bg-black text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-medium hover:bg-gold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base btn-mobile"
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-gold/30 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none text-sm"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex-1 lg:flex-none lg:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none text-sm bg-white"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Featured Filter */}
            <div className="flex-1 lg:flex-none lg:w-48">
              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none text-sm bg-white"
              >
                <option value="all">All Products</option>
                <option value="featured">Featured Only</option>
                <option value="not-featured">Not Featured</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex-1 lg:flex-none lg:w-48">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field)
                  setSortOrder(order as 'asc' | 'desc')
                }}
                className="w-full px-4 py-2.5 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none text-sm bg-white"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low-High)</option>
                <option value="price-desc">Price (High-Low)</option>
                <option value="category-asc">Category (A-Z)</option>
                <option value="featured-desc">Featured First</option>
              </select>
            </div>
          </div>

          {/* Results count and bulk actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4 pt-4 border-t border-gold/20">
            <p className="text-sm text-black/70">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            <div className="flex items-center gap-2">
              {selectedProducts.size > 0 && (
                <>
                  <span className="text-sm text-black/70">
                    {selectedProducts.size} selected
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Delete Selected
                  </button>
                </>
              )}
              {totalPages > 1 && (
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gold rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold/10"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-black/70">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gold rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold/10"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl md:rounded-3xl border border-gold/30 overflow-hidden">
          {/* Mobile Table */}
          <div className="block md:hidden">
            <div className="p-4 space-y-4">
              {paginatedProducts.map((product) => (
                <div key={product._id} className="border border-gold/20 rounded-xl p-3 sm:p-4">
                  <div className="flex gap-2 mb-3 sm:gap-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product._id!)}
                      onChange={() => handleSelectProduct(product._id!)}
                      className="w-4 h-4 mt-1 border-gold rounded"
                    />
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-black-dark text-xs mb-1 line-clamp-2 sm:text-sm">{product.name}</h3>
                      <p className="text-black/70 text-[10px] mb-1 line-clamp-2 sm:text-xs sm:mb-2">{product.description}</p>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-black-dark font-medium text-xs sm:text-sm truncate">{product.price}</span>
                        <span className="text-black/70 text-[10px] sm:text-xs flex-shrink-0">{product.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gold/20 sm:pt-3">
                    <button
                      onClick={() => toggleFeatured(product)}
                      className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] transition-colors sm:gap-1 sm:px-2 sm:py-1 sm:text-xs ${
                        product.featured
                          ? 'bg-accent-emerald/10 text-accent-emerald'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {product.featured ? <Eye size={10} className="sm:w-3 sm:h-3" /> : <EyeOff size={10} className="sm:w-3 sm:h-3" />}
                      <span className="hidden xs:inline">{product.featured ? 'Featured' : 'Hidden'}</span>
                    </button>
                    
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleDuplicate(product)}
                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors sm:p-2"
                        title="Duplicate"
                      >
                        <Copy size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleShowModal(product)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors sm:p-2"
                      >
                        <Edit2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors sm:p-2"
                      >
                        <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-black/70">
                  {products.length === 0 ? 'No products yet. Create your first product to get started.' : 'No products match your filters.'}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100/20">
                <tr>
                  <th className="px-4 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.size === paginatedProducts.length && paginatedProducts.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 border-gold rounded"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-black-dark font-medium cursor-pointer hover:bg-gray-100/30" onClick={() => handleSort('name')}>
                    Product {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp size={14} className="inline" /> : <ChevronDown size={14} className="inline" />)}
                  </th>
                  <th className="px-6 py-4 text-left text-black-dark font-medium cursor-pointer hover:bg-gray-100/30" onClick={() => handleSort('category')}>
                    Category {sortBy === 'category' && (sortOrder === 'asc' ? <ChevronUp size={14} className="inline" /> : <ChevronDown size={14} className="inline" />)}
                  </th>
                  <th className="px-6 py-4 text-left text-black-dark font-medium cursor-pointer hover:bg-gray-100/30" onClick={() => handleSort('price')}>
                    Price {sortBy === 'price' && (sortOrder === 'asc' ? <ChevronUp size={14} className="inline" /> : <ChevronDown size={14} className="inline" />)}
                  </th>
                  <th className="px-6 py-4 text-left text-black-dark font-medium cursor-pointer hover:bg-gray-100/30" onClick={() => handleSort('featured')}>
                    Featured {sortBy === 'featured' && (sortOrder === 'asc' ? <ChevronUp size={14} className="inline" /> : <ChevronDown size={14} className="inline" />)}
                  </th>
                  <th className="px-6 py-4 text-left text-black-dark font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product._id} className="border-b border-gold/20 hover:bg-gray-50/30">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product._id!)}
                        onChange={() => handleSelectProduct(product._id!)}
                        className="w-4 h-4 border-gold rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <div className="font-medium text-black-dark">{product.name}</div>
                          <div className="text-sm text-black/70 truncate max-w-[200px]">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-black/80">{product.category}</td>
                    <td className="px-6 py-4 text-black-dark font-medium">{product.price}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFeatured(product)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                          product.featured
                            ? 'bg-accent-emerald/10 text-accent-emerald'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {product.featured ? <Eye size={14} /> : <EyeOff size={14} />}
                        {product.featured ? 'Featured' : 'Not Featured'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDuplicate(product)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Duplicate"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => handleShowModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-black/70">
                      {products.length === 0 ? 'No products yet. Create your first product to get started.' : 'No products match your filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Product Form Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl border border-gold/30 w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gold/20 flex justify-between items-center">
                <h2 className="font-serif text-xl sm:text-2xl text-black-dark">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-black/70 hover:text-black-dark hover:bg-gray-100/20 rounded-lg transition-colors btn-mobile"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Essential Fields Only */}
                  <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 mb-4">
                    <p className="text-sm text-black/70">
                      <strong>Quick Add:</strong> Just fill in the basics below. Advanced details are set automatically!
                    </p>
                  </div>

                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-black-dark mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none text-base"
                        placeholder="e.g., Gold Hoop Earrings"
                        required
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black-dark mb-2">
                        Price *
                      </label>
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="w-full px-4 py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none"
                        placeholder="₦250,000"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-dark mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none"
                      required
                    >
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-dark mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none"
                      placeholder="Describe your product... What makes it special?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-dark mb-2">
                      Product Images *
                    </label>
                    <ImageUpload
                      images={formData.images.filter(img => img.trim())}
                      onChange={(newImages) => handleInputChange('images', newImages)}
                      maxImages={5}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => handleInputChange('featured', e.target.checked)}
                        className="w-4 h-4 text-black-dark border-gold rounded focus:ring-brown/20"
                      />
                      <span className="text-sm font-medium text-black-dark">
                        Feature this product on homepage
                      </span>
                    </label>
                  </div>

                  {/* Collapsible Advanced Options */}
                  <details className="border border-gold/20 rounded-xl overflow-hidden">
                    <summary className="cursor-pointer bg-gold/5 px-4 py-3 font-medium text-black-dark hover:bg-gold/10 transition-colors">
                      Advanced Options (Optional)
                    </summary>
                    <div className="p-4 space-y-4 bg-white">
                      <div>
                        <label className="block text-sm font-medium text-black-dark mb-2">
                          Product Story
                        </label>
                        <textarea
                          value={formData.story}
                          onChange={(e) => handleInputChange('story', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none"
                          placeholder="Optional backstory or inspiration"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black-dark mb-2">
                          Material
                        </label>
                        <input
                          type="text"
                          value={formData.material}
                          onChange={(e) => handleInputChange('material', e.target.value)}
                          className="w-full px-4 py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none"
                          placeholder="e.g., Gold-tone alloy"
                        />
                      </div>
                    </div>
                  </details>
                </form>
              </div>

              <div className="p-6 border-t border-gold/20 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-black text-black-dark rounded-xl font-medium hover:bg-gold hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-ivory border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
