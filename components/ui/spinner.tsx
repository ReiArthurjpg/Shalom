import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('size-4 animate-spin', className)} aria-hidden />
}

/** Bloco de carregamento (skeleton) com a cor areia da marca. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-sand', className)} aria-hidden />
}

export function PageLoading({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div role="status" className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Spinner className="size-6 text-gold" />
      <span className="text-sm">{label}</span>
    </div>
  )
}