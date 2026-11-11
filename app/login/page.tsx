import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ShieldCheck } from 'lucide-react'

import { Logo } from '@/components/brand/logo'
import { LoginForm } from '@/components/login/login-form'
import { ShalomShowcase } from '@/components/login/shalom-showcase'
import { Skeleton } from '@/components/ui/spinner'

export const metadata: Metadata = {
  title: 'Login • Shalom Imóveis',
  description: 'Acesso corporativo à plataforma de gestão da Shalom Imóveis.',
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-col bg-sand lg:flex-row">
      {/* Coluna esquerda: vitrine institucional */}
      <section className="hidden min-h-screen lg:flex lg:w-[55%] xl:w-[58%]">
        <ShalomShowcase />
      </section>

      {/* Coluna direita: formulário de autenticação */}
      <section className="flex min-h-screen flex-1 flex-col justify-between bg-white px-6 py-8 sm:px-12 lg:px-14 xl:px-20">
        <div className="flex items-center justify-between">
          <Logo className="w-28 lg:hidden" priority />
          <div className="ml-auto hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
            <ShieldCheck className="size-4 text-success" aria-hidden />
            Ambiente seguro • Shalom Imóveis
          </div>
        </div>

        <div className="my-auto py-8">
          <Suspense fallback={<Skeleton className="mx-auto h-96 w-full max-w-[430px]" />}>
            <LoginForm />
          </Suspense>
        </div>

        <footer className="border-t border-border pt-4 text-center text-[11px] text-muted-foreground sm:text-left">
          © {new Date().getFullYear()} Shalom Imóveis
        </footer>
      </section>
    </main>
  )
}