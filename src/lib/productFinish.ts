import type { ProductData } from '@/lib/productTypes'

export type ProductFinish = 'gold' | 'silver' | 'mixed' | 'other'
export type FinishFilter = 'all' | 'gold' | 'silver' | 'mixed'

/** The catalog's descriptions already call out gold and silver finishes. */
export function getProductFinish(product: Pick<ProductData, 'name'> & Partial<Pick<ProductData, 'description' | 'material' | 'materials' | 'finish'>>): ProductFinish {
  if (product.finish && product.finish !== 'other') return product.finish
  const text = `${product.name} ${product.description || ''} ${product.material || ''} ${product.materials || ''}`.toLowerCase()
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
  if (filter === 'mixed') return finish === 'mixed'
  return finish === filter
}
