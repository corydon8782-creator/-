import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercent?: boolean
  color?: 'blue' | 'green' | 'amber' | 'red'
  size?: 'sm' | 'md'
  className?: string
}

const colorMap = {
  blue: 'bg-primary-600',
  green: 'bg-green-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
  color = 'blue',
  size = 'md',
  className,
}: ProgressBarProps) {
  const pct = Math.round((value / max) * 100)

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-xs text-slate-600">{label}</span>}
          {showPercent && <span className="text-xs font-medium text-slate-700">{pct}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-slate-200 rounded-full overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2')}>
        <div
          className={cn('h-full rounded-full transition-all duration-300', colorMap[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
