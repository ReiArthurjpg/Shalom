import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

import { cn } from '@/lib/utils'

const styles = {
  success: { box: 'border-success/30 bg-success-soft text-success', Icon: CheckCircle2 },
  error: { box: 'border-destructive/30 bg-danger-soft text-destructive', Icon: AlertCircle },
  info: { box: 'border-gold/60 bg-gold-soft text-navy-800', Icon: Info },
} as const

/** Mensagens de sucesso, erro e informação. */
export function Alert({
  variant = 'info',
  className,
  children,
}: {
  variant?: keyof typeof styles
  className?: string
  children: React.ReactNode
}) {
  const { box, Icon } = styles[variant]
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn('flex items-start gap-2.5 rounded-md border px-3.5 py-3 text-sm font-medium', box, className)}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}