'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { DocumentSection } from '@/lib/types'
import {
  GripVertical,
  Eye,
  EyeOff,
  Lock,
  ChevronRight,
} from 'lucide-react'

interface SectionListProps {
  sections: DocumentSection[]
  activeId: string | null
  onSelect: (id: string) => void
  onToggleVisible: (id: string) => void
}

const SECTION_ICONS: Record<string, string> = {
  title: '📄',
  overview: '📋',
  scope: '🔍',
  organization: '👥',
  material: '📦',
  test_plan: '🧪',
  work_quality: '⚙️',
  test_items: '📊',
  attachment: '📎',
  approval: '✅',
  text: '📝',
  table: '📊',
  heading: '📌',
}

export default function SectionList({
  sections,
  activeId,
  onSelect,
  onToggleVisible,
}: SectionListProps) {
  return (
    <div className="space-y-0.5">
      {sections.map((section) => {
        const isActive = activeId === section.id
        return (
          <div
            key={section.id}
            className={cn(
              'group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer select-none transition-colors',
              isActive
                ? 'bg-primary-100 text-primary-800'
                : 'hover:bg-slate-100 text-slate-700',
              !section.isVisible && 'opacity-50',
            )}
            onClick={() => onSelect(section.id)}
          >
            <div className="text-slate-400 group-hover:text-slate-500 cursor-grab flex-shrink-0">
              <GripVertical size={14} />
            </div>
            <span className="text-sm flex-shrink-0">
              {SECTION_ICONS[section.type] ?? '📝'}
            </span>
            <span className={cn(
              'text-xs flex-1 min-w-0 truncate font-medium',
              isActive ? 'text-primary-800' : 'text-slate-700',
            )}>
              {section.title}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {section.isLocked ? (
                <Lock size={12} className="text-slate-400" />
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleVisible(section.id)
                  }}
                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                >
                  {section.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
              )}
            </div>
            {isActive && <ChevronRight size={12} className="text-primary-600 flex-shrink-0" />}
          </div>
        )
      })}
    </div>
  )
}
