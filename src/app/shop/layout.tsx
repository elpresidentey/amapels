import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Shop All Jewellery",
  description:
    "Shop AMAPELS earrings, necklaces, bracelets and rings. Handpicked in Abuja, gift-ready and delivered nationwide.",
  path: "/shop",
  keywords: [
    "buy jewellery online Nigeria",
    "Abuja jewellery shop",
    "gold earrings Nigeria",
    "necklaces Abuja",
    "bracelets Nigeria",
    "rings Nigeria",
  ],
})

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
