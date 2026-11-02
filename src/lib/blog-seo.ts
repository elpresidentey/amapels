import { cache } from "react"
import dbConnect from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"

export type PostSeo = {
  title: string
  slug: string
  excerpt: string
  image?: string
  author?: string
  category?: string
  publishedAt?: string
  updatedAt?: string
}

type BlogPostDoc = {
  title?: string
  slug?: string
  excerpt?: string
  image?: string
  author?: string
  category?: string
  publishedAt?: string | Date
  updatedAt?: string | Date
  createdAt?: string | Date
}

function toIso(value?: string | Date): string | undefined {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

/** Published post for metadata/structured data. Never throws. */
export const getPostForSeo = cache(async (slug: string): Promise<PostSeo | null> => {
  try {
    await dbConnect()
    const post = (await BlogPost.findOne({ slug, published: true }).lean()) as BlogPostDoc | null
    if (!post?.title) return null

    return {
      title: post.title,
      slug: post.slug || slug,
      excerpt: (post.excerpt || "").replace(/\s+/g, " ").slice(0, 160),
      image: post.image || undefined,
      author: post.author || "AMAPELS",
      category: post.category || undefined,
      publishedAt: toIso(post.publishedAt || post.createdAt),
      updatedAt: toIso(post.updatedAt || post.publishedAt || post.createdAt),
    }
  } catch {
    return null
  }
})
