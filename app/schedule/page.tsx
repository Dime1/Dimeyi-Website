import { getPageAccess }  from '@/lib/gate'
import { GatedPage }      from '@/components/ui/GatedPage'
import { UNLOCK_DATES }   from '@/config/reveal'

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
      <div className="min-h-screen py-32 px-6 text-center">
        <h1 className="font-display text-4xl text-plum">Schedule</h1>
        <p className="font-sans text-plum/30 text-xs tracking-widest uppercase mt-4">Event blocks — Plan 3</p>
      </div>
    </GatedPage>
  )
}
