'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  loginWithCredentials,
  loginWithGoogleCredential,
  requestPasswordReset,
  type AuthResponse,
} from '@/lib/auth'
import { GoogleButton, isGoogleLoginEnabled } from './google-button'

/** Aceita apenas caminhos internos, evitando redirecionamento aberto. */
function safeRedirect(target: string | null): string {
  if (!target || !target.startsWith('/') || target.startsWith('//') || target.startsWith('/\\')) return '/'
  return target
}

type Mode = 'login' | 'forgot'

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const redirectTo = safeRedirect(params.get('redirect'))

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<string | null>(null)

  const expired = params.get('expired') === '1'

  const reset = (next: Mode) => {
    setMode(next)
    setError(null)
    setSuccess(null)
    setFieldErrors({})
  }

  const finish = (data: AuthResponse) => {
    if (data.success) {
      router.replace(redirectTo)
      router.refresh()
      return
    }
    setError(data.message || 'Não foi possível entrar.')
    setFieldErrors(data.errors ?? {})
    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setLoading(true)
    finish(await loginWithCredentials(email.trim(), password))
  }

  const handleGoogle = async (credential: string) => {
    setError(null)
    setLoading(true)
    finish(await loginWithGoogleCredential(credential))
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setFieldErrors({})
    setLoading(true)
    const data = await requestPasswordReset(email.trim())
    setLoading(false)
    if (data.success) setSuccess(data.message)
    else {
      setError(data.message)
      setFieldErrors(data.errors ?? {})
    }
  }

  if (mode === 'forgot') {
    return (
      <div className="mx-auto w-full max-w-[430px]">
        <button
          type="button"
          onClick={() => reset('login')}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden /> Voltar ao login
        </button>
        <h2 className="gold-rule text-2xl font-bold">Recuperar senha</h2>
        <p className="mt-3 mb-6 text-sm text-muted-foreground">
          Informe seu e-mail corporativo e enviaremos um link para definir uma nova senha.
        </p>

        <form onSubmit={handleForgot} className="space-y-4" noValidate>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="error">{error}</Alert>}
          <Field label="E-mail" htmlFor="forgot-email" error={fieldErrors.email}>
            <Input
              id="forgot-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!fieldErrors.email}
              placeholder="voce@empresa.com.br"
            />
          </Field>
          <Button type="submit" size="lg" className="w-full" disabled={loading || !email}>
            {loading ? <Spinner /> : <Mail />} Enviar link
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[430px]">
      <p className="eyebrow text-muted-foreground">Área restrita</p>
      <h2 className="gold-rule mt-2 text-3xl font-bold">Entrar</h2>
      <p className="mt-3 mb-7 text-sm text-muted-foreground">Use suas credenciais corporativas para acessar o painel.</p>

      <form onSubmit={handleLogin} className="space-y-4" noValidate>
        {expired && !error && <Alert variant="info">Sua sessão expirou. Entre novamente para continuar.</Alert>}
        {error && <Alert variant="error">{error}</Alert>}

        <Field label="E-mail" htmlFor="email" error={fieldErrors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            placeholder="voce@empresa.com.br"
          />
        </Field>

        <Field label="Senha" htmlFor="password" error={fieldErrors.password}>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              className="pr-11"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => reset('forgot')}
            className="text-sm font-medium text-navy-700 underline-offset-4 hover:underline"
          >
            Esqueci minha senha
          </button>
        </div>

        <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading || !email || !password}>
          {loading ? <Spinner /> : <Lock />} Entrar <ArrowRight className="ml-auto" />
        </Button>
      </form>

      {isGoogleLoginEnabled && (
        <>
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
          </div>
          <GoogleButton onCredential={handleGoogle} />
        </>
      )}
    </div>
  )
}