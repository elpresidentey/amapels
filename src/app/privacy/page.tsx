'use client'

import { motion } from 'framer-motion'

export default function PrivacyPage() {
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
            <h1 className="font-serif text-5xl font-light text-brown-dark mb-6">Privacy Policy</h1>
            <p className="text-lg text-brown/70">
              Last updated: July 2026
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-sand/30 p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">1. Information We Collect</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This may include:
                </p>
                <ul className="list-disc pl-6 text-brown/80 space-y-2">
                  <li>Name, email address, and phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely through our payment providers)</li>
                  <li>Communication preferences and correspondence with us</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">2. How We Use Your Information</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-brown/80 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders and account</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">3. Information Sharing</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-brown/80 space-y-2">
                  <li>Service providers who help us operate our business (shipping, payment processing, etc.)</li>
                  <li>Legal requirements or to protect our rights</li>
                  <li>Business transfers (mergers, acquisitions, etc.)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">4. Data Security</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">5. Cookies and Tracking</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookies through your browser settings, but this may affect the functionality of our site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">6. Your Rights</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-brown/80 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Object to certain types of processing</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">7. Data Retention</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">8. International Transfers</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  Your information may be transferred to and processed in countries outside Nigeria. We ensure appropriate safeguards are in place to protect your personal information in accordance with this policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">9. Children's Privacy</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will take steps to delete the information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl text-brown-dark mb-4">10. Changes to This Policy</h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "last updated" date.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-brown-dark mb-4">11. Contact Us</h2>
                <p className="text-brown/80 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 text-brown/80">
                  <p>Email: privacy@amapels.com</p>
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