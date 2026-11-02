import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers about AMAPELS delivery, payments, returns, jewellery care and sizing — everything you need before you order.",
  path: "/faq",
})

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children
}
