import type { Metadata } from 'next'

import { AppShell } from '@/components/layout/app-shell'
import { ImoveisView } from '@/components/imoveis/imoveis-view'

export const metadata: Metadata = {
  title: 'Imóveis • Shalom Imóveis',
  description: 'Cadastro e gestão do portfólio de imóveis da Shalom Imóveis.',
}

export default function ImoveisPage() {
  return (
    <AppShell>
      <ImoveisView />
    </AppShell>
  )
}