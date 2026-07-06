import { Metadata } from 'next'
import { Shield, Droplets, Sun, Clock, AlertTriangle, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jewelry Care Guide - AMAPELS',
  description: 'Learn how to properly care for your AMAPELS jewelry. Expert tips on cleaning, storage, and maintenance to keep your pieces beautiful for years.',
}

export default function CareGuidePage() {
  const careSteps = [
    {
      icon: Droplets,
      title: 'Gentle Cleaning',
      description: 'Clean your jewelry regularly with warm water and mild soap',
      details: [
        'Use a soft-bristled toothbrush for intricate details',
        'Rinse thoroughly and dry with a soft cloth',
        'Avoid harsh chemicals and ultrasonic cleaners',
        'For pearls, use only a damp cloth'
      ]
    },
    {
      icon: Shield,
      title: 'Proper Storage',
      description: 'Store pieces separately to prevent scratching and tarnishing',
      details: [
        'Use individual soft pouches or lined jewelry boxes',
        'Keep pieces separated to avoid tangling',
        'Store in a cool, dry place away from sunlight',
        'Use anti-tarnish strips for silver pieces'
      ]
    },
    {
      icon: Sun,
      title: 'Avoid Exposure',
      description: 'Protect jewelry from chemicals, moisture, and extreme conditions',
      details: [
        'Remove before swimming, exercising, or showering',
        'Avoid contact with perfumes, lotions, and cleaning products',
        'Take off jewelry before applying cosmetics',
        'Store away from direct sunlight and heat'
      ]
    },
    {
      icon: Clock,
      title: 'Regular Maintenance',
      description: 'Schedule professional cleaning and inspection annually',
      details: [
        'Have clasps and settings checked by professionals',
        'Professional cleaning restores original shine',
        'Address loose stones or damaged parts immediately',
        'Consider re-plating for gold vermeil pieces'
      ]
    }
  ]

  const materialGuides = [
    {
      material: 'Sterling Silver',
      care: 'Polish regularly with a silver cloth to prevent tarnishing. Store in anti-tarnish pouches.',
      warning: 'Avoid chlorine and sulfur-containing products'
    },
    {
      material: 'Gold Vermeil',
      care: 'Clean gently with soft cloth. Avoid abrasive cleaners that can remove the gold layer.',
      warning: 'Re-plating may be needed after extensive wear'
    },
    {
      material: 'Pearls',
      care: 'Wipe with damp cloth only. Store flat and away from other jewelry to prevent scratching.',
      warning: 'Never use cleaning solutions or ultrasonic cleaners'
    },
    {
      material: 'Gemstones',
      care: 'Clean with mild soap and water. Use soft brush for settings. Dry thoroughly.',
      warning: 'Some stones are heat and chemical sensitive'
    }
  ]

  const dosDonts = {
    dos: [
      'Put jewelry on last when getting dressed',
      'Remove jewelry first when undressing',
      'Clean regularly with appropriate methods',
      'Store in original packaging when traveling',
      'Have annual professional inspections',
      'Handle with clean, dry hands'
    ],
    donts: [
      'Wear jewelry while exercising or swimming',
      'Expose to harsh chemicals or cleaners',
      'Store different metals together',
      'Sleep in your jewelry',
      'Use tissues or paper towels to clean',
      'Pull or tug on delicate chains'
    ]
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="section-shell pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-brown-dark mb-6 lg:mb-8">
            Jewelry Care Guide
          </h1>
          <p className="text-lg sm:text-xl text-brown/70 leading-relaxed">
            Keep your AMAPELS jewelry beautiful for years to come with our expert care tips. 
            Proper maintenance ensures your pieces remain as stunning as the day you received them.
          </p>
        </div>
      </section>

      {/* Care Steps */}
      <section className="section-shell pb-16 lg:pb-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-2xl lg:text-3xl font-light text-brown-dark mb-4">
            Essential Care Steps
          </h2>
          <p className="text-brown/70 max-w-2xl mx-auto">
            Follow these four essential steps to maintain your jewelry's beauty and longevity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {careSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brown/5 rounded-full mb-6">
                  <Icon size={24} className="text-brown-dark" />
                </div>
                <h3 className="font-semibold text-lg text-brown-dark mb-3">
                  {step.title}
                </h3>
                <p className="text-brown/70 text-sm leading-relaxed mb-4">
                  {step.description}
                </p>
                <ul className="text-left space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="text-xs text-brown/60 leading-relaxed">
                      • {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Material-Specific Care */}
      <section className="bg-brown-dark text-ivory section-shell py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-2xl lg:text-3xl font-light mb-4">
            Material-Specific Care
          </h2>
          <p className="text-ivory/80 max-w-2xl mx-auto">
            Different materials require different care approaches for optimal maintenance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {materialGuides.map((guide, index) => (
            <div key={index} className="bg-ivory/5 rounded-lg p-6">
              <h3 className="font-semibold text-lg text-ivory mb-3">
                {guide.material}
              </h3>
              <p className="text-ivory/80 text-sm leading-relaxed mb-4">
                {guide.care}
              </p>
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-yellow-200 text-xs">
                  {guide.warning}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="section-shell py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-2xl lg:text-3xl font-light text-brown-dark mb-4">
            Quick Reference
          </h2>
          <p className="text-brown/70 max-w-2xl mx-auto">
            Essential do's and don'ts for everyday jewelry care
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Do's */}
          <div className="bg-green-50 rounded-lg p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <h3 className="font-semibold text-lg text-green-800">
                Do's
              </h3>
            </div>
            <ul className="space-y-3">
              {dosDonts.dos.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-600 text-sm mt-0.5">•</span>
                  <span className="text-green-700 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div className="bg-red-50 rounded-lg p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✕</span>
              </div>
              <h3 className="font-semibold text-lg text-red-800">
                Don'ts
              </h3>
            </div>
            <ul className="space-y-3">
              {dosDonts.donts.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-red-600 text-sm mt-0.5">•</span>
                  <span className="text-red-700 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Professional Services */}
      <section className="section-shell pb-16 lg:pb-24">
        <div className="bg-brown/5 rounded-2xl p-8 lg:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brown-dark rounded-full mb-6">
              <Sparkles size={24} className="text-ivory" />
            </div>
            <h2 className="font-serif text-2xl lg:text-3xl font-light text-brown-dark mb-4">
              Professional Care Services
            </h2>
            <p className="text-brown/70 leading-relaxed mb-6">
              Our expert jewelers offer professional cleaning, repair, and restoration services. 
              Schedule an appointment to keep your AMAPELS jewelry in pristine condition.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm text-brown/70 mb-8">
              <div>Professional Cleaning</div>
              <div>Stone Setting Repair</div>
              <div>Chain & Clasp Repair</div>
            </div>
            <a 
              href="mailto:care@amapels.com"
              className="inline-flex items-center px-8 py-3 bg-brown-dark text-ivory text-sm font-medium rounded-md hover:bg-brown transition-colors btn-mobile"
            >
              Contact Care Team
            </a>
          </div>
        </div>
      </section>

      {/* Emergency Care */}
      <section className="bg-yellow-50 border-l-4 border-yellow-400 section-shell py-8">
        <div className="flex items-start gap-4">
          <AlertTriangle size={20} className="text-yellow-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">
              Emergency Care Tips
            </h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>• If a stone becomes loose, stop wearing immediately and contact us</p>
              <p>• For broken chains, keep all pieces and avoid DIY repairs</p>
              <p>• Tarnishing on silver is normal and easily reversible</p>
              <p>• Contact us within 30 days for any quality concerns</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}