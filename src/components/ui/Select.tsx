import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
  required?: boolean
}

export default function Select({
  label,
  error,
  hint,
  options,
  placeholder,
  required,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.replace(/\s/g, '-').toLowerCase()

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            'w-full appearance-none border rounded-md text-sm text-slate-900 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-slate-50 disabled:cursor-not-allowed',
            error ? 'border-red-400' : 'border-slate-300',
            'px-3 py-2 pr-9',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
