'use client'

import { useState }    from 'react'
import { useForm }     from 'react-hook-form'
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
  const [hasPlusOne, setHasPlusOne] = useState(() => !!initial.plus_one_name)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<StepDetailsValues>({
    resolver:      zodResolver(stepDetailsSchema),
    defaultValues: initial,
  })

  const selectedSize  = watch('asoebi_size')
  const plusOneName   = watch('plus_one_name')

  function onSubmit(data: StepDetailsValues) {
    onNext({
      ...data,
      plus_one_name: hasPlusOne ? data.plus_one_name : undefined,
    })
  }

  const canSubmit = !hasPlusOne || (plusOneName && plusOneName.trim().length >= 2)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>

      {/* Plus one */}
      <div>
        <p className="font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/85 mb-3">
          Are you bringing a plus one?
        </p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={() => setHasPlusOne(true)}
            className={[
              'py-2.5 border rounded-sm font-sans text-sm font-medium tracking-[0.14em] uppercase transition-all duration-200',
              hasPlusOne
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-gold/30 text-plum/75 hover:border-gold/55',
            ].join(' ')}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => { setHasPlusOne(false); setValue('plus_one_name', undefined) }}
            className={[
              'py-2.5 border rounded-sm font-sans text-sm font-medium tracking-[0.14em] uppercase transition-all duration-200',
              !hasPlusOne
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-gold/30 text-plum/75 hover:border-gold/55',
            ].join(' ')}
          >
            No
          </button>
        </div>

        {hasPlusOne && (
          <div>
            <label htmlFor="plus-one-name" className="block font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/85 mb-2">
              Plus One's Full Name <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="plus-one-name"
              type="text"
              autoComplete="off"
              placeholder="Full name"
              className="w-full border border-gold/35 rounded-sm bg-ivory/60 px-4 py-3 font-sans text-sm text-plum placeholder:text-plum/50 focus:outline-none focus:border-gold/70 transition-colors"
              {...register('plus_one_name')}
            />
            {errors.plus_one_name && (
              <p role="alert" className="mt-2 font-sans text-xs text-red-600/80">
                {errors.plus_one_name.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Aso-ebi size */}
      <div>
        <p className="font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/85 mb-1">
          Aso-Ebi Size
          <span className="ml-2 text-plum/60 normal-case tracking-normal text-xs">(optional)</span>
        </p>
        <p className="font-sans text-sm text-plum/75 mb-3">
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
                  : 'border-gold/35 text-plum/80 hover:border-gold/55',
              ].join(' ')}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !canSubmit}
        className="w-full border border-gold/60 rounded-sm py-3 font-sans text-sm font-medium tracking-[0.16em] uppercase text-gold hover:bg-gold/5 disabled:opacity-40 transition-colors"
      >
        {isSubmitting ? 'Sending…' : 'Confirm RSVP'}
      </button>
    </form>
  )
}
