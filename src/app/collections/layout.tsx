import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Jewellery Collections",
  description:
    "Explore AMAPELS collections — everyday pieces, statement earrings, layering chains and gift-ready sets, handpicked in Abuja.",
  path: "/collections",
})

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return children
}
