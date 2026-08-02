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
    const audio   = new Audio(src)
    audio.loop    = loop
    audioRef.current = audio

    const onPlay  = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('play',  onPlay)
    audio.addEventListener('pause', onPause)

    // Attempt autoplay on mount; browsers may block it — fails silently
    audio.play().catch(() => {})

    return () => {
      audio.removeEventListener('play',  onPlay)
      audio.removeEventListener('pause', onPause)
      audio.pause()
      audioRef.current = null
    }
  }, [src, loop])

  function toggle() {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {
        // Browser autoplay policy — silently ignored; state stays false via event listeners
      })
    }
  }

  return { playing, toggle }
}
