'use client'

import { MessageCircle } from 'lucide-react'

const BUSINESS_NUMBER = '2348161238148'

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${BUSINESS_NUMBER}?text=${encodeURIComponent("Hello AMAPELS, I have a question.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 left-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)] transition-transform duration-300 hover:scale-110 sm:bottom-6 sm:left-6 sm:h-12 sm:w-12"
    >
      <MessageCircle size={20} strokeWidth={2} />
    </a>
  )
}
