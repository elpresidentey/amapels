'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import NewCart from '@/components/NewCart'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import IntroOverlay from '@/components/IntroOverlay'
import SessionInitializer from '@/components/SessionInitializer'

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <IntroOverlay />
      <SessionInitializer />
      <Navbar />
      <NewCart />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
