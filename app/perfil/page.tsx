import type { Metadata } from 'next'

import { AppShell } from '@/components/layout/app-shell'
import { ProfileView } from '@/components/profile/profile-view'

export const metadata: Metadata = {
  title: 'Meu perfil • Shalom Imóveis',
  description: 'Gerencie seus dados, senha e sessões na Shalom Imóveis.',
}

export default function PerfilPage() {
  return (
    <AppShell>
      <ProfileView />
    </AppShell>
  )
}