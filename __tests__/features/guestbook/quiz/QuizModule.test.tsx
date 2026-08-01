import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor }               from '@testing-library/react'
import { QuizModule }                                        from '@/features/guestbook/quiz/QuizModule'

vi.mock('@/config/content', () => ({
  QUIZ_QUESTIONS: [
    { id: 'q1', question: 'Where did they meet?', options: ['A', 'B', 'C', 'D'], answer: 1 },
  ],
}))

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ scores: [] }), { status: 200 }),
  ))
})
afterEach(() => { vi.unstubAllGlobals() })

describe('QuizModule', () => {
  it('shows setup phase with Begin button initially', () => {
    render(<QuizModule />)
    expect(screen.getByRole('button', { name: /begin the quiz/i })).toBeInTheDocument()
  })

  it('Begin button is disabled without name and avatar', () => {
    render(<QuizModule />)
    expect(screen.getByRole('button', { name: /begin the quiz/i })).toBeDisabled()
  })

  it('Begin button enables when name and avatar provided', () => {
    render(<QuizModule />)
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), { target: { value: 'Ola' } })
    fireEvent.click(screen.getByRole('button', { name: /select 💍 avatar/i }))
    expect(screen.getByRole('button', { name: /begin the quiz/i })).not.toBeDisabled()
  })

  it('transitions to question view on Begin click', () => {
    render(<QuizModule />)
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), { target: { value: 'Ola' } })
    fireEvent.click(screen.getByRole('button', { name: /select 💍 avatar/i }))
    fireEvent.click(screen.getByRole('button', { name: /begin the quiz/i }))
    expect(screen.getByText('Where did they meet?')).toBeInTheDocument()
  })

  it('transitions to done screen after answering', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ score: { id: '1' } }), { status: 201 }),
    ))
    render(<QuizModule />)
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), { target: { value: 'Ola' } })
    fireEvent.click(screen.getByRole('button', { name: /select 💍 avatar/i }))
    fireEvent.click(screen.getByRole('button', { name: /begin the quiz/i }))
    fireEvent.click(screen.getByRole('button', { name: 'B' }))
    await waitFor(() => expect(screen.getByText(/1 \/ 1/)).toBeInTheDocument(), { timeout: 2000 })
  })
})
