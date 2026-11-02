import type { Metadata } from "next"
import { absoluteUrl, jsonLd, pageMetadata } from "@/lib/seo"
import { getPostForSeo } from "@/lib/blog-seo"
import JournalPostClient from "./JournalPostClient"

// Posts come from MongoDB at request time, not at build time.
export const dynamic = "force-dynamic"

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostForSeo(params.slug)

  if (!post) {
    return pageMetadata({
      title: "Journal",
      description: "Notes on jewellery, styling and gifting from AMAPELS in Abuja.",
      path: `/journal/${params.slug}`,
      noIndex: true,
    })
  }

  return pageMetadata({
    title: `${post.title.trim()} | AMAPELS`,
    description: post.excerpt || `${post.title} — from the AMAPELS journal.`,
    path: `/journal/${post.slug}`,
    image: post.image,
    imageAlt: post.title,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  })
}

export default async function JournalPostPage({ params }: Props) {
  const post = await getPostForSeo(params.slug)
  const url = absoluteUrl(`/journal/${params.slug}`)

  const structuredData = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt || post.title,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        ...(post.image
          ? { image: post.image.startsWith("http") ? post.image : absoluteUrl(post.image) }
          : {}),
        author: { "@type": "Person", name: post.author || "AMAPELS" },
        publisher: {
          "@type": "Organization",
          name: "AMAPELS",
          logo: { "@type": "ImageObject", url: absoluteUrl("/icons/icon-512.png") },
        },
        ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
        ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
        ...(post.category ? { articleSection: post.category } : {}),
      }
    : null

  return (
    <>
      {structuredData ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
      ) : null}
      <JournalPostClient />
    </>
  )
}
