export interface ProductData {
  _id: string
  name: string
  price: string
  category: 'Earrings' | 'Necklaces' | 'Bracelets' | 'Jewellery Sets' | 'Rings'
  story: string
  material: string
  description: string
  details: string[]
  materials: string
  care: string
  options: string[]
  images: string[]
  featured: boolean
  finish?: 'gold' | 'silver' | 'mixed' | 'other'
  createdAt: string
  updatedAt: string
}
