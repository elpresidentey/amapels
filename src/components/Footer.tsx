import Link from 'next/link'
import { Instagram, Facebook, Twitter, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-brown/8 bg-[#140f0a] text-ivory">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 sm:py-12 md:px-12 lg:px-24 lg:py-24">
        <div className="mb-10 grid grid-cols-1 gap-6 sm:mb-12 sm:gap-8 md:gap-12 md:grid-cols-2 lg:mb-20 lg:gap-16 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr]">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.42em] text-ivory/45 sm:mb-4 lg:mb-6">Amapels Lagos</p>
            <h2 className="font-serif text-xl font-light leading-snug sm:text-2xl lg:text-3xl">Exquisite Nigerian jewelry, crafted to be treasured.</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/62 sm:mt-4 lg:mt-6">
              A curated destination for statement pieces, timeless treasures, artisan craftsmanship, and jewelry that celebrates your every moment.
            </p>
            <div className="mt-5 flex space-x-3 sm:mt-6 sm:space-x-4 lg:mt-10">
              <a 
                href="https://instagram.com/amapels" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/55 transition-colors hover:text-white"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={18} className="sm:w-[19px] sm:h-[19px]" />
              </a>
              <a 
                href="https://facebook.com/amapels" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/55 transition-colors hover:text-white"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={18} className="sm:w-[19px] sm:h-[19px]" />
              </a>
              <a 
                href="https://twitter.com/amapels" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/55 transition-colors hover:text-white"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={18} className="sm:w-[19px] sm:h-[19px]" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.38em] text-ivory/45 sm:mb-4 lg:mb-7">Discover</h3>
            <ul className="space-y-2 lg:space-y-3">
              <li><Link href="/collections" className="text-sm text-ivory/65 transition-colors hover:text-white">Collections</Link></li>
              <li><Link href="/shop" className="text-sm text-ivory/65 transition-colors hover:text-white">All Jewelry</Link></li>
              <li><Link href="/shop?category=Earrings" className="text-sm text-ivory/65 transition-colors hover:text-white">Earrings</Link></li>
              <li><Link href="/shop?category=Necklaces" className="text-sm text-ivory/65 transition-colors hover:text-white">Necklaces</Link></li>
              <li><Link href="/shop?category=Bracelets" className="text-sm text-ivory/65 transition-colors hover:text-white">Bracelets</Link></li>
              <li><Link href="/shop?category=Jewellery%20Sets" className="text-sm text-ivory/65 transition-colors hover:text-white">Jewelry Sets</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.38em] text-ivory/45 sm:mb-4 lg:mb-7">About</h3>
            <ul className="space-y-2 lg:space-y-3">
              <li><Link href="/story" className="text-sm text-ivory/65 transition-colors hover:text-white">Our Story</Link></li>
              <li><Link href="/contact" className="text-sm text-ivory/65 transition-colors hover:text-white">Contact Us</Link></li>
              <li><Link href="/artisan-process" className="text-sm text-ivory/65 transition-colors hover:text-white">Artisan Process</Link></li>
              <li><Link href="/gift-guide" className="text-sm text-ivory/65 transition-colors hover:text-white">Gift Guide</Link></li>
              <li><Link href="/care-guide" className="text-sm text-ivory/65 transition-colors hover:text-white">Jewelry Care</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.38em] text-ivory/45 sm:mb-4 lg:mb-7">Support</h3>
            <ul className="space-y-2 lg:space-y-3">
              <li><Link href="/shipping-returns" className="text-sm text-ivory/65 transition-colors hover:text-white">Shipping & Returns</Link></li>
              <li><Link href="/size-guide" className="text-sm text-ivory/65 transition-colors hover:text-white">Size Guide</Link></li>
              <li><Link href="/faq" className="text-sm text-ivory/65 transition-colors hover:text-white">FAQ</Link></li>
              <li><Link href="/track-order" className="text-sm text-ivory/65 transition-colors hover:text-white">Track Your Order</Link></li>
              <li><Link href="/privacy" className="text-sm text-ivory/65 transition-colors hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ivory/10 pt-5 sm:pt-6 lg:pt-8">
          <div className="flex flex-col items-start justify-between gap-3 sm:gap-4 md:flex-row md:items-center lg:gap-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <p className="text-xs text-ivory/42 sm:text-sm">
                © 2026 AMAPELS. All rights reserved.
              </p>
              <span className="hidden sm:inline text-ivory/20">•</span>
              <p className="text-xs text-ivory/30 sm:text-sm">
                Made by IEL
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-7">
              <Link href="/terms" className="text-xs text-ivory/58 transition-colors hover:text-white sm:text-sm">Terms</Link>
              <Link href="/privacy" className="text-xs text-ivory/58 transition-colors hover:text-white sm:text-sm">Privacy</Link>
              <a href="tel:+234-809-123-4567" className="flex items-center gap-1.5 text-xs text-ivory/58 transition-colors hover:text-white sm:gap-2 sm:text-sm">
                <Phone size={13} className="sm:w-[14px] sm:h-[14px]" />
                <span className="hidden sm:inline">+234-809-123-4567</span>
                <span className="sm:hidden">Call</span>
              </a>
              <a href="mailto:hello@amapels.com" className="flex items-center gap-1.5 text-xs text-ivory/58 transition-colors hover:text-white sm:gap-2 sm:text-sm">
                <Mail size={13} className="sm:w-[14px] sm:h-[14px]" />
                <span className="hidden sm:inline">hello@amapels.com</span>
                <span className="sm:hidden">Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
