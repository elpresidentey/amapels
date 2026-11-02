import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Our Story",
  description:
    "AMAPELS is a Nigerian jewellery shop in Abuja. We buy from trusted suppliers and independent makers, and only list what survives real wear.",
  path: "/story",
})

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
