import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MilestoneCard } from '@/features/timeline/MilestoneCard'
import { STORY_MILESTONES } from '@/config/content'

describe('MilestoneCard', () => {
  const milestone = STORY_MILESTONES[0]

  it('renders the chapter label', () => {
    render(<MilestoneCard milestone={milestone} index={0} />)
    expect(screen.getByText('Chapter One')).toBeInTheDocument()
  })

  it('renders the milestone title', () => {
    render(<MilestoneCard milestone={milestone} index={0} />)
    expect(screen.getByText('A Hello That Changed Everything')).toBeInTheDocument()
  })

  it('renders the date', () => {
    render(<MilestoneCard milestone={milestone} index={0} />)
    expect(screen.getByText(/April 2018/)).toBeInTheDocument()
  })

  it('renders the body text', () => {
    render(<MilestoneCard milestone={milestone} index={0} />)
    expect(screen.getAllByText(/Covenant University/).length).toBeGreaterThan(0)
  })
})
