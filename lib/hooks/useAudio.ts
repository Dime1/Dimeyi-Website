'use client'

import { useEffect, useRef, useState } from 'react'

interface UseAudioOptions {
  src:   string
  loop?: boolean
}

export function useAudio({ src, loop = true }: UseAudioOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    audioRef.current      = new Audio(src)
    audioRef.current.loop = loop
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [src, loop])

  function toggle() {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().catch(() => {
        // Browser autoplay policy — user must interact first; silent fail is correct
      })
      setPlaying(true)
    }
  }

  return { playing, toggle }
}
