import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Shop All Jewellery",
  description:
    "Browse every AMAPELS piece — earrings, necklaces, bracelets and jewellery sets. Handpicked in Abuja, gift-ready, and delivered nationwide.",
  path: "/shop",
  keywords: [
    "buy jewellery online Nigeria",
    "Abuja jewellery shop",
    "gold earrings Nigeria",
    "necklaces Abuja",
    "bracelets Nigeria",
  ],
})

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
