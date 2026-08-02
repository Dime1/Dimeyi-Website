'use client'

import { useForm }           from 'react-hook-form'
import { zodResolver }       from '@hookform/resolvers/zod'
import { stepEntrySchema, type StepEntryValues } from '@/lib/rsvp-schema'

interface StepEntryProps {
  initial: Partial<StepEntryValues>
  onNext:  (data: StepEntryValues) => void
}

const inputClass = 'w-full border border-gold/35 rounded-sm bg-ivory/60 px-4 py-3 font-sans text-sm text-plum placeholder:text-plum/50 focus:outline-none focus:border-gold/70 transition-colors'
const labelClass = 'block font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/85 mb-2'

export function StepEntry({ initial, onNext }: StepEntryProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<StepEntryValues>({
    resolver:      zodResolver(stepEntrySchema),
    defaultValues: initial,
  })

  return (
    <form onSubmit={handleSubmit((data) => onNext(data))} className="space-y-6" noValidate>
      <div>
        <label htmlFor="rsvp-name" className={labelClass}>Your Name</label>
        <input
          id="rsvp-name"
          type="text"
          autoComplete="name"
          className={inputClass}
          placeholder="Full name"
          {...register('name')}
        />
        {errors.name && (
          <p role="alert" className="mt-2 font-sans text-xs text-red-600/80">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="rsvp-email" className={labelClass}>Email</label>
        <input
          id="rsvp-email"
          type="email"
          autoComplete="email"
          className={inputClass}
          placeholder="your@email.com"
          {...register('email')}
        />
        {errors.email && (
          <p role="alert" className="mt-2 font-sans text-xs text-red-600/80">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="rsvp-phone" className={labelClass}>Phone Number</label>
        <input
          id="rsvp-phone"
          type="tel"
          autoComplete="tel"
          className={inputClass}
          placeholder="+1 234 567 8900"
          {...register('phone')}
        />
        {errors.phone && (
          <p role="alert" className="mt-2 font-sans text-xs text-red-600/80">{errors.phone.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full border border-gold/50 rounded-sm py-3 font-sans text-sm font-medium tracking-[0.16em] uppercase text-gold/90 hover:bg-gold/5 transition-colors"
      >
        Continue
      </button>
    </form>
  )
}
