import React from 'react'
import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const sizeMap = {
  xs: 'w-4 h-4 border-2',
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
}

export default function Spinner({ size = 'md', className, label }: SpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'rounded-full border-primary-200 border-t-primary-600 animate-spin',
          sizeMap[size],
        )}
      />
      {label && <p className="text-sm text-slate-500">{label}</p>}
    </div>
  )
}
