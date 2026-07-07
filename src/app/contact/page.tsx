'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSubmitted(true)
    setIsSubmitting(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-16">
        <div className="section-shell">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-accent-emerald rounded-full flex items-center justify-center mx-auto mb-6">
              <Send size={24} className="text-white" />
            </div>
            <h1 className="font-serif text-3xl font-light text-black-dark mb-4">Your Message Has Been Sent</h1>
            <p className="text-black/70 mb-8">Thank you for reaching out. Our team will respond within 24 hours with the care your inquiry deserves.</p>
            <button 
              onClick={() => {
                setSubmitted(false)
                setFormData({ name: '', email: '', subject: '', message: '' })
              }}
              className="bg-black-light-dark text-white px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-gold transition-colors"
            >
              Send Another Message
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-16">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-black/50 mb-4">Connect With Us</p>
            <h1 className="font-serif text-5xl font-light text-black-dark mb-6">Get In Touch</h1>
            <p className="text-lg text-black/70 max-w-2xl mx-auto">
              Share your jewelry dreams with us - we're here to bring them to life with care and artistry.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="font-serif text-2xl text-black-dark mb-8">We're Here For You</h2>
              
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-primary-light/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-black-dark" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black-dark mb-2">Email Us</h3>
                    <p className="text-black/70">hello@amapels.com</p>
                    <p className="text-black/70">support@amapels.com</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-primary-light/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-black-dark" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black-dark mb-2">Call Us</h3>
                    <p className="text-black/70">+234 (0) 812 345 6789</p>
                    <p className="text-black/70">+234 (0) 901 234 5678</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-primary-light/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-black-dark" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black-dark mb-2">Visit Us</h3>
                    <p className="text-black/70">123 Victoria Island,</p>
                    <p className="text-black/70">Lagos, Nigeria</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-primary-light/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-black-dark" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black-dark mb-2">Business Hours</h3>
                    <p className="text-black/70">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-black/70">Sat: 10:00 AM - 4:00 PM</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-3xl border border-gold/30 p-8 md:p-12">
                <h2 className="font-serif text-2xl text-black-dark mb-8">Share Your Vision</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-black-dark mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-gray-800-dark outline-none transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-black-dark mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-gray-800-dark outline-none transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-black-dark mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-gray-800-dark outline-none transition-colors"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-black-dark mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gold rounded-xl focus:ring-2 focus:ring-brown/20 focus:border-gray-800-dark outline-none transition-colors resize-vertical"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black-light-dark text-white py-4 px-8 rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Sending...' : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}