import { useEffect, useState } from 'react'
import type { ProductData } from '@/lib/fallbackProducts'

export function useProducts(category?: string) {
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)

        let url = '/api/products'
        if (category && category !== 'All') {
          url += `?category=${encodeURIComponent(category)}`
        }

        const res = await fetch(url)
        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch products')
        }

        if (!ignore) {
          setProducts(data.data || [])
        }
      } catch (err) {
        if (!ignore) {
          setError((err as Error).message)
          setProducts([])
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      ignore = true
    }
  }, [category])

  return { products, loading, error }
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function fetchProduct() {
      if (!id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/products/${id}`)
        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch product')
        }

        if (!ignore) {
          setProduct(data.data)
        }
      } catch (err) {
        if (!ignore) {
          setError((err as Error).message)
          setProduct(null)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchProduct()

    return () => {
      ignore = true
    }
  }, [id])

  return { product, loading, error }
}
