import { REGISTRY_LINKS } from '@/config/content'

export function RegistrySection() {
  return (
    <div className="space-y-6">
      {[...REGISTRY_LINKS].map(item => (
        <div key={item.id} className="border border-gold/15 rounded-sm px-8 py-6 bg-ivory/60">
          <div className="w-8 h-px bg-gold/40 mb-4" aria-hidden="true" />
          <h2 className="font-display text-xl text-plum mb-2">{item.label}</h2>
          {item.note && !item.note.startsWith('[') && (
            <p className="font-sans text-xs text-plum/50 mb-4">{item.note}</p>
          )}
          {item.url.startsWith('[') ? (
            <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-plum/25">
              Link coming soon
            </span>
          ) : (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[10px] tracking-[0.15em] uppercase text-gold hover:text-plum transition-colors duration-200"
            >
              View Registry →
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
