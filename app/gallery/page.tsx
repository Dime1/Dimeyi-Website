import { GalleryGrid }    from '@/features/gallery/GalleryGrid'
import { ScriptureStrip } from '@/components/ui/ScriptureStrip'
import { VERSES }         from '@/config/content'

export default function GalleryPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-plum/30">
      {/* Background video at 50% opacity */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.5 }}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/Page Background/Gallery.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 md:py-16">

        {/* Header card */}
        <div className="bg-plum/85 backdrop-blur-md rounded-2xl shadow-2xl px-6 md:px-10 py-6 mb-10 w-fit mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl text-ivory mb-3">
            Gallery
          </h1>
          <p className="font-sans text-xs tracking-[0.18em] uppercase text-gold">
            Moments we have carried
          </p>
        </div>

        <GalleryGrid />

        <ScriptureStrip
          text={VERSES.gallery.text}
          reference={VERSES.gallery.ref}
          className="bg-ivory/70 backdrop-blur-sm rounded-2xl"
        />
      </div>
    </div>
  )
}
