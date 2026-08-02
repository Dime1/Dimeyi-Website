'use client'

import { useState, useMemo } from 'react'
import { GUEST_LIST, type Guest } from '@/config/guests'

interface StepSearchProps {
  onNext: (guest: Guest) => void
}

export function StepSearch({ onNext }: StepSearchProps) {
  const [query,    setQuery]    = useState('')
  const [selected, setSelected] = useState<Guest | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    return GUEST_LIST.filter(g => g.lastName.toLowerCase().includes(q))
  }, [query])

  const hasQuery   = query.trim().length >= 2
  const noResults  = hasQuery && results.length === 0

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="rsvp-search" className="block font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/85 mb-2">
          Search by Last Name <span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          id="rsvp-search"
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(null) }}
          placeholder="e.g. Okafor"
          autoComplete="off"
          className="w-full border border-gold/35 rounded-sm bg-ivory/60 px-4 py-3 font-sans text-sm text-plum placeholder:text-plum/50 focus:outline-none focus:border-gold/70 transition-colors"
        />
      </div>

      {/* Results */}
      {hasQuery && (
        <div className="space-y-2">
          {results.map(guest => (
            <button
              key={guest.id}
              type="button"
              onClick={() => setSelected(guest)}
              className={[
                'w-full text-left px-4 py-3 border rounded-sm font-sans text-sm transition-all duration-200',
                selected?.id === guest.id
                  ? 'border-gold bg-gold/10 text-plum font-medium'
                  : 'border-gold/25 text-plum/85 hover:border-gold/55 hover:bg-gold/5',
              ].join(' ')}
            >
              {guest.firstName} {guest.lastName}
            </button>
          ))}

          {noResults && (
            <p className="font-sans text-sm text-plum/60 text-center py-4 border border-gold/15 rounded-sm">
              No match found.{' '}
              <span className="text-plum/85">Please double-check your spelling or contact us for help.</span>
            </p>
          )}
        </div>
      )}

      {!hasQuery && (
        <p className="font-sans text-xs text-plum/50 text-center tracking-wide">
          Type at least 2 characters to search
        </p>
      )}

      <button
        type="button"
        disabled={!selected}
        onClick={() => selected && onNext(selected)}
        className="w-full border border-gold/50 rounded-sm py-3 font-sans text-sm font-medium tracking-[0.16em] uppercase text-gold/90 hover:bg-gold/5 transition-colors disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  )
}
