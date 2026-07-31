import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { StepAttendance } from '@/features/rsvp/StepAttendance'

describe('StepAttendance', () => {
  it('renders attending and not-attending buttons', () => {
    render(<StepAttendance name="Ola" onNext={vi.fn()} />)
    expect(screen.getByRole('button', { name: /joyfully attend/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /unable to attend/i })).toBeInTheDocument()
  })

  it('calls onNext with attending=true when yes is clicked', () => {
    const onNext = vi.fn()
    render(<StepAttendance name="Ola" onNext={onNext} />)
    fireEvent.click(screen.getByRole('button', { name: /joyfully attend/i }))
    expect(onNext).toHaveBeenCalledWith({ attending: true })
  })

  it('calls onNext with attending=false when no is clicked', () => {
    const onNext = vi.fn()
    render(<StepAttendance name="Ola" onNext={onNext} />)
    fireEvent.click(screen.getByRole('button', { name: /unable to attend/i }))
    expect(onNext).toHaveBeenCalledWith({ attending: false })
  })

  it('displays the guest name in the question', () => {
    render(<StepAttendance name="Feyisogo" onNext={vi.fn()} />)
    expect(screen.getByText(/Feyisogo/)).toBeInTheDocument()
  })
})
