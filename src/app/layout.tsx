import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper"
import ErrorBoundary from "@/components/ErrorBoundary"
import { SITE_NAME, SITE_URL, absoluteUrl, jsonLd } from "@/lib/seo"

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

const siteUrl = SITE_URL

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // `default` is the homepage title; every other route sets its own title and
  // the template appends the brand. Routes that set a title should NOT append
  // "- AMAPELS" themselves.
  title: {
    default: "Jewellery Shop in Abuja | AMAPELS",
    template: `%s | ${SITE_NAME}`,
  },
  description: "A Nigerian jewellery shop in Abuja. Shop earrings, necklaces, bracelets, and jewellery sets — handpicked, gift-ready, and delivered nationwide.",
  keywords: "Nigerian jewellery, jewellery shop Abuja, African jewelry, gold earrings, pearl necklaces, bracelets, statement jewelry, gift jewellery",
  authors: [{ name: "AMAPELS" }],
  creator: "AMAPELS",
  openGraph: {
    title: "Jewellery Shop in Abuja | AMAPELS",
    description: "Handpicked Nigerian jewellery. Live in Abuja, delivered nationwide.",
    // Homepage only — every other route overrides this via pageMetadata().
    url: siteUrl,
    siteName: "AMAPELS",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AMAPELS — Modern Nigerian Elegance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jewellery Shop in Abuja | AMAPELS",
    description: "Handpicked Nigerian jewellery. Live in Abuja, delivered nationwide.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Homepage canonical. Every other route overrides it in its own metadata —
  // see src/lib/seo.ts for why that is mandatory.
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": ["Organization", "JewelryStore"],
                "@id": `${SITE_URL}/#organization`,
                name: SITE_NAME,
                url: SITE_URL,
                logo: absoluteUrl("/icons/icon-512.png"),
                image: absoluteUrl("/icons/icon-512.png"),
                description:
                  "A Nigerian jewellery shop in Abuja. Handpicked earrings, necklaces, bracelets and jewellery sets, delivered nationwide.",
                email: "amapelsng@gmail.com",
                telephone: "+2348161238148",
                priceRange: "₦₦",
                currenciesAccepted: "NGN",
                areaServed: { "@type": "Country", name: "Nigeria" },
                sameAs: [
                  "https://instagram.com/amapels",
                  "https://facebook.com/amapels",
                  "https://twitter.com/amapels",
                ],
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Wuse II",
                  addressLocality: "Abuja",
                  addressRegion: "FCT",
                  addressCountry: "NG",
                },
                openingHoursSpecification: [
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                    ],
                    opens: "09:00",
                    closes: "18:00",
                  },
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: "Saturday",
                    opens: "10:00",
                    closes: "16:00",
                  },
                ],
              },
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                name: SITE_NAME,
                url: SITE_URL,
                inLanguage: "en-NG",
                publisher: { "@id": `${SITE_URL}/#organization` },
              },
            ],
          })}
        />
        <ErrorBoundary>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </ErrorBoundary>
      </body>
    </html>
  )
}
