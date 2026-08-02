'use client'
import { useState }          from 'react'
import { GuestbookWall }     from '@/features/guestbook/GuestbookWall'

export default function GuestbookPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden bg-plum/30">
      {/* Background video at 50% opacity */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.5 }}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/Page Background/ode to the couple.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10 md:py-16">

        {/* Header card — title and subtitle only */}
        <div className="bg-plum/85 backdrop-blur-md rounded-2xl shadow-2xl px-6 md:px-10 py-6 mb-6 w-fit mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl text-ivory mb-3">
            Ode to the Couple
          </h1>
          <p className="font-sans text-xs tracking-[0.18em] uppercase text-gold">
            Leave your blessing for us
          </p>
        </div>

        {/* Leave a Blessing — solid filled button, outside the card */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gold text-plum px-10 py-3 rounded-full font-sans text-sm font-semibold tracking-[0.18em] uppercase hover:bg-gold/80 transition-colors shadow-lg"
          >
            Leave a Blessing
          </button>
        </div>

        {/* Message cards — outside the card, video bg shows through */}
        <GuestbookWall open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </div>
  )
}
