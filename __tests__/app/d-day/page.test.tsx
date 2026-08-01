import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({ get: vi.fn().mockReturnValue(undefined) }),
}))

// Mock gate
vi.mock('@/lib/gate', () => ({
  getPageAccess: vi.fn().mockReturnValue({ state: 'teaser', unlocksAt: new Date('2026-11-20') }),
}))

// Mock GatedPage — teaser state renders teaserContent
vi.mock('@/components/ui/GatedPage', () => ({
  GatedPage: ({ teaserContent, state }: { teaserContent: React.ReactNode; state: string }) =>
    state === 'teaser' ? <>{teaserContent}</> : <div>unlocked</div>,
}))

vi.mock('@/features/schedule/EventBlock', () => ({
  EventBlock: ({ event }: { event: { name: string } }) => <div>{event.name}</div>,
}))

vi.mock('@/features/travel/LogisticsCard', () => ({
  LogisticsCard: ({ label }: { label: string }) => <div>{label}</div>,
}))

vi.mock('@/features/travel/MapSection', () => ({
  MapSection: () => <div>Map</div>,
}))

vi.mock('@/components/ui/ScriptureStrip', () => ({
  ScriptureStrip: () => <div>Scripture</div>,
}))

import DayPage from '@/app/d-day/page'

describe('D-Day page', () => {
  it('renders teaser content when gate is locked', async () => {
    const page = await DayPage()
    render(page)
    expect(screen.getByText(/still being written/i)).toBeInTheDocument()
  })
})
