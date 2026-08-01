'use client'
import { useEffect, useState } from 'react'

interface ScoreEntry {
  id:            string
  player_name:   string
  avatar:        string
  score:         number
  time_taken_ms: number
}

const RANK_LABELS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

export function Leaderboard() {
  const [scores,  setScores]  = useState<ScoreEntry[]>([])
  const [loading, setLoading] = useState(true)

  function load() {
    fetch('/api/quiz')
      .then(r => r.json())
      .then(json => setScores(json.scores ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 30_000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return (
    <p className="font-sans text-xs text-plum/30 text-center tracking-widest uppercase">
      Loading scores…
    </p>
  )

  if (scores.length === 0) return (
    <p className="font-sans text-xs text-plum/30 text-center tracking-widest uppercase">
      No scores yet — be the first!
    </p>
  )

  return (
    <div className="max-w-md mx-auto">
      <h3 className="font-display text-2xl text-plum text-center mb-8">
        Royal Court Rankings
      </h3>
      <ol className="space-y-3">
        {scores.map((entry, i) => (
          <li
            key={entry.id}
            className="flex items-center gap-4 border border-gold/15 rounded-sm px-5 py-3 bg-ivory/60"
          >
            <span className="font-script italic text-gold/60 text-sm w-8 shrink-0 text-center">
              {RANK_LABELS[i]}
            </span>
            <span className="text-xl">{entry.avatar}</span>
            <span className="font-sans text-sm text-plum flex-1 truncate">{entry.player_name}</span>
            <span className="font-display text-plum text-lg">{entry.score}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
