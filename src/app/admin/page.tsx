'use client'

import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Table, Spinner } from 'react-bootstrap'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    recentSales: [] as any[]
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
      // Fetch total products
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // Fetch total sales
      const { count: salesCount } = await supabase
        .from('sales')
        .select('*', { count: 'exact', head: true })

      // Fetch recent sales
      const { data: recentSales } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      // Calculate total revenue (simplified - in production, you'd parse the price strings)
      const { data: allSales } = await supabase
        .from('sales')
        .select('total_price')

      setStats({
        totalProducts: productCount || 0,
        totalSales: salesCount || 0,
        totalRevenue: allSales?.length || 0, // Simplified
        recentSales: recentSales || []
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" />
      </Container>
    )
  }

  return (
    <Container>
      <h1 className="mb-4">Dashboard</h1>
      <Row className="mb-4">
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Products</Card.Title>
              <Card.Text className="display-4">{stats.totalProducts}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Sales</Card.Title>
              <Card.Text className="display-4">{stats.totalSales}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Orders</Card.Title>
              <Card.Text className="display-4">{stats.totalRevenue}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>Recent Sales</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.product_name}</td>
                  <td>{sale.customer_name || sale.customer_email || 'N/A'}</td>
                  <td>
                    <span className={`badge bg-${sale.status === 'completed' ? 'success' : sale.status === 'pending' ? 'warning' : 'danger'}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td>{new Date(sale.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {stats.recentSales.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center">No sales yet</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  )
}
