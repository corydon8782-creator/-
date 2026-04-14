'use client'

import React, { useState } from 'react'
import { TestItem } from '@/lib/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import {
  Plus,
  Trash2,
  Copy,
  GripVertical,
  Sparkles,
  Edit3,
  Check,
  X,
} from 'lucide-react'

interface TestItemsTableProps {
  items: TestItem[]
  onChange: (items: TestItem[]) => void
}

const EMPTY_ITEM: Omit<TestItem, 'id'> = {
  workType: '',
  itemName: '',
  testMethod: '',
  frequency: '',
  standard: '',
  remark: '',
  isRequired: false,
  isAiGenerated: false,
  isModified: false,
}

function EditableCell({
  value,
  onChange,
  className,
  multiline,
}: {
  value: string
  onChange: (v: string) => void
  className?: string
  multiline?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const commit = () => {
    onChange(draft)
    setEditing(false)
  }

  if (!editing) {
    return (
      <div
        className={cn(
          'group relative px-2.5 py-1.5 min-h-[32px] cursor-text hover:bg-primary-50 rounded',
          !value && 'text-slate-300 italic',
          className,
        )}
        onClick={() => { setDraft(value); setEditing(true) }}
      >
        {value || '클릭하여 입력'}
        <Edit3 size={10} className="absolute top-1 right-1 text-slate-300 opacity-0 group-hover:opacity-100" />
      </div>
    )
  }

  return multiline ? (
    <textarea
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      className="w-full px-2.5 py-1.5 text-sm border border-primary-400 rounded focus:outline-none resize-none"
      rows={3}
    />
  ) : (
    <input
      autoFocus
      type="text"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
      className="w-full px-2.5 py-1.5 text-sm border border-primary-400 rounded focus:outline-none"
    />
  )
}

export default function TestItemsTable({ items, onChange }: TestItemsTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const updateItem = (id: string, field: keyof TestItem, value: string | boolean) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value, isModified: true } : item,
      ),
    )
  }

  const addItem = (afterId?: string) => {
    const newItem: TestItem = {
      ...EMPTY_ITEM,
      id: Math.random().toString(36).slice(2),
    }
    if (!afterId) {
      onChange([...items, newItem])
    } else {
      const idx = items.findIndex((i) => i.id === afterId)
      const next = [...items]
      next.splice(idx + 1, 0, newItem)
      onChange(next)
    }
  }

  const copyItem = (id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    const copy: TestItem = { ...item, id: Math.random().toString(36).slice(2), isAiGenerated: false }
    const idx = items.findIndex((i) => i.id === id)
    const next = [...items]
    next.splice(idx + 1, 0, copy)
    onChange(next)
  }

  const removeItem = (id: string) => {
    onChange(items.filter((i) => i.id !== id))
    setSelected((s) => { const n = new Set(s); n.delete(id); return n })
  }

  const removeSelected = () => {
    onChange(items.filter((i) => !selected.has(i.id)))
    setSelected(new Set())
  }

  const toggleSelect = (id: string) => {
    setSelected((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  const toggleAll = () => {
    if (selected.size === items.length) setSelected(new Set())
    else setSelected(new Set(items.map((i) => i.id)))
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button variant="primary" size="xs" icon={<Plus size={13} />} onClick={() => addItem()}>
            행 추가
          </Button>
          {selected.size > 0 && (
            <Button
              variant="danger"
              size="xs"
              icon={<Trash2 size={13} />}
              onClick={removeSelected}
            >
              선택 삭제 ({selected.size}행)
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Badge variant="info">{items.length}개 항목</Badge>
          <span className="flex items-center gap-1">
            <Sparkles size={11} className="text-blue-400" />
            AI 추출
          </span>
          <span className="w-2 h-2 rounded-sm bg-amber-200 border border-amber-400 inline-block" />
          사용자 수정
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-100">
              <th className="w-8 border-b border-r border-slate-300 p-2 text-center">
                <input
                  type="checkbox"
                  checked={selected.size === items.length && items.length > 0}
                  onChange={toggleAll}
                  className="w-3 h-3"
                />
              </th>
              <th className="w-6 border-b border-r border-slate-300 p-2" />
              <th className="border-b border-r border-slate-300 p-2 text-left font-semibold text-slate-700 min-w-[90px]">공종</th>
              <th className="border-b border-r border-slate-300 p-2 text-left font-semibold text-slate-700 min-w-[140px]">시험 항목</th>
              <th className="border-b border-r border-slate-300 p-2 text-left font-semibold text-slate-700 min-w-[150px]">시험 방법</th>
              <th className="border-b border-r border-slate-300 p-2 text-left font-semibold text-slate-700 min-w-[130px]">시험 빈도</th>
              <th className="border-b border-r border-slate-300 p-2 text-left font-semibold text-slate-700 min-w-[150px]">합격 기준</th>
              <th className="border-b border-r border-slate-300 p-2 text-left font-semibold text-slate-700 min-w-[80px]">비고</th>
              <th className="border-b border-slate-300 p-2 text-center font-semibold text-slate-700 w-20">작업</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                className={cn(
                  'border-b border-slate-200 align-top group',
                  item.isModified && 'bg-amber-50',
                  item.isAiGenerated && !item.isModified && 'bg-blue-50/30',
                  selected.has(item.id) && 'bg-primary-50',
                )}
              >
                <td className="border-r border-slate-200 p-2 text-center align-middle">
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-3 h-3"
                  />
                </td>
                <td className="border-r border-slate-200 p-2 text-center align-middle text-slate-300 cursor-grab">
                  <GripVertical size={13} />
                </td>
                <td className="border-r border-slate-200 align-top">
                  <EditableCell
                    value={item.workType}
                    onChange={(v) => updateItem(item.id, 'workType', v)}
                  />
                </td>
                <td className="border-r border-slate-200 align-top">
                  <EditableCell
                    value={item.itemName}
                    onChange={(v) => updateItem(item.id, 'itemName', v)}
                  />
                </td>
                <td className="border-r border-slate-200 align-top">
                  <EditableCell
                    value={item.testMethod}
                    onChange={(v) => updateItem(item.id, 'testMethod', v)}
                    multiline
                  />
                </td>
                <td className="border-r border-slate-200 align-top">
                  <EditableCell
                    value={item.frequency}
                    onChange={(v) => updateItem(item.id, 'frequency', v)}
                    multiline
                  />
                </td>
                <td className="border-r border-slate-200 align-top">
                  <EditableCell
                    value={item.standard}
                    onChange={(v) => updateItem(item.id, 'standard', v)}
                    multiline
                  />
                </td>
                <td className="border-r border-slate-200 align-top">
                  <EditableCell
                    value={item.remark}
                    onChange={(v) => updateItem(item.id, 'remark', v)}
                  />
                </td>
                <td className="p-1 align-middle">
                  <div className="flex items-center justify-center gap-0.5">
                    {item.isAiGenerated && (
                      <span title="AI 추출 항목">
                        <Sparkles size={11} className="text-blue-400" />
                      </span>
                    )}
                    <button
                      onClick={() => copyItem(item.id)}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      title="복사"
                    >
                      <Copy size={12} />
                    </button>
                    <button
                      onClick={() => addItem(item.id)}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      title="아래에 행 추가"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50"
                      title="삭제"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add row */}
      <button
        onClick={() => addItem()}
        className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-xs text-slate-400 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center gap-1"
      >
        <Plus size={13} /> 행 추가
      </button>

      {/* Legend */}
      <div className="flex items-center gap-4 text-2xs text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-blue-50 border border-blue-200" />
          AI 자동 추출 항목
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-amber-50 border border-amber-200" />
          사용자 수정 항목
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-white border border-slate-200" />
          직접 입력 항목
        </div>
      </div>
    </div>
  )
}
