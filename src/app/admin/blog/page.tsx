'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FileText, Plus, Search, Edit3, Trash2, Eye, EyeOff,
  ChevronDown, ChevronUp, ArrowUpDown, Loader2, AlertCircle, CheckCircle, XCircle
} from 'lucide-react'
import { getAdminAuthHeaders } from '@/lib/admin-api'
import ImageUpload from '@/components/ImageUpload'
import Toast from '@/components/Toast'

interface BlogPost {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  category: string
  image: string
  tags: string[]
  published: boolean
  publishedAt?: string
  createdAt: string
}

const emptyPost = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  author: 'AMAPELS',
  category: 'News',
  image: '',
  tags: [] as string[],
  published: true,
}

export default function AdminBlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyPost)
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortField, setSortField] = useState<'createdAt' | 'title'>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error', visible: false })

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true })
  }

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/blog?all=true', {
        headers: getAdminAuthHeaders(),
      })
      const data = await res.json()
      if (res.ok) setPosts(data.posts || [])
    } catch {
      showToast('Failed to load posts', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const session = localStorage.getItem('admin_session')
    if (!session) { router.push('/admin/login'); return }
    fetchPosts()
  }, [fetchPosts, router])

  const openCreate = () => {
    setEditingId(null)
    setFormData(emptyPost)
    setTagInput('')
    setShowForm(true)
  }

  const openEdit = (post: BlogPost) => {
    setEditingId(post._id)
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      category: post.category,
      image: post.image,
      tags: post.tags || [],
      published: post.published,
    })
    setTagInput('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData(emptyPost)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content || !formData.slug) {
      showToast('Title, slug, and content are required', 'error')
      return
    }
    setSaving(true)
    try {
      const url = editingId ? `/api/blog/${editingId}` : '/api/blog'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { ...getAdminAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        showToast(editingId ? 'Post updated' : 'Post created', 'success')
        closeForm()
        fetchPosts()
      } else {
        const data = await res.json()
        showToast(data.error || 'Failed to save', 'error')
      }
    } catch {
      showToast('Failed to save post', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
        headers: getAdminAuthHeaders(),
      })
      if (res.ok) {
        showToast('Post deleted', 'success')
        fetchPosts()
      } else {
        showToast('Failed to delete', 'error')
      }
    } catch {
      showToast('Failed to delete', 'error')
    }
  }

  const togglePublished = async (post: BlogPost) => {
    try {
      const res = await fetch(`/api/blog/${post._id}`, {
        method: 'PUT',
        headers: { ...getAdminAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      })
      if (res.ok) {
        showToast(post.published ? 'Post unpublished' : 'Post published', 'success')
        fetchPosts()
      }
    } catch {
      showToast('Failed to update', 'error')
    }
  }

  const generateSlug = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    }))
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  const categories = [...new Set(posts.map((p) => p.category))]

  const filtered = posts
    .filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.excerpt.toLowerCase().includes(search.toLowerCase())) return false
      if (categoryFilter && p.category !== categoryFilter) return false
      return true
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortField === 'title') return a.title.localeCompare(b.title) * dir
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir
    })

  const toggleSort = (field: 'createdAt' | 'title') => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortDir('desc') }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={24} className="animate-spin text-gold-dark" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary">
      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={() => setToast((t) => ({ ...t, visible: false }))} duration={3000} />

      <div className="section-shell py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-light text-black-dark sm:text-3xl">Blog Posts</h1>
            <p className="mt-1 text-sm text-black/50">Manage your journal &amp; news articles</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-black-dark px-5 py-3 text-xs font-medium uppercase tracking-[0.22em] text-white transition-all hover:bg-black"
          >
            <Plus size={14} />
            New Post
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gold/20 bg-white py-3 pl-9 pr-4 text-sm outline-none transition-colors focus:border-gold-dark"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gold/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold-dark"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded border border-gold/20 bg-white p-6"
          >
            <h2 className="mb-6 font-serif text-xl font-light text-black-dark">
              {editingId ? 'Edit Post' : 'New Post'}
            </h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-black/50">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                      if (!editingId) generateSlug(e.target.value)
                    }}
                    className="w-full border border-gold/20 px-3 py-2.5 text-sm outline-none focus:border-gold-dark"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-black/50">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full border border-gold/20 px-3 py-2.5 text-sm outline-none focus:border-gold-dark"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-black/50">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                    className="w-full border border-gold/20 px-3 py-2.5 text-sm outline-none focus:border-gold-dark"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-black/50">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gold/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold-dark"
                  >
                    {['News', 'Collections', 'Behind the Scenes', 'Style Guide', 'Events', 'Press'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-black/50">Excerpt</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full border border-gold/20 px-3 py-2.5 text-sm outline-none focus:border-gold-dark"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-black/50">Content *</label>
                <textarea
                  rows={10}
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full border border-gold/20 px-3 py-2.5 font-mono text-sm outline-none focus:border-gold-dark"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-black/50">Featured Image</label>
                <ImageUpload
                  images={formData.image ? [formData.image] : []}
                  onChange={(urls) => setFormData((prev) => ({ ...prev, image: urls[0] || '' }))}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-black/50">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 border border-gold/20 bg-primary-light px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-black/60">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-black/30 hover:text-red">&times;</button>
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                    placeholder="Add tag..."
                    className="flex-1 border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold-dark"
                  />
                  <button type="button" onClick={addTag} className="border border-gold/20 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-black/50 hover:bg-black-dark hover:text-white transition-colors">Add</button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
                  className="h-4 w-4 accent-gold-dark"
                />
                <label htmlFor="published" className="text-sm text-black/70">Publish immediately</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-black-dark px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition-all hover:bg-black disabled:opacity-50"
                >
                  {saving && <Loader2 size={12} className="animate-spin" />}
                  {editingId ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="border border-black/10 px-6 py-2.5 text-[10px] uppercase tracking-[0.22em] text-black/50 transition-colors hover:border-black/30"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded border border-dashed border-gold/20 py-20 text-center">
            <FileText size={32} className="text-gold/40" />
            <p className="font-serif text-xl font-light text-black-dark">No posts yet</p>
            <p className="text-sm text-black/45">Create your first journal entry or news article.</p>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-black-dark px-6 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all hover:bg-black"
            >
              <Plus size={13} />
              New Post
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gold/20 text-left text-[10px] uppercase tracking-[0.18em] text-black/50">
                  <th className="py-3 pr-4">
                    <button onClick={() => toggleSort('title')} className="inline-flex items-center gap-1 hover:text-black-dark">
                      Title <ArrowUpDown size={11} />
                    </button>
                  </th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">
                    <button onClick={() => toggleSort('createdAt')} className="inline-flex items-center gap-1 hover:text-black-dark">
                      Date <ArrowUpDown size={11} />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post._id} className="border-b border-black/[0.04] transition-colors hover:bg-primary-light/50">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-black-dark">{post.title}</p>
                      <p className="mt-0.5 text-[11px] text-black/40">/{post.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-black/60">{post.category}</td>
                    <td className="px-4 py-3 text-black/60">{post.author}</td>
                    <td className="px-4 py-3">
<button
                          onClick={() => togglePublished(post)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
                            post.published
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-amber-50 hover:text-amber-700'
                              : 'bg-black/[0.04] text-black/40 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                          {post.published ? 'Published' : 'Draft'}
                        </button>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-black/50">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(post)}
                          className="rounded p-2.5 text-black/40 transition-colors hover:bg-black/[0.04] hover:text-gold-dark"
                          title="Edit"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id, post.title)}
                          className="rounded p-2.5 text-black/40 transition-colors hover:bg-red/[0.06] hover:text-red"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}