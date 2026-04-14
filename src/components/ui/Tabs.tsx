'use client'

import React, { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

interface TabsContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextType>({ activeTab: '', setActiveTab: () => {} })

interface TabsProps {
  defaultTab: string
  children: React.ReactNode
  className?: string
  onChange?: (tab: string) => void
}

export function Tabs({ defaultTab, children, className, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleChange = (tab: string) => {
    setActiveTab(tab)
    onChange?.(tab)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabListProps {
  children: React.ReactNode
  className?: string
  variant?: 'underline' | 'pills'
}

export function TabList({ children, className, variant = 'underline' }: TabListProps) {
  return (
    <div
      className={cn(
        'flex',
        variant === 'underline' && 'border-b border-slate-200 gap-0',
        variant === 'pills' && 'gap-1 bg-slate-100 p-1 rounded-lg',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface TabProps {
  value: string
  children: React.ReactNode
  className?: string
  variant?: 'underline' | 'pills'
  disabled?: boolean
}

export function Tab({ value, children, className, variant = 'underline', disabled }: TabProps) {
  const { activeTab, setActiveTab } = useContext(TabsContext)
  const isActive = activeTab === value

  return (
    <button
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(
        'text-sm font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed',
        variant === 'underline' && [
          'px-4 py-2.5 border-b-2 -mb-px',
          isActive
            ? 'border-primary-600 text-primary-700'
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
        ],
        variant === 'pills' && [
          'px-3 py-1.5 rounded-md',
          isActive
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900',
        ],
        className,
      )}
    >
      {children}
    </button>
  )
}

interface TabPanelProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const { activeTab } = useContext(TabsContext)
  if (activeTab !== value) return null
  return <div className={className}>{children}</div>
}
