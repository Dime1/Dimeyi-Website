interface ConstellationThreadProps {
  className?: string
}

export function ConstellationThread({ className = '' }: ConstellationThreadProps) {
  return (
    <div
      className={`absolute left-[15px] inset-y-4 w-px pointer-events-none ${className}`}
      aria-hidden="true"
      style={{
        background:
          'linear-gradient(to bottom, transparent 0%, rgba(201,162,75,0.25) 8%, rgba(201,162,75,0.22) 92%, transparent 100%)',
      }}
    />
  )
}
