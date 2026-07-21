import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import NewCart from "@/components/NewCart"
import Footer from "@/components/Footer"
import IntroOverlay from "@/components/IntroOverlay"
import ErrorBoundary from "@/components/ErrorBoundary"
import PerformanceMonitor from "@/components/PerformanceMonitor"
import SessionInitializer from "@/components/SessionInitializer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "AMAPELS - Modern Nigerian Elegance",
  description: "A Nigerian luxury jewelry house with a digital flagship store. Discover handcrafted earrings, necklaces, bracelets, and jewellery sets crafted in Lagos.",
  keywords: "Nigerian jewelry, Lagos jewelry, African jewelry, handcrafted jewelry, gold earrings, pearl necklaces, statement jewelry, elegant jewelry",
  authors: [{ name: "AMAPELS" }],
  creator: "AMAPELS",
  openGraph: {
    title: "AMAPELS - Modern Nigerian Elegance",
    description: "Discover handcrafted Nigerian jewelry made in Lagos.",
    url: "https://amapels.com",
    siteName: "AMAPELS",
    locale: "en_NG",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body 
        className={`${inter.variable} ${playfair.variable} font-sans min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <IntroOverlay />
          <SessionInitializer />
          <PerformanceMonitor />
          <Navbar />
          <NewCart />
          <main className="flex-1">{children}</main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  )
}
