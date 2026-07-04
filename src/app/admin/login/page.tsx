'use client'

import { useState } from 'react'
import { Container, Form, Button, Card, Alert } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

// Secure hash for 'admin123' - generated with bcrypt.hashSync('admin123', 10)
const ADMIN_PASSWORD_HASH = '$2a$10$8K1p/a0dQ2jZiYvYPtq01OehsjjhiMWhn7zNGQa1GafPNqGe8paVe'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Query admin_users table
      const { data: admin, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !admin) {
        setError('Invalid credentials')
        setLoading(false)
        return
      }

      // Use bcrypt for secure password comparison
      const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
      
      if (isValidPassword) {
        const sessionData = {
          ...admin,
          loginTime: new Date().toISOString(),
          sessionId: crypto.randomUUID(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        }
        
        localStorage.setItem('admin_session', JSON.stringify(sessionData))
        sessionStorage.setItem('admin_active', 'true')
        
        router.push('/admin')
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Admin Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@amapels.com"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}
