'use client'

interface StepAlreadyRegisteredProps {
  name:      string
  attending: boolean
  onUpdate:  () => void
  onBack:    () => void
}

export function StepAlreadyRegistered({ name, attending, onUpdate, onBack }: StepAlreadyRegisteredProps) {
  return (
    <div className="space-y-7 text-center">

      <div className="space-y-2">
        <p className="font-script italic text-gold/90 text-2xl leading-relaxed">
          You're already registered!
        </p>
        <p className="font-sans text-sm text-plum/70">
          We have an existing RSVP for <span className="font-semibold text-plum">{name}</span>.
        </p>
      </div>

      {/* Current status */}
      <div className="border border-gold/25 rounded-sm bg-gold/5 py-5 px-6 space-y-1">
        <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-plum/45">Current response</p>
        <p className={`font-sans text-sm font-semibold tracking-wide ${attending ? 'text-gold' : 'text-plum/65'}`}>
          {attending ? '✓ Attending' : '✗ Not attending'}
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={onUpdate}
          className="w-full border border-gold/60 rounded-sm py-3 font-sans text-sm font-medium tracking-[0.16em] uppercase text-gold hover:bg-gold/5 transition-colors"
        >
          Update my RSVP
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full border border-gold/20 rounded-sm py-3 font-sans text-sm font-medium tracking-[0.16em] uppercase text-plum/55 hover:border-gold/35 hover:text-plum/75 transition-colors"
        >
          Back to search
        </button>
      </div>

    </div>
  )
}
