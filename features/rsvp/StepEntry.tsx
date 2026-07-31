'use client'

import { useForm }           from 'react-hook-form'
import { zodResolver }       from '@hookform/resolvers/zod'
import { stepEntrySchema, type StepEntryValues } from '@/lib/rsvp-schema'

interface StepEntryProps {
  initial: Partial<StepEntryValues>
  onNext:  (data: StepEntryValues) => void
}

export function StepEntry({ initial, onNext }: StepEntryProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<StepEntryValues>({
    resolver:      zodResolver(stepEntrySchema),
    defaultValues: initial,
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6" noValidate>
      <div>
        <label
          htmlFor="rsvp-name"
          className="block font-sans text-[10px] tracking-[0.18em] uppercase text-plum/50 mb-2"
        >
          Your Name
        </label>
        <input
          id="rsvp-name"
          type="text"
          autoComplete="name"
          className="w-full border border-gold/25 rounded-sm bg-ivory/60 px-4 py-3 font-sans text-sm text-plum placeholder:text-plum/25 focus:outline-none focus:border-gold/60 transition-colors"
          placeholder="Full name"
          {...register('name')}
        />
        {errors.name && (
          <p role="alert" className="mt-2 font-sans text-xs text-red-600/80">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="rsvp-email"
          className="block font-sans text-[10px] tracking-[0.18em] uppercase text-plum/50 mb-2"
        >
          Email
        </label>
        <input
          id="rsvp-email"
          type="email"
          autoComplete="email"
          className="w-full border border-gold/25 rounded-sm bg-ivory/60 px-4 py-3 font-sans text-sm text-plum placeholder:text-plum/25 focus:outline-none focus:border-gold/60 transition-colors"
          placeholder="your@email.com"
          {...register('email')}
        />
        {errors.email && (
          <p role="alert" className="mt-2 font-sans text-xs text-red-600/80">
            {errors.email.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full border border-gold/50 rounded-sm py-3 font-sans text-[11px] tracking-[0.16em] uppercase text-gold/80 hover:bg-gold/5 transition-colors"
      >
        Continue
      </button>
    </form>
  )
}
