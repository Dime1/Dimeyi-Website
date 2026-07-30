import { NextRequest, NextResponse }    from 'next/server'
import { getPageAccess }                from '@/lib/gate'
import type { GatedPage }               from '@/config/reveal'

const VALID_PAGES: GatedPage[] = ['schedule', 'travel']

export async function GET(request: NextRequest) {
  const page       = request.nextUrl.searchParams.get('page') as GatedPage | null
  const rsvpStatus = request.nextUrl.searchParams.get('rsvpStatus') ?? undefined

  if (!page || !VALID_PAGES.includes(page)) {
    return NextResponse.json(
      { error: 'Invalid page parameter. Must be "schedule" or "travel".' },
      { status: 400 }
    )
  }

  const access = getPageAccess(page, rsvpStatus)
  return NextResponse.json(access)
}
