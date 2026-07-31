import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AvatarPicker, AVATARS }     from '@/features/guestbook/quiz/AvatarPicker'

describe('AvatarPicker', () => {
  it('renders a button for every avatar', () => {
    render(<AvatarPicker selected={null} onSelect={vi.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(AVATARS.length)
  })

  it('marks the selected avatar as pressed', () => {
    render(<AvatarPicker selected={AVATARS[0]} onSelect={vi.fn()} />)
    expect(screen.getAllByRole('button')[0]).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByRole('button')[1]).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onSelect with the clicked avatar', () => {
    const onSelect = vi.fn()
    render(<AvatarPicker selected={null} onSelect={onSelect} />)
    fireEvent.click(screen.getAllByRole('button')[2])
    expect(onSelect).toHaveBeenCalledWith(AVATARS[2])
  })
})
