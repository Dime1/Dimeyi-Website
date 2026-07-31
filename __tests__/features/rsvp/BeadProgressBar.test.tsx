import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BeadProgressBar } from '@/features/rsvp/BeadProgressBar'

describe('BeadProgressBar', () => {
  it('renders 4 beads', () => {
    render(<BeadProgressBar currentStep={1} totalSteps={4} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('marks step 1 as current', () => {
    render(<BeadProgressBar currentStep={1} totalSteps={4} />)
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveAttribute('aria-current', 'step')
  })

  it('marks steps before current as completed', () => {
    render(<BeadProgressBar currentStep={3} totalSteps={4} />)
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveAttribute('data-completed', 'true')
    expect(items[1]).toHaveAttribute('data-completed', 'true')
    expect(items[2]).toHaveAttribute('aria-current', 'step')
    expect(items[3]).not.toHaveAttribute('data-completed')
  })

  it('has accessible label', () => {
    render(<BeadProgressBar currentStep={2} totalSteps={4} />)
    expect(screen.getByRole('list', { name: /step 2 of 4/i })).toBeInTheDocument()
  })
})
