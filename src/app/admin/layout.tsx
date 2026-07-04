'use client'

import { useEffect, useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getAdminSession, clearAdminSession } from '@/lib/auth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const session = getAdminSession()
      
      if (!session) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(true)
        if (pathname === '/admin/login') {
          router.push('/admin')
        }
      }
      setLoading(false)
    }

    checkAuth()
    
    // Check auth status every minute
    const interval = setInterval(checkAuth, 60000)
    
    return () => clearInterval(interval)
  }, [router, pathname])

  const handleLogout = () => {
    clearAdminSession()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div>Loading...</div>
      </Container>
    )
  }

  // Show login page without navbar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4" style={{ backgroundColor: '#1a1a1a' }}>
        <Container>
          <Navbar.Brand as={Link} href="/admin" className="text-white font-weight-bold">AMAPELS Admin</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} href="/admin" className="text-white">Dashboard</Nav.Link>
              <Nav.Link as={Link} href="/admin/products" className="text-white">Products</Nav.Link>
              <Nav.Link as={Link} href="/admin/orders" className="text-white">Orders</Nav.Link>
              <Nav.Link as={Link} href="/admin/sales" className="text-white">Sales</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link onClick={handleLogout} className="text-white">Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        {children}
      </Container>
    </>
  )
}
