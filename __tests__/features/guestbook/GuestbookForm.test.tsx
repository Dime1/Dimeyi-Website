import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor }   from '@testing-library/react'
import { GuestbookForm }                         from '@/features/guestbook/GuestbookForm'

const ENTRY = { id: '1', author_name: 'Ola', message: 'Congrats!', created_at: '2026-01-01' }

describe('GuestbookForm', () => {
  beforeEach(() => { vi.unstubAllGlobals() })

  it('renders name and message fields', () => {
    render(<GuestbookForm onSubmitted={vi.fn()} />)
    expect(screen.getByPlaceholderText(/enter your name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/write your blessing/i)).toBeInTheDocument()
  })

  it('calls onSubmitted with the new entry on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ entry: ENTRY }), { status: 201 }),
    ))
    const onSubmitted = vi.fn()
    render(<GuestbookForm onSubmitted={onSubmitted} />)
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i),    { target: { value: 'Ola' } })
    fireEvent.change(screen.getByPlaceholderText(/write your blessing/i), { target: { value: 'Congrats!' } })
    fireEvent.click(screen.getByRole('button', { name: /leave a blessing/i }))
    await waitFor(() => expect(onSubmitted).toHaveBeenCalledWith(ENTRY))
  })

  it('shows thank-you message after successful submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ entry: ENTRY }), { status: 201 }),
    ))
    render(<GuestbookForm onSubmitted={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i),    { target: { value: 'Ola' } })
    fireEvent.change(screen.getByPlaceholderText(/write your blessing/i), { target: { value: 'Congrats!' } })
    fireEvent.click(screen.getByRole('button', { name: /leave a blessing/i }))
    await waitFor(() => expect(screen.getByText(/thank you/i)).toBeInTheDocument())
  })

  it('shows error alert on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 500 })))
    render(<GuestbookForm onSubmitted={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i),    { target: { value: 'Ola' } })
    fireEvent.change(screen.getByPlaceholderText(/write your blessing/i), { target: { value: 'Congrats!' } })
    fireEvent.click(screen.getByRole('button', { name: /leave a blessing/i }))
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })
})
