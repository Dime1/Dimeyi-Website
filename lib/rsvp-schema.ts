import { z } from 'zod'

export const ASOEBI_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
export type AsoebiSize = typeof ASOEBI_SIZES[number]

export const stepEntrySchema = z.object({
  name:  z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
})
export type StepEntryValues = z.infer<typeof stepEntrySchema>

export const stepDetailsSchema = z.object({
  guest_count:  z.number().int().min(1, 'At least 1 guest required').max(10, 'Maximum 10 guests'),
  dietary:      z.string().max(200).optional(),
  song_request: z.string().max(100).optional(),
  asoebi_size:  z.enum(ASOEBI_SIZES).optional(),
})
export type StepDetailsValues = z.infer<typeof stepDetailsSchema>

export const rsvpSchema = stepEntrySchema.extend({
  attending:    z.boolean(),
  guest_count:  z.number().int().max(10).optional(),
  dietary:      z.string().max(200).optional(),
  song_request: z.string().max(100).optional(),
  asoebi_size:  z.enum(ASOEBI_SIZES).optional(),
}).refine(
  d => !d.attending || (d.guest_count !== undefined && d.guest_count >= 1),
  { message: 'Guest count required when attending', path: ['guest_count'] },
)
export type RSVPPayload = z.infer<typeof rsvpSchema>
