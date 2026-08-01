import { GuestbookWall } from '@/features/guestbook/GuestbookWall'

export default function GuestbookPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-32">
      <section>
        <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
          Ode to the Couple
        </h1>
        <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
          Leave your blessing for us
        </p>
        <GuestbookWall />
      </section>
    </div>
  )
}
