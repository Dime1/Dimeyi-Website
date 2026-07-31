import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScrapbookModule } from '@/features/love-letters/ScrapbookModule'
import { LOVE_LETTERS } from '@/config/content'

describe('ScrapbookModule', () => {
  it('renders the Love Letters heading', () => {
    render(<ScrapbookModule />)
    expect(screen.getByRole('heading', { name: /love letters/i })).toBeInTheDocument()
  })

  it('renders a card for each letter', () => {
    render(<ScrapbookModule />)
    for (const letter of LOVE_LETTERS) {
      expect(screen.getByText(`From ${letter.from}`)).toBeInTheDocument()
    }
  })

  it('renders "To" recipient line for each letter', () => {
    render(<ScrapbookModule />)
    for (const letter of LOVE_LETTERS) {
      expect(screen.getByText(`To ${letter.to}, with love`)).toBeInTheDocument()
    }
  })
})
