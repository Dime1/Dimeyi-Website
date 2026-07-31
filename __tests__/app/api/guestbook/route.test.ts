import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/guestbook/route'
import * as supabaseModule from '@/lib/supabase'

vi.mock('@/lib/supabase', () => ({ getSupabase: vi.fn() }))

function mockGetSupabase(getResult: object, postResult?: object) {
  vi.mocked(supabaseModule.getSupabase).mockReturnValue({
    from: () => ({
      select:  () => ({ order: () => ({ limit: vi.fn().mockResolvedValue(getResult) }) }),
      insert:  () => ({ select: () => ({ single: vi.fn().mockResolvedValue(postResult ?? getResult) }) }),
    }),
  } as unknown as ReturnType<typeof supabaseModule.getSupabase>)
}

function makeReq(body: unknown) {
  return new Request('http://localhost/api/guestbook', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
}

describe('GET /api/guestbook', () => {
  it('returns 200 with entries array', async () => {
    mockGetSupabase({ data: [{ id: '1', author_name: 'Ola', message: 'Congrats!', created_at: '2026-01-01' }], error: null })
    const res  = await GET()
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.entries).toHaveLength(1)
  })

  it('returns 500 when Supabase errors', async () => {
    mockGetSupabase({ data: null, error: new Error('db down') })
    const res = await GET()
    expect(res.status).toBe(500)
  })
})

describe('POST /api/guestbook', () => {
  beforeEach(() => {
    mockGetSupabase(
      { data: [], error: null },
      { data: { id: '1', author_name: 'Ola', message: 'Congrats!', created_at: '2026-01-01' }, error: null },
    )
  })

  it('returns 422 for missing author_name', async () => {
    const res = await POST(makeReq({ message: 'Hello' }))
    expect(res.status).toBe(422)
  })

  it('returns 422 for empty message', async () => {
    const res = await POST(makeReq({ author_name: 'Ola', message: '' }))
    expect(res.status).toBe(422)
  })

  it('returns 201 with entry on success', async () => {
    const res  = await POST(makeReq({ author_name: 'Ola', message: 'Congrats!' }))
    const json = await res.json()
    expect(res.status).toBe(201)
    expect(json.entry.author_name).toBe('Ola')
  })
})
