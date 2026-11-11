import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME } from './lib/constants'

const PROTECTED_PATHS = ['/', '/imoveis', '/perfil']
const AUTH_PATHS = ['/login']

/**
 * Tenta ler o campo `exp` de um JWT (apenas para UX rápida).
 * Retorna null se o token não for um JWT padrão com exp.
 */
function decodeJwtExp(token: string): number | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    const decoded = JSON.parse(atob(padded))
    return typeof decoded.exp === 'number' ? decoded.exp : null
  } catch {
    return null
  }
}

/**
 * Verifica se o cookie de sessão indica um usuário autenticado.
 * - Se o token for um JWT com `exp`, valida a expiração.
 * - Se o token existir mas não for um JWT padrão (ex: token opaco),
 *   considera autenticado pela presença do cookie.
 * A validação real de assinatura é feita pela API em cada request.
 */
function checkAuthenticated(rawToken: string | undefined): boolean {
  if (!rawToken || rawToken.length < 20) return false
  const token = decodeURIComponent(rawToken)
  const exp = decodeJwtExp(token)
  // JWT com exp → valida expiração
  if (exp !== null) return exp > Math.floor(Date.now() / 1000)
  // Token opaco (não-JWT) → confia na presença do cookie; API valida depois
  return true
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const rawToken = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const isAuthenticated = checkAuthenticated(rawToken)

  const matches = (routes: string[]) =>
    routes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  if (matches(PROTECTED_PATHS) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  if (matches(AUTH_PATHS) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/imoveis/:path*', '/perfil/:path*', '/login'],
}