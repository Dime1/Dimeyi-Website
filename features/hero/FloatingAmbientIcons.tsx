'use client'

import { motion }           from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

// ── Layer opacity levels ─────────────────────────────────────────────────────

const LAYER_OPACITY = [0.45, 0.60, 0.75] as const

// ── Fixed instance config (no Math.random — avoids hydration mismatch) ───────

interface Instance {
  id:    number
  src:   string   // path relative to /public
  x:     number   // left %
  y0:    number   // top % (starting position — near/below fold)
  layer: 0 | 1 | 2
  delay: number   // seconds
  dur:   number   // full cycle duration (seconds)
  size:  number   // rendered px
  r:     number   // initial rotation (degrees)
  sw:    number   // x-sway amplitude (px)
  wb:    number   // rotation wobble (degrees)
}

const INSTANCES: Instance[] = [
  // ── Layer 0 — background: smaller, slow, softest ─────────────────────────
  { id: 0,  src: '/Logo Icons/1-removebg-preview.png',  x: 7,   y0: 95,  layer: 0, delay: 0,   dur: 28, size: 117, r: -12, sw: 16, wb: 9  },
  { id: 1,  src: '/Logo Icons/2-removebg-preview.png',  x: 88,  y0: 100, layer: 0, delay: 5,   dur: 33, size: 126, r: 8,   sw: 11, wb: 7  },
  { id: 2,  src: '/Logo Icons/3-removebg-preview.png',  x: 22,  y0: 107, layer: 0, delay: 11,  dur: 27, size: 108, r: -8,  sw: 19, wb: 10 },
  { id: 3,  src: '/Logo Icons/4-removebg-preview.png',  x: 76,  y0: 92,  layer: 0, delay: 16,  dur: 36, size: 117, r: 15,  sw: 9,  wb: 5  },
  { id: 4,  src: '/Logo Icons/5-removebg-preview.png',  x: 46,  y0: 103, layer: 0, delay: 3,   dur: 31, size: 108, r: 0,   sw: 17, wb: 8  },
  // ── Layer 1 — mid ─────────────────────────────────────────────────────────
  { id: 5,  src: '/Logo Icons/6-removebg-preview.png',  x: 15,  y0: 98,  layer: 1, delay: 7,   dur: 24, size: 144, r: -20, sw: 22, wb: 12 },
  { id: 6,  src: '/Logo Icons/7-removebg-preview.png',  x: 63,  y0: 112, layer: 1, delay: 13,  dur: 26, size: 135, r: 10,  sw: 14, wb: 9  },
  { id: 7,  src: '/Logo Icons/9-removebg-preview.png',  x: 38,  y0: 105, layer: 1, delay: 18,  dur: 22, size: 144, r: -5,  sw: 16, wb: 11 },
  { id: 8,  src: '/Logo Icons/10-removebg-preview.png', x: 83,  y0: 96,  layer: 1, delay: 2,   dur: 20, size: 135, r: 45,  sw: 12, wb: 28 },
  // ── Layer 2 — foreground: larger, slightly faster ─────────────────────────
  { id: 9,  src: '/Logo Icons/11-removebg-preview.png', x: 4,   y0: 108, layer: 2, delay: 8,   dur: 18, size: 171, r: -10, sw: 26, wb: 9  },
  { id: 10, src: '/Logo Icons/12-removebg-preview.png', x: 56,  y0: 100, layer: 2, delay: 4,   dur: 21, size: 162, r: 5,   sw: 20, wb: 7  },
  { id: 11, src: '/Logo Icons/13-removebg-preview.png', x: 93,  y0: 93,  layer: 2, delay: 14,  dur: 19, size: 180, r: 18,  sw: 18, wb: 11 },
  { id: 12, src: '/Logo Icons/1-removebg-preview.png',  x: 31,  y0: 101, layer: 2, delay: 6,   dur: 23, size: 153, r: -25, sw: 23, wb: 13 },
  { id: 13, src: '/Logo Icons/3-removebg-preview.png',  x: 71,  y0: 97,  layer: 2, delay: 10,  dur: 17, size: 189, r: 20,  sw: 16, wb: 30 },
]

// ── Component ────────────────────────────────────────────────────────────────

export function FloatingAmbientIcons() {
  const reduced = useReducedMotion()
  if (reduced) return null

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 2 }}
    >
      {INSTANCES.map(inst => {
        const opacity = LAYER_OPACITY[inst.layer]

        return (
          <motion.div
            key={inst.id}
            style={{
              position: 'absolute',
              left:     `${inst.x}%`,
              top:      `${inst.y0}%`,
            }}
            animate={{
              y:      [0, -1100],
              x:      [0, inst.sw, -inst.sw * 0.55, inst.sw * 0.25, 0],
              rotate: [inst.r, inst.r + inst.wb, inst.r - inst.wb * 0.5, inst.r + inst.wb * 0.2, inst.r],
              opacity: [0, opacity, opacity, 0],
            }}
            transition={{
              y: {
                duration: inst.dur,
                delay:    inst.delay,
                ease:     'linear',
                repeat:   Infinity,
              },
              x: {
                duration:   inst.dur * 0.28 + 3,
                delay:      inst.delay,
                ease:       'easeInOut',
                repeat:     Infinity,
                repeatType: 'mirror',
              },
              rotate: {
                duration:   inst.dur * 0.33 + 2,
                delay:      inst.delay,
                ease:       'easeInOut',
                repeat:     Infinity,
                repeatType: 'mirror',
              },
              opacity: {
                duration: inst.dur,
                delay:    inst.delay,
                ease:     'easeInOut',
                repeat:   Infinity,
                times:    [0, 0.07, 0.90, 1],
              },
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={inst.src}
              alt=""
              width={inst.size}
              height={inst.size}
              style={{ display: 'block' }}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
