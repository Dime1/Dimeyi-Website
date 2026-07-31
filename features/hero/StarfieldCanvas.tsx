'use client'

import { useRef } from 'react'
import { useParticles } from '@/lib/hooks/useParticles'

interface StarfieldCanvasProps {
  count?: number
}

export function StarfieldCanvas({ count = 100 }: StarfieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useParticles(canvasRef, count)

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}
