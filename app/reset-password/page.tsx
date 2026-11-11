import { Suspense } from 'react'
import type { Metadata } from 'next'

import { ResetPasswordView } from '@/components/login/reset-password-view'
import { Skeleton } from '@/components/ui/spinner'

export const metadata: Metadata = {
  title: 'Definir nova senha • Shalom Imóveis',
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Skeleton className="mx-auto mt-24 h-96 w-full max-w-md" />}>
      <ResetPasswordView />
    </Suspense>
  )
}