import { NextResponse } from 'next/server'
import { getSupabase }  from '@/lib/supabase'

export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('guests')
    .select('id, first_name, last_name')
    .order('last_name', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Failed to load guests' }, { status: 500 })
  }

  return NextResponse.json({ guests: data })
}
