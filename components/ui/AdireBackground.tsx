'use client'

import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export function AdireBackground() {
  const reduced = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden text-plum"
    >
      <svg
        width="200%"
        height="200%"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 opacity-[0.05]"
        style={reduced
          ? {}
          : { animation: 'adireDrift 60s linear infinite' }
        }
      >
        <defs>
          <pattern
            id="adire-pattern"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            <circle cx="30" cy="30" r="14" fill="none" stroke="currentColor" strokeWidth="0.4"/>
            <circle cx="30" cy="30" r="5"  fill="none" stroke="currentColor" strokeWidth="0.4"/>
            <line x1="8"  y1="30" x2="52" y2="30" stroke="currentColor" strokeWidth="0.3"/>
            <line x1="30" y1="8"  x2="30" y2="52" stroke="currentColor" strokeWidth="0.3"/>
            <line x1="13" y1="13" x2="47" y2="47" stroke="currentColor" strokeWidth="0.25"/>
            <line x1="47" y1="13" x2="13" y2="47" stroke="currentColor" strokeWidth="0.25"/>
            <ellipse cx="0"  cy="0"  rx="3.5" ry="5.5" fill="none" stroke="currentColor" strokeWidth="0.35"/>
            <ellipse cx="60" cy="0"  rx="3.5" ry="5.5" fill="none" stroke="currentColor" strokeWidth="0.35"/>
            <ellipse cx="0"  cy="60" rx="3.5" ry="5.5" fill="none" stroke="currentColor" strokeWidth="0.35"/>
            <ellipse cx="60" cy="60" rx="3.5" ry="5.5" fill="none" stroke="currentColor" strokeWidth="0.35"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#adire-pattern)"/>
      </svg>

      <style>{`
        @keyframes adireDrift {
          0%   { transform: translate(0px, 0px); }
          100% { transform: translate(60px, 60px); }
        }
      `}</style>
    </div>
  )
}
