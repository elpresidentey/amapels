import { Metadata } from 'next'
import { Truck, Clock, Shield, RotateCcw, Package, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shipping & Returns - AMAPELS',
  description: 'Learn about our shipping options, delivery times, and return policy. Free shipping on orders over ₦50,000 with secure packaging and easy returns.',
}

export default function ShippingReturnsPage() {
  const shippingOptions = [
    {
      method: 'Standard Delivery',
      time: '3-5 Business Days',
      cost: '₦2,500',
      description: 'Reliable delivery across Nigeria with tracking',
      icon: Truck
    },
    {
      method: 'Express Delivery',
      time: '1-2 Business Days',
      cost: '₦5,000',
      description: 'Priority delivery for urgent orders',
      icon: Clock
    },
    {
      method: 'Premium Delivery',
      time: 'Same Day (Lagos)',
      cost: '₦8,000',
      description: 'Same-day delivery within Lagos Island & Victoria Island',
      icon: Package
    }
  ]

  const locations = [
    {
      city: 'Lagos',
      areas: ['Victoria Island', 'Ikoyi', 'Lekki', 'Surulere', 'Ikeja'],
      delivery: 'Same day / Next day available'
    },
    {
      city: 'Abuja',
      areas: ['Maitama', 'Asokoro', 'Wuse', 'Garki', 'Gwarinpa'],
      delivery: '1-2 business days'
    },
    {
      city: 'Port Harcourt',
      areas: ['GRA', 'Old GRA', 'Trans Amadi', 'Rumuola'],
      delivery: '2-3 business days'
    },
    {
      city: 'Kano',
      areas: ['Nasarawa', 'Fagge', 'Municipal', 'Tarauni'],
      delivery: '3-4 business days'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-shell pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-black-dark mb-6 lg:mb-8">
            Shipping & Returns
          </h1>
          <p className="text-lg sm:text-xl text-black/70 leading-relaxed">
            We ensure your AMAPELS jewelry reaches you safely and beautifully packaged. 
            Enjoy free shipping on orders over ₦50,000 and hassle-free returns within 30 days.
          </p>
        </div>
      </section>

      {/* Free Shipping Banner */}
      <section className="section-shell pb-16">
        <div className="bg-black text-white rounded-2xl p-6 lg:p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <Truck size={24} className="text-white" />
          </div>
          <h2 className="font-serif text-xl lg:text-2xl font-light mb-2">
            Free Shipping on Orders ₦50,000+
          </h2>
          <p className="text-white/80 text-sm">
            Enjoy complimentary standard delivery on qualifying orders across Nigeria
          </p>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="section-shell pb-16 lg:pb-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-2xl lg:text-3xl font-light text-black-dark mb-4">
            Delivery Options
          </h2>
          <p className="text-black/70 max-w-2xl mx-auto">
            Choose the delivery speed that works best for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {shippingOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-black-light/5 rounded-full mb-4">
                  <Icon size={24} className="text-black-dark" />
                </div>
                <h3 className="font-semibold text-lg text-black-dark mb-2">
                  {option.method}
                </h3>
                <p className="text-black font-medium mb-2">
                  {option.time}
                </p>
                <p className="text-black-dark text-xl font-semibold mb-3">
                  {option.cost}
                </p>
                <p className="text-black/70 text-sm">
                  {option.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Delivery Areas */}
      <section className="bg-black-light/5 section-shell py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-2xl lg:text-3xl font-light text-black-dark mb-4">
            Delivery Areas
          </h2>
          <p className="text-black/70 max-w-2xl mx-auto">
            We deliver to major cities across Nigeria with varying delivery times
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {locations.map((location, index) => (
            <div key={index} className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-black-dark" />
                <h3 className="font-semibold text-black-dark">
                  {location.city}
                </h3>
              </div>
              <p className="text-black text-sm font-medium mb-3">
                {location.delivery}
              </p>
              <ul className="space-y-1">
                {location.areas.map((area, idx) => (
                  <li key={idx} className="text-black/70 text-xs">
                    • {area}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Returns Policy */}
      <section className="section-shell py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-2xl lg:text-3xl font-light text-black-dark mb-4">
            Easy Returns
          </h2>
          <p className="text-black/70 max-w-2xl mx-auto">
            We want you to love your AMAPELS jewelry. If you're not completely satisfied, 
            returns are easy and hassle-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <RotateCcw size={24} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-lg text-black-dark mb-2">
              30-Day Returns
            </h3>
            <p className="text-black/70 text-sm leading-relaxed">
              Return unworn items in original packaging within 30 days of delivery
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield size={24} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg text-black-dark mb-2">
              Free Return Shipping
            </h3>
            <p className="text-black/70 text-sm leading-relaxed">
              We cover return shipping costs for orders over ₦30,000
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Clock size={24} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg text-black-dark mb-2">
              Quick Refunds
            </h3>
            <p className="text-black/70 text-sm leading-relaxed">
              Refunds processed within 3-5 business days after we receive your return
            </p>
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="bg-black text-white section-shell py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-2xl lg:text-3xl font-light mb-4">
            How to Return
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Follow these simple steps to return your order
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full text-white font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold text-white mb-2">
                Contact Us
              </h3>
              <p className="text-white/70 text-sm">
                Email us at returns@amapels.com with your order number
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full text-white font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold text-white mb-2">
                Get Return Label
              </h3>
              <p className="text-white/70 text-sm">
                We'll send you a prepaid return shipping label
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full text-white font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold text-white mb-2">
                Pack & Ship
              </h3>
              <p className="text-white/70 text-sm">
                Package items in original packaging and ship back to us
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full text-white font-bold mb-4">
                4
              </div>
              <h3 className="font-semibold text-white mb-2">
                Get Refund
              </h3>
              <p className="text-white/70 text-sm">
                Receive your refund once we process the returned item
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Packaging & Security */}
      <section className="section-shell py-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="font-serif text-2xl lg:text-3xl font-light text-black-dark mb-6">
              Secure & Beautiful Packaging
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-black-dark mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-black-dark mb-1">Tamper-Proof Security</h3>
                  <p className="text-black/70 text-sm">All packages are sealed with security tape and tracking enabled</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package size={20} className="text-black-dark mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-black-dark mb-1">Protective Packaging</h3>
                  <p className="text-black/70 text-sm">Jewelry arrives in cushioned boxes with anti-tarnish protection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck size={20} className="text-black-dark mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-black-dark mb-1">Insured Delivery</h3>
                  <p className="text-black/70 text-sm">All shipments are fully insured and require signature upon delivery</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black-light/5 rounded-2xl p-8">
            <h3 className="font-serif text-xl font-light text-black-dark mb-4">
              Need Help with Your Order?
            </h3>
            <p className="text-black/70 text-sm leading-relaxed mb-6">
              Our customer care team is here to help with any shipping or return questions. 
              Contact us for order updates, delivery tracking, or return assistance.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-black/60">Email:</span>
                <a href="mailto:help@amapels.com" className="text-black-dark hover:text-black">
                  help@amapels.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-black/60">Phone:</span>
                <a href="tel:+234-809-123-4567" className="text-black-dark hover:text-black">
                  +234-809-123-4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-black/60">Hours:</span>
                <span className="text-black-dark">Mon-Sat 9AM-6PM WAT</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
