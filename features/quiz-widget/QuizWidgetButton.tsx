'use client'
import { useState, useEffect }             from 'react'
import { AnimatePresence, motion }          from 'framer-motion'
import { QuizModule }                       from '@/features/guestbook/quiz/QuizModule'

export function QuizWidgetButton() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open quiz"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-plum flex items-center justify-center hover:bg-plum/90 transition-colors duration-200"
        style={{ boxShadow: '0 4px 16px rgba(91,61,110,0.4)' }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/>
          <path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
          <path d="M6 4h12v8a6 6 0 0 1-12 0V4z"/>
          <line x1="9"  y1="21" x2="15" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="quiz-backdrop"
              aria-label="Close quiz backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="quiz-drawer"
              role="dialog"
              aria-modal={true}
              aria-label="How Well Do You Know Us?"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-ivory rounded-t-2xl overflow-y-auto"
              style={{ maxHeight: '70vh' }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gold/15">
                <h2 className="font-display text-xl text-plum">How Well Do You Know Us?</h2>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close quiz"
                  className="text-plum/40 hover:text-plum transition-colors duration-200 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="px-6 py-8">
                <QuizModule />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
