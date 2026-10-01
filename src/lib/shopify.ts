// Shopify Headless client for AMAPELS
// Keeps Next.js frontend design, uses Shopify (fac0fc-10.myshopify.com) as backend.
// Uses Storefront GraphQL API via plain fetch — no extra deps.

const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-10'

export function getShopifyDomain(): string {
  return (
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    process.env.SHOPIFY_STORE_DOMAIN ||
    'fac0fc-10.myshopify.com'
  ).replace(/^https?:\/\//, '').replace(/\/$/, '')
}

export function getStorefrontToken(): string {
  return process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || process.env.SHOPIFY_STOREFRONT_TOKEN || ''
}

export function isShopifyConfigured(): boolean {
  const domain = getShopifyDomain()
  const token = getStorefrontToken()
  return Boolean(domain && token && domain.includes('.myshopify.com'))
}

function endpoint(): string {
  return `https://${getShopifyDomain()}/api/${SHOPIFY_API_VERSION}/graphql.json`
}

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const token = getStorefrontToken()
  if (!token) throw new Error('Shopify Storefront token missing. Set NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN.')

  const res = await fetch(endpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    // Products change often — don't statically cache
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Shopify API HTTP ${res.status}: ${text.slice(0, 300)}`)
  }

  const json = await res.json()
  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL: ${json.errors.map((e: { message: string }) => e.message).join('; ')}`)
  }
  return json.data as T
}

// ---------- Types ----------
interface ShopifyImage { url: string; altText?: string | null }
interface ShopifyPrice { amount: string; currencyCode: string }
interface ShopifyVariant {
  id: string
  title: string
  availableForSale: boolean
  price: ShopifyPrice
}
interface ShopifyProductNode {
  id: string
  title: string
  handle: string
  description: string
  productType: string
  tags: string[]
  images: { edges: { node: ShopifyImage }[] }
  variants: { edges: { node: ShopifyVariant }[] }
}

// AMAPELS frontend shape (matches fallbackProducts ProductData + shopify refs)
export interface ShopifyMappedProduct {
  _id: string
  name: string
  price: string
  category: 'Earrings' | 'Necklaces' | 'Bracelets' | 'Jewellery Sets'
  story: string
  material: string
  description: string
  details: string[]
  materials: string
  care: string
  options: string[]
  images: string[]
  featured: boolean
  createdAt: string
  updatedAt: string
  // headless refs (ignored by old UI, used for checkout)
  handle: string
  shopifyProductId: string
  shopifyVariantId: string
  priceAmount: number
  currencyCode: string
  availableForSale: boolean
}

function formatNaira(amountStr: string, currencyCode: string): string {
  const n = parseFloat(amountStr)
  if (Number.isNaN(n)) return `₦${amountStr}`
  const symbol = currencyCode === 'NGN' ? '₦' : `${currencyCode} `
  return `${symbol}${Math.round(n).toLocaleString('en-NG')}`
}

function mapCategory(productType: string, tags: string[]): ShopifyMappedProduct['category'] {
  const valid = ['Earrings', 'Necklaces', 'Bracelets', 'Jewellery Sets']
  if (valid.includes(productType)) return productType as ShopifyMappedProduct['category']
  for (const t of tags) {
    const match = valid.find((v) => v.toLowerCase() === t.toLowerCase().trim())
    if (match) return match as ShopifyMappedProduct['category']
  }
  return 'Necklaces'
}

