import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amapelsng.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private utility/admin pages crawlable so their page-level noindex
      // directives can be read. The API itself is not search content.
      disallow: ["/api"],
    },
    host: siteUrl,
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
