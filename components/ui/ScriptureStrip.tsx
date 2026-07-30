interface ScriptureStripProps {
  text:      string
  reference: string
}

export function ScriptureStrip({ text, reference }: ScriptureStripProps) {
  return (
    <aside
      className="relative w-full py-8 px-6 my-16 overflow-hidden"
      aria-label={`Scripture: ${reference}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"/>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"/>

      <div className="relative text-center max-w-2xl mx-auto">
        <p className="font-script italic text-lg leading-relaxed text-gold/75">
          {text}
        </p>
        <p className="mt-3 font-sans font-medium text-[10px] tracking-[0.18em] uppercase text-gold/45">
          {reference}
        </p>
      </div>
    </aside>
  )
}
