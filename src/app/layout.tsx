import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import NewCart from "@/components/NewCart"
import Footer from "@/components/Footer"
import ErrorBoundary from "@/components/ErrorBoundary"
import PerformanceMonitor from "@/components/PerformanceMonitor"
import SessionInitializer from "@/components/SessionInitializer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AMAPELS - Modern Nigerian Elegance",
  description: "A Nigerian luxury fashion house with a digital flagship store. Discover beautiful jewelry, statement pieces, and elegant accessories crafted in Lagos.",
  keywords: "Nigerian jewelry, luxury accessories, Lagos fashion, African jewelry, statement pieces, elegant jewelry",
  authors: [{ name: "AMAPELS" }],
  creator: "AMAPELS",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  openGraph: {
    title: "AMAPELS - Modern Nigerian Elegance",
    description: "Discover beautiful Nigerian jewelry and luxury accessories crafted in Lagos.",
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
