export interface ProductData {
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
}
