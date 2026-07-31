'use client'

interface StepAttendanceProps {
  name:   string
  onNext: (data: { attending: boolean }) => void
}

export function StepAttendance({ name, onNext }: StepAttendanceProps) {
  return (
    <div className="space-y-8">
      <p className="font-script italic text-gold/70 text-center text-xl leading-relaxed">
        Will {name} be joining us to celebrate?
      </p>

      <div className="grid grid-cols-1 gap-4">
        <button
          type="button"
          onClick={() => onNext({ attending: true })}
          className="w-full border border-gold/50 rounded-sm py-5 font-sans text-[11px] tracking-[0.2em] uppercase text-gold hover:bg-gold/8 transition-colors"
        >
          I will joyfully attend
        </button>
        <button
          type="button"
          onClick={() => onNext({ attending: false })}
          className="w-full border border-gold/15 rounded-sm py-5 font-sans text-[11px] tracking-[0.2em] uppercase text-plum/35 hover:border-gold/30 hover:text-plum/50 transition-colors"
        >
          I am unable to attend
        </button>
      </div>
    </div>
  )
}
