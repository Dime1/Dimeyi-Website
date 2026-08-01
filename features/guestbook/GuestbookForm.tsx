'use client'
import { useState } from 'react'

export interface GuestbookEntry {
  id:          string
  author_name: string
  message:     string
  created_at:  string
}

interface GuestbookFormProps {
  onSubmitted: (entry: GuestbookEntry) => void
}

export function GuestbookForm({ onSubmitted }: GuestbookFormProps) {
  const [name,       setName]       = useState('')
  const [message,    setMessage]    = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [submitted,  setSubmitted]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res  = await fetch('/api/guestbook', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ author_name: name, message }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error('Submit failed')
      onSubmitted(json.entry)
      setName('')
      setMessage('')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <p className="font-script italic text-plum/60 text-2xl text-center py-8">
        Thank you for your blessing ♡
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mb-16">
      {error && (
        <p role="alert" className="font-sans text-xs text-red-600/80 text-center border border-red-300/30 rounded-sm py-3 px-4">
          {error}
        </p>
      )}
      <div>
        <label className="font-sans text-xs tracking-[0.18em] uppercase text-plum/70 block mb-1">
          Your Name
        </label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          required
          minLength={2}
          placeholder="Enter your name"
          className="w-full border border-gold/35 rounded-sm px-4 py-3 font-sans text-sm text-plum bg-transparent focus:outline-none focus:border-gold/65"
        />
      </div>
      <div>
        <label className="font-sans text-xs tracking-[0.18em] uppercase text-plum/70 block mb-1">
          Leave a Message
        </label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          maxLength={500}
          rows={4}
          placeholder="Write your blessing for the couple…"
          className="w-full border border-gold/35 rounded-sm px-4 py-3 font-sans text-sm text-plum bg-transparent focus:outline-none focus:border-gold/65 resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full border border-gold/30 text-plum font-sans text-xs tracking-[0.18em] uppercase py-3 hover:bg-plum hover:text-ivory transition-colors duration-300 disabled:opacity-40"
      >
        {submitting ? 'Sending…' : 'Leave a Blessing'}
      </button>
    </form>
  )
}
