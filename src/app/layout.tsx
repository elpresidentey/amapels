import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper"
import ErrorBoundary from "@/components/ErrorBoundary"

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
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "AMAPELS",
    statusBarStyle: "black-translucent",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0C0A08",
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
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </ErrorBoundary>
      </body>
    </html>
  )
}
