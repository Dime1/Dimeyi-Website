import { describe, expect, it } from 'vitest'
import { stepEntrySchema, stepDetailsSchema, rsvpSchema } from '@/lib/rsvp-schema'

describe('stepEntrySchema', () => {
  it('rejects short name', () => {
    expect(stepEntrySchema.safeParse({ name: 'X', email: 'a@b.com', phone: '1234567' }).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(stepEntrySchema.safeParse({ name: 'Ola', email: 'notanemail', phone: '1234567' }).success).toBe(false)
  })

  it('rejects short phone', () => {
    expect(stepEntrySchema.safeParse({ name: 'Ola', email: 'ola@test.com', phone: '123' }).success).toBe(false)
  })

  it('accepts valid entry', () => {
    expect(stepEntrySchema.safeParse({ name: 'Ola', email: 'ola@test.com', phone: '+234 801 234 5678' }).success).toBe(true)
  })
})

describe('stepDetailsSchema', () => {
  it('accepts empty details (all optional)', () => {
    expect(stepDetailsSchema.safeParse({}).success).toBe(true)
  })

  it('accepts a valid aso-ebi size', () => {
    expect(stepDetailsSchema.safeParse({ asoebi_size: 'M' }).success).toBe(true)
  })

  it('rejects an invalid aso-ebi size', () => {
    expect(stepDetailsSchema.safeParse({ asoebi_size: 'XXXL' }).success).toBe(false)
  })
})

describe('rsvpSchema', () => {
  it('accepts attending=false with no details', () => {
    expect(rsvpSchema.safeParse({ name: 'Ola', email: 'ola@test.com', phone: '1234567', attending: false }).success).toBe(true)
  })

  it('accepts attending=true with aso-ebi size', () => {
    expect(rsvpSchema.safeParse({
      name: 'Ola', email: 'ola@test.com', phone: '1234567', attending: true, asoebi_size: 'L',
    }).success).toBe(true)
  })

  it('accepts attending=true with no optional fields', () => {
    expect(rsvpSchema.safeParse({ name: 'Ola', email: 'ola@test.com', phone: '1234567', attending: true }).success).toBe(true)
  })
})
