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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amapelsng.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AMAPELS - Modern Nigerian Elegance",
  description: "A Nigerian jewellery shop in Abuja. Shop earrings, necklaces, bracelets, and jewellery sets — handpicked, gift-ready, and delivered nationwide.",
  keywords: "Nigerian jewellery, jewellery shop Abuja, African jewelry, gold earrings, pearl necklaces, bracelets, statement jewelry, gift jewellery",
  authors: [{ name: "AMAPELS" }],
  creator: "AMAPELS",
  openGraph: {
    title: "AMAPELS - Modern Nigerian Elegance",
    description: "Handpicked Nigerian jewellery. Live in Abuja, delivered nationwide.",
    url: siteUrl,
    siteName: "AMAPELS",
    locale: "en_NG",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF6EF" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0A08" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans min-h-screen flex flex-col`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('amapels-theme');document.documentElement.dataset.theme=(t==='dark'||t==='light')?t:'light'}catch(e){document.documentElement.dataset.theme='light'}",
          }}
        />
        <ErrorBoundary>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </ErrorBoundary>
      </body>
    </html>
  )
}
