import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AstrolabeCountdown } from '@/features/hero/AstrolabeCountdown'

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
})

describe('AstrolabeCountdown', () => {
  it('renders a DAYS label', () => {
    render(<AstrolabeCountdown />)
    expect(screen.getByText('DAYS')).toBeInTheDocument()
  })

  it('has an accessible aria-label mentioning days', () => {
    const { container } = render(<AstrolabeCountdown />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('aria-label')).toMatch(/days/)
  })

  it('renders an HH:MM:SS time display', () => {
    render(<AstrolabeCountdown />)
    const timeEl = screen.getByRole('timer')
    expect(timeEl).toBeInTheDocument()
  })
})
