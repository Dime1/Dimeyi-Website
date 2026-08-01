import type { Metadata }           from 'next'
import { Playfair_Display, Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import { Nav }             from '@/components/layout/Nav'
import { Footer }          from '@/components/layout/Footer'
import { LenisProvider }   from '@/components/layout/LenisProvider'
import { AudioToggle }      from '@/components/ui/AudioToggle'
import { QuizWidgetButton } from '@/features/quiz-widget/QuizWidgetButton'
import { AdireBackground } from '@/components/ui/AdireBackground'
import { COUPLE }          from '@/config/content'

const playfair = Playfair_Display({
  subsets:  ['latin'],
  variable: '--font-display',
  display:  'swap',
})

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300'],
  style:    ['normal', 'italic'],
  variable: '--font-script',
  display:  'swap',
})

const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-sans',
  display:  'swap',
})

export const metadata: Metadata = {
  title:       `${COUPLE.displayNames} — Wedding`,
  description: `You're invited to celebrate the wedding of ${COUPLE.fullNames} on February 18, 2027.`,
  openGraph: {
    title:       `${COUPLE.displayNames} — Wedding`,
    description: `You're invited to celebrate the wedding of ${COUPLE.fullNames}.`,
    type:        'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}
    >
      <body className="bg-ivory text-plum min-h-screen">
        <AdireBackground />
        <LenisProvider>
          <Nav />
          <main className="relative z-10 pt-16" id="main-content">
            {children}
          </main>
          <Footer />
        </LenisProvider>
        <AudioToggle />
        <QuizWidgetButton />
      </body>
    </html>
  )
}
