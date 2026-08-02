import type { EVENTS }         from '@/config/content'
import { AddToCalendarButton } from '@/features/schedule/AddToCalendarButton'

type Event = (typeof EVENTS)[number]

interface EventBlockProps {
  event: Event
}

function isPlaceholder(val: string) {
  return val.startsWith('[')
}

export function EventBlock({ event }: EventBlockProps) {
  return (
    <article className="border border-gold/15 rounded-sm px-8 py-10 bg-ivory/60 backdrop-blur-sm">
      {/* Gold top rule */}
      <div className="w-10 h-px bg-gold/40 mb-6" aria-hidden="true" />

      <h2 className="font-display text-2xl md:text-3xl text-plum mb-3">{event.name}</h2>

      <p className="font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/80 mb-1">
        {event.date}
        {!isPlaceholder(event.time) && ` · ${event.time}`}
      </p>

      {!isPlaceholder(event.location) && (
        <p className="font-sans text-base text-plum/85 mb-5">{event.location}</p>
      )}

      {!isPlaceholder(event.dresscode) && (
        <div className="mb-5">
          <p className="font-sans text-sm font-medium tracking-[0.2em] uppercase text-gold/80 mb-1">
            Dress code
          </p>
          <p className="font-sans text-base text-plum/85">{event.dresscode}</p>
        </div>
      )}

      {event.note && (
        <p className="font-sans text-sm text-plum/75 leading-relaxed italic border-l border-gold/20 pl-4 mb-6">
          {event.note}
        </p>
      )}

      <AddToCalendarButton event={event} />
    </article>
  )
}
