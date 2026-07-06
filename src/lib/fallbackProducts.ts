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
  // NEW PRODUCTS USING UNUSED IMAGES
  {
    name: 'MIDNIGHT ELEGANCE EARRINGS',
    price: '₦320,000',
    category: 'Earrings',
    story: 'Evening Collection',
    material: 'Dark metal finish',
    description: 'Sophisticated drop earrings that embody elegance and mystery, perfect for evening wear and special occasions.',
    details: [
      'Dramatic drop design',
      'Dark lustrous finish',
      'Comfortable ear wire',
      'Statement piece for evenings',
    ],
    materials: 'Dark metal alloy with textured details',
    care: 'Store in individual pouches to prevent scratching.',
    options: ['Dark Finish', 'Luxury Box'],
    images: [
      '/images/edgar-soto-o87CUS_uDiQ-unsplash.jpg',
      '/images/k-studios-hbCWaqLnD_s-unsplash.jpg',
      '/images/mayank-gehlot-lsxBmX8Hmwc-unsplash.jpg',
    ],
    featured: true,
  },
  {
    name: 'BOHEMIAN DREAMS NECKLACE',
    price: '₦280,000',
    category: 'Necklaces',
    story: 'Free Spirit Collection',
    material: 'Mixed metals',
    description: 'A flowing, organic necklace that captures the essence of bohemian style with its natural, free-form design.',
    details: [
      'Organic, flowing design',
      'Mixed metal textures',
      'Adjustable chain length',
      'Bohemian-inspired aesthetic',
    ],
    materials: 'Mixed metal alloys with natural finish',
    care: 'Clean with soft brush and mild soap, dry thoroughly.',
    options: ['Natural Finish', 'Eco-Friendly Packaging'],
    images: [
      '/images/julie-sd--Njp0M9Rzhc-unsplash.jpg',
      '/images/pexels-gabriela-brasiliano-515209300-32225451.jpg',
      '/images/pexels-howard-chin-1677264-5564051.jpg',
    ],
    featured: false,
  },
  {
    name: 'ROYAL HERITAGE BRACELET',
    price: '₦390,000',
    category: 'Bracelets',
    story: 'Heritage Collection',
    material: 'Antique gold finish',
    description: 'A regal bracelet inspired by traditional Nigerian jewelry, featuring intricate details and rich cultural heritage.',
    details: [
      'Intricate traditional patterns',
      'Rich antique gold finish',
      'Adjustable sizing',
      'Cultural heritage design',
    ],
    materials: 'Antique gold-plated alloy with traditional motifs',
    care: 'Handle with care, store in padded box to preserve detailing.',
    options: ['Antique Gold', 'Heritage Box'],
    images: [
      '/images/pexels-sheilabox-235376934-12184920.jpg',
      '/images/pexels-vedat-28933799.jpg',
      '/images/pexels-vedat-29043373.jpg',
    ],
    featured: true,
  },
  {
    name: 'MODERN GEOMETRIC SET',
    price: '₦520,000',
    category: 'Jewellery Sets',
    story: 'Contemporary Collection',
    material: 'Brushed silver',
    description: 'A striking contemporary jewelry set featuring clean geometric lines and modern aesthetic for the fashion-forward woman.',
    details: [
      'Matching earrings and necklace',
      'Clean geometric design',
      'Brushed silver finish',
      'Contemporary minimalist style',
    ],
    materials: 'Brushed silver-tone alloy with geometric forms',
    care: 'Polish regularly with silver cloth to maintain brushed finish.',
    options: ['Complete Set', 'Designer Box'],
    images: [
      '/images/pexels-ben-iwara-1033992193-27152278.jpg',
      '/images/pexels-gabriela-brasiliano-515209300-32225451.jpg',
      '/images/pexels-howard-chin-1677264-5564051.jpg',
    ],
    featured: false,
  },
  {
    name: 'SUNRISE PENDANT NECKLACE',
    price: '₦165,000',
    category: 'Necklaces',
    story: 'Nature\'s Beauty',
    material: 'Warm gold tone',
    description: 'A delicate pendant necklace that captures the warmth of a sunrise, perfect for everyday elegance.',
    details: [
      'Delicate pendant design',
      'Warm gold tone finish',
      'Adjustable chain length',
      'Perfect for layering',
    ],
    materials: 'Gold-tone alloy with pendant detail',
    care: 'Store flat and avoid tangling with other necklaces.',
    options: ['Gold Tone', 'Standard Box'],
    images: [
      '/images/andres-vera-202NAwjisYA-unsplash.jpg',
      '/images/prahant-studio-h0evAOsNNtg-unsplash.jpg',
      '/images/godfred-kwakye-fOcFLNzGtd0-unsplash.jpg',
    ],
    featured: false,
  },
  {
    name: 'CRYSTAL CASCADE EARRINGS',
    price: '₦375,000',
    category: 'Earrings',
    story: 'Glamour Collection',
    material: 'Crystal and silver',
    description: 'Dazzling cascading earrings that create movement and sparkle, perfect for special occasions and celebrations.',
    details: [
      'Cascading crystal design',
      'Creates beautiful movement',
      'Silver-tone setting',
      'Perfect for special occasions',
    ],
    materials: 'Silver-tone alloy with cascading crystal elements',
    care: 'Handle gently to prevent crystal damage, store in padded compartment.',
    options: ['Silver & Crystal', 'Luxury Box'],
    images: [
      '/images/evie-martinez-mCjEVrBS1bM-unsplash.jpg',
      '/images/sabrianna-Y_bxfTa_iUA-unsplash.jpg',
      '/images/gabriel-ogulu-r0bH4hAVBmk-unsplash.jpg',
    ],
    featured: true,
  },
  {
    name: 'TRIBAL FUSION BRACELET',
    price: '₦215,000',
    category: 'Bracelets',
    story: 'Cultural Fusion',
    material: 'Mixed metal & beads',
    description: 'A unique bracelet that blends traditional African elements with contemporary design for a modern tribal aesthetic.',
    details: [
      'Tribal-inspired patterns',
      'Mixed metal and bead elements',
      'Comfortable stretch fit',
      'Cultural fusion design',
    ],
    materials: 'Mixed metals with natural bead accents',
    care: 'Avoid water exposure, clean gently with dry cloth.',
    options: ['Natural Finish', 'Cultural Box'],
    images: [
      '/images/moses-malik-roldan-7KqTvNjAZws-unsplash.jpg',
      '/images/theresa-ude-bFSMzNAij8I-unsplash.jpg',
      '/images/k-studios-hbCWaqLnD_s-unsplash.jpg',
    ],
    featured: false,
  },
  {
    name: 'PEARL RADIANCE SET',
    price: '₦680,000',
    category: 'Jewellery Sets',
    story: 'Luxury Collection',
    material: 'Pearl & gold',
    description: 'An exquisite pearl jewelry set that embodies timeless elegance and luxury, perfect for the most special occasions.',
    details: [
      'Matching pearl necklace and earrings',
      'Lustrous pearl finish',
      'Gold-tone accents',
      'Timeless luxury design',
    ],
    materials: 'Cultured pearls with gold-tone settings',
    care: 'Store pearls separately, avoid perfume contact, wipe gently after wearing.',
    options: ['Pearl & Gold', 'Luxury Collection Box'],
    images: [
      '/images/lisa-marie-theck-pxg9jOgPzK4-unsplash.jpg',
      '/images/brian-wangenheim--5T5yMvZ2-E-unsplash.jpg',
      '/images/theresa-ude-01hjEW7Hc-8-unsplash.jpg',
    ],
    featured: true,
  },
  {
    name: 'VINTAGE CHARM NECKLACE',
    price: '₦195,000',
    category: 'Necklaces',
    story: 'Vintage Revival',
    material: 'Antique brass',
    description: 'A charming vintage-inspired necklace that tells a story of timeless beauty and classic elegance.',
    details: [
      'Vintage-inspired design',
      'Antique brass finish',
      'Unique charm details',
      'Classic chain length',
    ],
    materials: 'Antique brass with vintage charm accents',
    care: 'Polish occasionally with brass cleaner, store in dry environment.',
    options: ['Antique Brass', 'Vintage Box'],
    images: [
      '/images/julie-sd--Njp0M9Rzhc-unsplash.jpg',
      '/images/edgar-soto-o87CUS_uDiQ-unsplash.jpg',
      '/images/mayank-gehlot-lsxBmX8Hmwc-unsplash.jpg',
    ],
    featured: false,
  },
  {
    name: 'CONTEMPORARY CUFF BRACELET',
    price: '₦145,000',
    category: 'Bracelets',
    story: 'Modern Edge',
    material: 'Brushed metal',
    description: 'A bold contemporary cuff that makes a statement with its clean lines and modern aesthetic.',
    details: [
      'Open cuff design',
      'Brushed metal finish',
      'Adjustable sizing',
      'Contemporary style',
    ],
    materials: 'Brushed metal alloy with modern finish',
    care: 'Clean with soft cloth, avoid harsh chemicals.',
    options: ['Brushed Metal', 'Modern Box'],
    images: [
      '/images/pexels-vedat-28933799.jpg',
      '/images/pexels-vedat-29043373.jpg',
      '/images/pexels-sheilabox-235376934-12184920.jpg',
    ],
    featured: false,
  },
  {
    name: 'CELESTIAL MOON EARRINGS',
    price: '₦285,000',
    category: 'Earrings',
    story: 'Celestial Collection',
    material: 'Silver & moonstone',
    description: 'Ethereal earrings inspired by the moon and stars, featuring delicate moonstone accents that catch the light beautifully.',
    details: [
      'Celestial moon design',
      'Moonstone accent details',
      'Silver-tone setting',
      'Ethereal and elegant',
    ],
    materials: 'Silver-tone alloy with moonstone accents',
    care: 'Store carefully to protect moonstone, clean gently.',
    options: ['Silver & Moonstone', 'Celestial Box'],
    images: [
      '/images/muhammad-taha-ibrahim-DWcGIvmI30Y-unsplash.jpg',
      '/images/carlos-esteves-1MWbwTaeJIA-unsplash.jpg',
      '/images/michael-kyule-sjnV1w7TtNE-unsplash.jpg',
    ],
    featured: false,
  },
  {
    name: 'INFINITY LOVE SET',
    price: '₦420,000',
    category: 'Jewellery Sets',
    story: 'Eternal Love',
    material: 'Rose gold tone',
    description: 'A romantic jewelry set featuring infinity symbols, perfect for expressing eternal love and commitment.',
    details: [
      'Infinity symbol design',
      'Rose gold tone finish',
      'Matching necklace and bracelet',
      'Symbol of eternal love',
    ],
    materials: 'Rose gold-tone alloy with infinity motifs',
    care: 'Store in soft pouch, avoid contact with perfumes.',
    options: ['Rose Gold Set', 'Love Collection Box'],
    images: [
      '/images/pexels-gabriela-brasiliano-515209300-32225451.jpg',
      '/images/pexels-howard-chin-1677264-5564051.jpg',
      '/images/pexels-ben-iwara-1033992193-27152278.jpg',
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
