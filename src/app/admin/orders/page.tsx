'use client'

import { useState, useEffect } from 'react'
import { Container, Card, Table, Badge, Button, Modal, Form, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  _id: string
  orderNumber: string
  customerEmail: string
  customerName: string
  customerPhone?: string
  items: OrderItem[]
  shippingAddress: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  subtotal: number
  shippingCost: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  createdAt: string
  updatedAt: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Mock orders data - would come from API in real app
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        _id: '1',
        orderNumber: 'AMP-1704067200000-ABC1',
        customerEmail: 'jane.doe@example.com',
        customerName: 'Jane Doe',
        customerPhone: '+234 801 234 5678',
        items: [
          {
            productId: '1',
            name: 'Crystal Pendant Necklace',
            price: 45000,
            quantity: 1,
            image: '/images/evie-martinez-mCjEVrBS1bM-unsplash.jpg'
          },
          {
            productId: '2',
            name: 'Gold Statement Earrings',
            price: 32000,
            quantity: 2,
            image: '/images/sabrianna-Y_bxfTa_iUA-unsplash.jpg'
          }
        ],
        shippingAddress: {
          street: '123 Victoria Island Street',
          city: 'Lagos',
          state: 'Lagos',
          postalCode: '100001',
          country: 'Nigeria'
        },
        subtotal: 109000,
        shippingCost: 2500,
        total: 119675, // Including VAT
        status: 'pending',
        paymentStatus: 'paid',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z'
      },
      {
        _id: '2',
        orderNumber: 'AMP-1704153600000-DEF2',
        customerEmail: 'john.smith@example.com',
        customerName: 'John Smith',
        customerPhone: '+234 802 345 6789',
        items: [
          {
            productId: '3',
            name: 'Silver Bracelet Set',
            price: 28000,
            quantity: 1,
            image: '/images/theresa-ude-01hjEW7Hc-8-unsplash.jpg'
          }
        ],
        shippingAddress: {
          street: '456 Lekki Phase 1',
          city: 'Lagos',
          state: 'Lagos',
          postalCode: '100001',
          country: 'Nigeria'
        },
        subtotal: 28000,
        shippingCost: 2500,
        total: 32600,
        status: 'processing',
        paymentStatus: 'paid',
        createdAt: '2024-01-02T14:30:00Z',
        updatedAt: '2024-01-02T14:30:00Z'
      }
    ]

    setTimeout(() => {
      setOrders(mockOrders)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'processing': return 'info'
      case 'shipped': return 'primary'
      case 'delivered': return 'success'
      case 'cancelled': return 'danger'
      default: return 'secondary'
    }
  }

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'success'
      case 'pending': return 'warning'
      case 'failed': return 'danger'
      case 'refunded': return 'info'
      default: return 'secondary'
    }
  }

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order._id === orderId 
        ? { ...order, status: newStatus as Order['status'], updatedAt: new Date().toISOString() }
        : order
    ))
  }

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Order Management</h1>
        <div className="d-flex gap-2">
          <Form.Select 
            size="sm" 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </div>
      </div>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5 className="card-title">Total Orders</h5>
              <h2 className="text-primary">{orders.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5 className="card-title">Pending</h5>
              <h2 className="text-warning">{orders.filter(o => o.status === 'pending').length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5 className="card-title">Processing</h5>
              <h2 className="text-info">{orders.filter(o => o.status === 'processing').length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5 className="card-title">Revenue</h5>
              <h2 className="text-success">{formatCurrency(orders.reduce((sum, o) => sum + o.total, 0))}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <Card.Title>Orders ({filteredOrders.length})</Card.Title>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <code className="text-primary">{order.orderNumber}</code>
                    </td>
                    <td>
                      <div>
                        <strong>{order.customerName}</strong>
                        <br />
                        <small className="text-muted">{order.customerEmail}</small>
                      </div>
                    </td>
                    <td>{order.items.length} item(s)</td>
                    <td><strong>{formatCurrency(order.total)}</strong></td>
                    <td>
                      <Badge bg={getStatusVariant(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getPaymentStatusVariant(order.paymentStatus)}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </Badge>
                    </td>
                    <td>
                      <small>{formatDate(order.createdAt)}</small>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowModal(true)
                          }}
                        >
                          View
                        </Button>
                        <Form.Select
                          size="sm"
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          style={{ width: '120px' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </Form.Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Order Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <h6>Order Information</h6>
                  <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                  <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                  <p><strong>Status:</strong> 
                    <Badge bg={getStatusVariant(selectedOrder.status)} className="ms-2">
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </Badge>
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Customer Information</h6>
                  <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                </Col>
              </Row>

              <h6>Shipping Address</h6>
              <p>
                {selectedOrder.shippingAddress.street}<br />
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}<br />
                {selectedOrder.shippingAddress.country}
              </p>

              <h6>Order Items</h6>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="border-top pt-3">
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Shipping:</span>
                  <span>{formatCurrency(selectedOrder.shippingCost)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Tax (VAT 7.5%):</span>
                  <span>{formatCurrency(selectedOrder.total - selectedOrder.subtotal - selectedOrder.shippingCost)}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}