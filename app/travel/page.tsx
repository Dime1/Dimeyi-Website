import { getPageAccess }  from '@/lib/gate'
import { GatedPage }      from '@/components/ui/GatedPage'
import { UNLOCK_DATES }   from '@/config/reveal'

export default function TravelPage() {
  const rsvpStatus = undefined
  const access     = getPageAccess('travel', rsvpStatus)

  const teaser = (
    <div className="min-h-screen bg-plum flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-script italic text-gold/60 text-2xl">
        The path to us is still being written
      </p>
      <p className="font-sans text-ivory/25 text-xs tracking-[0.16em] uppercase">
        Travel details unlock{' '}
        {UNLOCK_DATES.travel.toLocaleDateString('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric',
        })}
      </p>
    </div>
  )

  const partial = (
    <div className="min-h-screen py-32 px-6 text-center">
      <h1 className="font-display text-4xl text-plum">Travel</h1>
      <p className="font-sans text-plum/40 text-sm mt-4">General location info is shown here.</p>
      <p className="font-sans text-plum/30 text-xs tracking-widest uppercase mt-2">
        RSVP to unlock full address &amp; hotel details — Plan 3
      </p>
    </div>
  )

  return (
    <GatedPage
      state={access.state}
      unlocksAt={access.unlocksAt}
      teaserContent={teaser}
      partialContent={partial}
    >
      <div className="min-h-screen py-32 px-6 text-center">
        <h1 className="font-display text-4xl text-plum">Travel</h1>
        <p className="font-sans text-plum/30 text-xs tracking-widest uppercase mt-4">
          Full map + details — Plan 3
        </p>
      </div>
    </GatedPage>
  )
}
