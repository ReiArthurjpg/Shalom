import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shalom Imóveis • Plataforma de Gestão',
  description: 'Plataforma corporativa da Shalom Imóveis para gestão de imóveis, equipe e atendimento.',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#222D3A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  )
}