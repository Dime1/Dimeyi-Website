'use client'

import { Controller, useForm }  from 'react-hook-form'
import { zodResolver }          from '@hookform/resolvers/zod'
import {
  stepDetailsSchema,
  type StepDetailsValues,
  ASOEBI_SIZES,
  type AsoebiSize,
} from '@/lib/rsvp-schema'

interface StepDetailsProps {
  initial:      Partial<StepDetailsValues>
  onNext:       (data: StepDetailsValues) => void
  isSubmitting: boolean
}

export function StepDetails({ initial, onNext, isSubmitting }: StepDetailsProps) {
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } =
    useForm<StepDetailsValues>({
      resolver:      zodResolver(stepDetailsSchema),
      defaultValues: { guest_count: 1, ...initial },
    })

  const guestCount   = watch('guest_count')
  const selectedSize = watch('asoebi_size')

  return (
    <form onSubmit={handleSubmit((data) => onNext(data))} className="space-y-6" noValidate>
      {/* Guest count stepper */}
      <div>
        <label
          htmlFor="guest_count_display"
          className="block font-sans text-[10px] tracking-[0.18em] uppercase text-plum/50 mb-2"
        >
          Number of Guests (including yourself)
        </label>
        {/* Hidden input for label association */}
        <input
          id="guest_count_display"
          type="number"
          className="sr-only"
          aria-hidden="true"
          readOnly
          value={guestCount !== undefined ? guestCount : 1}
          tabIndex={-1}
        />
        <Controller
          name="guest_count"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Decrease guest count"
                onClick={() => field.onChange(Math.max(1, (field.value !== undefined ? field.value : 1) - 1))}
                className="w-9 h-9 border border-gold/30 rounded-sm font-sans text-plum/60 hover:border-gold/60 transition-colors"
              >
                −
              </button>
              <span
                className="font-display text-2xl text-plum w-8 text-center"
                role="status"
                aria-live="polite"
              >
                {field.value !== undefined ? field.value : 1}
              </span>
              <button
                type="button"
                aria-label="Increase guest count"
                onClick={() => field.onChange(Math.min(10, (field.value !== undefined ? field.value : 1) + 1))}
                className="w-9 h-9 border border-gold/30 rounded-sm font-sans text-plum/60 hover:border-gold/60 transition-colors"
              >
                +
              </button>
            </div>
          )}
        />
        {errors.guest_count && (
          <p role="alert" className="mt-2 font-sans text-xs text-red-600/80">
            {errors.guest_count.message}
          </p>
        )}
      </div>

      {/* Dietary */}
      <div>
        <label
          htmlFor="dietary"
          className="block font-sans text-[10px] tracking-[0.18em] uppercase text-plum/50 mb-2"
        >
          Dietary Requirements
          <span className="ml-2 text-plum/30 normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="dietary"
          type="text"
          placeholder="Allergies, vegetarian, etc."
          className="w-full border border-gold/25 rounded-sm bg-ivory/60 px-4 py-3 font-sans text-sm text-plum placeholder:text-plum/25 focus:outline-none focus:border-gold/60 transition-colors"
          {...register('dietary')}
        />
      </div>

      {/* Song request */}
      <div>
        <label
          htmlFor="song_request"
          className="block font-sans text-[10px] tracking-[0.18em] uppercase text-plum/50 mb-2"
        >
          Song Request
          <span className="ml-2 text-plum/30 normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="song_request"
          type="text"
          placeholder="What should we play for you?"
          className="w-full border border-gold/25 rounded-sm bg-ivory/60 px-4 py-3 font-sans text-sm text-plum placeholder:text-plum/25 focus:outline-none focus:border-gold/60 transition-colors"
          {...register('song_request')}
        />
      </div>

      {/* Aso-ebi size */}
      <div>
        <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-plum/50 mb-1">
          Aso-Ebi Size
          <span className="ml-2 text-plum/30 normal-case tracking-normal">(optional)</span>
        </p>
        <p className="font-sans text-[10px] text-plum/30 mb-3">
          Coordinated fabric — details shared with confirmed guests
        </p>
        <div className="flex flex-wrap gap-2">
          {ASOEBI_SIZES.map(size => (
            <button
              key={size}
              type="button"
              aria-label={size}
              aria-pressed={selectedSize === size}
              onClick={() => setValue('asoebi_size', selectedSize === size ? undefined : size as AsoebiSize)}
              className={[
                'px-4 py-2 border rounded-sm font-sans text-xs transition-colors',
                selectedSize === size
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-gold/20 text-plum/40 hover:border-gold/40',
              ].join(' ')}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full border border-gold/50 rounded-sm py-3 font-sans text-[11px] tracking-[0.16em] uppercase text-gold/80 hover:bg-gold/5 disabled:opacity-40 transition-colors"
      >
        {isSubmitting ? 'Sending…' : 'Confirm RSVP'}
      </button>
    </form>
  )
}
