import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artisan Process - AMAPELS',
  description: 'Discover the meticulous craftsmanship behind every AMAPELS piece. Learn about our artisan process and traditional Nigerian jewelry making techniques.',
}

export default function ArtisanProcessPage() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="section-shell pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-brown-dark mb-6 lg:mb-8">
            Our Artisan Process
          </h1>
          <p className="text-lg sm:text-xl text-brown/70 leading-relaxed">
            Every AMAPELS piece tells a story of heritage, skill, and passion. 
            Discover the meticulous craftsmanship behind our jewelry.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-shell pb-16 lg:pb-24">
        <div className="space-y-16 lg:space-y-24">
          
          {/* Step 1: Design & Inspiration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="max-w-lg">
                <span className="text-sm font-semibold uppercase tracking-wide text-brown/60 mb-3 block">
                  Step 01
                </span>
                <h2 className="font-serif text-2xl lg:text-3xl font-light text-brown-dark mb-4 lg:mb-6">
                  Design & Inspiration
                </h2>
                <p className="text-brown/70 leading-relaxed mb-4">
                  Our journey begins with inspiration drawn from Nigerian heritage, contemporary fashion, 
                  and the stories of the women who wear our pieces. Each design is carefully sketched 
                  and refined by our master artisans.
                </p>
                <p className="text-brown/70 leading-relaxed">
                  We blend traditional motifs with modern aesthetics, ensuring every piece reflects 
                  both timeless elegance and contemporary relevance.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative aspect-square lg:aspect-[4/5] rounded-lg overflow-hidden">
                <Image
                  src="/images/pexels-gabriela-brasiliano-515209300-32225451.jpg"
                  alt="Jewelry design sketches and inspiration"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Material Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="relative aspect-square lg:aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="/images/pexels-sheilabox-235376934-12184920.jpg"
                alt="Premium jewelry materials and gems"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="max-w-lg">
                <span className="text-sm font-semibold uppercase tracking-wide text-brown/60 mb-3 block">
                  Step 02
                </span>
                <h2 className="font-serif text-2xl lg:text-3xl font-light text-brown-dark mb-4 lg:mb-6">
                  Premium Material Selection
                </h2>
                <p className="text-brown/70 leading-relaxed mb-4">
                  We source only the finest materials - from sterling silver to gold vermeil, 
                  genuine gemstones, and ethically-sourced pearls. Each material is carefully 
                  inspected for quality and authenticity.
                </p>
                <p className="text-brown/70 leading-relaxed">
                  Our commitment to quality means every component meets our exacting standards, 
                  ensuring durability and lasting beauty in every piece.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: Handcrafting */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="max-w-lg">
                <span className="text-sm font-semibold uppercase tracking-wide text-brown/60 mb-3 block">
                  Step 03
                </span>
                <h2 className="font-serif text-2xl lg:text-3xl font-light text-brown-dark mb-4 lg:mb-6">
                  Masterful Handcrafting
                </h2>
                <p className="text-brown/70 leading-relaxed mb-4">
                  Our skilled artisans, trained in traditional Nigerian jewelry-making techniques, 
                  bring each design to life through meticulous handcrafting. Every curve, every 
                  setting, every detail is shaped with precision and care.
                </p>
                <p className="text-brown/70 leading-relaxed">
                  This process can take anywhere from several hours to several days, depending 
                  on the complexity of the piece. We never rush perfection.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative aspect-square lg:aspect-[4/5] rounded-lg overflow-hidden">
                <Image
                  src="/images/pexels-ben-iwara-1033992193-27152278.jpg"
                  alt="Artisan crafting jewelry by hand"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Step 4: Quality Control */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="relative aspect-square lg:aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="/images/pexels-howard-chin-1677264-5564051.jpg"
                alt="Quality control and jewelry inspection"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="max-w-lg">
                <span className="text-sm font-semibold uppercase tracking-wide text-brown/60 mb-3 block">
                  Step 04
                </span>
                <h2 className="font-serif text-2xl lg:text-3xl font-light text-brown-dark mb-4 lg:mb-6">
                  Rigorous Quality Control
                </h2>
                <p className="text-brown/70 leading-relaxed mb-4">
                  Every finished piece undergoes thorough quality inspection. We check for 
                  structural integrity, finish quality, stone security, and overall craftsmanship 
                  to ensure it meets our high standards.
                </p>
                <p className="text-brown/70 leading-relaxed">
                  Only pieces that pass our comprehensive quality checks are carefully packaged 
                  and prepared for our customers, complete with authenticity documentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="bg-brown-dark text-ivory section-shell py-16 lg:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl lg:text-3xl font-light mb-6 lg:mb-8">
            Honoring Nigerian Heritage
          </h2>
          <p className="text-lg text-ivory/80 leading-relaxed mb-8">
            Our artisan process honors centuries-old Nigerian jewelry-making traditions while 
            embracing modern techniques and quality standards. Each piece carries the spirit 
            of our cultural heritage.
          </p>
          <p className="text-ivory/70 leading-relaxed">
            We are proud to support local artisans and preserve traditional craftsmanship 
            for future generations while creating jewelry that speaks to the modern Nigerian woman.
          </p>
        </div>
      </section>
    </div>
  )
}