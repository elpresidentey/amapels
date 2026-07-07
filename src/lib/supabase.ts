import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  category: string | null
  stock: number
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  items: OrderItem[]
  shipping_address: ShippingAddress
  payment_reference: string | null
  payment_status: string
  status: string
  subtotal: number
  shipping_cost: number
  tax: number
  total: number
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface ShippingAddress {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

// Helper functions
export async function getProducts(options?: {
  category?: string
  featured?: boolean
  limit?: number
}) {
  let query = supabase.from('products').select('*')

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.featured !== undefined) {
    query = query.eq('featured', options.featured)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data as Product[]
}

export async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Product
}

export async function createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single()

  if (error) throw error
  return data as Order
}

export async function getOrders(options?: {
  status?: string
  limit?: number
  offset?: number
}) {
  let query = supabase.from('orders').select('*', { count: 'exact' })

  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
  }

  const { data, error, count } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return { orders: data as Order[], total: count || 0 }
}

export async function getOrder(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Order
}

export async function updateOrderStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Order
}

export async function getOrderByReference(reference: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('payment_reference', reference)
    .single()

  if (error) throw error
  return data as Order
}
