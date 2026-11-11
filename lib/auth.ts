'use client'

import { SESSION_COOKIE_NAME, REFRESH_COOKIE_NAME, SESSION_MAX_AGE_MS, SESSION_MAX_AGE_SECONDS } from './constants'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8023/api'

export type UserRole = 'admin' | 'gerente' | 'corretor'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
  avatar_url?: string | null
  last_login_at?: string | null
  created_at?: string | null
  session_exp?: string | null
}

export interface ActiveSession {
  id: number
  ip_address: string
  user_agent: string
  created_at: string
  expires_at: string
  is_current: number | boolean
}

export interface LoginAttemptItem {
  ip_address: string
  success: number | boolean
  attempted_at: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token?: string
  refresh_token?: string
  expires_in?: number
  expires_at?: string
  user?: AuthUser
  errors?: Record<string, string>
}

export interface ProfileResponse {
  success: boolean
  message: string
  user?: AuthUser
  sessions?: ActiveSession[]
  recent_attempts?: LoginAttemptItem[]
}

const STORAGE_TOKEN_KEY = 'shalom_token'
const STORAGE_USER_KEY = 'shalom_user'
const STORAGE_EXP_KEY = 'shalom_session_exp'

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  gerente: 'Gerente',
  corretor: 'Corretor',
}

export function setClientSession(token: string, user: AuthUser) {
  if (typeof window === 'undefined') return

  localStorage.setItem(STORAGE_TOKEN_KEY, token)
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))
  localStorage.setItem(STORAGE_EXP_KEY, String(Date.now() + SESSION_MAX_AGE_MS))

  document.cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`
}

export function clearClientSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_TOKEN_KEY)
  localStorage.removeItem(STORAGE_USER_KEY)
  localStorage.removeItem(STORAGE_EXP_KEY)

  const expired = 'path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax'
  document.cookie = `${SESSION_COOKIE_NAME}=; ${expired}`
  document.cookie = `${REFRESH_COOKIE_NAME}=; ${expired}`
}

function sessionExpired(): boolean {
  const exp = Number(localStorage.getItem(STORAGE_EXP_KEY) || 0)
  return !!exp && Date.now() > exp
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    if (sessionExpired()) {
      clearClientSession()
      return null
    }
    const raw = localStorage.getItem(STORAGE_USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  if (sessionExpired()) {
    clearClientSession()
    return null
  }
  return localStorage.getItem(STORAGE_TOKEN_KEY)
}

export function getSessionRemainingSeconds(): number {
  if (typeof window === 'undefined') return 0
  const exp = Number(localStorage.getItem(STORAGE_EXP_KEY) || 0)
  if (!exp) return 0
  return Math.max(0, Math.floor((exp - Date.now()) / 1000))
}

function authHeaders(json = true): Record<string, string> {
  const token = getStoredToken()
  return {
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function readJson<T>(res: Response): Promise<T> {
  try {
    return (await res.json()) as T
  } catch {
    return { success: false, message: 'Resposta inválida do servidor.' } as T
  }
}

async function postJson<T = AuthResponse>(path: string, body: unknown, withAuth = false): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: withAuth ? authHeaders() : { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return await readJson<T>(res)
  } catch {
    return { success: false, message: 'Não foi possível conectar ao servidor. Tente novamente.' } as T
  }
}

function persistIfAuthenticated(data: AuthResponse): AuthResponse {
  if (data.success && data.token && data.user) {
    setClientSession(data.token, data.user)
  }
  return data
}

export async function loginWithCredentials(email: string, password: string): Promise<AuthResponse> {
  return persistIfAuthenticated(await postJson('/auth/login', { email, password }))
}

export async function loginWithGoogleCredential(credential: string): Promise<AuthResponse> {
  return persistIfAuthenticated(await postJson('/auth/google', { credential }))
}

export async function registerUser(payload: {
  name: string
  email: string
  role?: UserRole
}): Promise<AuthResponse> {
  return postJson('/auth/register', payload, true)
}

export async function requestPasswordReset(
  email: string
): Promise<AuthResponse & { expires_in_minutes?: number }> {
  return postJson('/auth/forgot-password', { email })
}

export async function verifyPasswordResetToken(
  email: string,
  token: string
): Promise<{ success: boolean; message: string; email?: string; expires_at?: string; remaining_seconds?: number }> {
  try {
    const params = new URLSearchParams({ email, token })
    const res = await fetch(`${API_BASE_URL}/auth/verify-reset-token?${params.toString()}`)
    return await readJson(res)
  } catch {
    return { success: false, message: 'Não foi possível conectar ao servidor.' }
  }
}

export async function confirmPasswordReset(payload: {
  email: string
  token: string
  password: string
}): Promise<AuthResponse> {
  return postJson('/auth/reset-password', payload)
}

export async function fetchProfileDetails(): Promise<ProfileResponse | null> {
  const token = getStoredToken()
  if (!token) return null

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include',
      headers: authHeaders(false),
    })
    if (!res.ok) {
      if (res.status === 401) clearClientSession()
      return null
    }
    const data: ProfileResponse = await res.json()
    if (data?.success && data?.user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user))
    }
    return data
  } catch {
    return null
  }
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const token = getStoredToken()
  if (!token) return null

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include',
      headers: authHeaders(false),
    })
    if (!res.ok) {
      if (res.status === 401) clearClientSession()
      return null
    }
    const data = await res.json()
    if (data?.success && data?.user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user))
      return data.user as AuthUser
    }
    return null
  } catch {
    // Falha de rede: mantém o usuário em cache até a sessão expirar.
    return getStoredUser()
  }
}

export async function updateProfile(payload: {
  name: string
  avatar_url?: string | null
  current_password?: string
  new_password?: string
}): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'PUT',
      credentials: 'include',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    const data = await readJson<AuthResponse>(res)
    if (res.ok && data.success && data.user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user))
    }
    return data
  } catch {
    return { success: false, message: 'Não foi possível conectar ao servidor.' }
  }
}

export async function logoutUser(): Promise<void> {
  const token = getStoredToken()
  try {
    await Promise.allSettled([
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
      fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }),
    ])
  } finally {
    clearClientSession()
  }
}

