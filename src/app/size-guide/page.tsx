import { Metadata } from 'next'
import { Ruler, Info, Download, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Size Guide - AMAPELS',
  description: 'Find your perfect fit with our comprehensive jewelry size guide. Includes ring sizing, bracelet measurements, necklace lengths and helpful tips.',
}

export default function SizeGuidePage() {
  const ringSizes = [
    { us: '4', uk: 'H', circumference: '46.8mm', diameter: '14.9mm' },
    { us: '4.5', uk: 'I', circumference: '47.8mm', diameter: '15.2mm' },
    { us: '5', uk: 'J', circumference: '49.3mm', diameter: '15.7mm' },
    { us: '5.5', uk: 'K', circumference: '50.8mm', diameter: '16.2mm' },
    { us: '6', uk: 'L', circumference: '51.8mm', diameter: '16.5mm' },
    { us: '6.5', uk: 'M', circumference: '53.3mm', diameter: '17.0mm' },
    { us: '7', uk: 'N', circumference: '54.3mm', diameter: '17.3mm' },
    { us: '7.5', uk: 'O', circumference: '55.8mm', diameter: '17.8mm' },
    { us: '8', uk: 'P', circumference: '56.8mm', diameter: '18.1mm' },
    { us: '8.5', uk: 'Q', circumference: '58.3mm', diameter: '18.6mm' },
    { us: '9', uk: 'R', circumference: '59.3mm', diameter: '18.9mm' },
    { us: '9.5', uk: 'S', circumference: '60.8mm', diameter: '19.4mm' },
    { us: '10', uk: 'T', circumference: '61.8mm', diameter: '19.7mm' }
  ]

  const necklaceLengths = [
    { 
      length: '35-40cm (14-16")', 
      name: 'Choker', 
      description: 'Sits at the base of the neck, perfect for layering',
      bestFor: 'Evening wear, layering with longer pieces'
    },
    { 
      length: '40-45cm (16-18")', 
      name: 'Princess', 
      description: 'Classic length that sits at the collarbone',
      bestFor: 'Everyday wear, business attire, most necklines'
    },
    { 
      length: '50-55cm (20-22")', 
      name: 'Matinee', 
      description: 'Falls just below the collarbone to the bust line',
      bestFor: 'High necklines, casual and business wear'
    },
    { 
      length: '60-70cm (24-28")', 
      name: 'Opera', 
      description: 'Long length that can be worn single or doubled',
      bestFor: 'Evening wear, over sweaters, formal occasions'
    },
    { 
      length: '75cm+ (30"+)', 
      name: 'Rope', 
      description: 'Very long, versatile length for various styling',
      bestFor: 'Layering, knotting, wrapping multiple times'
    }
  ]

  const braceletSizes = [
    { size: 'XS', wrist: '13-14cm', description: 'Petite wrist' },
    { size: 'S', wrist: '15-16cm', description: 'Small wrist' },
    { size: 'M', wrist: '16-17cm', description: 'Average wrist' },
    { size: 'L', wrist: '17-18cm', description: 'Large wrist' },
    { size: 'XL', wrist: '18-19cm', description: 'Extra large wrist' }
  ]

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="section-shell pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-brown-dark mb-6 lg:mb-8">
            Size Guide
          </h1>
          <p className="text-lg sm:text-xl text-brown/70 leading-relaxed">
            Find your perfect fit with our comprehensive sizing guide. 
            Get accurate measurements for rings, necklaces, and bracelets to ensure 
            your AMAPELS jewelry fits beautifully.
          </p>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="section-shell pb-16">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">
                Sizing Tips for Best Results
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Measure at the end of the day when fingers are largest</li>
                <li>• Account for knuckle size when measuring ring fingers</li>
                <li>• Consider the width of the band - wider bands fit tighter</li>
                <li>• Measure your non-dominant hand as it's typically smaller</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Ring Size Guide */}
      <section className="section-shell pb-16 lg:pb-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-2xl lg:text-3xl font-light text-brown-dark mb-4">
            Ring Size Guide
          </h2>
          <p className="text-brown/70 max-w-2xl mx-auto">
            Use our conversion chart to find your perfect ring size
          </p>
        </div>

        {/* Measurement Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-brown/5 rounded-lg p-6">
            <h3 className="font-semibold text-brown-dark mb-4 flex items-center gap-2">
              <Ruler size={20} />
              Method 1: Existing Ring
            </h3>
            <ol className="space-y-2 text-sm text-brown/70">
              <li>1. Take a ring that fits the desired finger well</li>
              <li>2. Measure the inner diameter in millimeters</li>
              <li>3. Use our chart below to find your size</li>
              <li>4. This is the most accurate method if available</li>
            </ol>
          </div>

          <div className="bg-brown/5 rounded-lg p-6">
            <h3 className="font-semibold text-brown-dark mb-4 flex items-center gap-2">
              <Ruler size={20} />
              Method 2: String Measurement
            </h3>
            <ol className="space-y-2 text-sm text-brown/70">
              <li>1. Wrap string around the base of your finger</li>
              <li>2. Mark where the string overlaps</li>
              <li>3. Measure the string length in millimeters</li>
              <li>4. This gives you the circumference for our chart</li>
            </ol>
          </div>
        </div>

        {/* Ring Size Chart */}
        <div className="overflow-x-auto">
          <table className="w-full bg-ivory border border-brown/20 rounded-lg">
            <thead className="bg-brown-dark text-ivory">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">US Size</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">UK Size</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Circumference</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Diameter</th>
              </tr>
            </thead>
            <tbody>
              {ringSizes.map((size, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-brown/5' : 'bg-ivory'}>
                  <td className="px-4 py-3 text-sm font-medium text-brown-dark">{size.us}</td>
                  <td className="px-4 py-3 text-sm text-brown/70">{size.uk}</td>
                  <td className="px-4 py-3 text-sm text-brown/70">{size.circumference}</td>
                  <td className="px-4 py-3 text-sm text-brown/70">{size.diameter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Necklace Length Guide */}
      <section className="bg-brown-dark text-ivory section-shell py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-2xl lg:text-3xl font-light mb-4">
            Necklace Length Guide
          </h2>
          <p className="text-ivory/80 max-w-2xl mx-auto">
            Choose the perfect necklace length for your style and occasion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {necklaceLengths.map((necklace, index) => (
            <div key={index} className="bg-ivory/5 rounded-lg p-6">
              <h3 className="font-semibold text-ivory text-lg mb-2">
                {necklace.name}
              </h3>
              <p className="text-ivory/90 font-medium mb-3">
                {necklace.length}
              </p>
              <p className="text-ivory/70 text-sm leading-relaxed mb-4">
                {necklace.description}
              </p>
              <div className="border-t border-ivory/10 pt-3">
                <p className="text-ivory/60 text-xs font-medium mb-1">BEST FOR:</p>
                <p className="text-ivory/80 text-xs">{necklace.bestFor}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bracelet Size Guide */}
      <section className="section-shell py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-2xl lg:text-3xl font-light text-brown-dark mb-4">
            Bracelet Size Guide
          </h2>
          <p className="text-brown/70 max-w-2xl mx-auto">
            Find your ideal bracelet fit with our wrist measurement guide
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-brown/5 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-brown-dark mb-4">
              How to Measure Your Wrist
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-brown-dark mb-2">For Snug Fit:</h4>
                <p className="text-brown/70 text-sm">Measure exactly around your wrist bone</p>
              </div>
              <div>
                <h4 className="font-medium text-brown-dark mb-2">For Comfortable Fit:</h4>
                <p className="text-brown/70 text-sm">Add 1-2cm to your wrist measurement</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {braceletSizes.map((bracelet, index) => (
              <div key={index} className="border border-brown/20 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-brown-dark text-ivory rounded-full flex items-center justify-center font-semibold mb-3 mx-auto">
                  {bracelet.size}
                </div>
                <p className="font-medium text-brown-dark mb-1">
                  {bracelet.wrist}
                </p>
                <p className="text-brown/60 text-xs">
                  {bracelet.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earring Guide */}
      <section className="bg-brown/5 section-shell py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl lg:text-3xl font-light text-brown-dark mb-4">
            Earring Fit Guide
          </h2>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-ivory rounded-lg p-6">
            <h3 className="font-semibold text-brown-dark mb-4">
              Stud Earrings
            </h3>
            <ul className="space-y-2 text-sm text-brown/70">
              <li>• Small (3-5mm): Subtle, everyday wear</li>
              <li>• Medium (6-8mm): Noticeable but not overwhelming</li>
              <li>• Large (9mm+): Statement pieces for special occasions</li>
            </ul>
          </div>

          <div className="bg-ivory rounded-lg p-6">
            <h3 className="font-semibold text-brown-dark mb-4">
              Drop & Hoop Earrings
            </h3>
            <ul className="space-y-2 text-sm text-brown/70">
              <li>• Small hoops: 10-20mm diameter</li>
              <li>• Medium hoops: 25-35mm diameter</li>
              <li>• Large hoops: 40mm+ diameter</li>
              <li>• Consider face shape and hair length</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Size Help */}
      <section className="section-shell py-16 lg:pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-brown-dark text-ivory rounded-2xl p-8 lg:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-ivory/10 rounded-full mb-6">
              <Heart size={24} />
            </div>
            <h2 className="font-serif text-2xl lg:text-3xl font-light mb-4">
              Need Sizing Help?
            </h2>
            <p className="text-ivory/80 leading-relaxed mb-8 max-w-2xl mx-auto">
              Still unsure about sizing? Our jewelry experts are here to help you find 
              the perfect fit. We also offer free size exchanges within 30 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:sizing@amapels.com"
                className="inline-flex items-center px-8 py-3 bg-ivory text-brown-dark text-sm font-medium rounded-md hover:bg-ivory/90 transition-colors btn-mobile"
              >
                Get Sizing Help
              </a>
              <a 
                href="#"
                className="inline-flex items-center px-8 py-3 border border-ivory/30 text-ivory text-sm font-medium rounded-md hover:bg-ivory/10 transition-colors btn-mobile"
              >
                <Download size={16} className="mr-2" />
                Download Size Chart
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}