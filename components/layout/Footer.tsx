import { COUPLE, VERSES, WEDDING } from '@/config/content'

export function Footer() {
  return (
    <footer className="relative bg-plum text-ivory/50 py-20 px-6 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent"/>

      <div className="relative max-w-xl mx-auto text-center space-y-4">
        <p className="font-script italic text-gold/70 text-xl leading-relaxed">
          {VERSES.footer.text}
        </p>
        <p className="font-sans font-medium text-[10px] tracking-[0.18em] uppercase text-gold/40">
          {VERSES.footer.ref}
        </p>

        <div className="pt-10 mt-10 border-t border-white/5 space-y-2">
          <p className="font-display text-ivory/80 text-2xl tracking-wide">
            {COUPLE.fullNames}
          </p>
          <p className="font-sans text-[11px] tracking-[0.16em] uppercase text-ivory/30">
            {WEDDING.dateLabel}
          </p>
          <p className="font-sans text-xs text-ivory/20 pt-2">
            With love and gratitude — thank you for celebrating with us.
          </p>
          {COUPLE.hashtag !== '[WEDDING_HASHTAG]' && (
            <p className="font-sans text-xs tracking-widest text-gold/35 pt-1">
              {COUPLE.hashtag}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
