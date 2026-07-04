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

export type SeedProduct = Omit<ProductData, '_id' | 'createdAt' | 'updatedAt'>

export const seedProducts: SeedProduct[] = [
  {
    name: 'AMAPELS SIGNATURE HOOP',
    price: '₦250,000',
    category: 'Earrings',
    story: 'Statement Earrings',
    material: 'Gold-tone finish',
    description: 'A beautiful hoop earring that adds warmth and confidence to any outfit, perfect for both everyday wear and special occasions.',
    details: [
      'Lightweight and comfortable to wear',
      'Polished gold-tone finish',
      'Secure clasp for all-day comfort',
      'Versatile for daily and occasion wear',
    ],
    materials: 'Gold-tone alloy with stone detail',
    care: 'Store in a dry place and wipe gently with a soft cloth after wearing.',
    options: ['Gold Finish', 'Gift Box'],
    images: [
      '/images/sabrianna-Y_bxfTa_iUA-unsplash.jpg',
      '/images/gabriel-ogulu-r0bH4hAVBmk-unsplash.jpg',
      '/images/evie-martinez-mCjEVrBS1bM-unsplash.jpg',
    ],
    featured: true,
  },
  {
    name: 'CRYSTAL HALO BRACELET',
    price: '₦180,000',
    category: 'Bracelets',
    story: 'Bracelets & Shine',
    material: 'Crystal detail',
    description: 'A stunning bracelet with crystal details that catches the light beautifully, adding elegance to any wrist.',
    details: [
      'Beautiful crystal halo design',
      'Elegant shine for any occasion',
      'Adjustable fit for comfort',
      'Perfect for gifting someone special',
    ],
    materials: 'Silver-tone alloy with crystal stones',
    care: 'Keep away from perfume, water, and moisture to maintain the shine.',
    options: ['Silver Finish', 'Gift Box'],
    images: [
      '/images/lisa-marie-theck-pxg9jOgPzK4-unsplash.jpg',
      '/images/brian-wangenheim--5T5yMvZ2-E-unsplash.jpg',
      '/images/theresa-ude-01hjEW7Hc-8-unsplash.jpg',
    ],
    featured: true,
  },
  {
    name: 'GOLDEN MUSE COLLAR',
    price: '₦120,000',
    category: 'Necklaces',
    story: 'Necklaces & Sets',
    material: 'Polished gold finish',
    description: 'A beautiful neck piece that adds polish and presence to your outfit, perfect for making a statement.',
    details: [
      'Statement collar design',
      'Smooth metallic finish',
      'Great for special occasions',
      'Pairs beautifully with earrings and bracelets',
    ],
    materials: 'Polished metal finish',
    care: 'Store flat in a lined pouch and clean gently with a soft cloth.',
    options: ['Gold Finish', 'Standard Box'],
    images: [
      '/images/andres-vera-202NAwjisYA-unsplash.jpg',
      '/images/godfred-kwakye-fOcFLNzGtd0-unsplash.jpg',
      '/images/prahant-studio-h0evAOsNNtg-unsplash.jpg',
    ],
    featured: false,
  },
  {
    name: 'CLASSIC STUD PAIR',
    price: '₦450,000',
    category: 'Earrings',
    story: 'Modern Classics',
    material: 'Stone-set studs',
    description: 'A beautiful stud earring pair that adds timeless sparkle and elegance to your everyday look.',
    details: [
      'Classic floral-inspired design',
      'Stone-set sparkle',
      'Comfortable for all-day wear',
      'Perfect for everyday elegance',
    ],
    materials: 'Gold-tone alloy with stone setting',
    care: 'Avoid direct contact with water, lotion, or fragrance to maintain the finish.',
    options: ['Gold Finish', 'Pair'],
    images: [
      '/images/muhammad-taha-ibrahim-DWcGIvmI30Y-unsplash.jpg',
      '/images/carlos-esteves-1MWbwTaeJIA-unsplash.jpg',
      '/images/michael-kyule-sjnV1w7TtNE-unsplash.jpg',
    ],
    featured: false,
  },
  {
    name: 'SHELL STATEMENT SET',
    price: '₦220,000',
    category: 'Jewellery Sets',
    story: 'Cultural Edit',
    material: 'Natural shell detail',
    description: 'A coordinated jewellery set that combines natural textures with beautiful design for a standout look.',
    details: [
      'Matching necklace and earrings',
      'Natural shell-inspired details',
      'Designed to make a statement',
      'A unique conversation piece',
    ],
    materials: 'Mixed shell and metal components',
    care: 'Store separately and handle gently to preserve the natural elements.',
    options: ['Full Set', 'Gift Wrap'],
    images: [
      '/images/pexels-ben-iwara-1033992193-27152278.jpg',
      '/images/moses-malik-roldan-7KqTvNjAZws-unsplash.jpg',
      '/images/theresa-ude-bFSMzNAij8I-unsplash.jpg',
    ],
    featured: false,
  },
  {
    name: 'GIFTED GLOW BRACELET',
    price: '₦95,000',
    category: 'Bracelets',
    story: 'Gift Edit',
    material: 'Silver-tone finish',
    description: 'A simple, elegant bracelet perfect for everyday wear and makes a beautiful gift for someone special.',
    details: [
      'Minimal and comfortable design',
      'Soft reflective finish',
      'Easy to stack with other bracelets',
      'Perfect for gifting',
    ],
    materials: 'Silver-tone finish',
    care: 'Keep in a jewellery pouch and avoid contact with harsh surfaces.',
    options: ['Standard', 'Gift Box'],
    images: [
      '/images/theresa-ude-01hjEW7Hc-8-unsplash.jpg',
      '/images/lisa-marie-theck-pxg9jOgPzK4-unsplash.jpg',
      '/images/brian-wangenheim--5T5yMvZ2-E-unsplash.jpg',
    ],
    featured: true,
  },
]

const fallbackTimestamp = '2026-06-30T00:00:00.000Z'

export const fallbackProducts: ProductData[] = seedProducts.map((product, index) => ({
  ...product,
  _id: `fallback-${index + 1}`,
  createdAt: fallbackTimestamp,
  updatedAt: fallbackTimestamp,
}))

export function getFallbackProducts(category?: string | null) {
  if (!category || category === 'All') {
    return fallbackProducts
  }

  return fallbackProducts.filter((product) => product.category === category)
}

export function getFallbackProductById(id: string) {
  return fallbackProducts.find((product) => product._id === id) ?? null
}
