import { describe, it, expect, vi } from 'vitest'
import { render, screen }           from '@testing-library/react'
import { RegistrySection }          from '@/features/registry/RegistrySection'

vi.mock('@/config/content', () => ({
  REGISTRY_LINKS: [
    { id: 'r1', label: 'Amazon',   url: 'https://amazon.com', note: 'Kitchen items'     },
    { id: 'r2', label: 'Wishlist', url: '[REGISTRY_2_URL]',   note: '[REGISTRY_2_NOTE]' },
  ],
}))

describe('RegistrySection', () => {
  it('renders all registry item labels', () => {
    render(<RegistrySection />)
    expect(screen.getByText('Amazon')).toBeInTheDocument()
    expect(screen.getByText('Wishlist')).toBeInTheDocument()
  })

  it('renders a real link for non-placeholder URLs', () => {
    render(<RegistrySection />)
    const link = screen.getByRole('link', { name: /view registry/i })
    expect(link).toHaveAttribute('href', 'https://amazon.com')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('shows "Link coming soon" for placeholder URLs', () => {
    render(<RegistrySection />)
    expect(screen.getByText('Link coming soon')).toBeInTheDocument()
  })

  it('renders item notes for non-placeholder notes', () => {
    render(<RegistrySection />)
    expect(screen.getByText('Kitchen items')).toBeInTheDocument()
  })
})
