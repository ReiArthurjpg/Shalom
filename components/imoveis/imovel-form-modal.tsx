'use client'

import { useEffect, useState } from 'react'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input, Select, Textarea } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Spinner } from '@/components/ui/spinner'
import {
  FINALIDADE_LABELS,
  ImoveisApiError,
  STATUS_LABELS,
  TIPO_LABELS,
  createImovel,
  updateImovel,
  type ImovelInput,
  type ImovelItem,
} from '@/lib/imoveis-api'

const EMPTY: ImovelInput = {
  titulo: '',
  tipo: 'casa',
  finalidade: 'venda',
  status: 'disponivel',
  preco: 0,
  cidade: '',
  bairro: '',
  uf: '',
  quartos: 0,
  banheiros: 0,
  vagas: 0,
  area_m2: null,
  descricao: '',
}

function toInput(item: ImovelItem): ImovelInput {
  const { id, createdAt, updatedAt, areaM2, ...rest } = item
  void id
  void createdAt
  void updatedAt
  return { ...rest, area_m2: areaM2 }
}

/** Modal de cadastro/edição. Recebe `imovel` para editar ou null para criar. */
export function ImovelFormModal({
  open,
  imovel,
  onClose,
  onSaved,
}: {
  open: boolean
  imovel: ImovelItem | null
  onClose: () => void
  onSaved: (item: ImovelItem) => void
}) {
  const [form, setForm] = useState<ImovelInput>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      setForm(imovel ? toInput(imovel) : EMPTY)
      setError(null)
      setFieldErrors({})
    }
  }, [open, imovel])

  const set = <K extends keyof ImovelInput>(key: K, value: ImovelInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const num = (v: string) => (v === '' ? 0 : Number(v))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setFieldErrors({})
    try {
      const saved = imovel ? await updateImovel(imovel.id, form) : await createImovel(form)
      onSaved(saved)
    } catch (err) {
      if (err instanceof ImoveisApiError) {
        setError(err.message)
        setFieldErrors(err.errors)
      } else {
        setError('Erro inesperado ao salvar.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={imovel ? 'Editar imóvel' : 'Novo imóvel'}
      description="Preencha os dados do imóvel."
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && <Alert variant="error">{error}</Alert>}

        <Field label="Título" htmlFor="titulo" error={fieldErrors.titulo}>
          <Input id="titulo" value={form.titulo} onChange={(e) => set('titulo', e.target.value)} aria-invalid={!!fieldErrors.titulo} required />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Tipo" htmlFor="tipo" error={fieldErrors.tipo}>
            <Select id="tipo" value={form.tipo} onChange={(e) => set('tipo', e.target.value as ImovelInput['tipo'])}>
              {Object.entries(TIPO_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </Select>
          </Field>
          <Field label="Finalidade" htmlFor="finalidade" error={fieldErrors.finalidade}>
            <Select id="finalidade" value={form.finalidade} onChange={(e) => set('finalidade', e.target.value as ImovelInput['finalidade'])}>
              {Object.entries(FINALIDADE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </Select>
          </Field>
          <Field label="Status" htmlFor="status" error={fieldErrors.status}>
            <Select id="status" value={form.status} onChange={(e) => set('status', e.target.value as ImovelInput['status'])}>
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Preço (R$)" htmlFor="preco" error={fieldErrors.preco}>
            <Input id="preco" type="number" min={0} step="0.01" inputMode="decimal" value={form.preco} onChange={(e) => set('preco', num(e.target.value))} aria-invalid={!!fieldErrors.preco} />
          </Field>
          <Field label="Área (m²)" htmlFor="area" error={fieldErrors.area_m2}>
            <Input id="area" type="number" min={0} step="0.01" inputMode="decimal" value={form.area_m2 ?? ''} onChange={(e) => set('area_m2', e.target.value === '' ? null : Number(e.target.value))} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Quartos" htmlFor="quartos" error={fieldErrors.quartos}>
            <Input id="quartos" type="number" min={0} value={form.quartos} onChange={(e) => set('quartos', num(e.target.value))} />
          </Field>
          <Field label="Banheiros" htmlFor="banheiros" error={fieldErrors.banheiros}>
            <Input id="banheiros" type="number" min={0} value={form.banheiros} onChange={(e) => set('banheiros', num(e.target.value))} />
          </Field>
          <Field label="Vagas" htmlFor="vagas" error={fieldErrors.vagas}>
            <Input id="vagas" type="number" min={0} value={form.vagas} onChange={(e) => set('vagas', num(e.target.value))} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_5rem]">
          <Field label="Bairro" htmlFor="bairro">
            <Input id="bairro" value={form.bairro ?? ''} onChange={(e) => set('bairro', e.target.value)} />
          </Field>
          <Field label="Cidade" htmlFor="cidade">
            <Input id="cidade" value={form.cidade ?? ''} onChange={(e) => set('cidade', e.target.value)} />
          </Field>
          <Field label="UF" htmlFor="uf" error={fieldErrors.uf}>
            <Input id="uf" maxLength={2} value={form.uf ?? ''} onChange={(e) => set('uf', e.target.value.toUpperCase())} />
          </Field>
        </div>

        <Field label="Descrição" htmlFor="descricao">
          <Textarea id="descricao" value={form.descricao ?? ''} onChange={(e) => set('descricao', e.target.value)} />
        </Field>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="gold" disabled={saving}>
            {saving && <Spinner />} {imovel ? 'Salvar alterações' : 'Cadastrar imóvel'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

