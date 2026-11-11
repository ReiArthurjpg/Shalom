import { Building2, ShieldCheck, Users } from 'lucide-react'

import { Monogram } from '@/components/brand/logo'
import { Logo } from '@/components/brand/logo'

const HIGHLIGHTS = [
  { icon: Building2, text: 'Portfólio de imóveis centralizado' },
  { icon: Users, text: 'Equipe e permissões por perfil' },
  { icon: ShieldCheck, text: 'Acesso protegido por sessão segura' },
]

/** Vitrine institucional da tela de login (visível a partir de lg). */
export function ShalomShowcase() {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-navy-800 p-12 text-white xl:p-16">
      {/* Monograma como marca d'água */}
      <Monogram className="pointer-events-none absolute -right-24 -bottom-16 w-[34rem] max-w-none opacity-[0.07]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gold" aria-hidden />

      <div className="relative">
        <Logo tone="dark" className="w-44" priority />
      </div>

      <div className="relative max-w-lg">
        <p className="eyebrow text-gold">Plataforma de gestão</p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight xl:text-5xl">
          Solidez em cada negócio imobiliário.
        </h1>
        <div className="mt-6 h-[3px] w-12 bg-gold" aria-hidden />
        <p className="mt-6 text-base leading-relaxed text-white/75">
          Acesse o painel da Shalom Imóveis para gerenciar o portfólio, acompanhar a operação e manter a equipe alinhada.
        </p>

        <ul className="mt-10 space-y-4">
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-white/85">
              <span className="flex size-9 items-center justify-center rounded-md bg-white/10 text-gold">
                <Icon className="size-[18px]" aria-hidden />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-white/50">© {new Date().getFullYear()} Shalom Imóveis. Todos os direitos reservados.</p>
    </div>
  )
}