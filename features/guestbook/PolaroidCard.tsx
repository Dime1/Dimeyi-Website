interface PolaroidCardProps {
  authorName: string
  message:    string
  rotation:   number
}

export function PolaroidCard({ authorName, message, rotation }: PolaroidCardProps) {
  return (
    <div
      style={{ transform: `rotate(${rotation}deg)` }}
      className="bg-white border border-gray-100 shadow-md p-4 pb-8 break-inside-avoid"
    >
      <div className="bg-blush w-full aspect-[4/3] mb-3 flex items-center justify-center">
        <span className="font-script italic text-plum/20 text-4xl" aria-hidden="true">♡</span>
      </div>
      <p className="font-sans text-xs text-plum/70 leading-relaxed mb-3 line-clamp-5">
        {message}
      </p>
      <p className="font-script italic text-plum/40 text-sm text-right">
        — {authorName}
      </p>
    </div>
  )
}
