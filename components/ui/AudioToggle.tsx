'use client'

import { useAudio } from '@/lib/hooks/useAudio'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { AUDIO } from '@/config/content'

export function AudioToggle() {
  const { playing, toggle } = useAudio({ src: AUDIO.src })
  const reduced             = useReducedMotion()

  return (
    <button
      onClick={toggle}
      aria-label={playing ? 'Mute music' : 'Play music'}
      title={playing
        ? `Mute — ${AUDIO.title} by ${AUDIO.artist}`
        : `Play — ${AUDIO.title} by ${AUDIO.artist}`
      }
      className={[
        'fixed bottom-6 right-6 z-50',
        'w-10 h-10 rounded-full',
        'border border-gold/40 bg-plum/80 backdrop-blur-sm',
        'flex items-center justify-center text-gold',
        'hover:text-rose hover:border-gold',
        'hover:shadow-[0_0_16px_rgba(230,169,192,0.35)]',
        'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-plum',
        reduced ? '' : 'transition-all duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110',
      ].join(' ')}
    >
      {playing ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
          <rect x="2" y="2" width="3.5" height="10" rx="1"/>
          <rect x="8.5" y="2" width="3.5" height="10" rx="1"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
          <path d="M3 2.5v9a.5.5 0 0 0 .757.429l7-4.5a.5.5 0 0 0 0-.858l-7-4.5A.5.5 0 0 0 3 2.5z"/>
        </svg>
      )}
    </button>
  )
}
