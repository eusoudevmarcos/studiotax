import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Sectors from '@/components/Sectors'
import About from '@/components/About'
import CTA from '@/components/CTA'
import WhatsAppButton from '@/components/WhatsAppButton'
import Footer from '@/components/Footer'

export default function Page() {
  return (
    <>
      <Hero />
      <Sectors />
      <Services />
      <About />
      <CTA />
      <WhatsAppButton />
      <Footer />
    </>
  )
}
