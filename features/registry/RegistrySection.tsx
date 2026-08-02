'use client'
import { useState } from 'react'

type Account = 'ng' | 'intl'

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-sans text-sm uppercase tracking-[0.12em] text-plum/80 mt-2">{label}</p>
      <p className="font-sans text-sm font-semibold text-plum">{value}</p>
    </div>
  )
}

export function RegistrySection() {
  const [card1Flipped, setCard1Flipped] = useState(false)
  const [card2Flipped, setCard2Flipped] = useState(false)
  const [account,      setAccount]      = useState<Account>('ng')

  return (
    <div className="flex gap-8 justify-center flex-wrap py-4">

      {/* Card 1 — Give to the Couple */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Flip card to see account details"
        className="w-full max-w-[256px] h-80 cursor-pointer select-none text-left"
        style={{ perspective: '900px' }}
        onClick={() => setCard1Flipped(f => !f)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setCard1Flipped(f => !f) }}
      >
        <div
          className="relative w-full h-full"
          style={{
            transformStyle:  'preserve-3d',
            transition:      'transform 0.65s cubic-bezier(0.4,0,0.2,1)',
            transform:       card1Flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-lg"
            style={{
              backfaceVisibility: 'hidden',
              background:         'linear-gradient(145deg, #5b3d6e 0%, #7a5490 100%)',
            }}
          >
            <svg width="58" height="58" viewBox="0 0 60 60" fill="none" className="mb-4" aria-hidden="true">
              <path d="M30 50 C30 50 8 35 8 20 C8 13 13.5 8 20 8 C24 8 27.5 10.5 30 14 C32.5 10.5 36 8 40 8 C46.5 8 52 13 52 20 C52 35 30 50 30 50Z" fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M30 43 C30 43 13 31 13 21 C13 16.5 16.5 13 21 13 C24.5 13 27 15 30 18.5 C33 15 35.5 13 39 13 C43.5 13 47 16.5 47 21 C47 31 30 43 30 43Z" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1"/>
              <circle cx="15" cy="14" r="1.5" fill="white" opacity="0.6"/>
              <circle cx="45" cy="12" r="1"   fill="white" opacity="0.5"/>
              <circle cx="48" cy="30" r="1.5" fill="white" opacity="0.4"/>
            </svg>
            <p className="font-sans text-xs tracking-[0.16em] uppercase text-white font-bold mb-2">
              Give to the Couple
            </p>
            <p className="font-sans text-xs text-white/70 tracking-widest">
              Tap to see account details
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-5 shadow-lg"
            style={{
              backfaceVisibility: 'hidden',
              transform:          'rotateY(180deg)',
              background:         '#fffaf6',
              border:             '1.5px solid #e8ddd5',
            }}
          >
            <p className="font-sans text-xs font-bold tracking-[0.14em] uppercase text-plum mb-3">
              Account Details
            </p>

            {/* Tab switcher — stopPropagation so clicks don't flip the card */}
            <div
              className="flex w-full rounded-lg overflow-hidden mb-3"
              style={{ border: '1.5px solid #d8ccc4' }}
              onClick={e => { e.preventDefault(); e.stopPropagation() }}
            >
              <button
                aria-pressed={account === 'ng'}
                className={`flex-1 py-1.5 font-sans text-xs font-bold tracking-widest uppercase transition-colors ${
                  account === 'ng' ? 'bg-plum text-ivory' : 'bg-white text-plum/80'
                }`}
                onClick={e => { e.stopPropagation(); setAccount('ng') }}
              >
                🇳🇬 Nigerian
              </button>
              <button
                aria-pressed={account === 'intl'}
                className={`flex-1 py-1.5 font-sans text-xs font-bold tracking-widest uppercase transition-colors border-l ${
                  account === 'intl' ? 'bg-plum text-ivory' : 'bg-white text-plum/80'
                }`}
                style={{ borderLeftColor: '#d8ccc4' }}
                onClick={e => { e.stopPropagation(); setAccount('intl') }}
              >
                🌍 Intl
              </button>
            </div>

            {account === 'ng' ? (
              <div className="w-full">
                <DetailRow label="Account Name" value="Feyisogo & Dimeji" />
                <DetailRow label="Bank"         value="[BANK_NAME]"       />
                <DetailRow label="Account No."  value="[ACCOUNT_NUMBER]"  />
                <DetailRow label="Sort Code"    value="[SORT_CODE]"       />
              </div>
            ) : (
              <div className="w-full">
                <DetailRow label="Account Name" value="Feyisogo & Dimeji" />
                <DetailRow label="IBAN"         value="[IBAN]"            />
                <DetailRow label="BIC / SWIFT"  value="[BIC_SWIFT]"      />
                <DetailRow label="Bank"         value="[BANK_NAME_INTL]"  />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card 2 — Gift List */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Flip card to see gift list"
        className="w-full max-w-[256px] h-80 cursor-pointer select-none text-left"
        style={{ perspective: '900px' }}
        onClick={() => setCard2Flipped(f => !f)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setCard2Flipped(f => !f) }}
      >
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            transition:     'transform 0.65s cubic-bezier(0.4,0,0.2,1)',
            transform:      card2Flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-lg"
            style={{
              backfaceVisibility: 'hidden',
              background:         'linear-gradient(145deg, #9c6b38 0%, #c4904a 100%)',
            }}
          >
            <svg width="58" height="58" viewBox="0 0 60 60" fill="none" className="mb-4" aria-hidden="true">
              <rect x="10" y="26" width="40" height="26" rx="3" fill="rgba(255,255,255,0.2)"  stroke="white" strokeWidth="1.5"/>
              <rect x="8"  y="20" width="44" height="8"  rx="3" fill="rgba(255,255,255,0.3)"  stroke="white" strokeWidth="1.5"/>
              <rect x="27" y="20" width="6"  height="32" rx="1" fill="rgba(255,255,255,0.5)"/>
              <rect x="8"  y="22" width="44" height="4"  rx="1" fill="rgba(255,255,255,0.4)"/>
              <path d="M30 20 C28 14 20 12 20 18 C20 22 28 22 30 20Z" fill="rgba(255,255,255,0.7)" stroke="white" strokeWidth="1"/>
              <path d="M30 20 C32 14 40 12 40 18 C40 22 32 22 30 20Z" fill="rgba(255,255,255,0.7)" stroke="white" strokeWidth="1"/>
              <circle cx="30" cy="20" r="3" fill="white"/>
            </svg>
            <p className="font-sans text-xs tracking-[0.16em] uppercase text-white font-bold mb-2">
              Gift List
            </p>
            <p className="font-sans text-xs text-white/70 tracking-widest">
              Tap to explore our wishlist
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-6 shadow-lg"
            style={{
              backfaceVisibility: 'hidden',
              transform:          'rotateY(180deg)',
              background:         '#fffaf6',
              border:             '1.5px solid #e8ddd5',
            }}
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="mb-3" aria-hidden="true">
              <circle cx="16" cy="22" r="9" stroke="#9c6b38" strokeWidth="2.5" fill="none"/>
              <circle cx="28" cy="22" r="9" stroke="#9c6b38" strokeWidth="2.5" fill="none"/>
              <path d="M22 15 C24.5 17 24.5 27 22 29" stroke="#fffaf6" strokeWidth="3"/>
              <path d="M22 15 C19.5 17 19.5 27 22 29" stroke="#fffaf6" strokeWidth="3"/>
            </svg>
            <p className="font-sans text-sm uppercase tracking-[0.12em] text-plum/80 mb-4">
              Browse our wishlist
            </p>
            <a
              href="https://www.amazon.de/wedding/share/FeyiandDims"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-2 rounded-full bg-plum text-ivory font-sans text-xs font-semibold tracking-widest uppercase mb-2 hover:bg-plum/90 transition-colors"
            >
              Amazon List
            </a>
            <a
              href="https://giftwhale.com/lists/A1In4C"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-2 rounded-full text-ivory font-sans text-xs font-semibold tracking-widest uppercase hover:opacity-80 transition-opacity"
              style={{ background: '#9c6b38' }}
            >
              Giftwhale
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
