import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How AMAPELS collects, uses and protects your personal information when you shop with us.",
  path: "/privacy",
})

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
