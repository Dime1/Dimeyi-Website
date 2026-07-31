'use client'

import type { EVENTS } from '@/config/content'

type Event = (typeof EVENTS)[number]

interface AddToCalendarButtonProps {
  event: Event
}

function isPlaceholder(val: string) {
  return val.startsWith('[')
}

function buildGoogleCalendarUrl(event: Event): string {
  const base   = 'https://www.google.com/calendar/render'
  const params = new URLSearchParams({
    action:   'TEMPLATE',
    text:     event.name,
    dates:    '20270218T120000Z/20270218T140000Z',
    location: isPlaceholder(event.location) ? '' : event.location,
    details:  event.note ?? '',
  })
  return `${base}?${params.toString()}`
}

export function AddToCalendarButton({ event }: AddToCalendarButtonProps) {
  const disabled = isPlaceholder(event.time)

  if (disabled) {
    return (
      <button
        disabled
        className="font-sans text-[10px] tracking-[0.16em] uppercase text-plum/25 border border-plum/10 rounded-sm px-4 py-2 cursor-not-allowed"
        aria-label="Add to calendar — details coming soon"
      >
        Add to Calendar
      </button>
    )
  }

  const googleUrl = buildGoogleCalendarUrl(event)

  return (
    <a
      href={googleUrl}
      target="_blank"
      rel="noopener noreferrer"
      role="button"
      className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.16em] uppercase text-gold border border-gold/30 rounded-sm px-4 py-2 hover:border-gold hover:bg-gold/5 transition-colors duration-150"
      aria-label={`Add ${event.name} to Google Calendar`}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
        <path d="M5 0a5 5 0 1 0 0 10A5 5 0 0 0 5 0Zm.5 7.5h-1v-3h1v3Zm0-4h-1v-1h1v1Z"/>
      </svg>
      Add to Calendar
    </a>
  )
}
