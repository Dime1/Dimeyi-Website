import { describe, it, expect, vi, afterEach } from 'vitest'
import { getPageAccess } from '@/lib/gate'

describe('getPageAccess', () => {
  afterEach(() => vi.useRealTimers())

  it('returns teaser state when current date is before unlock date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const result = getPageAccess('schedule')
    expect(result.state).toBe('teaser')
  })

  it('includes unlocksAt date when in teaser state', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const result = getPageAccess('schedule')
    expect(result.unlocksAt).toBeInstanceOf(Date)
  })

  it('returns full state for schedule when date has passed', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const result = getPageAccess('schedule')
    expect(result.state).toBe('full')
  })

  it('returns partial state for travel when date passed but rsvp is not_attending', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const result = getPageAccess('travel', 'not_attending')
    expect(result.state).toBe('partial')
  })

  it('returns partial state for travel when date passed and no rsvp status provided', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const result = getPageAccess('travel', undefined)
    expect(result.state).toBe('partial')
  })

  it('returns full state for travel when date passed and rsvp is attending', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const result = getPageAccess('travel', 'attending')
    expect(result.state).toBe('full')
  })
})
