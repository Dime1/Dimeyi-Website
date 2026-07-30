export const UNLOCK_DATES = {
  schedule: new Date('2026-11-20T00:00:00Z'),
  travel:   new Date('2026-11-20T00:00:00Z'),
} as const

export type GatedPage = keyof typeof UNLOCK_DATES
