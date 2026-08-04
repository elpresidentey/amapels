'use client'

import { useState } from 'react'
import { Upload, X, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  const handleClosePreview = () => setPreviewIndex(null)

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreviewIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length))
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreviewIndex((prev) => (prev === null ? null : (prev + 1) % images.length))
  }

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
            <button
              type="button"
              onClick={() => setPreviewIndex(index)}
              className="block w-full h-full"
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Remove image ${index + 1}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="w-full min-h-[120px] rounded-xl border-2 border-dashed border-black/20 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-colors bg-gray-50/50">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload size={32} className="text-black/40 mb-2" />
                <span className="text-sm font-medium text-black/60">Click to upload images</span>
                <span className="text-xs text-black/40 mt-1">JPG, PNG, WEBP up to 5MB each</span>
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

      {previewIndex !== null && images[previewIndex] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={handleClosePreview}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            type="button"
            onClick={handleClosePreview}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Close preview"
          >
            <X size={24} />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-3 sm:left-6 p-2 text-white/80 hover:text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-3 sm:right-6 p-2 text-white/80 hover:text-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <img
            src={images[previewIndex]}
            alt={`Product image ${previewIndex + 1}`}
            className="max-h-full max-w-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60">
            {previewIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </div>
  )
}
