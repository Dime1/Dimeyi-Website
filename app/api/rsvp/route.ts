// app/api/rsvp/route.ts
import { NextResponse } from 'next/server'
import { rsvpSchema }   from '@/lib/rsvp-schema'
import { getSupabase }  from '@/lib/supabase'

export async function POST(req: Request) {
  const body   = await req.json()
  const parsed = rsvpSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const supabase = getSupabase()
  const { error } = await supabase.from('rsvp').insert(parsed.data)
  if (error) {
    return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 })
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
