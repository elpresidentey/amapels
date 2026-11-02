import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Your Bag",
  description: "Review the pieces in your AMAPELS bag.",
  path: "/cart",
  noIndex: true,
})

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
