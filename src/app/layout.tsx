import '../styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Studio Tax',
  description:
    'Consultoria tributária especializada em bares, restaurantes, cafés, mercados e açougues.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans">
        {/* Header fixo */}
        <Header />

        {/* Main: espaço para o conteúdo abaixo do header */}
        <main style={{ paddingTop: '100px', minHeight: 'calc(100vh - 160px)' }}>
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  )
}

