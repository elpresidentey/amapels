export interface ShopNavLink {
  label: string
  href: string
}

export interface ShopNavSection {
  heading: string
  links: ShopNavLink[]
}

function shopHref(options: { category?: string; query?: string; finish?: string; maxPrice?: number } = {}) {
  const params = new URLSearchParams()
  if (options.category) params.set('category', options.category)
  if (options.query) params.set('q', options.query)
  if (options.finish) params.set('finish', options.finish)
  if (options.maxPrice) params.set('maxPrice', String(options.maxPrice))
  const query = params.toString()
  return `/shop${query ? `?${query}` : ''}`
}

const item = (label: string, href: string): ShopNavLink => ({ label, href })
const categoryItem = (label: string, category: string, query?: string) =>
  item(label, shopHref({ category, query }))
const searchItem = (label: string, query: string, category?: string) =>
  item(label, shopHref({ category, query }))

export const SHOP_NAV_MENUS: Array<{ id: string; label: string; sections: ShopNavSection[] }> = [
  {
    id: 'shop-by',
    label: 'Shop By',
    sections: [
      {
        heading: 'Category',
        links: [
          categoryItem('Earrings', 'Earrings'),
          categoryItem('Bracelets', 'Bracelets'),
          searchItem('Personalised Jewellery', 'personalised'),
          item('All Jewellery', shopHref()),
        ],
      },
      {
        heading: 'Material',
        links: [
          item('Gold Jewellery', shopHref({ finish: 'gold' })),
          item('Silver Jewellery', shopHref({ finish: 'silver' })),
          item('Mixed Metal', shopHref({ finish: 'mixed' })),
          searchItem('Solid Gold', 'solid gold'),
          searchItem('Diamond Jewellery', 'diamond'),
          searchItem('Pearl Jewellery', 'pearl'),
        ],
      },
    ],
  },
  {
    id: 'earrings',
    label: 'Earrings',
    sections: [
      {
        heading: 'Category',
        links: [
          categoryItem('All Earrings', 'Earrings'),
          item('Gold Earrings', shopHref({ category: 'Earrings', finish: 'gold' })),
          item('Silver Earrings', shopHref({ category: 'Earrings', finish: 'silver' })),
          categoryItem('Solid Gold Earrings', 'Earrings', 'solid gold'),
          categoryItem('Earring Gift Set', 'Jewellery Sets', 'earring'),
        ],
      },
      {
        heading: 'Style',
        links: [
          ...['Hoop', 'Huggie', 'Stud', 'Statement', 'Gemstone', 'Pearl', 'Ear Cuffs'].map((name) =>
            categoryItem(name, 'Earrings', name.toLowerCase())
          ),
        ],
      },
    ],
  },
  {
    id: 'necklace',
    label: 'Necklace',
    sections: [
      {
        heading: 'Category',
        links: [
          categoryItem('All Necklaces', 'Necklaces'),
          item('Gold Necklaces', shopHref({ category: 'Necklaces', finish: 'gold' })),
          categoryItem('Solid Gold Necklaces', 'Necklaces', 'solid gold'),
          categoryItem('Necklace Gift Set', 'Jewellery Sets', 'necklace'),
          categoryItem('Personalised Necklaces', 'Necklaces', 'personalised'),
        ],
      },
      {
        heading: 'Style',
        links: ['Gemstone', 'T Bar', 'Pendant', 'Birthstone', 'Pearl'].map((name) =>
          categoryItem(`${name} Necklaces`, 'Necklaces', name.toLowerCase())
        ),
      },
    ],
  },
  {
    id: 'rings',
    label: 'Rings',
    sections: [
      {
        heading: 'Category',
        links: [
          categoryItem('All Rings', 'Rings'),
          item('Gold Rings', shopHref({ category: 'Rings', finish: 'gold' })),
          item('Silver Rings', shopHref({ category: 'Rings', finish: 'silver' })),
          categoryItem('Solid Gold Rings', 'Rings', 'solid gold'),
          categoryItem('Ring Gift Set', 'Jewellery Sets', 'ring'),
        ],
      },
      {
        heading: 'Style',
        links: ['Statement', 'Stacking', 'Gemstone', 'Band', 'Signet'].map((name) =>
          categoryItem(`${name} Rings`, 'Rings', name.toLowerCase())
        ),
      },
    ],
  },
  {
    id: 'bracelet',
    label: 'Bracelet',
    sections: [
      {
        heading: 'Category',
        links: [
          categoryItem('All Bracelets', 'Bracelets'),
          item('Gold Bracelets', shopHref({ category: 'Bracelets', finish: 'gold' })),
          item('Silver Bracelets', shopHref({ category: 'Bracelets', finish: 'silver' })),
          categoryItem('Solid Gold Bracelets', 'Bracelets', 'solid gold'),
          categoryItem('Bracelet Gift Sets', 'Jewellery Sets', 'bracelet'),
        ],
      },
      {
        heading: 'Style',
        links: ['Personalised', 'Gemstone', 'Stacking', 'Chain', 'Anklets'].map((name) =>
          categoryItem(name === 'Anklets' ? name : `${name} Bracelets`, 'Bracelets', name.toLowerCase())
        ),
      },
    ],
  },
  {
    id: 'gifts',
    label: 'Gifts',
    sections: [
      {
        heading: 'Category',
        links: [
          item('Personalised Gifts', shopHref({ query: 'personalised' })),
          categoryItem('Gift Sets', 'Jewellery Sets'),
          item('Birthday Gifts', '/gift-guide'),
          searchItem('Solid Gold Gifts', 'solid gold'),
          item('Gift Cards', '/contact'),
        ],
      },
      {
        heading: 'Gift by Budget',
        links: [30_000, 50_000, 100_000, 150_000, 200_000].map((amount) =>
          item(`Under ₦${amount / 1000}k`, shopHref({ maxPrice: amount }))
        ),
      },
      {
        heading: 'Occasion',
        links: [
          item('Gift Guide', '/gift-guide'),
          item('Birthday', '/gift-guide'),
          item('Bridal', '/gift-guide'),
          item('Anniversary', '/gift-guide'),
          item('Graduation', '/gift-guide'),
          item('Gifts for Her', '/gift-guide'),
          item('Gifts for Him', '/gift-guide'),
        ],
      },
    ],
  },
]
