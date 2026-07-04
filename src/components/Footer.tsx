import Link from 'next/link'
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-brown/8 bg-[#140f0a] text-ivory">
      <div className="max-w-7xl mx-auto px-6 py-20 md:px-12 lg:px-24 lg:py-24">
        <div className="mb-20 grid grid-cols-1 gap-16 md:grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr]">
          <div>
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.42em] text-ivory/45">Amapels Lagos</p>
            <h2 className="font-serif text-3xl font-light leading-snug">Exquisite Nigerian jewelry, crafted to be treasured.</h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/62">
              A curated destination for statement pieces, timeless treasures, artisan craftsmanship, and jewelry that celebrates your every moment.
            </p>
            <div className="mt-10 flex space-x-4">
              <a href="#" className="text-ivory/55 transition-colors hover:text-white">
                <Instagram size={19} />
              </a>
              <a href="#" className="text-ivory/55 transition-colors hover:text-white">
                <Facebook size={19} />
              </a>
              <a href="#" className="text-ivory/55 transition-colors hover:text-white">
                <Twitter size={19} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-7 text-[10px] font-semibold uppercase tracking-[0.38em] text-ivory/45">Discover</h3>
            <ul className="space-y-3">
              <li><Link href="/collections" className="text-sm text-ivory/65 transition-colors hover:text-white">Collections</Link></li>
              <li><Link href="/shop" className="text-sm text-ivory/65 transition-colors hover:text-white">All Jewelry</Link></li>
              <li><Link href="/shop?category=Earrings" className="text-sm text-ivory/65 transition-colors hover:text-white">Earrings</Link></li>
              <li><Link href="/shop?category=Bracelets" className="text-sm text-ivory/65 transition-colors hover:text-white">Bracelets</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-7 text-[10px] font-semibold uppercase tracking-[0.38em] text-ivory/45">About</h3>
            <ul className="space-y-3">
              <li><Link href="/story" className="text-sm text-ivory/65 transition-colors hover:text-white">Our Story</Link></li>
              <li><Link href="/contact" className="text-sm text-ivory/65 transition-colors hover:text-white">Contact Us</Link></li>
              <li><Link href="#" className="text-sm text-ivory/65 transition-colors hover:text-white">Artisan Process</Link></li>
              <li><Link href="#" className="text-sm text-ivory/65 transition-colors hover:text-white">The Gift Edit</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-7 text-[10px] font-semibold uppercase tracking-[0.38em] text-ivory/45">Support</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-ivory/65 transition-colors hover:text-white">Delivery & Returns</Link></li>
              <li><Link href="#" className="text-sm text-ivory/65 transition-colors hover:text-white">Jewelry Care Guide</Link></li>
              <li><Link href="#" className="text-sm text-ivory/65 transition-colors hover:text-white">FAQ</Link></li>
              <li><Link href="/privacy" className="text-sm text-ivory/65 transition-colors hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ivory/10 pt-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <p className="text-sm text-ivory/42">
              © 2026 AMAPELS. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-7">
              <Link href="/terms" className="text-sm text-ivory/58 transition-colors hover:text-white">Terms</Link>
              <Link href="/privacy" className="text-sm text-ivory/58 transition-colors hover:text-white">Privacy</Link>
              <Link href="/contact" className="flex items-center gap-2 text-sm text-ivory/58 transition-colors hover:text-white">
                <Mail size={14} />
                hello@amapels.com
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
