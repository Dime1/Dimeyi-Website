'use client'

import Link             from 'next/link'
import { usePathname }  from 'next/navigation'
import { useState }     from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV_LINKS, COUPLE } from '@/config/content'
import { UNLOCK_DATES }      from '@/config/reveal'
import { useReducedMotion }  from '@/lib/hooks/useReducedMotion'

function isGateLocked(href: string): boolean {
  const key = href.replace('/', '') as keyof typeof UNLOCK_DATES
  if (!(key in UNLOCK_DATES)) return false
  return new Date() < UNLOCK_DATES[key]
}

function unlockLabel(href: string): string {
  const key  = href.replace('/', '') as keyof typeof UNLOCK_DATES
  const date = UNLOCK_DATES[key]
  return `Unlocks ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
}

const LockIcon = () => (
  <svg
    width="9" height="9" viewBox="0 0 12 14"
    fill="currentColor" aria-hidden="true"
    className="inline ml-1 opacity-40"
  >
    <path d="M10 6V5a4 4 0 1 0-8 0v1H1v8h10V6h-1ZM5 5a1 1 0 1 1 2 0v1H5V5Z"/>
  </svg>
)

export function Nav() {
  const pathname  = usePathname()
  const reduced   = useReducedMotion()
  const [open, setOpen] = useState(false)

  const linkClass = (href: string) => [
    'relative text-sm font-sans font-medium tracking-[0.16em] uppercase',
    reduced ? '' : 'transition-colors duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    pathname === href ? 'text-gold' : 'text-ivory/90 hover:text-ivory',
    'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-gold after:origin-left',
    reduced ? 'after:scale-x-0' : 'after:transition-transform after:duration-[350ms] after:ease-[cubic-bezier(0.22,1,0.36,1)]',
    pathname === href ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100',
  ].join(' ')

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-plum/90 backdrop-blur-md border-b border-gold/10">
        <nav
          className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className={[
              'font-script italic text-gold text-lg tracking-wide',
              'hover:text-rose',
              reduced ? '' : 'transition-colors duration-[150ms]',
            ].join(' ')}
          >
            {COUPLE.displayNames}
          </Link>

          <ul className="hidden md:flex items-center gap-6" role="list">
            {NAV_LINKS.map(({ label, href, gated }) => {
              const locked = gated ? isGateLocked(href) : false
              return (
                <li key={href}>
                  <Link
                    href={href}
                    title={locked ? unlockLabel(href) : undefined}
                    aria-current={pathname === href ? 'page' : undefined}
                    className={linkClass(href)}
                  >
                    {label}
                    {locked && <LockIcon/>}
                  </Link>
                </li>
              )
            })}
          </ul>

          <button
            className="md:hidden text-ivory/80 hover:text-ivory p-1"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2Zm0 4h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2Zm0 4h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2Z" clipRule="evenodd"/>
              </svg>
            )}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={reduced ? { opacity: 1 } : { opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: '100%' }}
            transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-30 w-72 bg-plum border-l border-gold/10 pt-20 px-8 md:hidden"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col gap-6" role="list">
              {NAV_LINKS.map(({ label, href, gated }) => {
                const locked = gated ? isGateLocked(href) : false
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      title={locked ? unlockLabel(href) : undefined}
                      aria-current={pathname === href ? 'page' : undefined}
                      className={[
                        'text-base font-sans font-medium tracking-[0.14em] uppercase',
                        pathname === href ? 'text-gold' : 'text-ivory/90 hover:text-ivory',
                        reduced ? '' : 'transition-colors duration-[150ms]',
                      ].join(' ')}
                    >
                      {label}
                      {locked && <LockIcon/>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            className="fixed inset-0 z-20 bg-plum/60 md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  )
}
