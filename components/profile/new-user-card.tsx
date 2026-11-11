'use client'

import { useState } from 'react'
import { UserPlus } from 'lucide-react'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input, Select } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { ROLE_LABELS, registerUser, type UserRole } from '@/lib/auth'

/** Cadastro de novos usuários (somente administradores). O usuário define a senha por e-mail. */
export function NewUserCard() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('corretor')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    setFieldErrors({})
    const res = await registerUser({ name, email, role })
    setLoading(false)
    if (res.success) {
      setSuccess(res.message)
      setName('')
      setEmail('')
      setRole('corretor')
    } else {
      setError(res.message)
      setFieldErrors(res.errors ?? {})
    }
  }

  return (
    <section className="mt-6 rounded-lg border border-border bg-white p-5 shadow-sm sm:p-7">
      <h2 className="gold-rule text-lg font-bold">Novo usuário</h2>
      <p className="mt-3 mb-5 text-sm text-muted-foreground">
        O novo usuário recebe um e-mail com o link para definir a própria senha.
      </p>
      <form onSubmit={submit} className="space-y-4" noValidate>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="error">{error}</Alert>}
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Nome completo" htmlFor="new-user-name" error={fieldErrors.name}>
            <Input id="new-user-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="E-mail" htmlFor="new-user-email" error={fieldErrors.email}>
            <Input id="new-user-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Perfil" htmlFor="new-user-role" error={fieldErrors.role}>
            <Select id="new-user-role" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              {Object.entries(ROLE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Button type="submit" disabled={loading || !name || !email}>
          {loading ? <Spinner /> : <UserPlus />} Cadastrar usuário
        </Button>
      </form>
    </section>
  )
}

