import React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'

const variantStyles: Record<Variant, string> = {
  default: 'bg-slate-100 text-slate-600',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
}

interface BadgeProps {
  variant?: Variant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

export default function Badge({ variant = 'default', children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      )}
      {children}
    </span>
  )
}
