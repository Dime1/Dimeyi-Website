import { getPageAccess }   from '@/lib/gate'
import { GatedPage }       from '@/components/ui/GatedPage'
import { ScriptureStrip }  from '@/components/ui/ScriptureStrip'
import { EventBlock }      from '@/features/schedule/EventBlock'
import { UNLOCK_DATES }    from '@/config/reveal'
import { EVENTS, VERSES }  from '@/config/content'

export default function SchedulePage() {
  const access = getPageAccess('schedule')

  const teaser = (
    <div className="min-h-screen bg-plum flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-script italic text-gold/60 text-2xl">
        The path to us is still being written
      </p>
      <p className="font-sans text-ivory/25 text-xs tracking-[0.16em] uppercase">
        Schedule details unlock{' '}
        {UNLOCK_DATES.schedule.toLocaleDateString('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric',
        })}
      </p>
    </div>
  )

  return (
    <GatedPage state={access.state} unlocksAt={access.unlocksAt} teaserContent={teaser}>
      <section className="max-w-3xl mx-auto px-6 py-32">
        <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
          Schedule
        </h1>
        <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
          February 18, 2027 · Three celebrations
        </p>

        <div className="space-y-8">
          {[...EVENTS].map(event => (
            <EventBlock key={event.id} event={event} />
          ))}
        </div>

        <ScriptureStrip
          text={VERSES.schedule.text}
          reference={VERSES.schedule.ref}
        />
      </section>
    </GatedPage>
  )
}
