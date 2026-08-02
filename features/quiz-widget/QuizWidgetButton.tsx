'use client'
import { useState, useEffect }    from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { QuizModule }              from '@/features/guestbook/quiz/QuizModule'
import { Leaderboard }             from '@/features/guestbook/quiz/Leaderboard'

type Drawer = 'play' | 'leaderboard'

const SUB_ITEMS: { id: Drawer; label: string; icon: React.ReactNode }[] = [
  {
    id:    'play',
    label: 'Play',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <polygon points="5 3 19 12 5 21" />
      </svg>
    ),
  },
  {
    id:    'leaderboard',
    label: 'Rankings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
]

export function QuizWidgetButton() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawer,   setDrawer]   = useState<Drawer | null>(null)

  useEffect(() => {
    if (!drawer) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawer(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawer])

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawer])

  function openDrawer(d: Drawer) {
    setMenuOpen(false)
    setDrawer(d)
  }

  return (
    <>
      {/* Sub-buttons fan up above the main FAB */}
      <AnimatePresence>
        {menuOpen && SUB_ITEMS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.5, y: 12 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{    opacity: 0, scale: 0.5,  y: 12 }}
            transition={{ type: 'spring', damping: 22, stiffness: 380, delay: i * 0.07 }}
            className="fixed left-6 z-50 flex items-center gap-3"
            style={{ bottom: `${6.25 + i * 3.75}rem` }}
          >
            <button
              onClick={() => openDrawer(item.id)}
              aria-label={item.label}
              className="w-12 h-12 rounded-full bg-plum flex items-center justify-center shadow-lg hover:opacity-90 active:scale-95 transition-all duration-150"
              style={{ boxShadow: '0 4px 12px rgba(91,61,110,0.35)' }}
            >
              {item.icon}
            </button>
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0  }}
              exit={{    opacity: 0, x: -6  }}
              transition={{ delay: i * 0.07 + 0.06 }}
              className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-plum bg-ivory px-3 py-1.5 rounded-sm shadow-md whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Invisible overlay — closes menu on outside tap */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        aria-label={menuOpen ? 'Close menu' : 'Open quiz'}
        className="fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full bg-plum flex items-center justify-center hover:bg-plum/90 transition-colors duration-200"
        style={{ boxShadow: '0 4px 16px rgba(91,61,110,0.4)' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {menuOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0   }}
              exit={{    opacity: 0, rotate:  90  }}
              transition={{ duration: 0.18 }}
              className="text-white text-xl leading-none"
            >
              ✕
            </motion.span>
          ) : (
            <motion.svg
              key="quiz-icon"
              initial={{ opacity: 0, rotate:  90 }}
              animate={{ opacity: 1, rotate:  0  }}
              exit={{    opacity: 0, rotate: -90  }}
              transition={{ duration: 0.18 }}
              width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/>
              <path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
              <path d="M6 4h12v8a6 6 0 0 1-12 0V4z"/>
              <line x1="9"  y1="21" x2="15" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </motion.svg>
          )}
        </AnimatePresence>
      </button>

      {/* Drawer — slides up from bottom */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{    opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setDrawer(null)}
            />
            <motion.div
              key="drawer-panel"
              role="dialog"
              aria-modal
              aria-label={drawer === 'play' ? 'How Well Do You Know Us?' : 'Royal Court Rankings'}
              initial={{ y: '100%' }}
              animate={{ y: 0       }}
              exit={{    y: '100%'  }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-ivory rounded-t-2xl overflow-y-auto"
              style={{ maxHeight: '75dvh' }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gold/15">
                <h2 className="font-display text-xl text-plum">
                  {drawer === 'play' ? 'How Well Do You Know Us?' : 'Royal Court Rankings'}
                </h2>
                <button
                  onClick={() => setDrawer(null)}
                  aria-label="Close"
                  className="text-plum/40 hover:text-plum transition-colors duration-200 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="px-6 py-8">
                {drawer === 'play' ? <QuizModule /> : <Leaderboard />}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
