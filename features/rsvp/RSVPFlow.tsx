'use client'

import { useState }               from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BeadProgressBar }         from './BeadProgressBar'
import { StepSearch }              from './StepSearch'
import { StepEntry }               from './StepEntry'
import { StepAttendance }          from './StepAttendance'
import { StepDetails }             from './StepDetails'
import { StepConfirmation }        from './StepConfirmation'
import type { StepEntryValues, StepDetailsValues, RSVPPayload } from '@/lib/rsvp-schema'
import type { Guest } from '@/config/guests'

type Step = 1 | 2 | 3 | 4 | 5

interface Accumulated {
  name?:          string
  email?:         string
  phone?:         string
  attending?:     boolean
  asoebi_size?:   string
  plus_one_name?: string
}

const STEP_TITLES: Record<1 | 2 | 3 | 4, string> = {
  1: 'Find Your Name',
  2: 'Your Details',
  3: 'Will You Attend?',
  4: 'A Few More Things',
}

export function RSVPFlow() {
  const [step, setStep]                 = useState<Step>(1)
  const [data, setData]                 = useState<Accumulated>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError]               = useState<string | null>(null)

  async function submitRSVP(payload: RSVPPayload) {
    if (isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/rsvp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        const fieldErrors     = body?.error?.fieldErrors
        const firstFieldError = fieldErrors && (Object.values(fieldErrors) as string[][]).flat()[0]
        setError(firstFieldError ?? body?.detail ?? (typeof body?.error === 'string' ? body.error : null) ?? 'Something went wrong. Please try again.')
        return
      }
      setStep(5)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleStep1(guest: Guest) {
    setData(d => ({ ...d, name: `${guest.firstName} ${guest.lastName}` }))
    setStep(2)
  }

  function handleStep2(values: StepEntryValues) {
    setData(d => ({ ...d, ...values }))
    setStep(3)
  }

  function handleStep3({ attending }: { attending: boolean }) {
    const next = { ...data, attending }
    setData(next)
    if (!attending) {
      submitRSVP({ name: next.name!, email: next.email!, phone: next.phone!, attending: false })
    } else {
      setStep(4)
    }
  }

  function handleStep4(values: StepDetailsValues) {
    submitRSVP({
      name:          data.name!,
      email:         data.email!,
      phone:         data.phone!,
      attending:     true,
      asoebi_size:   values.asoebi_size,
      plus_one_name: values.plus_one_name,
    })
  }

  const showBar = step < 5

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      {showBar && (
        <div className="mb-10 text-center space-y-4">
          <BeadProgressBar currentStep={step} totalSteps={4} />
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-plum/50">
            {STEP_TITLES[step as 1 | 2 | 3 | 4]}
          </p>
        </div>
      )}

      {error && (
        <p role="alert" className="mb-6 font-sans text-xs text-red-600/80 text-center border border-red-300/30 rounded-sm py-3 px-4">
          {error}
        </p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {step === 1 && (
            <StepSearch onNext={handleStep1} />
          )}
          {step === 2 && (
            <StepEntry
              guestName={data.name ?? ''}
              initial={{ email: data.email, phone: data.phone }}
              onNext={handleStep2}
            />
          )}
          {step === 3 && (
            <StepAttendance
              name={data.name ?? 'friend'}
              onNext={handleStep3}
            />
          )}
          {step === 4 && (
            <StepDetails
              initial={{}}
              onNext={handleStep4}
              isSubmitting={isSubmitting}
            />
          )}
          {step === 5 && (
            <StepConfirmation
              name={data.name ?? 'friend'}
              attending={data.attending ?? false}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
