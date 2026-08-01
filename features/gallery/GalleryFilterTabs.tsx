'use client'
import type { GalleryCategory } from '@/config/content'

const TABS: { label: string; value: GalleryCategory }[] = [
  { label: 'All',             value: 'all'            },
  { label: 'Couple Journey',  value: 'couple-journey' },
  { label: 'Proposal Photos', value: 'proposal'       },
]

interface GalleryFilterTabsProps {
  active:   GalleryCategory
  onChange: (cat: GalleryCategory) => void
}

export function GalleryFilterTabs({ active, onChange }: GalleryFilterTabsProps) {
  return (
    <div role="tablist" className="flex gap-6 justify-center mb-12 flex-wrap">
      {TABS.map(tab => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={active === tab.value}
          onClick={() => onChange(tab.value)}
          className={`font-sans text-[10px] tracking-[0.18em] uppercase pb-1 transition-colors duration-200 ${
            active === tab.value
              ? 'text-plum border-b border-gold'
              : 'text-plum/40 hover:text-plum/70'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
