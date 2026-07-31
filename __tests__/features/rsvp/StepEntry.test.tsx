import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi }           from 'vitest'
import { StepEntry } from '@/features/rsvp/StepEntry'

describe('StepEntry', () => {
  it('renders name, email, and phone inputs', () => {
    render(<StepEntry initial={{}} onNext={vi.fn()} />)
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
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

  it('shows validation error for short phone number', async () => {
    render(<StepEntry initial={{}} onNext={vi.fn()} />)
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Ola' } })
    fireEvent.change(screen.getByLabelText(/email/i),     { target: { value: 'ola@test.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i),     { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument()
    })
  })

  it('calls onNext with name, email, and phone', async () => {
    const onNext = vi.fn()
    render(<StepEntry initial={{}} onNext={onNext} />)
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Ola' } })
    fireEvent.change(screen.getByLabelText(/email/i),     { target: { value: 'ola@test.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i),     { target: { value: '+2348012345678' } })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => {
      expect(onNext).toHaveBeenCalledWith({ name: 'Ola', email: 'ola@test.com', phone: '+2348012345678' })
    })
  })

  it('pre-fills from initial prop', () => {
    render(<StepEntry initial={{ name: 'Fey', email: 'fey@x.com', phone: '1234567' }} onNext={vi.fn()} />)
    expect(screen.getByLabelText(/your name/i)).toHaveValue('Fey')
    expect(screen.getByLabelText(/email/i)).toHaveValue('fey@x.com')
    expect(screen.getByLabelText(/phone/i)).toHaveValue('1234567')
  })
})
