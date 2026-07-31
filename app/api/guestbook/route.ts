import { NextResponse } from 'next/server'
import { z }            from 'zod'
import { getSupabase }  from '@/lib/supabase'

const guestbookSchema = z.object({
  author_name: z.string().min(2, 'Please enter your name'),
  message:     z.string().min(1, 'Please enter a message').max(500),
})

export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('guestbook')
    .select('id, created_at, author_name, message')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 })
  return NextResponse.json({ entries: data })
}

export async function POST(req: Request) {
  const body   = await req.json()
  const parsed = guestbookSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('guestbook')
    .insert(parsed.data)
    .select('id, created_at, author_name, message')
    .single()

  if (error) return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  return NextResponse.json({ entry: data }, { status: 201 })
}
