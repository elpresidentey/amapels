import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/supabase"
import { isShopifyConfigured, getShopifyProducts } from "@/lib/shopify"
import dbConnect from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amapelsng.com"

// Regenerate hourly so new products and journal posts appear without a deploy.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/collections`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/journal`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/gift-guide`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/story`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/track-order`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/size-guide`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/care-guide`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/shipping-returns`, changeFrequency: "monthly", priority: 0.4 },
  ]

  const productRoutes: MetadataRoute.Sitemap = []

  // Shopify-first catalog, matching the /api/products strategy
  if (isShopifyConfigured()) {
    try {
      const shopifyProducts = await getShopifyProducts()
      for (const p of shopifyProducts) {
        if (p?._id) {
          productRoutes.push({
            url: `${siteUrl}/shop/${p._id}`,
            changeFrequency: "weekly",
            priority: 0.8,
          })
        }
      }
    } catch {
      // fall through to Supabase below
    }
  }

  try {
    const products = await getProducts({})
    for (const p of products) {
      if (p?.id) {
        productRoutes.push({
          url: `${siteUrl}/shop/${p.id}`,
          lastModified: p.updated_at || p.created_at || undefined,
          changeFrequency: "weekly",
          priority: 0.8,
        })
      }
    }
  } catch {
    // If the database is temporarily unreachable we still return the static
    // routes so the sitemap never 500s.
  }

  // Journal posts (MongoDB). A failure here must never break the sitemap.
  const journalRoutes: MetadataRoute.Sitemap = []
  try {
    await dbConnect()
    const posts = (await BlogPost.find({ published: true })
      .select("slug updatedAt publishedAt")
      .sort({ publishedAt: -1 })
      .limit(200)
      .lean()) as Array<{ slug?: string; updatedAt?: Date; publishedAt?: Date }>

    for (const post of posts) {
      if (!post.slug) continue
      journalRoutes.push({
        url: `${siteUrl}/journal/${post.slug}`,
        lastModified: post.updatedAt || post.publishedAt || undefined,
        changeFrequency: "monthly",
        priority: 0.6,
      })
    }
  } catch {
    // Journal unavailable — still serve products and static routes.
  }

  return [...staticRoutes, ...dedupe([...productRoutes, ...journalRoutes])]

  function dedupe(routes: MetadataRoute.Sitemap) {
    const seen = new Set<string>()
    return routes.filter((r) => {
      if (seen.has(r.url)) return false
      seen.add(r.url)
      return true
    })
  }
}
