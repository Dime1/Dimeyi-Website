import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/quiz/route'
import * as supabaseModule from '@/lib/supabase'

vi.mock('@/lib/supabase', () => ({ getSupabase: vi.fn() }))

const SAMPLE_SCORE = { id: '1', player_name: 'Ola', avatar: '💍', score: 5, time_taken_ms: 5000 }

function makeReq(body: unknown) {
  return new Request('http://localhost/api/quiz', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
}

describe('GET /api/quiz', () => {
  beforeEach(() => {
    vi.mocked(supabaseModule.getSupabase).mockReturnValue({
      from: () => ({
        select: () => ({
          order: () => ({
            order: () => ({
              limit: vi.fn().mockResolvedValue({ data: [SAMPLE_SCORE], error: null }),
            }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof supabaseModule.getSupabase>)
  })

  it('returns 200 with scores array', async () => {
    const res  = await GET()
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.scores).toHaveLength(1)
    expect(json.scores[0].player_name).toBe('Ola')
  })
})

describe('POST /api/quiz', () => {
  beforeEach(() => {
    vi.mocked(supabaseModule.getSupabase).mockReturnValue({
      from: () => ({
        insert: () => ({
          select: () => ({
            single: vi.fn().mockResolvedValue({ data: SAMPLE_SCORE, error: null }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof supabaseModule.getSupabase>)
  })

  it('returns 422 for missing player_name', async () => {
    const res = await POST(makeReq({ avatar: '💍', score: 5, time_taken_ms: 5000 }))
    expect(res.status).toBe(422)
  })

  it('returns 422 for non-integer score', async () => {
    const res = await POST(makeReq({ player_name: 'Ola', avatar: '💍', score: 'bad', time_taken_ms: 5000 }))
    expect(res.status).toBe(422)
  })

  it('returns 201 with score on success', async () => {
    const res  = await POST(makeReq({ player_name: 'Ola', avatar: '💍', score: 5, time_taken_ms: 5000 }))
    const json = await res.json()
    expect(res.status).toBe(201)
    expect(json.score.player_name).toBe('Ola')
  })
})
