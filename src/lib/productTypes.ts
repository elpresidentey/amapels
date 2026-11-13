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
  /** Pieces in stock. null/undefined = not counted; 0 = sold out. */
  stock?: number | null
  /** Admin's manual availability switch. Treated as true when missing. */
  available?: boolean
  finish?: 'gold' | 'silver' | 'mixed' | 'other'
  createdAt: string
  updatedAt: string
}
