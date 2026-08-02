import { RSVPFlow }       from '@/features/rsvp/RSVPFlow'
import { ScriptureStrip } from '@/components/ui/ScriptureStrip'
import { VERSES }         from '@/config/content'

export default function RSVPPage() {
  return (
    <main className="relative min-h-screen bg-ivory overflow-hidden">
      {/* Background image at 50% opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('/Page Background/RSVP.jpg')", opacity: 0.5 }}
      />

      <section className="relative z-10 max-w-3xl mx-auto">
        {/* Frosted glass card keeps form readable over the photo */}
        <div className="mx-4 md:mx-0 mt-8 mb-4 bg-ivory/60 backdrop-blur-md rounded-2xl shadow-xl shadow-plum/10 overflow-hidden">
          <div className="px-6 pt-5 pb-2 text-center">
            <h1 className="font-display text-4xl md:text-5xl text-plum mb-3">
              RSVP
            </h1>
            <p className="font-sans text-xs tracking-[0.18em] uppercase text-plum/80">
              February 18, 2027 · Feyisogo &amp; Dimeji
            </p>
          </div>

          <RSVPFlow />
        </div>

        <ScriptureStrip text={VERSES.rsvp.text} reference={VERSES.rsvp.ref} className="bg-ivory/70 backdrop-blur-sm rounded-2xl" />
      </section>
    </main>
  )
}
