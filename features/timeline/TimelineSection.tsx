import { STORY_MILESTONES, VERSES } from '@/config/content'
import { MilestoneCard }        from '@/features/timeline/MilestoneCard'
import { ConstellationThread }  from '@/features/timeline/ConstellationThread'
import { ScriptureStrip }       from '@/components/ui/ScriptureStrip'

const SCRIPTURE_AFTER_INDEX = 4

export function TimelineSection() {
  return (
    <section className="relative max-w-3xl mx-auto px-6 py-16 md:py-32">
      <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
        Our Story
      </h1>
      <p className="font-sans text-xs tracking-[0.18em] uppercase text-plum/30 text-center mb-20">
        Ten chapters · One forever
      </p>

      <div className="relative pl-6 md:pl-8">
        <ConstellationThread />

        {[...STORY_MILESTONES].map((milestone, i) => (
          <div key={milestone.id}>
            <MilestoneCard milestone={milestone} index={i} />

            {i === SCRIPTURE_AFTER_INDEX && (
              <div className="pl-0 -ml-8 my-8">
                <ScriptureStrip
                  text={VERSES.timeline.text}
                  reference={VERSES.timeline.ref}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
