'use client'

import { useForm }  from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
  const { handleSubmit, setValue, watch } = useForm<StepDetailsValues>({
    resolver:      zodResolver(stepDetailsSchema),
    defaultValues: initial,
  })

  const selectedSize = watch('asoebi_size')

  return (
    <form onSubmit={handleSubmit((data) => onNext(data))} className="space-y-6" noValidate>
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
