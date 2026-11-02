import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Order Confirmed",
  description: "Thank you for your AMAPELS order.",
  path: "/order-confirmation",
  noIndex: true,
})

export default function OrderConfirmationLayout({ children }: { children: React.ReactNode }) {
  return children
}
