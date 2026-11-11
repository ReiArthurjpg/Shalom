'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { BedDouble, Car, ChevronRight, Download, Maximize2, Pencil, Plus, Search, ShowerHead, Trash2 } from 'lucide-react'

import { PageHeader } from '@/components/layout/page-header'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input, Select } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Skeleton, Spinner } from '@/components/ui/spinner'
import { getStoredUser } from '@/lib/auth'
import {
  FINALIDADE_LABELS,
  STATUS_LABELS,
  TIPO_LABELS,
  deleteImovel,
  fetchImoveis,
  type ImovelItem,
  type ImovelListResponse,
  type ImovelStatus,
} from '@/lib/imoveis-api'
import { cn, formatCurrencyBRL } from '@/lib/utils'
import { ImovelFormModal } from './imovel-form-modal'

const STATUS_STYLES: Record<ImovelStatus, string> = {
  disponivel: 'bg-success-soft text-success',
  reservado: 'bg-warning-soft text-warning',
  vendido: 'bg-navy-800 text-white',
  alugado: 'bg-navy-800 text-white',
}

const PER_PAGE = 12

export function ImoveisView() {
  const [data, setData] = useState<ImovelListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [tipo, setTipo] = useState('')
  const [finalidade, setFinalidade] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const [editing, setEditing] = useState<ImovelItem | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [toDelete, setToDelete] = useState<ImovelItem | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [canDelete, setCanDelete] = useState(false)

  useEffect(() => {
    const role = getStoredUser()?.role
    setCanDelete(role === 'admin' || role === 'gerente')
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search.trim())
      setPage(1)
    }, 350)
    return () => clearTimeout(t)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await fetchImoveis({ page, perPage: PER_PAGE, search: debounced, tipo, finalidade, status }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar imóveis.')
    } finally {
      setLoading(false)
    }
  }, [page, debounced, tipo, finalidade, status])

  useEffect(() => {
    load()
  }, [load])

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.perPage)) : 1

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await deleteImovel(toDelete.id)
      setToDelete(null)
      setNotice('Imóvel removido com sucesso.')
      await load()
    } catch (e) {
      setToDelete(null)
      setError(e instanceof Error ? e.message : 'Erro ao remover imóvel.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      {/* Breadcrumb Navegável */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-[#222D3A] font-semibold transition-colors cursor-pointer">
          Hub
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#222D3A] font-black">
          Imóveis
        </span>
      </nav>

      <PageHeader
        title="Imóveis"
        description="Cadastro e acompanhamento do portfólio."
        actions={
          <Button
            variant="gold"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus /> Novo imóvel
          </Button>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            aria-label="Buscar imóveis"
            placeholder="Buscar por título, bairro ou cidade"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select aria-label="Filtrar por tipo" value={tipo} onChange={(e) => { setTipo(e.target.value); setPage(1) }}>
          <option value="">Todos os tipos</option>
          {Object.entries(TIPO_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </Select>
        <Select aria-label="Filtrar por finalidade" value={finalidade} onChange={(e) => { setFinalidade(e.target.value); setPage(1) }}>
          <option value="">Venda e aluguel</option>
          {Object.entries(FINALIDADE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </Select>
        <Select aria-label="Filtrar por status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
          <option value="">Todos os status</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </Select>
      </div>

      {notice && <Alert variant="success" className="mb-4">{notice}</Alert>}
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      {loading && !data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56" />)}
        </div>
      ) : data && data.items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-input bg-white px-6 py-14 text-center">
          <p className="font-display text-lg font-bold">Nenhum imóvel encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {debounced || tipo || finalidade || status
              ? 'Ajuste os filtros para ver outros resultados.'
              : 'Cadastre o primeiro imóvel para começar.'}
          </p>
        </div>
      ) : (
        <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-3', loading && 'opacity-60 transition-opacity')}>
          {data?.items.map((item) => (
            <article key={item.id} className="cut-corner flex flex-col border border-border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="eyebrow text-muted-foreground">
                  {TIPO_LABELS[item.tipo]} • {FINALIDADE_LABELS[item.finalidade]}
                </span>
                <span className={cn('rounded px-2 py-0.5 text-[0.7rem] font-semibold', STATUS_STYLES[item.status])}>
                  {STATUS_LABELS[item.status]}
                </span>
              </div>
              <h3 className="mt-2 text-lg leading-snug font-bold">{item.titulo}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {[item.bairro, item.cidade, item.uf].filter(Boolean).join(' • ') || 'Localização não informada'}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/80">
                <span className="inline-flex items-center gap-1.5"><BedDouble className="size-4 text-muted-foreground" aria-hidden />{item.quartos}</span>
                <span className="inline-flex items-center gap-1.5"><ShowerHead className="size-4 text-muted-foreground" aria-hidden />{item.banheiros}</span>
                <span className="inline-flex items-center gap-1.5"><Car className="size-4 text-muted-foreground" aria-hidden />{item.vagas}</span>
                {item.areaM2 !== null && (
                  <span className="inline-flex items-center gap-1.5"><Maximize2 className="size-4 text-muted-foreground" aria-hidden />{item.areaM2} m²</span>
                )}
              </div>

              <div className="mt-auto flex items-end justify-between gap-2 border-t border-border pt-4">
                <div className="font-display text-xl font-extrabold">{formatCurrencyBRL(item.preco)}</div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm" aria-label={`Editar ${item.titulo}`} onClick={() => { setEditing(item); setFormOpen(true) }}>
                    <Pencil />
                  </Button>
                  {canDelete && (
                    <Button variant="ghost" size="icon-sm" aria-label={`Remover ${item.titulo}`} className="text-destructive hover:bg-danger-soft" onClick={() => setToDelete(item)}>
                      <Trash2 />
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {data && data.total > data.perPage && (
        <nav aria-label="Paginação" className="mt-6 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Página {page} de {totalPages} • {data.total} imóveis</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Próxima</Button>
          </div>
        </nav>
      )}

      <ImovelFormModal
        open={formOpen}
        imovel={editing}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false)
          setNotice(editing ? 'Imóvel atualizado com sucesso.' : 'Imóvel cadastrado com sucesso.')
          load()
        }}
      />

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Remover imóvel" className="sm:max-w-md">
        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja remover <strong className="text-foreground">{toDelete?.titulo}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setToDelete(null)}>Cancelar</Button>
          <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
            {deleting && <Spinner />} Remover
          </Button>
        </div>
      </Modal>
    </>
  )
}

