'use client'

export const AVATARS = ['💍', '🎂', '🥁', '🥂', '🐚'] as const
export type Avatar = typeof AVATARS[number]

interface AvatarPickerProps {
  selected: Avatar | null
  onSelect: (avatar: Avatar) => void
}

export function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {AVATARS.map(avatar => (
        <button
          key={avatar}
          type="button"
          onClick={() => onSelect(avatar)}
          aria-pressed={selected === avatar}
          aria-label={`Select ${avatar} avatar`}
          className={`text-3xl p-2 rounded-full border-2 transition-all duration-200 ${
            selected === avatar
              ? 'border-gold scale-110'
              : 'border-transparent hover:border-gold/40'
          }`}
        >
          {avatar}
        </button>
      ))}
    </div>
  )
}
