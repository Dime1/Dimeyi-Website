import { z } from 'zod'

export const ASOEBI_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
export type AsoebiSize = typeof ASOEBI_SIZES[number]

export const stepEntrySchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string()
    .min(5,  'Please enter your phone number')
    .max(20, 'Please enter a valid phone number')
    .regex(/^[+\d\s\-()\/.]+$/, 'Please enter a valid phone number'),
})
export type StepEntryValues = z.infer<typeof stepEntrySchema>

export const stepDetailsSchema = z.object({
  asoebi_size:   z.enum(ASOEBI_SIZES).optional(),
  plus_one_name: z.string().min(2, 'Please enter your plus one\'s full name').optional(),
})
export type StepDetailsValues = z.infer<typeof stepDetailsSchema>

export const rsvpSchema = z.object({
  name:          z.string().min(2),
  email:         z.string().email(),
  phone:         z.string().min(5).max(20),
  attending:     z.boolean(),
  asoebi_size:   z.enum(ASOEBI_SIZES).optional(),
  plus_one_name: z.string().optional(),
})
export type RSVPPayload = z.infer<typeof rsvpSchema>
