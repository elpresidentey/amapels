'use client'

import { motion } from 'framer-motion'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ivory pt-28 pb-16">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-brown/50 mb-4">Legal</p>
            <h1 className="font-serif text-5xl font-light text-brown-dark mb-6">Terms of Service</h1>
            <p className="text-lg text-brown/70">
              Last updated: July 2026
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-sand/30 p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">1. Acceptance of Terms</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  By accessing and using AMAPELS website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">2. Use License</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  Permission is granted to temporarily download one copy of the materials on AMAPELS website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 text-brown/80 space-y-2">
                  <li>modify or copy the materials;</li>
                  <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial);</li>
                  <li>attempt to decompile or reverse engineer any software contained on AMAPELS website;</li>
                  <li>remove any copyright or other proprietary notations from the materials.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">3. Product Information</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. Colors and details may vary from what appears on your screen.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">4. Purchases and Payment</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  All purchases are subject to product availability. We reserve the right to limit quantities and refuse service to anyone. Prices are subject to change without notice. Payment must be received before shipment of goods.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">5. Shipping and Returns</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  We ship within Nigeria and internationally. Shipping costs and delivery times vary by location. We offer a 30-day return policy for unused items in original packaging. Custom or personalized items cannot be returned.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">6. Privacy Policy</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">7. Disclaimer</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  The materials on AMAPELS website are provided on an 'as is' basis. AMAPELS makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">8. Limitations</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  In no event shall AMAPELS or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AMAPELS website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">9. Governing Law</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  These terms and conditions are governed by and construed in accordance with the laws of Nigeria and you irrevocably submit to the exclusive jurisdiction of the courts in Lagos State.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-brown-dark mb-4">10. Contact Information</h2>
                <p className="text-brown/80 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 text-brown/80">
                  <p>Email: legal@amapels.com</p>
                  <p>Phone: +234 (0) 812 345 6789</p>
                  <p>Address: 123 Victoria Island, Lagos, Nigeria</p>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}