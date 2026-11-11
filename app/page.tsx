import type { Metadata } from 'next'

import { DashboardView } from '@/components/dashboard/dashboard-view'
import { AppShell } from '@/components/layout/app-shell'

export const metadata: Metadata = {
  title: 'Painel • Shalom Imóveis',
}

export default function HomePage() {
  return (
    <AppShell>
      <DashboardView />
    </AppShell>
  )
}