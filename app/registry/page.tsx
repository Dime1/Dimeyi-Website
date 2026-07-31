import { RegistrySection } from '@/features/registry/RegistrySection'

export default function RegistryPage() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-32">
      <h1 className="font-display text-4xl md:text-5xl text-plum text-center mb-4">
        Registry
      </h1>
      <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-plum/30 text-center mb-16">
        Your presence is the greatest gift
      </p>
      <RegistrySection />
    </section>
  )
}
