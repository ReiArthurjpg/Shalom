'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'

import { BrandLockup } from '@/components/brand/logo'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from './nav-items'

export function Sidebar({ onNavigate, onLogout }: { onNavigate?: () => void; onLogout: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-navy-800 text-white">
      <div className="border-b border-white/10 px-6 py-6">
        <BrandLockup />
      </div>

      <nav aria-label="Navegação principal" className="flex-1 space-y-1 px-3 py-5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-gold/60 focus-visible:outline-none',
                active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              {active && <span className="absolute inset-y-1.5 left-0 w-1 rounded-r bg-gold" aria-hidden />}
              <Icon className={cn('size-[18px]', active && 'text-gold')} aria-hidden />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-3 focus-visible:ring-gold/60 focus-visible:outline-none"
        >
          <LogOut className="size-[18px]" aria-hidden />
          Sair
        </button>
      </div>
    </div>
  )
}