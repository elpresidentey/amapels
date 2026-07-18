'use client'

import { Metadata } from 'next'
import { useState } from 'react'
import { ChevronDown, Search, Package, CreditCard, RefreshCw, Shield, Mail, Phone } from 'lucide-react'

const metadata: Metadata = {
  title: 'FAQ - AMAPELS',
  description: 'Find answers to frequently asked questions about AMAPELS jewelry, shipping, returns, care instructions, and more.',
}

const FAQAccordion = ({ question, answer, isOpen, onToggle }: {
  question: string
  answer: string | React.ReactNode
  isOpen: boolean
  onToggle: () => void
}) => {
  return (
    <div className="border-b border-gray-800/10 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 lg:py-6 text-left hover:text-black transition-colors"
      >
        <h3 className="font-medium text-black-dark pr-4">{question}</h3>
        <ChevronDown 
          size={20} 
          className={`text-black/60 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <div className="pb-4 lg:pb-6">
          <div className="text-black/70 leading-relaxed prose prose-sm max-w-none">
            {answer}
          </div>
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Questions', icon: Search },
    { id: 'orders', name: 'Orders & Shipping', icon: Package },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'returns', name: 'Returns & Exchanges', icon: RefreshCw },
    { id: 'care', name: 'Jewelry Care', icon: Shield }
  ]

  const faqs = [
    {
      category: 'orders',
      question: 'How long does shipping take?',
      answer: (
        <div>
          <p className="mb-2">Shipping times depend on your location and chosen method:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Lagos:</strong> Same day or next day delivery available</li>
            <li><strong>Abuja:</strong> 1-2 business days</li>
            <li><strong>Other major cities:</strong> 2-4 business days</li>
            <li><strong>Rural areas:</strong> 3-7 business days</li>
          </ul>
          <p className="mt-2">Free shipping is available on orders over ₦50,000.</p>
        </div>
      )
    },
    {
      category: 'orders',
      question: 'Do you ship internationally?',
      answer: 'Currently, we only ship within Nigeria. We are working on expanding our international shipping options. Sign up for our newsletter to be notified when international shipping becomes available.'
    },
    {
      category: 'orders',
      question: 'Can I track my order?',
      answer: (
        <div>
          <p>Yes! Once your order ships, you'll receive:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>A tracking number via email and SMS</li>
            <li>Real-time updates on your order status</li>
            <li>Estimated delivery time</li>
          </ul>
          <p className="mt-2">You can also track your order on our <a href="/track-order" className="text-black-dark underline">Track Order page</a>.</p>
        </div>
      )
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: (
        <div>
          <p className="mb-2">We accept multiple secure payment methods:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Debit/Credit Cards (Visa, Mastercard, Verve)</li>
            <li>Bank transfers</li>
            <li>Mobile money (MTN, Airtel, 9mobile)</li>
            <li>USSD payments</li>
          </ul>
          <p className="mt-2">All payments are processed securely through Paystack with SSL encryption.</p>
        </div>
      )
    },
    {
      category: 'payment',
      question: 'Is my payment information secure?',
      answer: 'Absolutely. We use Paystack\'s secure payment gateway with 256-bit SSL encryption. We never store your payment information on our servers. All transactions are PCI DSS compliant for maximum security.'
    },
    {
      category: 'payment',
      question: 'Can I pay in installments?',
      answer: 'Currently, we only accept full payment at checkout. However, we\'re exploring payment plan options and will notify customers when this becomes available.'
    },
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: (
        <div>
          <p className="mb-2">We offer a 30-day return policy:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Items must be unworn and in original packaging</li>
            <li>Return shipping is free for orders over ₦30,000</li>
            <li>Refunds are processed within 3-5 business days</li>
            <li>Custom or personalized items cannot be returned</li>
          </ul>
          <p className="mt-2">Contact us at returns@amapels.com to start a return.</p>
        </div>
      )
    },
    {
      category: 'returns',
      question: 'Can I exchange my jewelry for a different size?',
      answer: 'Yes! We offer free size exchanges within 30 days of purchase. The item must be unworn and in original condition. Contact our customer service team to arrange a size exchange.'
    },
    {
      category: 'returns',
      question: 'What if my jewelry arrives damaged?',
      answer: 'If your jewelry arrives damaged, please contact us immediately at help@amapels.com with photos of the damage. We will arrange for a replacement or full refund at no cost to you. All shipments are insured for your protection.'
    },
    {
      category: 'care',
      question: 'How should I clean my jewelry?',
      answer: (
        <div>
          <p className="mb-2">Cleaning depends on the material:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Silver:</strong> Use a silver polishing cloth regularly</li>
            <li><strong>Gold:</strong> Clean with warm water and mild soap</li>
            <li><strong>Pearls:</strong> Wipe with a damp cloth only</li>
            <li><strong>Gemstones:</strong> Gentle soap and soft brush</li>
          </ul>
          <p className="mt-2">See our <a href="/care-guide" className="text-black-dark underline">complete care guide</a> for detailed instructions.</p>
        </div>
      )
    },
    {
      category: 'care',
      question: 'How should I store my jewelry?',
      answer: 'Store jewelry in individual soft pouches or lined compartments to prevent scratching. Keep pieces away from moisture, direct sunlight, and chemicals. Use anti-tarnish strips for silver jewelry.'
    },
    {
      category: 'orders',
      question: 'Do you offer gift wrapping?',
      answer: 'Yes! All orders come with complimentary luxury gift packaging. You can also add a personal message during checkout. For special gift wrapping requests, contact our customer service team.'
    },
    {
      category: 'orders',
      question: 'Can I cancel or modify my order?',
      answer: 'Orders can be cancelled or modified within 2 hours of placement if they haven\'t been processed for shipping. Contact us immediately at help@amapels.com if you need to make changes.'
    },
    {
      category: 'payment',
      question: 'Do you offer warranties on your jewelry?',
      answer: 'Yes, all AMAPELS jewelry comes with a 1-year warranty against manufacturing defects. This covers issues like broken clasps, loose stones (not from wear), or plating issues. Normal wear and tear is not covered.'
    },
    {
      category: 'care',
      question: 'My silver jewelry is tarnishing. Is this normal?',
      answer: 'Yes, silver naturally tarnishes when exposed to air and moisture. This is completely normal and easily reversible. Regular cleaning with a silver cloth will restore the shine. Proper storage with anti-tarnish strips helps prevent tarnishing.'
    },
    {
      category: 'orders',
      question: 'Do you have a physical store?',
      answer: 'Currently, AMAPELS operates exclusively online to offer the best prices and widest selection. However, we do have showroom appointments available in Lagos for VIP customers. Contact us to schedule a private viewing.'
    }
  ]

  const filteredFAQs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-shell pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-black-dark mb-6 lg:mb-8">
            Frequently Asked Questions
          </h1>
          <p className="text-lg sm:text-xl text-black/70 leading-relaxed">
            Find answers to common questions about ordering, shipping, returns, and caring for your AMAPELS jewelry.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section-shell pb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all btn-mobile ${
                  activeCategory === category.id
                    ? 'bg-black text-white'
                    : 'bg-black-light/5 text-black hover:bg-gold/10'
                }`}
              >
                <Icon size={16} />
                {category.name}
              </button>
            )
          })}
        </div>
      </section>

      {/* FAQ List */}
      <section className="section-shell pb-16 lg:pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-800/10 rounded-lg">
            {filteredFAQs.map((faq, index) => (
              <FAQAccordion
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onToggle={() => toggleFAQ(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-black text-white section-shell py-16 lg:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl lg:text-3xl font-light mb-6">
            Still Need Help?
          </h2>
          <p className="text-white/80 leading-relaxed mb-8">
            Can't find the answer you're looking for? Our customer service team is here to help. 
            Reach out and we'll get back to you as soon as possible.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <a 
              href="mailto:help@amapels.com"
              className="flex items-center justify-center gap-3 bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors btn-mobile"
            >
              <Mail size={20} />
              <div className="text-left">
                <div className="font-medium">Email Support</div>
                <div className="text-sm text-white/70">help@amapels.com</div>
              </div>
            </a>
            
            <a 
              href="tel:+234-809-123-4567"
              className="flex items-center justify-center gap-3 bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors btn-mobile"
            >
              <Phone size={20} />
              <div className="text-left">
                <div className="font-medium">Phone Support</div>
                <div className="text-sm text-white/70">+234-809-123-4567</div>
              </div>
            </a>
          </div>
          
          <p className="text-white/60 text-sm">
            Customer service hours: Monday - Saturday, 9AM - 6PM WAT
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section-shell py-16 lg:pb-24">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl font-light text-black-dark mb-4">
            Popular Help Topics
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <a href="/shipping-returns" className="bg-black-light/5 rounded-lg p-6 text-center hover:bg-gold/10 transition-colors group">
            <Package size={24} className="mx-auto mb-3 text-black-dark group-hover:text-black" />
            <h3 className="font-medium text-black-dark mb-2">Shipping Info</h3>
            <p className="text-black/70 text-sm">Delivery times and costs</p>
          </a>
          
          <a href="/size-guide" className="bg-black-light/5 rounded-lg p-6 text-center hover:bg-gold/10 transition-colors group">
            <Shield size={24} className="mx-auto mb-3 text-black-dark group-hover:text-black" />
            <h3 className="font-medium text-black-dark mb-2">Size Guide</h3>
            <p className="text-black/70 text-sm">Find your perfect fit</p>
          </a>
          
          <a href="/care-guide" className="bg-black-light/5 rounded-lg p-6 text-center hover:bg-gold/10 transition-colors group">
            <Shield size={24} className="mx-auto mb-3 text-black-dark group-hover:text-black" />
            <h3 className="font-medium text-black-dark mb-2">Jewelry Care</h3>
            <p className="text-black/70 text-sm">Keep pieces beautiful</p>
          </a>
          
          <a href="/track-order" className="bg-black-light/5 rounded-lg p-6 text-center hover:bg-gold/10 transition-colors group">
            <Search size={24} className="mx-auto mb-3 text-black-dark group-hover:text-black" />
            <h3 className="font-medium text-black-dark mb-2">Track Order</h3>
            <p className="text-black/70 text-sm">Check delivery status</p>
          </a>
        </div>
      </section>
    </div>
  )
}
