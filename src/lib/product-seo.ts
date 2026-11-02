import { cache } from "react"
import { getProduct, getProductImages } from "@/lib/supabase"
import { isShopifyConfigured, getShopifyProductById } from "@/lib/shopify"

export type ProductSeo = {
  id: string
  name: string
  description: string
  images: string[]
  price: number | null
  currency: string
  category?: string
  available: boolean
  updatedAt?: string
}

function parsePrice(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.]/g, ""))
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

/**
 * Normalised product data for metadata + structured data.
 * Mirrors the source order used by /api/products/[id]: Shopify first, then
 * Supabase. Wrapped in React `cache` so generateMetadata and the page share
 * one fetch per request.
 */
export const getProductForSeo = cache(async (id: string): Promise<ProductSeo | null> => {
  if (isShopifyConfigured()) {
    try {
      const product = await getShopifyProductById(id)
      if (product) {
        return {
          id: product._id,
          name: product.name,
          description: product.description || "",
          images: product.images?.filter(Boolean) || [],
          price: product.priceAmount ?? parsePrice(product.price),
          currency: product.currencyCode || "NGN",
          category: product.category,
          available: product.availableForSale !== false,
          updatedAt: product.updatedAt,
        }
      }
    } catch {
      // fall through to Supabase
    }
  }

  try {
    const product = await getProduct(id)
    if (product) {
      return {
        id: product.id,
        name: product.name,
        description: product.description || "",
        images: getProductImages(product),
        price: parsePrice(product.price),
        currency: "NGN",
        category: product.category || undefined,
        available: typeof product.stock === "number" ? product.stock > 0 : true,
        updatedAt: product.updated_at,
      }
    }
  } catch {
    // product genuinely not found / database unreachable
  }

  return null
})

export function productDescription(product: ProductSeo): string {
  const base =
    product.description?.trim() ||
    `${product.name} from AMAPELS — handpicked jewellery in Abuja, gift-ready and delivered nationwide.`
  return base.replace(/\s+/g, " ").slice(0, 160)
}
