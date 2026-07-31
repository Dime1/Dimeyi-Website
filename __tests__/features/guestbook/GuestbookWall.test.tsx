import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor }              from '@testing-library/react'
import { GuestbookWall }                         from '@/features/guestbook/GuestbookWall'

describe('GuestbookWall', () => {
  beforeEach(() => { vi.unstubAllGlobals() })

  it('shows empty state when no entries returned', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ entries: [] }), { status: 200 }),
    ))
    render(<GuestbookWall />)
    await waitFor(() => expect(screen.getByText(/be the first/i)).toBeInTheDocument())
  })

  it('renders polaroid cards for each entry', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        entries: [
          { id: '1', author_name: 'Ola', message: 'Congrats!', created_at: '2026-01-01' },
          { id: '2', author_name: 'Fey', message: 'So happy!', created_at: '2026-01-02' },
        ],
      }), { status: 200 }),
    ))
    render(<GuestbookWall />)
    await waitFor(() => expect(screen.getByText(/— Ola/)).toBeInTheDocument())
    expect(screen.getByText(/— Fey/)).toBeInTheDocument()
  })
})
