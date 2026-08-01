import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RegistrySection } from '@/features/registry/RegistrySection'

describe('RegistrySection', () => {
  it('renders Give to the Couple card front', () => {
    render(<RegistrySection />)
    expect(screen.getByText(/give to the couple/i)).toBeInTheDocument()
  })

  it('renders Gift List card front', () => {
    render(<RegistrySection />)
    expect(screen.getByText(/gift list/i)).toBeInTheDocument()
  })

  it('renders both account tabs on card 1', () => {
    render(<RegistrySection />)
    expect(screen.getByRole('button', { name: /nigerian/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /intl/i })).toBeInTheDocument()
  })

  it('shows Nigerian account fields by default', () => {
    render(<RegistrySection />)
    expect(screen.getByText('Account No.')).toBeInTheDocument()
    expect(screen.queryByText('IBAN')).not.toBeInTheDocument()
  })

  it('switches to International fields when Intl tab is clicked', () => {
    render(<RegistrySection />)
    fireEvent.click(screen.getByRole('button', { name: /intl/i }))
    expect(screen.getByText('IBAN')).toBeInTheDocument()
    expect(screen.queryByText('Account No.')).not.toBeInTheDocument()
  })

  it('renders Amazon List and Giftwhale links', () => {
    render(<RegistrySection />)
    expect(screen.getByRole('link', { name: /amazon list/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /giftwhale/i })).toBeInTheDocument()
  })

  it('Amazon link opens in new tab', () => {
    render(<RegistrySection />)
    expect(screen.getByRole('link', { name: /amazon list/i })).toHaveAttribute('target', '_blank')
  })
})
