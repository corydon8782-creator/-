import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string, fmt = 'yyyy.MM.dd') {
  try {
    return format(parseISO(dateStr), fmt, { locale: ko })
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr: string) {
  return formatDate(dateStr, 'yyyy.MM.dd HH:mm')
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatNumber(n: number | string): string {
  const num = typeof n === 'string' ? parseInt(n.replace(/,/g, ''), 10) : n
  if (isNaN(num)) return String(n)
  return num.toLocaleString('ko-KR')
}
