import Link from 'next/link'
import { Instagram, Facebook, Twitter, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-black-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-12 lg:px-24 lg:py-24">
        {/* Top brand strip */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 border-b border-white/[0.06] pb-10 sm:mb-14 sm:pb-12 md:flex-row md:items-end lg:mb-16">
          <div>
            <Link href="/" className="font-serif text-2xl font-light tracking-[0.28em] text-white uppercase sm:text-3xl">
              AMAPELS
            </Link>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55 sm:mt-4">
              Exquisite Nigerian jewelry, crafted in Lagos to be worn, gifted, and treasured.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {[
              { href: 'https://instagram.com/amapels', label: 'Instagram', Icon: Instagram },
              { href: 'https://facebook.com/amapels', label: 'Facebook', Icon: Facebook },
              { href: 'https://twitter.com/amapels', label: 'Twitter', Icon: Twitter },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/55 transition-all duration-300 hover:border-gold/40 hover:text-gold"
                aria-label={`Follow us on ${label}`}
              >
                <Icon size={16} strokeWidth={1.4} />
              </a>
            ))}
          </div>
        </div>

        <div className="mb-12 grid grid-cols-2 gap-8 sm:mb-14 sm:gap-10 md:grid-cols-4 lg:mb-16 lg:gap-14">
          <div className="col-span-2 md:col-span-1">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.32em] text-gold/70">
              Lagos · Nigeria
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-white/55">
              A curated house for statement pieces, quiet luxury, and jewelry that celebrates every moment.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.32em] text-white/40 sm:mb-5">
              Discover
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/collections', label: 'Collections' },
                { href: '/shop', label: 'All Jewelry' },
                { href: '/shop?category=Earrings', label: 'Earrings' },
                { href: '/shop?category=Necklaces', label: 'Necklaces' },
                { href: '/shop?category=Bracelets', label: 'Bracelets' },
                { href: '/shop?category=Jewellery%20Sets', label: 'Jewelry Sets' },
              ].map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition-colors duration-200 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.32em] text-white/40 sm:mb-5">
              About
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/story', label: 'Our Story' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/artisan-process', label: 'Artisan Process' },
                { href: '/gift-guide', label: 'Gift Guide' },
                { href: '/care-guide', label: 'Jewelry Care' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition-colors duration-200 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.32em] text-white/40 sm:mb-5">
              Support
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/shipping-returns', label: 'Shipping & Returns' },
                { href: '/size-guide', label: 'Size Guide' },
                { href: '/faq', label: 'FAQ' },
                { href: '/track-order', label: 'Track Your Order' },
                { href: '/privacy', label: 'Privacy Policy' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition-colors duration-200 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6 sm:pt-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
              <p className="text-xs text-white/40">© 2026 AMAPELS. All rights reserved.</p>
              <span className="hidden text-white/15 sm:inline">·</span>
              <p className="text-xs text-white/30">Made by IEL</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <Link href="/terms" className="text-xs text-white/45 transition-colors hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="text-xs text-white/45 transition-colors hover:text-white">
                Privacy
              </Link>
              <a
                href="tel:+234-809-123-4567"
                className="flex items-center gap-1.5 text-xs text-white/45 transition-colors hover:text-gold"
              >
                <Phone size={12} strokeWidth={1.5} />
                <span className="hidden sm:inline">+234-809-123-4567</span>
                <span className="sm:hidden">Call</span>
              </a>
              <a
                href="mailto:hello@amapels.com"
                className="flex items-center gap-1.5 text-xs text-white/45 transition-colors hover:text-gold"
              >
                <Mail size={12} strokeWidth={1.5} />
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
