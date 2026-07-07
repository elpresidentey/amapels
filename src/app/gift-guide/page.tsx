import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { Heart, Star, Gift, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gift Guide - AMAPELS',
  description: 'Find the perfect jewelry gift for every occasion. Explore our curated gift collections for birthdays, anniversaries, graduations and special moments.',
}

export default function GiftGuidePage() {
  const occasions = [
    {
      title: 'For Her Birthday',
      description: 'Celebrate her special day with jewelry as unique as she is',
      image: '/images/evie-martinez-mCjEVrBS1bM-unsplash.jpg',
      suggestions: ['Statement Earrings', 'Delicate Necklaces', 'Charm Bracelets'],
      priceRange: '₦15,000 - ₦85,000'
    },
    {
      title: 'Anniversary Gifts',
      description: 'Mark your milestones with timeless pieces that tell your story',
      image: '/images/theresa-ude-bFSMzNAij8I-unsplash.jpg',
      suggestions: ['Matching Sets', 'Eternity Rings', 'Pearl Necklaces'],
      priceRange: '₦25,000 - ₦150,000'
    },
    {
      title: 'Graduation Success',
      description: 'Commemorate achievements with jewelry for the next chapter',
      image: '/images/julie-sd--Njp0M9Rzhc-unsplash.jpg',
      suggestions: ['Professional Studs', 'Minimalist Chains', 'Classic Watches'],
      priceRange: '₦18,000 - ₦65,000'
    },
    {
      title: 'Mother\'s Day',
      description: 'Show appreciation with elegant pieces that reflect her grace',
      image: '/images/lisa-marie-theck-pxg9jOgPzK4-unsplash.jpg',
      suggestions: ['Birthstone Jewelry', 'Family Pendants', 'Elegant Brooches'],
      priceRange: '₦20,000 - ₦100,000'
    },
    {
      title: 'Self-Love Treats',
      description: 'Because you deserve beautiful things just because',
      image: '/images/sabrianna-Y_bxfTa_iUA-unsplash.jpg',
      suggestions: ['Stackable Rings', 'Everyday Necklaces', 'Hoop Earrings'],
      priceRange: '₦12,000 - ₦45,000'
    },
    {
      title: 'New Job Celebration',
      description: 'Professional pieces that add confidence to every meeting',
      image: '/images/theresa-ude-01hjEW7Hc-8-unsplash.jpg',
      suggestions: ['Subtle Studs', 'Professional Chains', 'Elegant Bracelets'],
      priceRange: '₦16,000 - ₦70,000'
    }
  ]

  const budgetGuides = [
    {
      range: 'Under ₦20,000',
      icon: Heart,
      description: 'Thoughtful pieces that make beautiful everyday accessories',
      items: ['Delicate earrings', 'Simple chains', 'Charm pendants', 'Minimalist rings']
    },
    {
      range: '₦20,000 - ₦50,000',
      icon: Star,
      description: 'Statement pieces perfect for special occasions',
      items: ['Bold earrings', 'Layered necklaces', 'Cocktail rings', 'Cuff bracelets']
    },
    {
      range: '₦50,000 - ₦100,000',
      icon: Gift,
      description: 'Premium pieces that become treasured heirlooms',
      items: ['Pearl sets', 'Designer collections', 'Gemstone jewelry', 'Gold pieces']
    },
    {
      range: '₦100,000+',
      icon: Sparkles,
      description: 'Luxury investment pieces for life\'s most important moments',
      items: ['Diamond jewelry', 'Limited editions', 'Custom pieces', 'Complete sets']
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-shell pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-black-dark mb-6 lg:mb-8">
            The Perfect Gift
          </h1>
          <p className="text-lg sm:text-xl text-black/70 leading-relaxed mb-8">
            Discover jewelry that speaks to the heart. Our curated gift guide helps you 
            find meaningful pieces for every person and occasion.
          </p>
          <Link 
            href="/shop"
            className="inline-flex items-center px-8 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-gold transition-colors btn-mobile"
          >
            Shop All Gifts
          </Link>
        </div>
      </section>

      {/* Gift Occasions */}
      <section className="section-shell pb-16 lg:pb-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-2xl lg:text-3xl font-light text-black-dark mb-4">
            Shop by Occasion
          </h2>
          <p className="text-black/70 max-w-2xl mx-auto">
            Find the perfect piece for life's special moments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {occasions.map((occasion, index) => (
            <div key={index} className="group">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4">
                <Image
                  src={occasion.image}
                  alt={occasion.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif text-xl font-light text-black-dark mb-2">
                {occasion.title}
              </h3>
              <p className="text-black/70 text-sm leading-relaxed mb-3">
                {occasion.description}
              </p>
              <div className="space-y-1 mb-3">
                {occasion.suggestions.map((suggestion, idx) => (
                  <p key={idx} className="text-xs text-black/60">• {suggestion}</p>
                ))}
              </div>
              <p className="text-sm font-medium text-black-dark mb-4">
                {occasion.priceRange}
              </p>
              <Link 
                href="/shop"
                className="text-sm font-medium text-black-dark hover:text-black transition-colors"
              >
                Shop Collection →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Budget Guide */}
      <section className="bg-black text-white section-shell py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-2xl lg:text-3xl font-light mb-4">
            Shop by Budget
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Beautiful jewelry at every price point
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {budgetGuides.map((guide, index) => {
            const Icon = guide.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">
                  {guide.range}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {guide.description}
                </p>
                <ul className="space-y-1">
                  {guide.items.map((item, idx) => (
                    <li key={idx} className="text-xs text-white/60">• {item}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Gift Services */}
      <section className="section-shell py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl lg:text-3xl font-light text-black-dark mb-4">
              Gift Services
            </h2>
            <p className="text-black/70">
              We make gifting effortless with our complimentary services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black-light/5 rounded-full mb-4">
                <Gift size={24} className="text-black-dark" />
              </div>
              <h3 className="font-semibold text-lg text-black-dark mb-2">
                Gift Wrapping
              </h3>
              <p className="text-black/70 text-sm leading-relaxed">
                Complimentary luxury gift wrapping with every purchase
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black-light/5 rounded-full mb-4">
                <Heart size={24} className="text-black-dark" />
              </div>
              <h3 className="font-semibold text-lg text-black-dark mb-2">
                Personal Message
              </h3>
              <p className="text-black/70 text-sm leading-relaxed">
                Include a handwritten note with your heartfelt message
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black-light/5 rounded-full mb-4">
                <Sparkles size={24} className="text-black-dark" />
              </div>
              <h3 className="font-semibold text-lg text-black-dark mb-2">
                Gift Consultation
              </h3>
              <p className="text-black/70 text-sm leading-relaxed">
                Not sure what to choose? Our team is here to help
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-shell pb-16 lg:pb-24">
        <div className="bg-black-light/5 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="font-serif text-2xl lg:text-3xl font-light text-black-dark mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-black/70 mb-6 max-w-2xl mx-auto">
            Our jewelry specialists are here to help you find the perfect gift. 
            Contact us for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-gold transition-colors btn-mobile"
            >
              Get Expert Advice
            </Link>
            <Link 
              href="/shop"
              className="inline-flex items-center px-8 py-3 border border-black text-black-dark text-sm font-medium rounded-md hover:bg-gold hover:text-white transition-colors btn-mobile"
            >
              Browse All Jewelry
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
