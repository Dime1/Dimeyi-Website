'use client'

import { motion }          from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface StepConfirmationProps {
  name:      string
  attending: boolean
}

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id:       i,
  angle:    (i / 28) * 360,
  distance: 55 + (i % 5) * 15,
  color:    (['#C9A24B', '#f5f0e8', '#6b3a6b'] as const)[i % 3],
  size:     i % 4 === 0 ? 10 : 6,
}))

export function StepConfirmation({ name, attending }: StepConfirmationProps) {
  const reduced = useReducedMotion()

  return (
    <div className="text-center space-y-8 py-4">
      {/* Particle burst */}
      <div className="relative flex justify-center items-center h-32" aria-hidden="true">
        {!reduced && PARTICLES.map(p => (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              width:           p.size,
              height:          p.size,
              backgroundColor: p.color,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{
              x:       Math.cos((p.angle * Math.PI) / 180) * p.distance,
              y:       Math.sin((p.angle * Math.PI) / 180) * p.distance,
              opacity: 0,
              scale:   [0, 1.4, 0],
            }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: p.id * 0.018 }}
          />
        ))}
        <motion.span
          className="font-script italic text-gold text-4xl relative z-10"
          initial={reduced ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 180, damping: 14 }}
        >
          Feyisogo &amp; Oladimeji
        </motion.span>
      </div>

      {/* Copy */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="space-y-3"
      >
        <p className="font-display text-2xl text-plum">
          {attending
            ? `We cannot wait to celebrate with you, ${name}!`
            : `Thank you, ${name}`}
        </p>
        <p className="font-sans text-sm text-plum/85 leading-relaxed max-w-xs mx-auto">
          {attending
            ? 'Your RSVP has been received. Travel details and further information will be shared soon.'
            : 'We will miss you on our special day. Your love and support mean everything to us.'}
        </p>
      </motion.div>
    </div>
  )
}
