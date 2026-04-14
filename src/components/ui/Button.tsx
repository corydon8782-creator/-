'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900 border border-primary-700 shadow-sm',
  secondary:
    'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 border border-slate-200',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 border border-transparent',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-red-600 shadow-sm',
  outline:
    'bg-white text-primary-700 hover:bg-primary-50 active:bg-primary-100 border border-primary-300',
}

const sizeStyles: Record<Size, string> = {
  xs: 'px-2.5 py-1 text-xs gap-1 rounded',
  sm: 'px-3 py-1.5 text-sm gap-1.5 rounded',
  md: 'px-4 py-2 text-sm gap-2 rounded-md',
  lg: 'px-5 py-2.5 text-base gap-2 rounded-md',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />
      ) : (
        iconPosition === 'left' && icon
      )}
      {children}
      {!loading && iconPosition === 'right' && icon}
    </button>
  )
}
