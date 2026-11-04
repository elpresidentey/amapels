'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, Clock, Mail, MapPin, Package, Search, Truck } from 'lucide-react'

const statuses = ['processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'] as const
type Status = typeof statuses[number]
type TrackingInfo = {
  orderId: string
  status: Status
  estimatedDelivery: string | null
  currentLocation: string
  trackingNumber: string | null
  courierName: string
  timeline: { date: string; time: string; status: string; location: string; completed: boolean }[]
}

export default function TrackOrderPage() {
  const [identifier, setIdentifier] = useState('')
  const [email, setEmail] = useState('')
  const [trackingData, setTrackingData] = useState<TrackingInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setIdentifier(params.get('orderNumber') || params.get('ref') || params.get('trackingNumber') || '')
  }, [])

  async function handleTrackOrder(event?: React.FormEvent) {
    event?.preventDefault()
    if (!identifier.trim() || !email.trim()) {
      setError('Enter your order number and the email used at checkout.')
      return
    }
    setIsLoading(true)
    setError('')
    setTrackingData(null)
    try {
      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, email }),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.error || 'Order not found. Check your details and try again.')
      setTrackingData(result.data)
    } catch (trackError) {
      setError(trackError instanceof Error ? trackError.message : 'Order tracking is temporarily unavailable.')
    } finally {
      setIsLoading(false)
    }
  }

  const statusText = (status: string) => status.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const statusIcon = (status: string) => status === 'delivered' ? <CheckCircle size={22} /> : status === 'processing' ? <Clock size={22} /> : status === 'out_for_delivery' ? <MapPin size={22} /> : <Truck size={22} />

  return (
    <div className="min-h-screen bg-paper">
      <section className="section-shell pt-16 pb-10 lg:pt-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl lg:text-4xl font-light text-ink mb-5">Track Your Order</h1>
          <p className="text-lg text-ink/70 leading-relaxed">Enter your order number and the email address used at checkout to view delivery updates.</p>
        </div>
      </section>

      <section className="section-shell pb-16">
        <form onSubmit={handleTrackOrder} className="max-w-2xl mx-auto bg-chrome border border-ink/15 rounded-lg p-6 lg:p-8 space-y-5">
          <div>
            <label htmlFor="orderNumber" className="block text-sm font-medium text-ink mb-2">Order Number or Tracking ID</label>
            <input id="orderNumber" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Order or tracking number" className="w-full px-4 py-3 border border-ink/45 rounded-md text-ink placeholder:text-ink/50 focus:ring-2 focus:ring-gold-ink/40 focus:border-ink min-h-[44px] text-base" />
          </div>
          <div>
            <label htmlFor="trackingEmail" className="block text-sm font-medium text-ink mb-2">Checkout Email</label>
            <input id="trackingEmail" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 border border-ink/45 rounded-md text-ink placeholder:text-ink/50 focus:ring-2 focus:ring-gold-ink/40 focus:border-ink min-h-[44px] text-base" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-ink text-on-ink text-sm font-medium rounded-md hover:bg-gold hover:text-black-dark transition-colors disabled:opacity-50">
            {isLoading ? <><span className="animate-spin h-4 w-4 border-2 border-on-ink border-t-transparent rounded-full" />Checking...</> : <><Search size={16} />Track Order</>}
          </button>
          {error && <div role="alert" className="flex items-center gap-3 p-4 bg-danger-soft border border-danger-line rounded-md"><AlertCircle size={20} className="text-danger flex-shrink-0" /><p className="text-danger text-sm">{error}</p></div>}
        </form>
      </section>

      {trackingData && <section className="section-shell pb-16 lg:pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-chrome border border-ink/15 rounded-lg p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-5">
              <div>
                <h2 className="font-serif text-2xl text-ink mb-2">Order #{trackingData.orderId}</h2>
                <p className="text-ink/70 mb-4">Tracking: <span className="font-medium text-ink">{trackingData.trackingNumber || 'Pending'}</span></p>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 text-ink">{statusIcon(trackingData.status)}{statusText(trackingData.status)}</span>
              </div>
              <div className="sm:text-right space-y-3">
                <div><p className="text-ink/65 text-sm">Current Location</p><p className="font-medium text-ink">{trackingData.currentLocation}</p></div>
                <div><p className="text-ink/65 text-sm">Estimated Delivery</p><p className="font-medium text-ink">{trackingData.estimatedDelivery ? new Date(trackingData.estimatedDelivery).toLocaleDateString() : 'To be determined'}</p></div>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-ink/15 flex items-center gap-3 text-sm text-ink/70"><Package size={18} />Delivery partner: <span className="font-medium text-ink">{trackingData.courierName}</span></div>
          </div>
          <div className="bg-chrome border border-ink/15 rounded-lg p-6 lg:p-8">
            <h3 className="font-semibold text-ink mb-6">Delivery Timeline</h3>
            {trackingData.timeline.length ? <div className="space-y-5">{trackingData.timeline.map((event, index) => <div key={`${event.date}-${index}`} className="flex gap-4">
              <div className={`mt-1 h-5 w-5 rounded-full border-2 flex-shrink-0 ${event.completed ? 'bg-success border-success' : 'border-ink/25'}`} />
              <div className="min-w-0"><p className={`font-medium ${event.completed ? 'text-ink' : 'text-ink/60'}`}>{event.status || 'Order update'}</p><p className="text-sm text-ink/60">{[event.date, event.time].filter(Boolean).join(' · ')}</p>{event.location && <p className="text-ink/60 text-sm flex items-center gap-1 mt-1"><MapPin size={12} />{event.location}</p>}</div>
            </div>)}</div> : <p className="text-sm text-ink/65">No delivery updates yet. Please check again later.</p>}
          </div>
        </div>
      </section>}

      <section className="bg-chrome text-ink section-shell py-12"><div className="text-center"><h2 className="font-serif text-2xl font-light mb-3">Need Help with Your Order?</h2><a href="mailto:amapelsng@gmail.com" className="inline-flex items-center gap-2 text-sm underline"><Mail size={16} />amapelsng@gmail.com</a></div></section>
    </div>
  )
}
