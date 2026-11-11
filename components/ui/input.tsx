import * as React from 'react'

import { cn } from '@/lib/utils'

export const inputClasses =
  'flex h-11 w-full rounded-md border border-input bg-white px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors outline-none focus-visible:border-gold focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20'

function Input({ className, type = 'text', ...props }: React.ComponentProps<'input'>) {
  return <input type={type} data-slot="input" className={cn(inputClasses, className)} {...props} />
}

function Select({ className, children, ...props }: React.ComponentProps<'select'>) {
  return (
    <select data-slot="select" className={cn(inputClasses, 'pr-8', className)} {...props}>
      {children}
    </select>
  )
}

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(inputClasses, 'h-auto min-h-24 py-2.5', className)}
      {...props}
    />
  )
}

export { Input, Select, Textarea }