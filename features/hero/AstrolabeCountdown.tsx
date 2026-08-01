'use client'

import { useEffect, useState } from 'react'
import { WEDDING }             from '@/config/content'
import { useReducedMotion }    from '@/lib/hooks/useReducedMotion'

interface TimeLeft {
  days:    number
  hours:   number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, WEDDING.date.getTime() - Date.now())
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const SIZE = 220
const CX   = 110
const CY   = 110
const R    = 88

// Round to 4dp so server HTML and client JS produce identical strings
function r(n: number) { return Math.round(n * 10000) / 10000 }

const TICKS = Array.from({ length: 60 }, (_, i) => {
  const angle = (i * 6 - 90) * (Math.PI / 180)
  const major = i % 5 === 0
  const inner = major ? R - 10 : R - 5
  return {
    x1: r(CX + inner * Math.cos(angle)),
    y1: r(CY + inner * Math.sin(angle)),
    x2: r(CX + R * Math.cos(angle)),
    y2: r(CY + R * Math.sin(angle)),
    major,
  }
})

export function AstrolabeCountdown() {
  // null on server + initial client render → no hydration mismatch
  const [time, setTime] = useState<TimeLeft | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    setTime(getTimeLeft())
    if (reduced) return
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [reduced])

  // 0 on server; real angle only after mount
  const pointerAngle = time && !reduced
    ? r(((Date.now() / 1000) % 86400 / 86400) * 360)
    : 0

  const ariaLabel = time
    ? `${time.days} days, ${time.hours} hours, ${time.minutes} minutes, ${time.seconds} seconds until the wedding`
    : 'Counting down to the wedding'

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-[220px]">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-label={ariaLabel}
          role="img"
        >
        {/* Outer ring */}
        <circle cx={CX} cy={CY} r={R}      fill="none" stroke="#C9A24B" strokeWidth="0.5" opacity="0.35"/>
        <circle cx={CX} cy={CY} r={R - 14} fill="none" stroke="#C9A24B" strokeWidth="0.25" opacity="0.15"/>

        {/* Tick marks */}
        {TICKS.map((t, i) => (
          <line
            key={i}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke="#C9A24B"
            strokeWidth={t.major ? 0.8 : 0.4}
            opacity={t.major ? 0.45 : 0.2}
          />
        ))}

        {/* Cross-hairs */}
        {([[CX, CY - R + 20, CX, CY - 48], [CX + 48, CY, CX + R - 20, CY],
          [CX, CY + 48, CX, CY + R - 20], [CX - R + 20, CY, CX - 48, CY]] as [number,number,number,number][]).map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#C9A24B" strokeWidth="0.3" opacity="0.12" />
        ))}

        {/* Pointer hand */}
        <g transform={`rotate(${pointerAngle}, ${CX}, ${CY})`}>
          <line
            x1={CX} y1={CY}
            x2={CX} y2={CY - R + 18}
            stroke="#C9A24B" strokeWidth="0.8" opacity="0.55" strokeLinecap="round"
          />
          <circle cx={CX} cy={CY - R + 18} r="2" fill="#C9A24B" opacity="0.6"/>
        </g>

        {/* Center dot */}
        <circle cx={CX} cy={CY} r="3" fill="#C9A24B" opacity="0.8"/>

        {/* Day count */}
        <text
          x={CX} y={CY - 8}
          textAnchor="middle" dominantBaseline="middle"
          fill="#FBF6F0" fontSize="34"
          fontFamily="var(--font-display)" fontWeight="700" opacity="0.9"
          aria-hidden="true"
        >
          {time?.days ?? '--'}
        </text>

        {/* DAYS label */}
        <text
          x={CX} y={CY + 17}
          textAnchor="middle" dominantBaseline="middle"
          fill="#C9A24B" fontSize="7"
          fontFamily="var(--font-sans)" fontWeight="500" letterSpacing="0.18em"
          opacity="0.55"
        >
          DAYS
        </text>
        </svg>
      </div>

      {/* HH:MM:SS */}
      <p
        role="timer"
        aria-label={time ? `${time.hours} hours ${time.minutes} minutes ${time.seconds} seconds` : 'loading'}
        className="font-sans text-xs tracking-[0.22em] text-gold/35 tabular-nums"
      >
        {time
          ? `${String(time.hours).padStart(2,'0')} : ${String(time.minutes).padStart(2,'0')} : ${String(time.seconds).padStart(2,'0')}`
          : '-- : -- : --'}
      </p>
    </div>
  )
}
