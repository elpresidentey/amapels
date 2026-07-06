'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart, ShoppingBag, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useProduct } from '@/hooks/useProducts'
import { useCartStore } from '@/store/newCartStore'

export default function ProductPage() {
  const params = useParams<{ id: string }>()
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  
  const { product, loading, error } = useProduct(params.id)
  const { addItem } = useCartStore()

  useEffect(() => {
    if (product) {
      setSelectedImage(0)
    }
  }, [product])

  const handleAddToCart = () => {
    if (!product) return
    
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category,
      size: 'Standard',
      color: 'Default'
    })
    
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sand border-t-brown-dark rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brown/70">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-accent-orange mb-4">Oops! Something went wrong.</p>
          <p className="text-brown/70">{error || 'Product not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-20">
        <Link href="/shop" className="inline-flex items-center gap-2 text-brown/70 hover:text-brown-dark mb-14 transition-colors">
          <ArrowLeft size={19} />
          <span className="text-sm font-medium">Back to Shop</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.95 }}
          >
            <div className="relative aspect-[3/4] overflow-hidden mb-6 rounded-[36px] bg-white shadow-sm">
              <Image 
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-5">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-[20px] transition-all duration-300 ${selectedImage === index ? 'ring-2 ring-brown-dark' : 'opacity-80 hover:opacity-100'}`}
                  >
                    <Image 
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 33vw, 20vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.95, delay: 0.15 }}
            className="flex flex-col"
          >
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-brown/50">{product.category}</p>
            <h1 className="font-serif text-3xl font-light md:text-4xl text-brown-dark mb-3">{product.name}</h1>
            <p className="text-2xl font-medium text-brown-dark mb-10">{product.price}</p>
            
            <p className="text-lg text-brown/75 leading-relaxed mb-10">
              {product.description}
            </p>

            <div className="flex gap-5 mb-12">
              <button 
                onClick={handleAddToCart}
                disabled={addedToCart}
                className="flex-1 bg-brown-dark text-white py-5 font-semibold text-[11px] uppercase tracking-[0.35em] hover:bg-[#2a2118] transition-colors duration-300 flex items-center justify-center gap-3 disabled:bg-accent-emerald"
              >
                {addedToCart ? (
                  <>
                    <Check size={19} />
                    ADDED TO BAG
                  </>
                ) : (
                  <>
                    <ShoppingBag size={19} />
                    ADD TO BAG
                  </>
                )}
              </button>
              <button className="w-14 h-14 border-2 border-brown-dark flex items-center justify-center hover:bg-brown-dark hover:text-white transition-colors duration-300">
                <Heart size={19} />
              </button>
            </div>

            <div className="border-t border-sand/30 pt-10 space-y-7">
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.35em] mb-4 text-brown-dark">Details</h3>
                <ul className="space-y-3 text-brown/75">
                  <li className="flex items-start gap-3">
                    <span className="text-accent-orange mt-1">•</span>
                    <span>Premium quality materials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent-orange mt-1">•</span>
                    <span>Elegant design perfect for any occasion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent-orange mt-1">•</span>
                    <span>Beautiful gift packaging included</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.35em] mb-3 text-brown-dark">Care</h3>
                <p className="text-brown/75">To keep your jewellery looking its best, avoid contact with water, perfumes, and chemicals. Store in a clean, dry place when not in use.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
