import { STORY_MOVEMENTS } from '@/config/content'
import { StoryMovement }   from './StoryMovement'
import { StoryThread }     from './StoryThread'
import { StoryBackground } from './StoryBackground'

function isIncomplete(m: (typeof STORY_MOVEMENTS)[number]) {
  return (
    m.title.startsWith('[')  ||
    m.body.startsWith('[')   ||
    m.period.startsWith('[')
  )
}

export function StorySection() {
  const visible = [...STORY_MOVEMENTS].filter(m => !isIncomplete(m))

  return (
    <section className="relative min-h-screen">
      <StoryBackground />

      <div className="relative max-w-7xl mx-auto px-6 md:px-16 py-24 md:py-32" style={{ zIndex: 1 }}>

        {/* Page header */}
        <header className="text-center mb-28 md:mb-44">
          <h1 className="font-display text-5xl md:text-7xl text-plum mb-4">
            Our Story
          </h1>
          <p className="font-sans text-sm tracking-[0.26em] uppercase text-plum/75">
            Written in the stars
          </p>
        </header>

        {/* Movements with connecting thread */}
        <div className="relative pl-0 md:pl-10">
          <StoryThread />

          <div className="relative" style={{ zIndex: 1 }}>
            {visible.map((movement, i) => (
              <StoryMovement
                key={movement.id}
                movement={movement}
                index={i}
                verseText={movement.verse.text}
                verseRef={movement.verse.ref}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
