import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimelineSection } from '@/features/timeline/TimelineSection'
import { STORY_MILESTONES, VERSES } from '@/config/content'

describe('TimelineSection', () => {
  it('renders all 10 chapter labels', () => {
    render(<TimelineSection />)
    for (const m of STORY_MILESTONES) {
      expect(screen.getByText(m.chapter)).toBeInTheDocument()
    }
  })

  it('renders the mid-timeline scripture verse text', () => {
    render(<TimelineSection />)
    expect(screen.getByText(VERSES.timeline.text)).toBeInTheDocument()
  })

  it('renders the page heading', () => {
    render(<TimelineSection />)
    expect(screen.getByRole('heading', { name: /our story/i })).toBeInTheDocument()
  })
})
