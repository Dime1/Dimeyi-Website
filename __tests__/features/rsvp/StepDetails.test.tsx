import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi }           from 'vitest'
import { StepDetails } from '@/features/rsvp/StepDetails'

describe('StepDetails', () => {
  it('renders aso-ebi size options', () => {
    render(<StepDetails initial={{}} onNext={vi.fn()} isSubmitting={false} />)
    expect(screen.getByText(/aso-ebi/i)).toBeInTheDocument()
  })

  it('renders all 6 aso-ebi size buttons', () => {
    render(<StepDetails initial={{}} onNext={vi.fn()} isSubmitting={false} />)
    for (const size of ['XS', 'S', 'M', 'L', 'XL', 'XXL']) {
      expect(screen.getByRole('button', { name: size })).toBeInTheDocument()
    }
  })

  it('calls onNext on submit', async () => {
    const onNext = vi.fn()
    render(<StepDetails initial={{}} onNext={onNext} isSubmitting={false} />)
    fireEvent.click(screen.getByRole('button', { name: /confirm rsvp/i }))
    await waitFor(() => {
      expect(onNext).toHaveBeenCalledWith(expect.objectContaining({}))
    })
  })

  it('disables submit button while submitting', () => {
    render(<StepDetails initial={{}} onNext={vi.fn()} isSubmitting={true} />)
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()
  })
})
