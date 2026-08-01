import { GuestbookWall } from '@/features/guestbook/GuestbookWall'
import { QuizModule }    from '@/features/guestbook/quiz/QuizModule'

export default function GuestbookPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-32">
      <section className="mb-32">
        <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
          Guestbook
        </h1>
        <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
          Leave your blessing for the couple
        </p>
        <GuestbookWall />
      </section>

      <section>
        <h2 className="font-display text-3xl md:text-4xl text-plum text-center mb-4">
          How Well Do You Know Us?
        </h2>
        <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
          A quiz for our guests
        </p>
        <QuizModule />
      </section>
    </div>
  )
}
