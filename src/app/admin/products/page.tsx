'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react'
import Toast from '@/components/Toast'
import ImageUpload from '@/components/ImageUpload'

interface Product {
  _id?: string
  name: string
  price: string
  category: string
  story: string
  material: string
  description: string
  details: string[]
  materials: string
  care: string
  options: string[]
  images: string[]
  featured?: boolean
  createdAt?: string
  updatedAt?: string
}

const CATEGORIES = ['Earrings', 'Necklaces', 'Bracelets', 'Jewellery Sets']

const initialFormData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  price: '',
  category: 'Earrings',
  story: '',
  material: '',
  description: '',
  details: [''],
  materials: '',
  care: '',
  options: [''],
  images: [''],
  featured: false
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Omit<Product, '_id' | 'createdAt' | 'updatedAt'>>(initialFormData)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    checkAuth()
    fetchProducts()
  }, [])
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

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      const result = await response.json()

      if (result.success) {
        setProducts(result.data || [])
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
        story: product.story,
        material: product.material,
        description: product.description,
        details: [...product.details],
        materials: product.materials,
        care: product.care,
        options: [...product.options],
        images: [...product.images],
        featured: product.featured || false
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

  const handleArrayFieldChange = (field: 'details' | 'options' | 'images', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayFieldItem = (field: 'details' | 'options' | 'images') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayFieldItem = (field: 'details' | 'options' | 'images', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }))
    }
  }

  const validateForm = (): string[] => {
    const errors: string[] = []
    
    if (!formData.name.trim()) errors.push('Product name is required')
    if (!formData.price.trim()) errors.push('Price is required')
    if (!formData.story.trim()) errors.push('Story is required')
    if (!formData.material.trim()) errors.push('Material is required')
    if (!formData.description.trim()) errors.push('Description is required')
    if (!formData.materials.trim()) errors.push('Materials information is required')
    if (!formData.care.trim()) errors.push('Care instructions are required')
    
    if (formData.details.every(d => !d.trim())) errors.push('At least one detail is required')
    if (formData.options.every(o => !o.trim())) errors.push('At least one option is required')
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
        details: formData.details.filter(d => d.trim()),
        options: formData.options.filter(o => o.trim()),
        images: formData.images.filter(i => i.trim())
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
          <button
            onClick={() => handleShowModal()}
            className="bg-black text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-medium hover:bg-gold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base btn-mobile"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl md:rounded-3xl border border-gold/30 overflow-hidden">
          {/* Mobile Table */}
          <div className="block md:hidden">
            <div className="p-4 space-y-4">
              {products.map((product) => (
                <div key={product._id} className="border border-gold/20 rounded-xl p-3 sm:p-4">
                  <div className="flex gap-2 mb-3 sm:gap-3">
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
              {products.length === 0 && (
                <div className="text-center py-8 text-black/70">
                  No products yet. Create your first product to get started.
                </div>
              )}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100/20">
                <tr>
                  <th className="px-6 py-4 text-left text-black-dark font-medium">Product</th>
                  <th className="px-6 py-4 text-left text-black-dark font-medium">Category</th>
                  <th className="px-6 py-4 text-left text-black-dark font-medium">Price</th>
                  <th className="px-6 py-4 text-left text-black-dark font-medium">Featured</th>
                  <th className="px-6 py-4 text-left text-black-dark font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-gold/20">
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
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-black/70">
                      No products yet. Create your first product to get started.
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
                      Story *
                    </label>
                    <textarea
                      value={formData.story}
                      onChange={(e) => handleInputChange('story', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none"
                      placeholder="Tell the story behind this product..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-dark mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none"
                      placeholder="Product description..."
                      required
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-black-dark mb-2">
                        Material *
                      </label>
                      <input
                        type="text"
                        value={formData.material}
                        onChange={(e) => handleInputChange('material', e.target.value)}
                        className="w-full px-4 py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none"
                        placeholder="Gold, Silver, etc."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black-dark mb-2">
                        Materials Info *
                      </label>
                      <input
                        type="text"
                        value={formData.materials}
                        onChange={(e) => handleInputChange('materials', e.target.value)}
                        className="w-full px-4 py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none"
                        placeholder="Detailed materials information"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black-dark mb-2">
                      Care Instructions *
                    </label>
                    <textarea
                      value={formData.care}
                      onChange={(e) => handleInputChange('care', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none"
                      placeholder="How to care for this product..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-dark mb-2">
                      Product Details *
                    </label>
                    {formData.details.map((detail, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) => handleArrayFieldChange('details', index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none"
                          placeholder="Product detail..."
                        />
                        {formData.details.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayFieldItem('details', index)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayFieldItem('details')}
                      className="text-black-dark hover:text-black text-sm font-medium"
                    >
                      + Add Detail
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black-dark mb-2">
                      Product Options *
                    </label>
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleArrayFieldChange('options', index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-black outline-none"
                          placeholder="Product option..."
                        />
                        {formData.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayFieldItem('options', index)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayFieldItem('options')}
                      className="text-black-dark hover:text-black text-sm font-medium"
                    >
                      + Add Option
                    </button>
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
