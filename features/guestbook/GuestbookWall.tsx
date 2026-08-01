'use client'
import { useEffect, useState }                from 'react'
import { motion, AnimatePresence }            from 'framer-motion'
import { PolaroidCard }                       from './PolaroidCard'
import { GuestbookForm, type GuestbookEntry } from './GuestbookForm'

const ROTATIONS = [-2, 1.5, -0.5, 2.5, -1, 1]

export function GuestbookWall() {
  const [entries,   setEntries]   = useState<GuestbookEntry[]>([])
  const [loading,   setLoading]   = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetch('/api/guestbook')
      .then(r => r.json())
      .then(json => setEntries(json.entries ?? []))
      .finally(() => setLoading(false))
  }, [])

  function handleNewEntry(entry: GuestbookEntry) {
    setEntries(prev => [entry, ...prev])
    setModalOpen(false)
  }

  return (
    <div>
      {/* Trigger button */}
      <div className="flex justify-center mb-16">
        <button
          onClick={() => setModalOpen(true)}
          className="border border-gold/50 px-10 py-3 font-sans text-[11px] tracking-[0.18em] uppercase text-gold/80 hover:bg-gold/5 transition-colors"
        >
          Leave a Blessing
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-plum/40 backdrop-blur-sm px-4"
            onClick={() => setModalOpen(false)}
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
              {/* Close button */}
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-4 text-plum/30 hover:text-plum/60 transition-colors text-lg leading-none"
              >
                ✕
              </button>

              <h2 className="font-display text-2xl text-plum text-center mb-1">
                Leave a Blessing
              </h2>
              <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-plum/30 text-center mb-8">
                Your words mean the world to us
              </p>

              <GuestbookForm onSubmitted={handleNewEntry} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries */}
      {loading ? (
        <p className="font-sans text-xs text-plum/30 text-center mt-16 tracking-widest uppercase">
          Loading messages…
        </p>
      ) : entries.length === 0 ? (
        <p className="font-sans text-xs text-plum/30 text-center mt-16 tracking-widest uppercase">
          Be the first to leave a message
        </p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
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
