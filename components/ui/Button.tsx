'use client'

import type { ButtonHTMLAttributes } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const reduced = useReducedMotion()

  const base = `
    inline-flex items-center justify-center gap-2
    px-6 py-3 rounded-sm border
    font-sans text-[11px] font-medium tracking-[0.16em] uppercase
    focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2
    disabled:opacity-40 disabled:cursor-not-allowed
    ${reduced ? '' : 'transition-all duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)]'}
  `

  const variants = {
    primary: `
      border-gold/50 text-gold bg-transparent
      hover:border-gold hover:scale-[1.02]
      hover:shadow-[0_0_20px_rgba(201,162,75,0.2)]
    `,
    ghost: `
      border-transparent text-ivory/60 bg-transparent
      hover:text-ivory hover:border-ivory/20
    `,
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
