import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions",
  description:
    "The terms that apply when you shop with AMAPELS — orders, pricing, delivery, returns and your rights.",
  path: "/terms",
})

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
