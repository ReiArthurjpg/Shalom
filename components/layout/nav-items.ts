import { Building2, LayoutDashboard, UserRound, type LucideIcon } from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Painel', icon: LayoutDashboard },
  { href: '/imoveis', label: 'Imóveis', icon: Building2 },
  { href: '/perfil', label: 'Meu perfil', icon: UserRound },
]