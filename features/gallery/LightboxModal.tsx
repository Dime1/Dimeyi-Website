'use client'
import { useEffect, useState } from 'react'
import Image                   from 'next/image'
import type { GalleryImage }   from '@/config/content'

interface LightboxModalProps {
  images:       readonly GalleryImage[]
  initialIndex: number
  onClose:      () => void
}

export function LightboxModal({ images, initialIndex, onClose }: LightboxModalProps) {
  const [index, setIndex] = useState(initialIndex)
  const image = images[index]

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowRight') setIndex(i => (i + 1) % images.length)
      if (e.key === 'ArrowLeft')  setIndex(i => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [images.length, onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      className="fixed inset-0 z-50 bg-plum/95 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] px-4 sm:px-12"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-contain"
            sizes="100vw"
          />
        </div>

        <button
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute top-0 right-2 sm:right-14 text-ivory/60 hover:text-ivory text-3xl leading-none"
        >
          ×
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={() => setIndex(i => (i - 1 + images.length) % images.length)}
              aria-label="Previous image"
              className="absolute left-0 top-1/2 -translate-y-1/2 text-ivory/60 hover:text-ivory px-3 text-4xl"
            >
              ‹
            </button>
            <button
              onClick={() => setIndex(i => (i + 1) % images.length)}
              aria-label="Next image"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-ivory/60 hover:text-ivory px-3 text-4xl"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  )
}
