import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GalleryGrid } from '@/features/gallery/GalleryGrid'

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

vi.mock('@/config/content', () => ({
  GALLERY_IMAGES: [
    { id: 'g1', src: '/img/p1.jpg', alt: 'Photo 1', category: 'couple-journey' },
    { id: 'g2', src: '/img/p2.jpg', alt: 'Photo 2', category: 'proposal'       },
    { id: 'g3', src: '/img/p3.jpg', alt: 'Photo 3', category: 'couple-journey' },
  ],
}))

describe('GalleryGrid', () => {
  it('renders all images when filter is All', () => {
    render(<GalleryGrid />)
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByAltText('Photo 1')).toBeInTheDocument()
    expect(screen.getByAltText('Photo 2')).toBeInTheDocument()
    expect(screen.getByAltText('Photo 3')).toBeInTheDocument()
  })

  it('filters to couple-journey only', () => {
    render(<GalleryGrid />)
    fireEvent.click(screen.getByRole('tab', { name: 'Couple Journey' }))
    expect(screen.getByAltText('Photo 1')).toBeInTheDocument()
    expect(screen.queryByAltText('Photo 2')).not.toBeInTheDocument()
  })

  it('opens lightbox when an image button is clicked', () => {
    render(<GalleryGrid />)
    fireEvent.click(screen.getByRole('button', { name: 'Photo 1' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes lightbox when close button is clicked', () => {
    render(<GalleryGrid />)
    fireEvent.click(screen.getByRole('button', { name: 'Photo 1' }))
    fireEvent.click(screen.getByRole('button', { name: /close lightbox/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
