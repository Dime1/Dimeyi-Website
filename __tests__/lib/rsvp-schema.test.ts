import { describe, expect, it } from 'vitest'
import { stepEntrySchema, stepDetailsSchema, rsvpSchema } from '@/lib/rsvp-schema'

describe('stepEntrySchema', () => {
  it('rejects short name', () => {
    expect(stepEntrySchema.safeParse({ name: 'X', email: 'a@b.com' }).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(stepEntrySchema.safeParse({ name: 'Ola', email: 'notanemail' }).success).toBe(false)
  })

  it('accepts valid entry', () => {
    expect(stepEntrySchema.safeParse({ name: 'Ola', email: 'ola@test.com' }).success).toBe(true)
  })
})

describe('stepDetailsSchema', () => {
  it('rejects guest_count of 0', () => {
    expect(stepDetailsSchema.safeParse({ guest_count: 0 }).success).toBe(false)
  })

  it('rejects guest_count above 10', () => {
    expect(stepDetailsSchema.safeParse({ guest_count: 11 }).success).toBe(false)
  })

  it('accepts valid details', () => {
    expect(stepDetailsSchema.safeParse({
      guest_count: 2,
      dietary: 'Vegetarian',
      song_request: 'Perfect',
      asoebi_size: 'M',
    }).success).toBe(true)
  })

  it('accepts details with no optional fields', () => {
    expect(stepDetailsSchema.safeParse({ guest_count: 1 }).success).toBe(true)
  })
})

describe('rsvpSchema', () => {
  it('accepts attending=false with no details', () => {
    expect(rsvpSchema.safeParse({ name: 'Ola', email: 'ola@test.com', attending: false }).success).toBe(true)
  })

  it('rejects attending=true with no guest_count', () => {
    expect(rsvpSchema.safeParse({ name: 'Ola', email: 'ola@test.com', attending: true }).success).toBe(false)
  })

  it('accepts attending=true with guest_count', () => {
    expect(rsvpSchema.safeParse({
      name: 'Ola', email: 'ola@test.com', attending: true, guest_count: 2,
    }).success).toBe(true)
  })
})
