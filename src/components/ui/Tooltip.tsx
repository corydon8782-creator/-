'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export default function Tooltip({ content, children, position = 'top', className }: TooltipProps) {
  const [show, setShow] = useState(false)

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  }

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={cn(
            'absolute z-50 px-2 py-1 text-xs text-white bg-slate-800 rounded whitespace-nowrap pointer-events-none',
            positionStyles[position],
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
