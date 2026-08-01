import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizWidgetButton } from '@/features/quiz-widget/QuizWidgetButton'

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, className, style, role, onClick, 'aria-label': ariaLabel }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
      <div className={className} style={style} role={role} onClick={onClick} aria-label={ariaLabel}>{children}</div>,
  },
}))

vi.mock('@/features/guestbook/quiz/QuizModule', () => ({
  QuizModule: () => <div data-testid="quiz-module">Quiz content</div>,
}))

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ scores: [] }), { status: 200 }),
  ))
})
afterEach(() => { vi.unstubAllGlobals() })

describe('QuizWidgetButton', () => {
  it('renders the trigger button', () => {
    render(<QuizWidgetButton />)
    expect(screen.getByRole('button', { name: /open quiz/i })).toBeInTheDocument()
  })

  it('drawer is not visible initially', () => {
    render(<QuizWidgetButton />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the drawer when trigger is clicked', () => {
    render(<QuizWidgetButton />)
    fireEvent.click(screen.getByRole('button', { name: /open quiz/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes the drawer via the close button', () => {
    render(<QuizWidgetButton />)
    fireEvent.click(screen.getByRole('button', { name: /open quiz/i }))
    fireEvent.click(screen.getByRole('button', { name: /close quiz/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the drawer when backdrop is clicked', () => {
    render(<QuizWidgetButton />)
    fireEvent.click(screen.getByRole('button', { name: /open quiz/i }))
    fireEvent.click(screen.getByLabelText('Close quiz backdrop'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the QuizModule inside the open drawer', () => {
    render(<QuizWidgetButton />)
    fireEvent.click(screen.getByRole('button', { name: /open quiz/i }))
    expect(screen.getByTestId('quiz-module')).toBeInTheDocument()
  })
})
