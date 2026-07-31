'use client'
import { useState }             from 'react'
import Image                    from 'next/image'
import { GALLERY_IMAGES, type GalleryCategory } from '@/config/content'
import { GalleryFilterTabs }    from './GalleryFilterTabs'
import { LightboxModal }        from './LightboxModal'

export function GalleryGrid() {
  const [category,    setCategory]    = useState<GalleryCategory>('all')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const filtered = category === 'all'
    ? [...GALLERY_IMAGES]
    : GALLERY_IMAGES.filter(img => img.category === category)

  return (
    <>
      <GalleryFilterTabs active={category} onChange={setCategory} />

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setLightboxIdx(i)}
            className="block w-full overflow-hidden rounded-sm border border-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label={img.alt}
          >
            <div className="relative aspect-[4/3] bg-blush">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </button>
        ))}
      </div>

      {lightboxIdx !== null && (
        <LightboxModal
          images={filtered}
          initialIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  )
}
