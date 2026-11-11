'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'

import { Logo } from '@/components/brand/logo'
import { Alert } from '@/components/ui/alert'
import { Button, buttonVariants } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PageLoading, Spinner } from '@/components/ui/spinner'
import { confirmPasswordReset, verifyPasswordResetToken } from '@/lib/auth'
import { cn } from '@/lib/utils'

type State = 'checking' | 'invalid' | 'ready' | 'done'

export function ResetPasswordView() {
  const params = useSearchParams()
  const email = params.get('email') ?? ''
  const token = params.get('token') ?? ''

  const [state, setState] = useState<State>('checking')
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!email || !token) {
      setMessage('Link de redefinição inválido ou incompleto.')
      setState('invalid')
      return
    }
    verifyPasswordResetToken(email, token).then((res) => {
      if (res.success) setState('ready')
      else {
        setMessage(res.message)
        setState('invalid')
      }
    })
  }, [email, token])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8) return setError('A senha deve ter pelo menos 8 caracteres.')
    if (password !== confirm) return setError('As senhas não coincidem.')

    setSubmitting(true)
    const res = await confirmPasswordReset({ email, token, password })
    setSubmitting(false)
    if (res.success) setState('done')
    else setError(res.message)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-border border-t-4 border-t-gold bg-white p-7 shadow-sm sm:p-9">
        <Logo className="mx-auto mb-6 w-28" priority />

        {state === 'checking' && <PageLoading label="Validando link…" />}

        {state === 'invalid' && (
          <div className="space-y-5 text-center">
            <Alert variant="error">{message}</Alert>
            <Link href="/login" className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
              Voltar ao login
            </Link>
          </div>
        )}

        {state === 'ready' && (
          <form onSubmit={submit} className="space-y-4" noValidate>
            <h1 className="gold-rule text-2xl font-bold">Definir nova senha</h1>
            <p className="pt-1 text-sm text-muted-foreground">
              Conta: <strong className="text-foreground">{email}</strong>
            </p>
            {error && <Alert variant="error">{error}</Alert>}
            <Field label="Nova senha" htmlFor="new-password" hint="Mínimo de 8 caracteres.">
              <Input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Field>
            <Field label="Confirmar senha" htmlFor="confirm-password">
              <Input id="confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </Field>
            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
              {submitting && <Spinner />} Salvar nova senha
            </Button>
          </form>
        )}

        {state === 'done' && (
          <div className="space-y-5 text-center">
            <CheckCircle2 className="mx-auto size-12 text-success" aria-hidden />
            <h1 className="text-xl font-bold">Senha atualizada</h1>
            <p className="text-sm text-muted-foreground">Sua senha foi redefinida. Você já pode entrar.</p>
            <Link href="/login" className={cn(buttonVariants({ variant: 'gold', size: 'lg' }), 'w-full')}>
              Ir para o login
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}