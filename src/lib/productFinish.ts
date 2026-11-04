import type { ProductData } from '@/lib/productTypes'

export type ProductFinish = 'gold' | 'silver' | 'mixed' | 'other'
export type FinishFilter = 'all' | 'gold' | 'silver'

/** The catalog's descriptions already call out gold and silver finishes. */
export function getProductFinish(product: Pick<ProductData, 'name' | 'description'>): ProductFinish {
  const text = `${product.name} ${product.description || ''}`.toLowerCase()
  const gold = /\bgold(?:[\s-]?(?:tone|toned|plated))?\b/.test(text)
  const silver = /\bsilver(?:[\s-]?(?:tone|toned|plated))?\b/.test(text)

  if (gold && silver) return 'mixed'
  if (gold) return 'gold'
  if (silver) return 'silver'
  return 'other'
}

export function matchesFinish(product: ProductData, filter: FinishFilter) {
  if (filter === 'all') return true
  const finish = getProductFinish(product)
  return finish === filter || finish === 'mixed'
}
