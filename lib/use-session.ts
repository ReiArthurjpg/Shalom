'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  fetchCurrentUser,
  getSessionRemainingSeconds,
  getStoredUser,
  logoutUser,
  type AuthUser,
} from './auth'

/**
 * Mantém o usuário autenticado em tela: revalida em /auth/me ao montar e
 * encerra a sessão (redirecionando ao login) quando ela expira.
 */
export function useSession() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Carrega do cache local imediatamente (evita flash de tela em branco)
    const cached = getStoredUser()
    if (cached) {
      setUser(cached)
      setLoading(false)
    }

    // Revalida com a API
    fetchCurrentUser().then((u) => {
      if (!mounted) return
      if (u) {
        setUser(u)
        setLoading(false)
      } else if (!getStoredUser()) {
        // Sem sessão no cache e API não reconheceu → vai pro login
        router.replace('/login')
      } else {
        setLoading(false)
      }
    })

    // Monitora expiração da sessão local a cada 5s
    const timer = setInterval(() => {
      if (getSessionRemainingSeconds() <= 0) {
        clearInterval(timer)
        logoutUser().then(() => router.replace('/login?expired=1'))
      }
    }, 5000)

    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [router])

  const logout = async () => {
    await logoutUser()
    router.replace('/login')
  }

  return { user, loading, setUser, logout }
}
