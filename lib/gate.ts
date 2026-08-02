import { UNLOCK_DATES, type GatedPage } from '@/config/reveal'

export type GateState = 'teaser' | 'partial' | 'full'

export interface PageAccess {
  state:      GateState
  unlocksAt?: Date
}

export function getPageAccess(page: GatedPage, rsvpStatus?: string): PageAccess {
  if (process.env.DEV_GATE_BYPASS === 'true' && process.env.NODE_ENV !== 'production') {
    return { state: 'full' }
  }

  const now        = new Date()
  const unlockDate = UNLOCK_DATES[page]

  if (now < unlockDate) {
    return { state: 'teaser', unlocksAt: unlockDate }
  }

  if (rsvpStatus !== 'attending') {
    return { state: 'partial' }
  }

  return { state: 'full' }
}
