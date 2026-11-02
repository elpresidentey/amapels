import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "The Journal",
  description:
    "Notes on jewellery, styling and gifting from the AMAPELS team in Abuja — how to build a stack, care for your pieces and choose a gift.",
  path: "/journal",
})

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return children
}
