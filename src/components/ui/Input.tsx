import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightElement?: React.ReactNode
  required?: boolean
}

export default function Input({
  label,
  error,
  hint,
  leftIcon,
  rightElement,
  required,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.replace(/\s/g, '-').toLowerCase()

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full border rounded-md text-sm text-slate-900 placeholder:text-slate-400 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
            error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-slate-300',
            leftIcon ? 'pl-9' : 'px-3',
            rightElement ? 'pr-10' : 'px-3',
            'py-2',
            className,
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
