import type { Metadata } from "next"

export const SITE_NAME = "AMAPELS"
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://amapelsng.com"
).replace(/\/$/, "")

export const DEFAULT_OG_IMAGE = "/og-image.png"

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${SITE_URL}/`).toString()
}

type PageMetaOptions = {
  title: string
  description: string
  /** Route path, e.g. "/shop" — used for the canonical and og:url. */
  path: string
  /** Absolute or site-relative image path. */
  image?: string
  imageAlt?: string
  type?: "website" | "article"
  noIndex?: boolean
  keywords?: string[]
  publishedTime?: string
  modifiedTime?: string
}

/**
 * Builds a complete metadata object for a route.
 *
 * Every indexable route MUST call this (or set `alternates.canonical` itself):
 * the root layout's canonical points at "/", so a route that does not override
 * it would tell Google it is a duplicate of the homepage.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt,
  type = "website",
  noIndex = false,
  keywords,
  publishedTime,
  modifiedTime,
}: PageMetaOptions): Metadata {
  const url = absoluteUrl(path)
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image)
  const cleanTitle = title.replace(/\s+/g, " ").trim()
  const hasBrand = cleanTitle.includes(SITE_NAME)
  const socialTitle = hasBrand ? cleanTitle : `${cleanTitle} | ${SITE_NAME}`

  return {
    // When the caller already includes the brand, pin it absolute so the root
    // layout's title template cannot append it twice.
    title: hasBrand ? { absolute: cleanTitle } : cleanTitle,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_NG",
      type,
      images: [
        {
          url: imageUrl,
          alt: imageAlt || cleanTitle,
          ...(image === DEFAULT_OG_IMAGE ? { width: 1200, height: 630 } : {}),
        },
      ],
      ...(type === "article"
        ? { publishedTime, modifiedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [imageUrl],
    },
  }
}

/** JSON-LD script payload for structured data. */
export function jsonLd(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data) }
}
