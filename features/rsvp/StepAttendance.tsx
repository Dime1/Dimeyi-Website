'use client'

interface StepAttendanceProps {
  name:               string
  previousAttending?: boolean
  onNext:             (data: { attending: boolean }) => void
}

export function StepAttendance({ name, previousAttending, onNext }: StepAttendanceProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <p className="font-script italic text-gold/90 text-2xl leading-relaxed">
          Will {name} be joining us to celebrate?
        </p>
        {previousAttending !== undefined && (
          <p className="font-sans text-xs text-plum/50">
            Previous response:{' '}
            <span className="font-semibold text-plum/70">
              {previousAttending ? 'Attending' : 'Not attending'}
            </span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          type="button"
          onClick={() => onNext({ attending: true })}
          className="w-full border border-gold/60 rounded-sm py-5 font-sans text-sm font-medium tracking-[0.2em] uppercase text-gold hover:bg-gold/8 transition-colors"
        >
          I will joyfully attend
        </button>
        <button
          type="button"
          onClick={() => onNext({ attending: false })}
          className="w-full border border-gold/30 rounded-sm py-5 font-sans text-sm font-medium tracking-[0.2em] uppercase text-plum/85 hover:border-gold/50 hover:text-plum transition-colors"
        >
          I am unable to attend
        </button>
      </div>
    </div>
  )
}
