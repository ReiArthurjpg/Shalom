'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CheckCircle2, ChevronRight, XCircle } from 'lucide-react'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PageLoading, Spinner } from '@/components/ui/spinner'
import { PageHeader } from '@/components/layout/page-header'
import { UserAvatar } from '@/components/layout/user-avatar'
import {
  ROLE_LABELS,
  fetchProfileDetails,
  updateProfile,
  type ActiveSession,
  type AuthUser,
  type LoginAttemptItem,
} from '@/lib/auth'
import { NewUserCard } from './new-user-card'

function formatDate(value?: string | null): string {
  if (!value) return '—'
  const d = new Date(value.replace(' ', 'T'))
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export function ProfileView() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [sessions, setSessions] = useState<ActiveSession[]>([])
  const [attempts, setAttempts] = useState<LoginAttemptItem[]>([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchProfileDetails().then((res) => {
      if (res?.user) {
        setUser(res.user)
        setName(res.user.name)
        setAvatarUrl(res.user.avatar_url ?? '')
        setSessions(res.sessions ?? [])
        setAttempts(res.recent_attempts ?? [])
      } else {
        setError('Não foi possível carregar seu perfil.')
      }
      setLoading(false)
    })
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)
    setFieldErrors({})

    const res = await updateProfile({
      name,
      avatar_url: avatarUrl || null,
      ...(newPassword ? { current_password: currentPassword, new_password: newPassword } : {}),
    })
    setSaving(false)

    if (res.success && res.user) {
      setUser((u) => (u ? { ...u, ...res.user } : res.user!))
      setCurrentPassword('')
      setNewPassword('')
      setSuccess(res.message)
    } else {
      setError(res.message)
      setFieldErrors(res.errors ?? {})
    }
  }

  if (loading) return <PageLoading label="Carregando perfil…" />

  return (
    <>
      {/* Breadcrumb Navegável */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-[#222D3A] font-semibold transition-colors cursor-pointer">
          Hub
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#222D3A] font-black">
          Meu perfil
        </span>
      </nav>

      <PageHeader title="Meu perfil" description="Seus dados, senha e sessões ativas." />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <form onSubmit={save} className="space-y-5 rounded-lg border border-border bg-white p-5 shadow-sm sm:p-7" noValidate>
          <div className="flex items-center gap-4">
            <UserAvatar user={user ? { ...user, name, avatar_url: avatarUrl || null } : null} className="size-14 text-base" />
            <div>
              <div className="font-display text-lg font-bold">{user?.name}</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
              {user && (
                <span className="mt-1 inline-block rounded bg-gold-soft px-2 py-0.5 text-[0.7rem] font-semibold text-navy-800">
                  {ROLE_LABELS[user.role]}
                </span>
              )}
            </div>
          </div>

          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="error">{error}</Alert>}

          <Field label="Nome completo" htmlFor="profile-name" error={fieldErrors.name}>
            <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!fieldErrors.name} required />
          </Field>
          <Field label="URL da foto (https)" htmlFor="profile-avatar" error={fieldErrors.avatar_url}>
            <Input id="profile-avatar" type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://" />
          </Field>

          <fieldset className="space-y-4 border-t border-border pt-5">
            <legend className="eyebrow -mt-8 bg-white pr-3 text-muted-foreground">Alterar senha</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Senha atual" htmlFor="current-password" error={fieldErrors.current_password}>
                <Input id="current-password" type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </Field>
              <Field label="Nova senha" htmlFor="profile-new-password" error={fieldErrors.new_password} hint="Mínimo de 8 caracteres.">
                <Input id="profile-new-password" type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </Field>
            </div>
          </fieldset>

          <Button type="submit" variant="gold" disabled={saving}>
            {saving && <Spinner />} Salvar alterações
          </Button>
        </form>

        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <h2 className="gold-rule text-base font-bold">Sessões ativas</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {sessions.map((s) => (
                <li key={s.id} className="rounded-md bg-sand px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{s.ip_address}</span>
                    {Boolean(Number(s.is_current)) && (
                      <span className="rounded bg-success-soft px-1.5 py-0.5 text-[0.65rem] font-semibold text-success">Atual</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Iniciada em {formatDate(s.created_at)}</div>
                </li>
              ))}
              {sessions.length === 0 && <li className="text-muted-foreground">Nenhuma sessão.</li>}
            </ul>
          </section>

          <section className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <h2 className="gold-rule text-base font-bold">Acessos recentes</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {attempts.map((a, i) => (
                <li key={i} className="flex items-center gap-2">
                  {Number(a.success) ? (
                    <CheckCircle2 className="size-4 shrink-0 text-success" aria-label="Sucesso" />
                  ) : (
                    <XCircle className="size-4 shrink-0 text-destructive" aria-label="Falha" />
                  )}
                  <span className="text-muted-foreground">{formatDate(a.attempted_at)}</span>
                  <span className="ml-auto text-xs">{a.ip_address}</span>
                </li>
              ))}
              {attempts.length === 0 && <li className="text-muted-foreground">Sem registros.</li>}
            </ul>
          </section>
        </div>
      </div>

      {user?.role === 'admin' && <NewUserCard />}
    </>
  )
}

