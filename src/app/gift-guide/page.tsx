import { Metadata } from 'next'
import GiftGuideContent from './GiftGuideContent'

export const metadata: Metadata = {
  title: 'Gift Guide - AMAPELS',
  description: 'Find the perfect jewelry gift for every occasion. Explore our curated gift collections for birthdays, anniversaries, graduations and special moments.',
}

export default function GiftGuidePage() {
  return <GiftGuideContent />
}
