import { cookies }         from 'next/headers'
import { getPageAccess }   from '@/lib/gate'
import { GatedPage }       from '@/components/ui/GatedPage'
import { LogisticsCard }   from '@/features/travel/LogisticsCard'
import { MapSection }      from '@/features/travel/MapSection'
import { UNLOCK_DATES }    from '@/config/reveal'
import { TRAVEL_INFO }     from '@/config/content'

export default async function TravelPage() {
  const cookieStore = await cookies()
  const rsvpStatus  = cookieStore.get('rsvp_status')?.value
  const access      = getPageAccess('travel', rsvpStatus)

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
    <section className="max-w-3xl mx-auto px-6 py-32">
      <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
        Travel
      </h1>
      <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
        General logistics — RSVP to unlock full details
      </p>

      <div className="border border-gold/15 rounded-sm px-8 py-8 bg-ivory/60 mb-6">
        <div className="w-8 h-px bg-gold/40 mb-6" aria-hidden="true" />
        <h2 className="font-display text-xl text-plum mb-5">Location</h2>
        <LogisticsCard label="Country"  value={TRAVEL_INFO.country} />
        <LogisticsCard label="City"     value={TRAVEL_INFO.city} />
        <LogisticsCard label="Airport"  value={TRAVEL_INFO.airportName} subValue={TRAVEL_INFO.airportDistance} />
      </div>

      <div className="border border-gold/15 rounded-sm px-8 py-8 bg-ivory/60 mb-8">
        <div className="w-8 h-px bg-gold/40 mb-6" aria-hidden="true" />
        <h2 className="font-display text-xl text-plum mb-5">Recommended Hotels</h2>
        {[...TRAVEL_INFO.hotels].map(hotel => (
          <LogisticsCard key={hotel.name} label={hotel.area} value={hotel.name} />
        ))}
      </div>

      <p className="font-sans text-xs text-center text-plum/35 tracking-[0.12em] uppercase">
        RSVP to unlock addresses, hotel booking codes, and the interactive venue map
      </p>
    </section>
  )

  return (
    <GatedPage
      state={access.state}
      unlocksAt={access.unlocksAt}
      teaserContent={teaser}
      partialContent={partial}
    >
      <section className="max-w-3xl mx-auto px-6 py-32">
        <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
          Travel
        </h1>
        <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
          Everything you need to find us
        </p>

        <div className="mb-8">
          <MapSection />
        </div>

        <div className="border border-gold/15 rounded-sm px-8 py-8 bg-ivory/60 mb-6">
          <div className="w-8 h-px bg-gold/40 mb-6" aria-hidden="true" />
          <h2 className="font-display text-xl text-plum mb-5">Venues</h2>
          <LogisticsCard label="Ceremony"  value={TRAVEL_INFO.ceremonyAddress} />
          <LogisticsCard label="Reception" value={TRAVEL_INFO.receptionAddress} />
        </div>

        <div className="border border-gold/15 rounded-sm px-8 py-8 bg-ivory/60">
          <div className="w-8 h-px bg-gold/40 mb-6" aria-hidden="true" />
          <h2 className="font-display text-xl text-plum mb-5">Hotels</h2>
          {[...TRAVEL_INFO.hotels].map(hotel => (
            <LogisticsCard
              key={hotel.name}
              label={hotel.name}
              value={hotel.area}
              subValue={hotel.bookingCode.startsWith('[') ? undefined : `Booking code: ${hotel.bookingCode}`}
            />
          ))}
        </div>
      </section>
    </GatedPage>
  )
}
