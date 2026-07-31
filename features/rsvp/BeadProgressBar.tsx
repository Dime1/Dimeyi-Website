'use client'

interface BeadProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function BeadProgressBar({ currentStep, totalSteps }: BeadProgressBarProps) {
  const label = `Step ${currentStep} of ${totalSteps}`

  return (
    <nav aria-label={label}>
      <ol
        role="list"
        aria-label={label}
        className="flex items-center justify-center"
      >
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1
          const completed = step < currentStep
          const current = step === currentStep

          return (
            <li
              key={step}
              data-completed={completed ? 'true' : undefined}
              aria-current={current ? 'step' : undefined}
              className="flex items-center"
            >
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={`block h-px w-8 transition-colors duration-500 ${completed ? 'bg-gold/60' : 'bg-gold/15'}`}
                />
              )}
              <span
                aria-hidden="true"
                className={[
                  'block w-4 h-5 rounded-full border transition-all duration-500',
                  completed
                    ? 'bg-gold border-gold shadow-[0_0_6px_rgba(201,162,75,0.5)]'
                    : current
                      ? 'bg-gold/30 border-gold/70 shadow-[0_0_4px_rgba(201,162,75,0.3)]'
                      : 'bg-transparent border-gold/25',
                ].join(' ')}
              />
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
