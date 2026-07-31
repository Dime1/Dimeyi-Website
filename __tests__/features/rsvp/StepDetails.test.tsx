import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi }           from 'vitest'
import { StepDetails } from '@/features/rsvp/StepDetails'

describe('StepDetails', () => {
  it('renders guest count, dietary, song request, and aso-ebi fields', () => {
    render(<StepDetails initial={{}} onNext={vi.fn()} isSubmitting={false} />)
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/dietary/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/song request/i)).toBeInTheDocument()
    expect(screen.getByText(/aso-ebi/i)).toBeInTheDocument()
  })

  it('shows validation error if guest count is 0 on submit', async () => {
    render(<StepDetails initial={{ guest_count: 0 as unknown as number }} onNext={vi.fn()} isSubmitting={false} />)
    // Decrease below 1 is not possible via the stepper, but we can directly submit with guest_count 0
    // by bypassing the stepper; in practice the refine catches it on submit
    fireEvent.click(screen.getByRole('button', { name: /confirm rsvp/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('calls onNext with valid data', async () => {
    const onNext = vi.fn()
    render(<StepDetails initial={{ guest_count: 2 }} onNext={onNext} isSubmitting={false} />)
    fireEvent.click(screen.getByRole('button', { name: /confirm rsvp/i }))
    await waitFor(() => {
      expect(onNext).toHaveBeenCalledWith(expect.objectContaining({ guest_count: 2 }))
    })
  })

  it('disables submit button while submitting', () => {
    render(<StepDetails initial={{ guest_count: 1 }} onNext={vi.fn()} isSubmitting={true} />)
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()
  })

  it('renders all 6 aso-ebi size options', () => {
    render(<StepDetails initial={{}} onNext={vi.fn()} isSubmitting={false} />)
    for (const size of ['XS', 'S', 'M', 'L', 'XL', 'XXL']) {
      expect(screen.getByRole('button', { name: size })).toBeInTheDocument()
    }
  })
})
