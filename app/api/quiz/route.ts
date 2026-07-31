import { NextResponse } from 'next/server'
import { z }            from 'zod'
import { getSupabase }  from '@/lib/supabase'

const scoreSchema = z.object({
  player_name:   z.string().min(2),
  avatar:        z.string().min(1),
  score:         z.number().int().min(0),
  time_taken_ms: z.number().int().min(0),
})

export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('quiz_scores')
    .select('id, player_name, avatar, score, time_taken_ms')
    .order('score',         { ascending: false })
    .order('time_taken_ms', { ascending: true  })
    .limit(10)

  if (error) return NextResponse.json({ error: 'Failed to load leaderboard' }, { status: 500 })
  return NextResponse.json({ scores: data })
}

export async function POST(req: Request) {
  const body   = await req.json()
  const parsed = scoreSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('quiz_scores')
    .insert(parsed.data)
    .select('id, player_name, avatar, score, time_taken_ms')
    .single()

  if (error) return NextResponse.json({ error: 'Failed to save score' }, { status: 500 })
  return NextResponse.json({ score: data }, { status: 201 })
}
