import { describe, it, expect } from 'vitest'
import { render, screen }       from '@testing-library/react'
import { PolaroidCard }         from '@/features/guestbook/PolaroidCard'

describe('PolaroidCard', () => {
  it('renders the author name', () => {
    render(<PolaroidCard authorName="Ola" message="Congrats!" rotation={2} />)
    expect(screen.getByText(/— Ola/)).toBeInTheDocument()
  })

  it('renders the message', () => {
    render(<PolaroidCard authorName="Ola" message="Congrats!" rotation={2} />)
    expect(screen.getByText('Congrats!')).toBeInTheDocument()
  })

  it('applies rotation via inline style', () => {
    const { container } = render(<PolaroidCard authorName="Ola" message="Hi" rotation={-1.5} />)
    const card = container.firstChild as HTMLElement
    expect(card.style.transform).toBe('rotate(-1.5deg)')
  })
})
