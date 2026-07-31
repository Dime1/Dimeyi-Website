import { z } from 'zod'

export const ASOEBI_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
export type AsoebiSize = typeof ASOEBI_SIZES[number]

export const stepEntrySchema = z.object({
  name:  z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number').max(20),
})
export type StepEntryValues = z.infer<typeof stepEntrySchema>

export const stepDetailsSchema = z.object({
  asoebi_size: z.enum(ASOEBI_SIZES).optional(),
})
export type StepDetailsValues = z.infer<typeof stepDetailsSchema>

export const rsvpSchema = stepEntrySchema.extend({
  attending:   z.boolean(),
  asoebi_size: z.enum(ASOEBI_SIZES).optional(),
})
export type RSVPPayload = z.infer<typeof rsvpSchema>
