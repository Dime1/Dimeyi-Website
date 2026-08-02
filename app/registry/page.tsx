import { RegistrySection } from '@/features/registry/RegistrySection'

export default function RegistryPage() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-10 md:py-16">
      <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
        Registry
      </h1>
      <p className="font-sans text-xs tracking-[0.18em] uppercase text-plum/55 text-center mb-10">
        Your presence is the greatest gift
      </p>
      <RegistrySection />
    </section>
  )
}
