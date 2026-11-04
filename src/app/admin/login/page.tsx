'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'
import { loginAdmin } from '@/lib/auth'
import Logo from '@/components/Logo'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await loginAdmin(formData.email.trim(), formData.password)
      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.1),transparent_50%)]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gold">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-black via-[#0C0A08] to-[#2a2113] p-8 text-center">
            <div className="mb-5 flex justify-center">
              <Logo
                variant="wordmark"
                tone="gold"
                className="h-8 w-64"
                priority
              />
            </div>
            <p className="text-gold-light text-[11px] uppercase tracking-[0.28em]">Admin Portal</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-medium text-black-dark mb-1">Welcome Back</h2>
              <p className="text-black/70 text-sm">Sign in to access your dashboard</p>
            </div>

            {/* Inline Error */}
            {error && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-black-dark mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40">
                    <Mail size={18} />
                  </div>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gold rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none text-base transition-all min-h-[48px] relative z-10 cursor-text"
                    placeholder="amapelsng@gmail.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-black-dark mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40">
                    <Lock size={18} />
                  </div>
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full pl-12 pr-14 py-3.5 border border-gold rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none text-base transition-all min-h-[48px] relative z-10 cursor-text"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/70 hover:text-black-dark transition-colors p-1 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.email || !formData.password}
                className="w-full bg-black text-white py-3.5 px-4 rounded-xl font-medium hover:bg-gold hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl border-2 border-gold min-h-[52px]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-black/60 text-sm">
            © 2026 AMAPELS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
