'use client'

import { useState }              from 'react'
import { useForm }               from 'react-hook-form'
import { zodResolver }           from '@hookform/resolvers/zod'
import { stepEntrySchema, type StepEntryValues } from '@/lib/rsvp-schema'

interface StepEntryProps {
  initial: Partial<StepEntryValues>
  onNext:  (data: StepEntryValues) => void
}

const COUNTRY_CODES = [
  { name: 'Nigeria',  code: '+234', flag: '🇳🇬' },
  { name: 'Germany',  code: '+49',  flag: '🇩🇪' },
  { name: 'UK',       code: '+44',  flag: '🇬🇧' },
  { name: 'Ireland',  code: '+353', flag: '🇮🇪' },
  { name: 'USA',      code: '+1',   flag: '🇺🇸' },
  { name: 'Canada',   code: '+1',   flag: '🇨🇦' },
] as const

const inputClass = 'w-full border border-gold/35 rounded-sm bg-ivory/60 px-4 py-3 font-sans text-sm text-plum placeholder:text-plum/50 focus:outline-none focus:border-gold/70 transition-colors'
const labelClass = 'block font-sans text-sm font-medium tracking-[0.18em] uppercase text-plum/85 mb-2'

export function StepEntry({ initial, onNext }: StepEntryProps) {
  const [countryCode, setCountryCode] = useState('+234')

  const { register, handleSubmit, formState: { errors } } = useForm<StepEntryValues>({
    resolver:      zodResolver(stepEntrySchema),
    defaultValues: initial,
  })

  function onSubmit(data: StepEntryValues) {
    onNext({ ...data, phone: `${countryCode}${data.phone}` })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

      {/* Name */}
      <div>
        <label htmlFor="rsvp-name" className={labelClass}>
          Your Name <span className="text-red-500 ml-0.5">*</span>
        </label>
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

      {/* Email */}
      <div>
        <label htmlFor="rsvp-email" className={labelClass}>
          Email <span className="text-red-500 ml-0.5">*</span>
        </label>
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

      {/* Phone */}
      <div>
        <label className={labelClass}>
          Phone Number <span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="flex gap-2">
          {/* Country code picker */}
          <select
            value={countryCode}
            onChange={e => setCountryCode(e.target.value)}
            aria-label="Country code"
            className="shrink-0 border border-gold/35 rounded-sm bg-ivory/60 px-3 py-3 font-sans text-sm text-plum focus:outline-none focus:border-gold/70 transition-colors"
          >
            {COUNTRY_CODES.map(c => (
              <option key={`${c.name}-${c.code}`} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>

          {/* Local number */}
          <input
            id="rsvp-phone"
            type="tel"
            autoComplete="tel-national"
            className={inputClass}
            placeholder="8012345678"
            {...register('phone')}
          />
        </div>
        {errors.phone && (
          <p role="alert" className="mt-2 font-sans text-xs text-red-600/80">{errors.phone.message}</p>
        )}
        <p className="mt-1.5 font-sans text-xs text-plum/60">
          Enter your local number without the country code
        </p>
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
