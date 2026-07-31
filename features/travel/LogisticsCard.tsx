interface LogisticsCardProps {
  label:     string
  value:     string
  subValue?: string
  icon?:     React.ReactNode
}

export function LogisticsCard({ label, value, subValue, icon }: LogisticsCardProps) {
  const isPending = value.startsWith('[')

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gold/10 last:border-0">
      {icon && (
        <div className="flex-shrink-0 mt-0.5 text-gold/40" aria-hidden="true">
          {icon}
        </div>
      )}
      <div>
        <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-plum/35 mb-1">
          {label}
        </p>
        {isPending ? (
          <p className="font-sans text-sm text-plum/25 italic">Coming soon</p>
        ) : (
          <>
            <p className="font-sans text-sm text-plum/75">{value}</p>
            {subValue && (
              <p className="font-sans text-xs text-plum/40 mt-0.5">{subValue}</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
