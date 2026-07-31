// __tests__/features/rsvp/RSVPFlow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { RSVPFlow } from '@/features/rsvp/RSVPFlow'

function fillStep1() {
  fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Ola' } })
  fireEvent.change(screen.getByLabelText(/email/i),     { target: { value: 'ola@x.com' } })
  fireEvent.change(screen.getByLabelText(/phone/i),     { target: { value: '+2341234567' } })
  fireEvent.click(screen.getByRole('button', { name: /continue/i }))
}

describe('RSVPFlow', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts on step 1 and shows name/email/phone form', () => {
    render(<RSVPFlow />)
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
  })

  it('advances to step 2 after valid step 1 submission', async () => {
    render(<RSVPFlow />)
    fillStep1()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /joyfully attend/i })).toBeInTheDocument()
    })
  })

  it('advances to step 3 when attending=true', async () => {
    render(<RSVPFlow />)
    fillStep1()
    await waitFor(() => screen.getByRole('button', { name: /joyfully attend/i }))
    fireEvent.click(screen.getByRole('button', { name: /joyfully attend/i }))
    await waitFor(() => {
      expect(screen.getByText(/aso-ebi/i)).toBeInTheDocument()
    })
  })

  it('calls /api/rsvp and advances to confirmation when attending=false', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(
      JSON.stringify({ status: 'not_attending' }), { status: 200 }
    ))
    render(<RSVPFlow />)
    fillStep1()
    await waitFor(() => screen.getByRole('button', { name: /unable to attend/i }))
    fireEvent.click(screen.getByRole('button', { name: /unable to attend/i }))
    await waitFor(() => {
      expect(screen.getByText(/we will miss you/i)).toBeInTheDocument()
    })
    expect(fetch).toHaveBeenCalledWith('/api/rsvp', expect.objectContaining({ method: 'POST' }))
  })

  it('shows error message if API call fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }))
    render(<RSVPFlow />)
    fillStep1()
    await waitFor(() => screen.getByRole('button', { name: /unable to attend/i }))
    fireEvent.click(screen.getByRole('button', { name: /unable to attend/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
