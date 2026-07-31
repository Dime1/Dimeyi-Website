import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LogisticsCard } from '@/features/travel/LogisticsCard'

describe('LogisticsCard', () => {
  it('renders the card label', () => {
    render(<LogisticsCard label="Airport" value="[AIRPORT_NAME]" />)
    expect(screen.getByText('Airport')).toBeInTheDocument()
  })

  it('renders a placeholder indicator when value starts with [', () => {
    render(<LogisticsCard label="Hotel" value="[HOTEL_NAME]" />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })

  it('renders the actual value when not a placeholder', () => {
    render(<LogisticsCard label="Country" value="Nigeria" />)
    expect(screen.getByText('Nigeria')).toBeInTheDocument()
  })
})
