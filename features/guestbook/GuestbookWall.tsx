'use client'
import { useEffect, useState }                from 'react'
import { motion, AnimatePresence }            from 'framer-motion'
import { PolaroidCard }                       from './PolaroidCard'
import { GuestbookForm, type GuestbookEntry } from './GuestbookForm'


interface GuestbookWallProps {
  open:    boolean
  onClose: () => void
}

export function GuestbookWall({ open, onClose }: GuestbookWallProps) {
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
    onClose()
  }

  return (
    <div>
      {/* Modal — controlled by parent */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-plum/40 backdrop-blur-sm px-4"
            onClick={onClose}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-md bg-ivory rounded-sm shadow-2xl px-8 pt-10 pb-8"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 text-plum/60 hover:text-plum transition-colors text-lg leading-none"
              >
                ✕
              </button>

              <h2 className="font-display text-2xl text-plum text-center mb-1">
                Leave a Blessing
              </h2>
              <p className="font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/75 text-center mb-8">
                Your words mean the world to us
              </p>

              <GuestbookForm onSubmitted={handleNewEntry} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries */}
      {loading ? (
        <p className="font-sans text-sm font-medium text-ivory/75 text-center mt-8 tracking-widest uppercase">
          Loading messages…
        </p>
      ) : entries.length === 0 ? (
        <p className="font-sans text-sm font-medium text-ivory/75 text-center mt-8 tracking-widest uppercase">
          Be the first to leave a message
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {entries.map((entry) => (
            <PolaroidCard
              key={entry.id}
              authorName={entry.author_name}
              message={entry.message}
              rotation={0}
            />
          ))}
        </div>
      )}
    </div>
  )
}
