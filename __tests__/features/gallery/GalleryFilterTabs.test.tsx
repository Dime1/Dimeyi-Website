import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GalleryFilterTabs } from '@/features/gallery/GalleryFilterTabs'

describe('GalleryFilterTabs', () => {
  it('renders all four tabs', () => {
    render(<GalleryFilterTabs active="all" onChange={vi.fn()} />)
    expect(screen.getAllByRole('tab')).toHaveLength(4)
  })

  it('marks the active tab as selected', () => {
    render(<GalleryFilterTabs active="traditional" onChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Traditional' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onChange with the correct category when clicked', () => {
    const onChange = vi.fn()
    render(<GalleryFilterTabs active="all" onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Pre-wedding' }))
    expect(onChange).toHaveBeenCalledWith('pre-wedding')
  })
})
