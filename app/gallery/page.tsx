import { GalleryGrid }    from '@/features/gallery/GalleryGrid'
import { ScriptureStrip } from '@/components/ui/ScriptureStrip'
import { VERSES }         from '@/config/content'

export default function GalleryPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-32">
      <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
        Gallery
      </h1>
      <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
        Moments we have carried
      </p>

      <GalleryGrid />

      <ScriptureStrip
        text={VERSES.gallery.text}
        reference={VERSES.gallery.ref}
      />
    </section>
  )
}
