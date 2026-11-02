import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Your Account",
  description: "Sign in to view your AMAPELS orders and saved details.",
  path: "/account",
  noIndex: true,
})

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children
}
