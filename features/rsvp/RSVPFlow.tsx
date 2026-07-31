'use client'

import { useState }               from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BeadProgressBar }         from './BeadProgressBar'
import { StepEntry }               from './StepEntry'
import { StepAttendance }          from './StepAttendance'
import { StepDetails }             from './StepDetails'
import { StepConfirmation }        from './StepConfirmation'
import type { StepEntryValues, StepDetailsValues, RSVPPayload } from '@/lib/rsvp-schema'

type Step = 1 | 2 | 3 | 4

interface Accumulated {
  name?:         string
  email?:        string
  attending?:    boolean
  guest_count?:  number
  dietary?:      string
  song_request?: string
  asoebi_size?:  string
}

const STEP_TITLES: Record<Step, string> = {
  1: 'Your Details',
  2: 'Will You Attend?',
  3: 'A Few More Things',
  4: '',
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
      if (!res.ok) throw new Error('Submit failed')
      setStep(4)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleStep1(values: StepEntryValues) {
    setData(d => ({ ...d, ...values }))
    setStep(2)
  }

  function handleStep2({ attending }: { attending: boolean }) {
    const next = { ...data, attending }
    setData(next)
    if (!attending) {
      submitRSVP({ name: next.name!, email: next.email!, attending: false })
    } else {
      setStep(3)
    }
  }

  function handleStep3(values: StepDetailsValues) {
    const payload: RSVPPayload = {
      name:         data.name!,
      email:        data.email!,
      attending:    true,
      guest_count:  values.guest_count,
      dietary:      values.dietary,
      song_request: values.song_request,
      asoebi_size:  values.asoebi_size,
    }
    submitRSVP(payload)
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      {step < 4 && (
        <div className="mb-10 text-center space-y-4">
          <BeadProgressBar currentStep={step} totalSteps={4} />
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-plum/30">
            {STEP_TITLES[step]}
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
            <StepEntry
              initial={{ name: data.name, email: data.email }}
              onNext={handleStep1}
            />
          )}
          {step === 2 && (
            <StepAttendance
              name={data.name ?? 'friend'}
              onNext={handleStep2}
            />
          )}
          {step === 3 && (
            <StepDetails
              initial={{ guest_count: data.guest_count ?? 1 }}
              onNext={handleStep3}
              isSubmitting={isSubmitting}
            />
          )}
          {step === 4 && (
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
