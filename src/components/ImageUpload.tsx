'use client'

import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Check if we'll exceed max images
    if (images.length + files.length > maxImages) {
      setUploadError(`You can only upload up to ${maxImages} images`)
      return
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB max
      
      if (!isValidType) {
        setUploadError(`${file.name} is not a valid image file`)
        return false
      }
      if (!isValidSize) {
        setUploadError(`${file.name} is too large (max 5MB)`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)
    setUploadError(null)

    try {
      const uploadPromises = validFiles.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Upload failed')
        }

        const result = await response.json()
        return result.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      onChange([...images, ...uploadedUrls])
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'Failed to upload images')
    } finally {
      setUploading(false)
      // Reset the input
      e.target.value = ''
    }
  }

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const handleImageUrlAdd = () => {
    const url = prompt('Enter image URL:')
    if (url && url.trim()) {
      onChange([...images, url.trim()])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-gold/30 group"
          >
            <img
              src={image}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-2 border-dashed border-gold/50 flex flex-col items-center justify-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload size={20} className="text-gold mb-1" />
                <span className="text-xs text-black/60">Upload</span>
              </>
            )}
          </label>
        )}
      </div>

      {uploadError && (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {uploadError}
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-xs text-black/60">
        <span>• Max {maxImages} images</span>
        <span>• Max 5MB per image</span>
        <span>• JPG, PNG, WEBP supported</span>
      </div>

      <button
        type="button"
        onClick={handleImageUrlAdd}
        className="text-sm text-black hover:text-gold font-medium flex items-center gap-2"
      >
        <ImageIcon size={16} />
        Or add image URL manually
      </button>
    </div>
  )
}
