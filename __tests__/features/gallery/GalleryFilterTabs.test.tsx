import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GalleryFilterTabs } from '@/features/gallery/GalleryFilterTabs'

describe('GalleryFilterTabs', () => {
  it('renders all three tabs', () => {
    render(<GalleryFilterTabs active="all" onChange={vi.fn()} />)
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it("marks the active tab as selected", () => {
    render(<GalleryFilterTabs active="couple-journey" onChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: "Couple's Journey" })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'false')
  })

  it("calls onChange with couple-journey when that tab is clicked", () => {
    const onChange = vi.fn()
    render(<GalleryFilterTabs active="all" onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: "Couple's Journey" }))
    expect(onChange).toHaveBeenCalledWith('couple-journey')
  })

  it('calls onChange with proposal when that tab is clicked', () => {
    const onChange = vi.fn()
    render(<GalleryFilterTabs active="all" onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Proposal' }))
    expect(onChange).toHaveBeenCalledWith('proposal')
  })
})
