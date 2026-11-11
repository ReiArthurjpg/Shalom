import { cn } from '@/lib/utils'
import type { AuthUser } from '@/lib/auth'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export function UserAvatar({ user, className }: { user: Pick<AuthUser, 'name' | 'avatar_url'> | null; className?: string }) {
  const name = user?.name ?? ''
  return user?.avatar_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.avatar_url}
      alt={name}
      referrerPolicy="no-referrer"
      className={cn('size-9 rounded-full object-cover ring-2 ring-gold/70', className)}
    />
  ) : (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-full bg-navy-800 font-display text-xs font-bold text-gold ring-2 ring-gold/70',
        className
      )}
    >
      {initials(name)}
    </span>
  )
}