'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface Star {
  x:       number
  y:       number
  r:       number
  opacity: number
  speed:   number
  phase:   number
}

export function useParticles(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  count = 100,
) {
  const reduced  = useReducedMotion()
  const starsRef = useRef<Star[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const effectiveCount = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency < 4)
      ? Math.floor(count / 2)
      : count

    function resize() {
      if (!canvas) return
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      starsRef.current = Array.from({ length: effectiveCount }, () => ({
        x:       Math.random() * canvas!.width,
        y:       Math.random() * canvas!.height,
        r:       Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.55 + 0.15,
        speed:   Math.random() * 0.4 + 0.05,
        phase:   Math.random() * Math.PI * 2,
      }))
    }

    function draw(time: number) {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const s of starsRef.current) {
        const twinkle = reduced
          ? s.opacity
          : s.opacity * (0.65 + 0.35 * Math.sin(time * 0.001 * s.speed + s.phase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(251,246,240,${twinkle})`
        ctx.fill()
      }
    }

    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    if (reduced) {
      draw(0)
      return () => ro.disconnect()
    }

    let raf: number
    function tick(time: number) {
      draw(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [canvasRef, count, reduced])
}
