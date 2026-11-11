'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, LogOut, Bell, Lock } from 'lucide-react'

import { PageLoading } from '@/components/ui/spinner'
import { useSession } from '@/lib/use-session'

function getOperatorInitials(name?: string): string {
  const parts = (name || 'AD').trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase()
}

/**
 * Shell institucional com Header escuro (#090D16 / #161E27),
 * iluminação ambiente, sino com tooltip de desenvolvimento e menu de operador SSO.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useSession()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [shineIndex, setShineIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setShineIndex((prev) => (prev + 1) % 100)
    }, 50)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = getOperatorInitials(user?.name)

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-[#DEBB4D] selection:text-[#090D16] flex flex-col justify-between relative overflow-x-hidden">
      {/* Ambient Light Orb Effect nas cores institucionais Shalom */}
      <div
        className="fixed w-96 h-96 rounded-full bg-[#DEBB4D]/10 blur-[120px] pointer-events-none transition-all duration-700"
        style={{
          top: `${10 + Math.sin(shineIndex * 0.08) * 10}%`,
          left: `${20 + Math.cos(shineIndex * 0.08) * 10}%`,
        }}
      />
      <div
        className="fixed w-96 h-96 rounded-full bg-[#222D3A]/10 blur-[140px] pointer-events-none transition-all duration-700"
        style={{
          bottom: `${10 + Math.cos(shineIndex * 0.08) * 10}%`,
          right: `${20 + Math.sin(shineIndex * 0.08) * 10}%`,
        }}
      />

      {/* TOP HEADER SSO HUB (#090D16 / #161E27 + #DEBB4D) */}
      <header className="w-full border-b border-slate-800/80 bg-[#090D16]/95 text-white backdrop-blur-md sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          {/* Brand Logo -> Clica e volta para o Hub Central */}
          <Link
            href="/"
            className="flex items-center gap-3 cursor-pointer min-w-0 group"
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white p-1 ring-2 ring-[#DEBB4D]/60 shadow-md shadow-[#DEBB4D]/20 flex items-center justify-center overflow-hidden">
                <img
                  src="/shalom-logo.png"
                  alt="Logo Shalom Imóveis"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#090D16]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-white truncate">
                  SHALOM
                </span>
                <span className="text-[10px] bg-[#DEBB4D]/15 text-[#DEBB4D] border border-[#DEBB4D]/35 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
                  HUB SSO
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block truncate">
                Centro de Comando &amp; Operações
              </span>
            </div>
          </Link>

          {/* Ações Direita do Header */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 relative shrink-0" ref={dropdownRef}>
            {/* Sino de Notificações (Em Desenvolvimento / Bloqueado) */}
            <div className="relative group">
              <button
                type="button"
                className="relative w-10 h-10 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-center text-slate-500 cursor-not-allowed opacity-75"
                title="Notificações em desenvolvimento"
              >
                <Bell className="w-4 h-4 text-slate-400" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-600" />
              </button>

              {/* Tooltip informativo de desenvolvimento */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-xl p-3 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                <div className="flex items-center gap-1.5 text-[11px] font-black text-[#DEBB4D] uppercase tracking-wide">
                  <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>Em Desenvolvimento:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                  Estamos construindo a central de notificações operacionais em tempo real para propostas, visitas e contratos.
                </p>
              </div>
            </div>

            {/* Botão Dropdown do Operador Logado */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#DEBB4D] text-[#090D16] font-black text-xs flex items-center justify-center">
                  {initials}
                </div>
                <span className="text-xs font-bold text-white hidden sm:inline">
                  {user ? user.name.split(' ')[0] : 'Operador'}
                </span>
                <span className="text-slate-400 text-[10px]">▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user?.name || 'Administrador Shalom'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      {user?.email || 'admin@shalom.com.br'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false)
                      router.push('/perfil')
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>Meu Perfil &amp; Redefinir Senha</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={async () => {
                      setDropdownOpen(false)
                      await logout()
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair da conta</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10 space-y-8 sm:space-y-10">
        {loading && !user ? <PageLoading /> : children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-6 px-6 text-center text-xs text-slate-500 space-y-1 shadow-inner mt-12">
        <p className="font-bold text-slate-700">SHALOM IMÓVEIS • PLATAFORMA DE GESTÃO OS V1.0</p>
        <p>© {new Date().getFullYear()} Shalom Imóveis. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
