import { LOVE_LETTERS } from '@/config/content'
import { LetterCard }   from '@/features/love-letters/LetterCard'

const ROTATIONS = [-1.5, 0.8, -0.5, 1.2]

export function ScrapbookModule() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-32">
      <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
        Love Letters
      </h1>
      <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
        Words that carried us here
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...LOVE_LETTERS].map((letter, i) => (
          <LetterCard
            key={letter.id}
            letter={letter}
            rotation={ROTATIONS[i % ROTATIONS.length]}
          />
        ))}
      </div>
    </section>
  )
}
