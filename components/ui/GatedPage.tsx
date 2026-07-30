import type { ReactNode } from 'react'
import type { GateState } from '@/lib/gate'

interface GatedPageProps {
  state:           GateState
  unlocksAt?:      Date
  teaserContent:   ReactNode
  partialContent?: ReactNode
  children:        ReactNode
}

export function GatedPage({
  state,
  teaserContent,
  partialContent,
  children,
}: GatedPageProps) {
  if (state === 'teaser')  return <>{teaserContent}</>
  if (state === 'partial') return <>{partialContent ?? teaserContent}</>
  return <>{children}</>
}
