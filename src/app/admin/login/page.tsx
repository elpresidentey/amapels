'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Toast from '@/components/Toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Admin credentials - email based login
      if (formData.email.toLowerCase() === 'admin@amapels.com' && formData.password === 'Amapels2024!') {
        localStorage.setItem('admin_session', JSON.stringify({
          email: formData.email,
          loginTime: new Date().toISOString()
        }))
        showToastMessage('Login successful! Redirecting...')
        setTimeout(() => {
          router.push('/admin')
        }, 1000)
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      showToastMessage('Invalid email or password', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-dark via-brown to-brown-dark flex items-center justify-center p-4">
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.08),transparent_50%)]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-brown-dark to-brown p-8 text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
              <Lock className="w-10 h-10 text-ivory" />
            </div>
            <h1 className="font-serif text-3xl text-ivory mb-2">AMAPELS</h1>
            <p className="text-ivory/70 text-sm uppercase tracking-widest">Admin Portal</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-medium text-brown-dark mb-1">Welcome Back</h2>
              <p className="text-brown/70 text-sm">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-brown-dark mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/40">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-sand rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-brown-dark outline-none text-base transition-all"
                    placeholder="admin@amapels.com"
                    required
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-dark mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/40">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-sand rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-brown-dark outline-none text-base transition-all"
                    placeholder="Enter your password"
                    required
                    style={{ fontSize: '16px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/70 hover:text-brown-dark transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-brown-dark border-sand rounded focus:ring-brown/20"
                  />
                  <span className="text-brown/70">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-brown-dark hover:text-brown transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.email || !formData.password}
                className="w-full bg-brown-dark text-ivory py-3.5 px-4 rounded-xl font-medium hover:bg-brown transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-ivory border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>

            {/* Demo Info */}
            <div className="mt-6 pt-6 border-t border-sand/30">
              <div className="bg-champagne/20 rounded-xl p-4 text-center">
                <p className="text-xs font-medium text-brown-dark mb-2">Demo Credentials</p>
                <div className="space-y-1 text-xs text-brown/70">
                  <p className="font-mono">Email: admin@amapels.com</p>
                  <p className="font-mono">Password: Amapels2024!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-ivory/60 text-sm">
            © 2026 AMAPELS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}