export function MapSection() {
  return <MapPlaceholder />
}

function MapPlaceholder() {
  return (
    <div className="relative w-full aspect-[16/9] max-h-80 rounded-sm overflow-hidden border border-gold/10 bg-plum/5 flex flex-col items-center justify-center gap-3">
      {/* Decorative compass rose */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="14" stroke="#C9A24B" strokeWidth="0.6" opacity="0.3"/>
        <line x1="16" y1="4" x2="16" y2="28" stroke="#C9A24B" strokeWidth="0.5" opacity="0.2"/>
        <line x1="4" y1="16" x2="28" y2="16" stroke="#C9A24B" strokeWidth="0.5" opacity="0.2"/>
        <circle cx="16" cy="16" r="2" fill="#C9A24B" opacity="0.5"/>
        <path d="M16 8l1.5 6h-3L16 8Z" fill="#C9A24B" opacity="0.5"/>
      </svg>
      <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-plum/30">
        Interactive map coming soon
      </p>
      <p className="font-sans text-[9px] text-plum/20">
        Venue pins will appear here once details are confirmed
      </p>
    </div>
  )
}
