'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, MapPin, Phone, Mail } from 'lucide-react'

const metadata: Metadata = {
  title: 'Track Your Order - AMAPELS',
  description: 'Track your AMAPELS jewelry order in real-time. Enter your order number or tracking ID to see delivery status and estimated arrival time.',
}

const OrderStatus = {
  PROCESSING: 'processing',
  SHIPPED: 'shipped', 
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered'
} as const

type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus]

interface TrackingInfo {
  orderId: string
  status: OrderStatusType
  estimatedDelivery: string
  currentLocation: string
  trackingNumber: string
  courierName: string
  courierPhone: string
  timeline: {
    date: string
    time: string
    status: string
    location: string
    completed: boolean
  }[]
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [trackingData, setTrackingData] = useState<TrackingInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Mock tracking data for demonstration
  const mockTrackingData: TrackingInfo = {
    orderId: 'AMP2024001',
    status: OrderStatus.IN_TRANSIT,
    estimatedDelivery: '2026-07-06 by 6:00 PM',
    currentLocation: 'Lagos Distribution Center',
    trackingNumber: 'TRK789012345',
    courierName: 'Express Logistics',
    courierPhone: '+234-800-123-4567',
    timeline: [
      {
        date: '2026-07-03',
        time: '2:30 PM',
        status: 'Order confirmed and payment received',
        location: 'AMAPELS Lagos',
        completed: true
      },
      {
        date: '2026-07-04',
        time: '10:15 AM',
        status: 'Package prepared and handed to courier',
        location: 'AMAPELS Fulfillment Center',
        completed: true
      },
      {
        date: '2026-07-04',
        time: '4:20 PM',
        status: 'Package received at sorting facility',
        location: 'Lagos Distribution Center',
        completed: true
      },
      {
        date: '2026-07-05',
        time: '9:45 AM',
        status: 'Package in transit to destination',
        location: 'Lagos Distribution Center',
        completed: true
      },
      {
        date: '2026-07-06',
        time: 'Estimated',
        status: 'Out for delivery',
        location: 'Victoria Island Hub',
        completed: false
      },
      {
        date: '2026-07-06',
        time: 'Estimated',
        status: 'Package delivered',
        location: 'Your Address',
        completed: false
      }
    ]
  }

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) {
      setError('Please enter an order number')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      if (orderNumber.toLowerCase().includes('amp') || orderNumber === 'TRK789012345') {
        setTrackingData(mockTrackingData)
        setError('')
      } else {
        setError('Order not found. Please check your order number and try again.')
        setTrackingData(null)
      }
      setIsLoading(false)
    }, 1500)
  }

  const getStatusIcon = (status: OrderStatusType) => {
    switch (status) {
      case OrderStatus.PROCESSING:
        return <Clock className="text-yellow-600" size={24} />
      case OrderStatus.SHIPPED:
      case OrderStatus.IN_TRANSIT:
        return <Truck className="text-blue-600" size={24} />
      case OrderStatus.OUT_FOR_DELIVERY:
        return <MapPin className="text-orange-600" size={24} />
      case OrderStatus.DELIVERED:
        return <CheckCircle className="text-green-600" size={24} />
      default:
        return <Package className="text-gray-600" size={24} />
    }
  }

  const getStatusText = (status: OrderStatusType) => {
    switch (status) {
      case OrderStatus.PROCESSING:
        return 'Processing'
      case OrderStatus.SHIPPED:
        return 'Shipped'
      case OrderStatus.IN_TRANSIT:
        return 'In Transit'
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'Out for Delivery'
      case OrderStatus.DELIVERED:
        return 'Delivered'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = (status: OrderStatusType) => {
    switch (status) {
      case OrderStatus.PROCESSING:
        return 'text-yellow-600 bg-yellow-50'
      case OrderStatus.SHIPPED:
      case OrderStatus.IN_TRANSIT:
        return 'text-blue-600 bg-blue-50'
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'text-orange-600 bg-orange-50'
      case OrderStatus.DELIVERED:
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="section-shell pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-brown-dark mb-6 lg:mb-8">
            Track Your Order
          </h1>
          <p className="text-lg sm:text-xl text-brown/70 leading-relaxed">
            Enter your order number or tracking ID to see real-time updates on your AMAPELS jewelry delivery.
          </p>
        </div>
      </section>

      {/* Tracking Form */}
      <section className="section-shell pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-ivory border border-brown/20 rounded-lg p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="orderNumber" className="block text-sm font-medium text-brown-dark mb-2">
                  Order Number or Tracking ID
                </label>
                <input
                  id="orderNumber"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., AMP2024001 or TRK789012345"
                  className="w-full px-4 py-3 border border-brown/20 rounded-md text-brown-dark placeholder:text-brown/40 focus:ring-2 focus:ring-brown/20 focus:border-brown min-h-[44px] text-base"
                  onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                />
              </div>
              <div className="sm:pt-7">
                <button
                  onClick={handleTrackOrder}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-brown-dark text-ivory text-sm font-medium rounded-md hover:bg-brown transition-colors disabled:opacity-50 btn-mobile"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-ivory border-t-transparent rounded-full"></div>
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      Track Order
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tracking Results */}
      {trackingData && (
        <section className="section-shell pb-16 lg:pb-24">
          <div className="max-w-4xl mx-auto">
            {/* Order Summary */}
            <div className="bg-ivory border border-brown/20 rounded-lg p-6 lg:p-8 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h2 className="font-serif text-xl lg:text-2xl font-light text-brown-dark mb-2">
                    Order #{trackingData.orderId}
                  </h2>
                  <p className="text-brown/70 mb-4">
                    Tracking: <span className="font-medium text-brown-dark">{trackingData.trackingNumber}</span>
                  </p>
                  
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(trackingData.status)}`}>
                    {getStatusIcon(trackingData.status)}
                    <span className="font-medium">{getStatusText(trackingData.status)}</span>
                  </div>
                </div>

                <div className="text-left lg:text-right">
                  <div className="mb-4">
                    <p className="text-brown/70 text-sm mb-1">Current Location</p>
                    <p className="font-medium text-brown-dark">{trackingData.currentLocation}</p>
                  </div>
                  <div>
                    <p className="text-brown/70 text-sm mb-1">Estimated Delivery</p>
                    <p className="font-medium text-brown-dark">{trackingData.estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Courier Info */}
            <div className="bg-brown/5 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-brown-dark mb-4">Courier Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Truck size={20} className="text-brown-dark" />
                  <div>
                    <p className="font-medium text-brown-dark">{trackingData.courierName}</p>
                    <p className="text-brown/70 text-sm">Delivery Partner</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-brown-dark" />
                  <div>
                    <a 
                      href={`tel:${trackingData.courierPhone}`}
                      className="font-medium text-brown-dark hover:text-brown"
                    >
                      {trackingData.courierPhone}
                    </a>
                    <p className="text-brown/70 text-sm">Contact Courier</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-ivory border border-brown/20 rounded-lg p-6 lg:p-8">
              <h3 className="font-semibold text-brown-dark mb-6">Delivery Timeline</h3>
              
              <div className="relative">
                {trackingData.timeline.map((event, index) => (
                  <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
                    {/* Timeline Line */}
                    {index < trackingData.timeline.length - 1 && (
                      <div 
                        className={`absolute left-3 top-8 w-0.5 h-full ${
                          event.completed ? 'bg-green-300' : 'bg-gray-200'
                        }`}
                      />
                    )}
                    
                    {/* Timeline Dot */}
                    <div 
                      className={`relative z-10 w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                        event.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'bg-ivory border-gray-300'
                      }`}
                    >
                      {event.completed && (
                        <CheckCircle size={12} className="text-white absolute inset-0.5" />
                      )}
                    </div>
                    
                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                        <p className={`font-medium ${event.completed ? 'text-brown-dark' : 'text-brown/60'}`}>
                          {event.status}
                        </p>
                        <div className="text-sm text-brown/60">
                          <span>{event.date}</span>
                          {event.time !== 'Estimated' && (
                            <span className="ml-2">{event.time}</span>
                          )}
                          {event.time === 'Estimated' && (
                            <span className="ml-2 text-orange-600 font-medium">Estimated</span>
                          )}
                        </div>
                      </div>
                      <p className="text-brown/60 text-sm flex items-center gap-1">
                        <MapPin size={12} />
                        {event.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="bg-brown-dark text-ivory section-shell py-16 lg:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl lg:text-3xl font-light mb-6">
            Need Help with Your Order?
          </h2>
          <p className="text-ivory/80 leading-relaxed mb-8">
            If you have questions about your delivery or need to make changes to your order, 
            our customer service team is here to help.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a 
              href="mailto:orders@amapels.com"
              className="flex items-center justify-center gap-3 bg-ivory/10 rounded-lg p-4 hover:bg-ivory/20 transition-colors btn-mobile"
            >
              <Mail size={20} />
              <div className="text-left">
                <div className="font-medium">Order Support</div>
                <div className="text-sm text-ivory/70">orders@amapels.com</div>
              </div>
            </a>
            
            <a 
              href="tel:+234-809-123-4567"
              className="flex items-center justify-center gap-3 bg-ivory/10 rounded-lg p-4 hover:bg-ivory/20 transition-colors btn-mobile"
            >
              <Phone size={20} />
              <div className="text-left">
                <div className="font-medium">Call Support</div>
                <div className="text-sm text-ivory/70">+234-809-123-4567</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Demo Instructions */}
      <section className="section-shell py-16 lg:pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <AlertCircle size={20} />
              Demo Instructions
            </h3>
            <p className="text-blue-700 text-sm leading-relaxed mb-3">
              This is a demo page. To see tracking results, try entering:
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• <code className="bg-blue-100 px-2 py-1 rounded">AMP2024001</code> - Sample order number</li>
              <li>• <code className="bg-blue-100 px-2 py-1 rounded">TRK789012345</code> - Sample tracking number</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}