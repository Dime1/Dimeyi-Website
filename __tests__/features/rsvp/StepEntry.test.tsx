import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi }           from 'vitest'
import { StepEntry } from '@/features/rsvp/StepEntry'

describe('StepEntry', () => {
  it('renders name and email inputs', () => {
    render(<StepEntry initial={{}} onNext={vi.fn()} />)
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('shows validation error for empty name on submit', async () => {
    render(<StepEntry initial={{}} onNext={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => {
      expect(screen.getByText(/please enter your full name/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    render(<StepEntry initial={{}} onNext={vi.fn()} />)
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Ola' } })
    fireEvent.change(screen.getByLabelText(/email/i),     { target: { value: 'bad' } })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
    })
  })

  it('calls onNext with valid data', async () => {
    const onNext = vi.fn()
    render(<StepEntry initial={{}} onNext={onNext} />)
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Ola' } })
    fireEvent.change(screen.getByLabelText(/email/i),     { target: { value: 'ola@test.com' } })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => {
      const call = onNext.mock.calls[0]
      expect(call[0]).toEqual({ name: 'Ola', email: 'ola@test.com' })
    })
  })

  it('pre-fills from initial prop', () => {
    render(<StepEntry initial={{ name: 'Fey', email: 'fey@x.com' }} onNext={vi.fn()} />)
    expect(screen.getByLabelText(/your name/i)).toHaveValue('Fey')
    expect(screen.getByLabelText(/email/i)).toHaveValue('fey@x.com')
  })
})
