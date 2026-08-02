// app/api/rsvp/route.ts
import { NextResponse } from 'next/server'
import { rsvpSchema }   from '@/lib/rsvp-schema'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const name  = searchParams.get('name')

  if (!email && !name) return NextResponse.json({ rsvp: null })

  const supabase = getSupabaseAdmin()

  const query = email
    ? supabase.from('rsvp').select('attending, asoebi_size, plus_one_name').eq('email', email)
    : supabase.from('rsvp').select('attending, asoebi_size, plus_one_name').ilike('name', name!)

  const { data } = await query.maybeSingle()
  return NextResponse.json({ rsvp: data ?? null })
}

export async function POST(req: Request) {
  const body   = await req.json()
  const parsed = rsvpSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from('rsvp').upsert(parsed.data, { onConflict: 'email' })
  if (error) {
    console.error('[RSVP] Supabase insert error:', error)
    return NextResponse.json({ error: 'Failed to save RSVP', detail: error.message }, { status: 500 })
  }

  const status = parsed.data.attending ? 'attending' : 'not_attending'
  const res    = NextResponse.json({ status })
  res.cookies.set('rsvp_status', status, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 365,
    path:     '/',
  })
  return res
}
