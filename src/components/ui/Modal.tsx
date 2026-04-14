'use client'

import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  footer?: React.ReactNode
  hideClose?: boolean
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl',
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  footer,
  hideClose,
}: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 w-full mx-4 bg-white rounded-lg shadow-xl flex flex-col max-h-[90vh]',
          sizeClasses[size],
        )}
      >
        {(title || !hideClose) && (
          <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
            <div>
              {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
              {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
            </div>
            {!hideClose && (
              <button
                onClick={onClose}
                className="ml-4 p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
