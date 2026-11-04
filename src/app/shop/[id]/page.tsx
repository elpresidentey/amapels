import type { Metadata } from "next"
import { absoluteUrl, jsonLd, pageMetadata } from "@/lib/seo"
import { getProductForSeo, productDescription, productTitle } from "@/lib/product-seo"
import ProductDetailClient from "./ProductDetailClient"

// Product data comes from Shopify/Supabase at request time; never bake it in
// at build time (the catalogue changes from the admin panel).
export const dynamic = "force-dynamic"

type Props = { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductForSeo(params.id)

  if (!product) {
    return pageMetadata({
      title: "Piece Not Found",
      description: "This AMAPELS piece may no longer be available. Browse the full collection to find something you love.",
      path: `/shop/${params.id}`,
      noIndex: true,
    })
  }

  return pageMetadata({
    title: productTitle(product),
    description: productDescription(product),
    path: `/shop/${params.id}`,
    image: product.images[0],
    imageAlt: `${product.name} — AMAPELS`,
  })
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductForSeo(params.id)
  const url = absoluteUrl(`/shop/${params.id}`)

  const structuredData = product
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            name: product.name.trim(),
            description: productDescription(product),
            image: product.images.map((src) => (src.startsWith("http") ? src : absoluteUrl(src))),
            sku: product.id,
            ...(product.category ? { category: product.category } : {}),
            brand: { "@type": "Brand", name: "AMAPELS" },
            ...(product.price !== null
              ? {
                  offers: {
                    "@type": "Offer",
                    url,
                    priceCurrency: product.currency || "NGN",
                    price: product.price,
                    availability: product.available
                      ? "https://schema.org/InStock"
                      : "https://schema.org/OutOfStock",
                    itemCondition: "https://schema.org/NewCondition",
                    seller: { "@type": "Organization", name: "AMAPELS" },
                  },
                }
              : {}),
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
              { "@type": "ListItem", position: 3, name: product.name, item: url },
            ],
          },
        ],
      }
    : null

  return (
    <>
      {structuredData ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
      ) : null}
      <ProductDetailClient />
    </>
  )
}
