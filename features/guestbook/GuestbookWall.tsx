'use client'
import { useEffect, useState }                    from 'react'
import { PolaroidCard }                           from './PolaroidCard'
import { GuestbookForm, type GuestbookEntry }     from './GuestbookForm'

const ROTATIONS = [-2, 1.5, -0.5, 2.5, -1, 1]

export function GuestbookWall() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/guestbook')
      .then(r => r.json())
      .then(json => setEntries(json.entries ?? []))
      .finally(() => setLoading(false))
  }, [])

  function handleNewEntry(entry: GuestbookEntry) {
    setEntries(prev => [entry, ...prev])
  }

  return (
    <div>
      <GuestbookForm onSubmitted={handleNewEntry} />

      {loading ? (
        <p className="font-sans text-xs text-plum/30 text-center mt-16 tracking-widest uppercase">
          Loading messages…
        </p>
      ) : entries.length === 0 ? (
        <p className="font-sans text-xs text-plum/30 text-center mt-16 tracking-widest uppercase">
          Be the first to leave a message
        </p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 mt-16">
          {entries.map((entry, i) => (
            <PolaroidCard
              key={entry.id}
              authorName={entry.author_name}
              message={entry.message}
              rotation={ROTATIONS[i % ROTATIONS.length]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
