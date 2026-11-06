import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Track Your Order",
  description:
    "Follow your AMAPELS order from our Abuja studio to your door. Enter your order reference to see live delivery status.",
  path: "/track-order",
  noIndex: true,
})

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children
}
