'use client'

import { useEffect, useState } from 'react'
import { Container, Table, Button, Modal, Form, Spinner, Alert, Badge } from 'react-bootstrap'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

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
        // Update existing sale
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
        // Create new sale
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

  const getStatusBadge = (status: string) => {
    const variant = status === 'completed' ? 'success' : status === 'pending' ? 'warning' : 'danger'
    return <Badge bg={variant}>{status}</Badge>
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Sales</h1>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add Sale
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <div className="mb-3">
        <Form.Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Form.Select>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Product</th>
            <th>Customer</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.product_name}</td>
              <td>
                <div>{sale.customer_name || 'N/A'}</div>
                <small className="text-muted">{sale.customer_email || ''}</small>
              </td>
              <td>{sale.quantity}</td>
              <td>{sale.total_price}</td>
              <td>{getStatusBadge(sale.status)}</td>
              <td>{new Date(sale.created_at).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal(sale)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(sale.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {sales.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center">No sales yet</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingSale ? 'Edit Sale' : 'Add Sale'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                required
                min="1"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total Price</Form.Label>
              <Form.Control
                type="text"
                value={formData.total_price}
                onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
                required
                placeholder="₦250,000"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Customer Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingSale ? 'Update' : 'Create'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
