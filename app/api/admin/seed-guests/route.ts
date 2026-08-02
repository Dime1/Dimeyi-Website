import { NextResponse } from 'next/server'
import { getSupabase }  from '@/lib/supabase'
import { GUEST_LIST }   from '@/config/guests'

export async function POST(req: Request) {
  const secret = new URL(req.url).searchParams.get('secret')

  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = getSupabase()
  const records  = GUEST_LIST.map(g => ({
    id:         g.id,
    first_name: g.firstName,
    last_name:  g.lastName,
  }))

  const { error } = await supabase
    .from('guests')
    .upsert(records, { onConflict: 'id' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ seeded: records.length })
}
