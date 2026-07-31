import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EventBlock } from '@/features/schedule/EventBlock'
import { EVENTS } from '@/config/content'

describe('EventBlock', () => {
  const event = EVENTS[1]  // Church Ceremony — has fixed date 'February 18, 2027'

  it('renders the event name', () => {
    render(<EventBlock event={event} />)
    expect(screen.getByText('Church Ceremony')).toBeInTheDocument()
  })

  it('renders the event date', () => {
    render(<EventBlock event={event} />)
    expect(screen.getByText(/February 18, 2027/)).toBeInTheDocument()
  })

  it('renders a disabled calendar button when time is a placeholder', () => {
    render(<EventBlock event={event} />)
    const btn = screen.getByRole('button', { name: /add to calendar/i })
    expect(btn).toBeDisabled()
  })

  it('renders the cultural note when present', () => {
    const reception = EVENTS[2]
    render(<EventBlock event={reception} />)
    expect(screen.getByText(/aso-ebi/i)).toBeInTheDocument()
  })
})
