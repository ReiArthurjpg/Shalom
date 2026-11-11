'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Building2,
  ArrowRight,
  TrendingUp,
  Home,
  CheckCircle2,
  Clock,
  UserRound,
  ShieldCheck,
  Sparkles,
  KeyRound,
} from 'lucide-react'

import { useSession } from '@/lib/use-session'
import { ROLE_LABELS } from '@/lib/auth'

function getInitials(name?: string): string {
  const parts = (name || 'AD').trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase()
}

export function DashboardView() {
  const router = useRouter()
  const { user } = useSession()

  const displayName = user?.name || 'Administrador'
  const firstName = displayName.split(' ')[0]
  const displayEmail = user?.email || 'admin@shalom.com.br'
  const displayRole = user?.role ? ROLE_LABELS[user.role] : 'Administrador'
  const initials = getInitials(displayName)

  const cards = [
    {
      title: 'Gestão de Imóveis',
      description:
        'Cadastre, edite e acompanhe todo o portfólio de imóveis da Shalom — residenciais, comerciais e terrenos.',
      icon: Building2,
      route: '/imoveis',
      badge: 'Ativo',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      gradient: 'from-[#090D16] to-slate-800',
      iconColor: 'text-[#DEBB4D]',
      available: true,
    },
    {
      title: 'Meu Perfil & Senha',
      description:
        'Gerencie seus dados pessoais, e-mail de acesso e altere sua senha com segurança.',
      icon: UserRound,
      route: '/perfil',
      badge: 'Ativo',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      gradient: 'from-slate-700 to-slate-900',
      iconColor: 'text-slate-200',
      available: true,
    },
    {
      title: 'Relatórios & Métricas',
      description:
        'Acompanhe o desempenho do portfólio com gráficos de vendas, locações e tempo médio de fechamento.',
      icon: TrendingUp,
      route: null,
      badge: 'Em breve',
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
      gradient: 'from-amber-700 to-amber-900',
      iconColor: 'text-amber-200',
      available: false,
    },
  ]

  const stats = [
    { label: 'Imóveis cadastrados', value: '—', icon: Home, color: 'text-[#DEBB4D]' },
    { label: 'Disponíveis', value: '—', icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Negociações ativas', value: '—', icon: Clock, color: 'text-sky-500' },
  ]

  return (
    <div className="space-y-8 sm:space-y-10">

      {/* ── Hero Banner + Perfil ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Banner de boas-vindas */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#090D16] via-[#0E1520] to-slate-900 text-white p-8 shadow-xl border border-slate-800/80 flex flex-col justify-between min-h-[220px]">
          {/* glow decorativo */}
          <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-[#DEBB4D]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-52 h-52 bg-slate-700/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DEBB4D]/15 border border-[#DEBB4D]/30 text-[#DEBB4D] text-[11px] font-extrabold uppercase tracking-widest w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              Painel de Gestão Imobiliária
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Bem-vindo,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DEBB4D] to-amber-300">
                  {firstName}
                </span>
                !
              </h1>
              <p className="mt-2 text-sm text-slate-400 max-w-lg leading-relaxed">
                Gerencie o portfólio da Shalom Imóveis, acompanhe negociações e mantenha os dados sempre atualizados.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push('/imoveis')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#DEBB4D] hover:bg-amber-400 text-[#090D16] text-xs font-extrabold transition-colors shadow-md shadow-[#DEBB4D]/30 cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              Ver imóveis
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card do usuário logado */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-5">
          {/* Avatar + nome */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#090D16] border-2 border-[#DEBB4D]/50 text-[#DEBB4D] font-black text-lg flex items-center justify-center shadow-md shrink-0 select-none">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-black text-slate-900 text-sm truncate">{displayName}</p>
              <p className="text-[11px] text-slate-500 font-mono truncate">{displayEmail}</p>
            </div>
          </div>

          {/* Função + status */}
          <div className="space-y-2.5 py-3 border-y border-slate-100 text-[12px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-semibold">Função</span>
              <span className="font-bold text-slate-800">{displayRole}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-semibold">Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Autenticado
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-semibold">Segurança</span>
              <span className="inline-flex items-center gap-1 font-bold text-sky-700 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                SSO Ativo
              </span>
            </div>
          </div>

          {/* Acesso rápido ao perfil */}
          <button
            type="button"
            onClick={() => router.push('/perfil')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#DEBB4D] font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Meu Perfil & Senha
          </button>
        </div>
      </div>

      {/* ── Stats rápidos ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="bg-white border border-slate-200/80 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                <p className="text-xl font-black text-slate-800">{s.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Grid de módulos ── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Módulos do sistema</h2>
          <p className="text-xs text-slate-500 mt-0.5">Acesse as ferramentas disponíveis na plataforma.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                onClick={() => card.available && card.route && router.push(card.route)}
                className={`group relative overflow-hidden rounded-3xl border p-6 flex flex-col justify-between gap-6 shadow-sm transition-all duration-200 ${
                  card.available
                    ? 'bg-white border-slate-200/80 hover:border-[#DEBB4D] hover:shadow-md hover:-translate-y-1 cursor-pointer'
                    : 'bg-slate-50 border-slate-200/60 cursor-not-allowed opacity-70 select-none'
                }`}
              >
                <div className="space-y-4">
                  {/* Ícone + badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.gradient} flex items-center justify-center shadow-md ${
                        card.available ? 'group-hover:scale-110 transition-transform duration-200' : 'grayscale opacity-60'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${card.badgeClass}`}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Texto */}
                  <div>
                    <h3 className={`text-base font-black ${card.available ? 'text-slate-900 group-hover:text-[#090D16]' : 'text-slate-500'}`}>
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{card.description}</p>
                  </div>
                </div>

                {/* Rodapé do card */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold">
                  {card.available ? (
                    <>
                      <span className="text-[#090D16]">Acessar</span>
                      <ArrowRight className="w-4 h-4 text-[#DEBB4D] group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      <span className="text-slate-400">Indisponível</span>
                      <Clock className="w-4 h-4 text-slate-400" />
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
