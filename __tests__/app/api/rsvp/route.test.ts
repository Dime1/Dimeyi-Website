// __tests__/app/api/rsvp/route.test.ts
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/rsvp/route'
import * as supabaseModule from '@/lib/supabase'

const mockInsert = vi.fn()
vi.mock('@/lib/supabase', () => ({
  getSupabase: vi.fn(),
}))

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/rsvp', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
}

beforeEach(() => {
  mockInsert.mockResolvedValue({ error: null })
  vi.mocked(supabaseModule.getSupabase).mockReturnValue({
    from: () => ({ insert: mockInsert }),
  } as unknown as ReturnType<typeof supabaseModule.getSupabase>)
})

describe('POST /api/rsvp', () => {
  it('returns 422 for missing name', async () => {
    const res = await POST(makeRequest({ email: 'a@b.com', phone: '1234567', attending: false }))
    expect(res.status).toBe(422)
  })

  it('returns 422 for invalid email', async () => {
    const res = await POST(makeRequest({ name: 'Ola', email: 'bad', phone: '1234567', attending: false }))
    expect(res.status).toBe(422)
  })

  it('returns 422 for missing phone', async () => {
    const res = await POST(makeRequest({ name: 'Ola', email: 'ola@test.com', attending: false }))
    expect(res.status).toBe(422)
  })

  it('inserts and sets cookie for attending=false', async () => {
    const res = await POST(makeRequest({ name: 'Ola', email: 'ola@test.com', phone: '1234567', attending: false }))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.status).toBe('not_attending')
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ola', email: 'ola@test.com', phone: '1234567', attending: false }),
    )
    const cookie = res.headers.get('set-cookie') ?? ''
    expect(cookie).toContain('rsvp_status=not_attending')
  })

  it('inserts and sets cookie for attending=true', async () => {
    const res = await POST(makeRequest({
      name: 'Fey', email: 'fey@test.com', phone: '9876543', attending: true, asoebi_size: 'M',
    }))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.status).toBe('attending')
    const cookie = res.headers.get('set-cookie') ?? ''
    expect(cookie).toContain('rsvp_status=attending')
  })

  it('returns 500 when Supabase errors', async () => {
    mockInsert.mockResolvedValueOnce({ error: new Error('db error') })
    const res = await POST(makeRequest({ name: 'Ola', email: 'ola@test.com', phone: '1234567', attending: false }))
    expect(res.status).toBe(500)
  })
})
