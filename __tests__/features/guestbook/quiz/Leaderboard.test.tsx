import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor }              from '@testing-library/react'
import { Leaderboard }                          from '@/features/guestbook/quiz/Leaderboard'

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers() })

describe('Leaderboard', () => {
  it('shows loading initially', () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ scores: [] }), { status: 200 }),
    ))
    render(<Leaderboard />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows empty state when no scores', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ scores: [] }), { status: 200 }),
    ))
    render(<Leaderboard />)
    await waitFor(() => expect(screen.getByText(/no scores yet/i)).toBeInTheDocument())
  })

  it('renders leaderboard entries', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        scores: [{ id: '1', player_name: 'Ola', avatar: '💍', score: 5, time_taken_ms: 5000 }],
      }), { status: 200 }),
    ))
    render(<Leaderboard />)
    await waitFor(() => expect(screen.getByText('Ola')).toBeInTheDocument())
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
