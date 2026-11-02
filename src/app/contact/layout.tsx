import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Talk to AMAPELS about an order, a gift or a bespoke piece. Based in Abuja, delivering nationwide across Nigeria.",
  path: "/contact",
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
