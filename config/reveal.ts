export const UNLOCK_DATES = {
  'd-day': new Date('2026-11-20T00:00:00Z'),
} as const

export type GatedPage = keyof typeof UNLOCK_DATES
