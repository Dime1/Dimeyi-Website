import { describe, it, expect, vi, afterEach } from 'vitest'
import { getPageAccess } from '@/lib/gate'

describe('getPageAccess', () => {
  afterEach(() => vi.useRealTimers())

  it('returns teaser state when current date is before unlock date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const result = getPageAccess('d-day')
    expect(result.state).toBe('teaser')
  })

  it('includes unlocksAt date when in teaser state', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const result = getPageAccess('d-day')
    expect(result.unlocksAt).toBeInstanceOf(Date)
  })

  it('returns partial state when date has passed but no rsvp', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const result = getPageAccess('d-day')
    expect(result.state).toBe('partial')
  })

  it('returns partial state when date passed but rsvp is not_attending', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const result = getPageAccess('d-day', 'not_attending')
    expect(result.state).toBe('partial')
  })

  it('returns full state when date passed and rsvp is attending', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const result = getPageAccess('d-day', 'attending')
    expect(result.state).toBe('full')
  })

  it('returns partial state when date passed and no rsvp status provided', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const result = getPageAccess('d-day', undefined)
    expect(result.state).toBe('partial')
  })
})
