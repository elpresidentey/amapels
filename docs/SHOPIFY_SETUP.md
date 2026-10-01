# Shopify Headless Setup — AMAPELS × fac0fc-10.myshopify.com

Your Next.js design is kept. Shopify becomes products / inventory / checkout backend.

Code already wired:
- `src/lib/shopify.ts` — Storefront GraphQL client + mapping to your frontend shape
- `src/app/api/products/route.ts` — tries Shopify first, falls back to Supabase → static
- `src/app/api/products/[id]/route.ts` — resolves handle / numeric id / gid via Shopify
- `src/app/api/shopify/checkout/route.ts` — cart lines → Shopify `checkoutUrl`
- `src/app/api/shopify/status/route.ts` — safe diagnostic (no token leak)

## 1. Get a Storefront API token (5 min)

1. Shopify admin → `fac0fc-10.myshopify.com/admin` → Apps → App and sales channel settings → Develop apps
2. Create app e.g. `AMAPELS Headless`
3. Configuration → Storefront API → enable:
   - `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`,
     `unauthenticated_read_product_pickup_locations`, `unauthenticated_write_checkouts`, `unauthenticated_write_customers`
4. Install → copy **Storefront API access token** (starts with `shpat_...` or headless token)

## 2. Configure env

Add to `.env` (and Vercel env):
```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=fac0fc-10.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=shpat_xxx
SHOPIFY_API_VERSION=2025-10
```

Restart `npm run dev`.

## 3. Verify

Visit `/api/shopify/status` — expect:
```json
{ "success": true, "configured": true, "sampleCount": 5 }
```
If `configured: false` → token missing. If 502 → token invalid or products unpublished to Headless channel.

Note: your storefront shows “Opening soon” (password page). The Storefront API still works, but products must be **Active + published to the Headless / Storefront channel**, otherwise the API returns 0 products.

## 4. Product mapping

| Shopify | AMAPELS UI |
|---|---|
| title / description / images / variant price | name / description / images / price (₦ formatted) |
| productType or tags (`Earrings`, `Necklaces`, `Bracelets`, `Jewellery Sets`) | category filter |
| tag `featured` | homepage featured |
| variant id (`gid://shopify/ProductVariant/...`) | checkout line id |

Custom copy (`story, material, care, details`) currently uses sensible defaults. For full fidelity, add Shopify metafields later and extend `mapShopifyProduct` in `src/lib/shopify.ts`.

## 5. Checkout flow

Old: Paystack inline → `/api/orders` → `/api/verify-payment`.
New: cart items (with `shopifyVariantId`) → `POST /api/shopify/checkout { lines }` → redirect to `checkoutUrl` (Shopify-hosted checkout handles payment, tax, shipping).

Old Supabase/fallback product IDs cannot check out via Shopify — they lack variant gids. Once Shopify is configured, shop pages serve Shopify IDs automatically.

## 6. Nigeria payments

Shopify Payments is not available in NG. In Shopify Settings → Payments, activate a supported gateway (e.g. Paystack third-party / Flutterwave / DPO) or you cannot collect payment via Shopify Checkout.

## 7. Next steps (optional)

- Publish products + remove store password when ready to launch
- Webhooks (`orders/create`) → keep `/track-order` + email working
- Migrate historic Supabase/Mongo products via Shopify Admin API productCreate, or CSV import in Shopify admin
