import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GatedPage } from '@/components/ui/GatedPage'

describe('GatedPage', () => {
  const teaser  = <div>Teaser content</div>
  const partial = <div>Partial content</div>
  const full    = <div>Full secret content</div>

  it('renders teaser and hides children when state is teaser', () => {
    render(
      <GatedPage state="teaser" teaserContent={teaser} unlocksAt={new Date('2027-01-01')}>
        {full}
      </GatedPage>
    )
    expect(screen.getByText('Teaser content')).toBeInTheDocument()
    expect(screen.queryByText('Full secret content')).not.toBeInTheDocument()
  })

  it('renders children and hides teaser when state is full', () => {
    render(
      <GatedPage state="full" teaserContent={teaser}>
        {full}
      </GatedPage>
    )
    expect(screen.getByText('Full secret content')).toBeInTheDocument()
    expect(screen.queryByText('Teaser content')).not.toBeInTheDocument()
  })

  it('renders partialContent when state is partial', () => {
    render(
      <GatedPage state="partial" teaserContent={teaser} partialContent={partial}>
        {full}
      </GatedPage>
    )
    expect(screen.getByText('Partial content')).toBeInTheDocument()
    expect(screen.queryByText('Full secret content')).not.toBeInTheDocument()
    expect(screen.queryByText('Teaser content')).not.toBeInTheDocument()
  })

  it('falls back to teaserContent when state is partial and no partialContent given', () => {
    render(
      <GatedPage state="partial" teaserContent={teaser}>
        {full}
      </GatedPage>
    )
    expect(screen.getByText('Teaser content')).toBeInTheDocument()
  })
})
