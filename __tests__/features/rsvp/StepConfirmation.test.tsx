import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StepConfirmation } from '@/features/rsvp/StepConfirmation'

describe('StepConfirmation', () => {
  it('shows attending thank-you message', () => {
    render(<StepConfirmation name="Ola" attending={true} />)
    expect(screen.getByText(/we cannot wait to celebrate/i)).toBeInTheDocument()
  })

  it('shows not-attending message', () => {
    render(<StepConfirmation name="Ola" attending={false} />)
    expect(screen.getByText(/we will miss you/i)).toBeInTheDocument()
  })

  it('displays the guest name in both states', () => {
    const { rerender } = render(<StepConfirmation name="Feyisogo" attending={true} />)
    expect(screen.getByText(/we cannot wait to celebrate with you, Feyisogo/i)).toBeInTheDocument()
    rerender(<StepConfirmation name="Feyisogo" attending={false} />)
    expect(screen.getByText(/thank you, Feyisogo/i)).toBeInTheDocument()
  })
})
