import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LightboxModal } from '@/features/gallery/LightboxModal'

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

const IMAGES = [
  { id: 'g1', src: '/img/1.jpg', alt: 'Photo 1', category: 'couple-journey' as const },
  { id: 'g2', src: '/img/2.jpg', alt: 'Photo 2', category: 'proposal' as const },
] as const

describe('LightboxModal', () => {
  it('renders the image at initialIndex', () => {
    render(<LightboxModal images={IMAGES} initialIndex={0} onClose={vi.fn()} />)
    expect(screen.getByAltText('Photo 1')).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(<LightboxModal images={IMAGES} initialIndex={0} onClose={onClose} />)
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    render(<LightboxModal images={IMAGES} initialIndex={0} onClose={onClose} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('advances to next image when next button clicked', () => {
    render(<LightboxModal images={IMAGES} initialIndex={0} onClose={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /next image/i }))
    expect(screen.getByAltText('Photo 2')).toBeInTheDocument()
  })

  it('wraps around from last to first on next', () => {
    render(<LightboxModal images={IMAGES} initialIndex={1} onClose={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /next image/i }))
    expect(screen.getByAltText('Photo 1')).toBeInTheDocument()
  })

  it('goes to previous image when prev button clicked', () => {
    render(<LightboxModal images={IMAGES} initialIndex={1} onClose={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /previous image/i }))
    expect(screen.getByAltText('Photo 1')).toBeInTheDocument()
  })
})
