'use client'

import { clearClientSession, getStoredToken } from './auth'

const IMOVEIS_API_URL = process.env.NEXT_PUBLIC_IMOVEIS_API_URL || 'http://localhost:8021/api/v1'

export class ImoveisApiError extends Error {
  public readonly status: number
  public readonly code: string
  public readonly errors: Record<string, string>

  constructor(message: string, status = 400, code = 'API_ERROR', errors: Record<string, string> = {}) {
    super(message)
    this.name = 'ImoveisApiError'
    this.status = status
    this.code = code
    this.errors = errors
  }
}

export type ImovelTipo = 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'rural'
export type ImovelFinalidade = 'venda' | 'aluguel'
export type ImovelStatus = 'disponivel' | 'reservado' | 'vendido' | 'alugado'

export const TIPO_LABELS: Record<ImovelTipo, string> = {
  casa: 'Casa',
  apartamento: 'Apartamento',
  terreno: 'Terreno',
  comercial: 'Comercial',
  rural: 'Rural',
}
export const FINALIDADE_LABELS: Record<ImovelFinalidade, string> = { venda: 'Venda', aluguel: 'Aluguel' }
export const STATUS_LABELS: Record<ImovelStatus, string> = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  vendido: 'Vendido',
  alugado: 'Alugado',
}

export interface ImovelItem {
  id: number
  titulo: string
  tipo: ImovelTipo
  finalidade: ImovelFinalidade
  status: ImovelStatus
  preco: number
  cidade: string | null
  bairro: string | null
  uf: string | null
  quartos: number
  banheiros: number
  vagas: number
  areaM2: number | null
  descricao: string | null
  createdAt: string
  updatedAt: string
}

export type ImovelInput = Omit<ImovelItem, 'id' | 'createdAt' | 'updatedAt' | 'areaM2'> & {
  area_m2: number | null
}

export interface ImovelStats {
  total: number
  disponiveis: number
  concluidos: number
}

export interface ImovelListResponse {
  page: number
  perPage: number
  total: number
  stats: ImovelStats
  items: ImovelItem[]
}

export interface ImovelListParams {
  page?: number
  perPage?: number
  search?: string
  tipo?: string
  finalidade?: string
  status?: string
  sort?: string
  dir?: 'asc' | 'desc'
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getStoredToken()
  let res: Response
  try {
    res = await fetch(`${IMOVEIS_API_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    })
  } catch {
    throw new ImoveisApiError('Não foi possível conectar à API de imóveis.', 0, 'NETWORK_ERROR')
  }

  let data: any = null
  try {
    data = await res.json()
  } catch {
    // corpo vazio ou inválido
  }

  if (!res.ok || data?.success === false) {
    if (res.status === 401) clearClientSession()
    throw new ImoveisApiError(
      data?.message || 'Erro ao processar a requisição.',
      res.status,
      data?.code || 'API_ERROR',
      data?.errors || {}
    )
  }
  return data as T
}

export function fetchImoveis(params: ImovelListParams = {}): Promise<ImovelListResponse> {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) qs.set(k, String(v))
  })
  return request<ImovelListResponse>(`/imoveis?${qs.toString()}`)
}

export async function createImovel(input: ImovelInput): Promise<ImovelItem> {
  const data = await request<{ item: ImovelItem }>('/imoveis', { method: 'POST', body: JSON.stringify(input) })
  return data.item
}

export async function updateImovel(id: number, input: ImovelInput): Promise<ImovelItem> {
  const data = await request<{ item: ImovelItem }>(`/imoveis/${id}`, { method: 'PUT', body: JSON.stringify(input) })
  return data.item
}

export async function deleteImovel(id: number): Promise<void> {
  await request(`/imoveis/${id}`, { method: 'DELETE' })
}

