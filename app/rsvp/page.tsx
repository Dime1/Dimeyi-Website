import { RSVPFlow }       from '@/features/rsvp/RSVPFlow'
import { ScriptureStrip } from '@/components/ui/ScriptureStrip'
import { VERSES }         from '@/config/content'

export default function RSVPPage() {
  return (
    <main className="min-h-screen bg-ivory">
      <section className="max-w-3xl mx-auto">
        <div className="px-6 pt-24 pb-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-plum mb-3">
            RSVP
          </h1>
          <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30">
            February 18, 2027 · Feyisogo &amp; Dimeji
          </p>
        </div>

        <RSVPFlow />

        <ScriptureStrip text={VERSES.rsvp.text} reference={VERSES.rsvp.ref} />
      </section>
    </main>
  )
}
