import GiftGuideContent from './GiftGuideContent'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Jewellery Gift Guide',
  description:
    'Find the perfect jewellery gift for every occasion — birthdays, anniversaries, graduations and special moments. Curated by AMAPELS in Abuja.',
  path: '/gift-guide',
})

export default function GiftGuidePage() {
  return <GiftGuideContent />
}