export function mapShopifyProduct(node: ShopifyProductNode): ShopifyMappedProduct {
  const images = node.images.edges.map((e) => e.node.url).filter(Boolean)
  const firstVariant = node.variants.edges[0]?.node
  const priceAmount = firstVariant ? parseFloat(firstVariant.price.amount) : 0
  const currencyCode = firstVariant?.price.currencyCode || 'NGN'
  const options = node.variants.edges.map((e) => e.node.title).filter((t) => t && t !== 'Default Title')
  const numericId = node.id.split('/').pop() || node.handle

  return {
    _id: numericId,
    name: node.title,
    price: firstVariant ? formatNaira(firstVariant.price.amount, currencyCode) : '₦0',
    category: mapCategory(node.productType, node.tags),
    story: node.description.split('.')[0]?.slice(0, 120) || 'Handcrafted with care',
    material: 'Premium materials',
    description: node.description || '',
    details: ['Handcrafted with care', 'Premium quality materials', 'Beautiful gift packaging'],
    materials: 'Premium materials with attention to detail',
    care: 'Store in a dry place and wipe gently with a soft cloth after wearing.',
    options: options.length ? options : ['Standard Size'],
    images: images.length ? images : ['/images/placeholder.webp'],
    featured: node.tags.map((t) => t.toLowerCase()).includes('featured'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    handle: node.handle,
    shopifyProductId: node.id,
    shopifyVariantId: firstVariant?.id || '',
    priceAmount,
    currencyCode,
    availableForSale: firstVariant?.availableForSale ?? true,
  }
}

const PRODUCT_FRAGMENT = `
  id title handle description productType tags
  images(first: 10) { edges { node { url altText } } }
  variants(first: 10) { edges { node { id title availableForSale price { amount currencyCode } } } }
`

export async function getShopifyProducts(category?: string, limit = 50): Promise<ShopifyMappedProduct[]> {
  const data = await shopifyFetch<{ products: { edges: { node: ShopifyProductNode }[] } }>(
    `query GetProducts($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) { edges { node { ${PRODUCT_FRAGMENT} } } }
    }`,
    { first: limit }
  )
  let products = data.products.edges.map((e) => mapShopifyProduct(e.node))
  if (category && category !== 'All') {
    products = products.filter((p) => p.category === category)
  }
  return products
}

export async function getShopifyProductByHandle(handle: string): Promise<ShopifyMappedProduct | null> {
  const data = await shopifyFetch<{ productByHandle: ShopifyProductNode | null }>(
    `query GetByHandle($handle: String!) {
      productByHandle(handle: $handle) { ${PRODUCT_FRAGMENT} }
    }`,
    { handle }
  )
  return data.productByHandle ? mapShopifyProduct(data.productByHandle) : null
}

export async function getShopifyProductById(id: string): Promise<ShopifyMappedProduct | null> {
  // Accept numeric id, handle, or full gid
  if (!id.startsWith('gid://')) {
    // try handle first (cheapest), then search numeric across list
    const byHandle = await getShopifyProductByHandle(id).catch(() => null)
    if (byHandle) return byHandle
    const all = await getShopifyProducts(undefined, 100).catch(() => [])
    return all.find((p) => p._id === id || p.handle === id) ?? null
  }
  const data = await shopifyFetch<{ product: ShopifyProductNode | null }>(
    `query GetById($id: ID!) { product(id: $id) { ${PRODUCT_FRAGMENT} } }`,
    { id }
  )
  return data.product ? mapShopifyProduct(data.product) : null
}

// ---------- Checkout (headless cart -> Shopify checkout URL) ----------
export interface CheckoutLine { variantId: string; quantity: number }

export async function createShopifyCheckout(lines: CheckoutLine[]): Promise<{ checkoutUrl: string; cartId: string }> {
  const valid = lines.filter((l) => l.variantId.startsWith('gid://') && l.quantity > 0)
  if (!valid.length) throw new Error('No valid Shopify variants. Sync products from Shopify first — old Supabase/fallback IDs cannot check out via Shopify.')

  const data = await shopifyFetch<{
    cartCreate: { cart: { id: string; checkoutUrl: string } | null; userErrors: { message: string }[] }
  }>(
    `mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { id checkoutUrl }
        userErrors { message }
      }
    }`,
    { lines: valid.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })) }
  )
  const err = data.cartCreate.userErrors[0]?.message
  if (err) throw new Error(err)
  if (!data.cartCreate.cart) throw new Error('Shopify did not return a checkout URL.')
  return { checkoutUrl: data.cartCreate.cart.checkoutUrl, cartId: data.cartCreate.cart.id }
}
