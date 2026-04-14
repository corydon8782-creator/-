'use client'

import React, { useState } from 'react'
import { ApprovalBox, ApprovalCell, APPROVAL_TITLE_PRESETS } from '@/lib/types'
import Button from '@/components/ui/Button'
import { Plus, Trash2, GripVertical, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ApprovalBoxEditorProps {
  approvalBox: ApprovalBox
  onChange: (box: ApprovalBox) => void
}

export default function ApprovalBoxEditor({ approvalBox, onChange }: ApprovalBoxEditorProps) {
  const [showPresets, setShowPresets] = useState<string | null>(null)

  const updateCell = (rowId: string, cellId: string, field: keyof ApprovalCell, value: string) => {
    onChange({
      ...approvalBox,
      rows: approvalBox.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              cells: row.cells.map((cell) =>
                cell.id === cellId ? { ...cell, [field]: value } : cell,
              ),
            }
          : row,
      ),
    })
  }

  const addCell = (rowId: string) => {
    const newCell: ApprovalCell = {
      id: Math.random().toString(36).slice(2),
      title: '담당자',
      name: '',
      date: '',
    }
    onChange({
      ...approvalBox,
      rows: approvalBox.rows.map((row) =>
        row.id === rowId ? { ...row, cells: [...row.cells, newCell] } : row,
      ),
    })
  }

  const removeCell = (rowId: string, cellId: string) => {
    onChange({
      ...approvalBox,
      rows: approvalBox.rows.map((row) =>
        row.id === rowId
          ? { ...row, cells: row.cells.filter((c) => c.id !== cellId) }
          : row,
      ),
    })
  }

  const addRow = () => {
    onChange({
      ...approvalBox,
      rows: [
        ...approvalBox.rows,
        {
          id: Math.random().toString(36).slice(2),
          cells: [{ id: Math.random().toString(36).slice(2), title: '담당자', name: '', date: '' }],
        },
      ],
    })
  }

  const removeRow = (rowId: string) => {
    onChange({
      ...approvalBox,
      rows: approvalBox.rows.filter((r) => r.id !== rowId),
    })
  }

  return (
    <div className="space-y-4">
      {/* Settings */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1">결재란 제목</label>
          <input
            type="text"
            value={approvalBox.title}
            onChange={(e) => onChange({ ...approvalBox, title: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1">결재란 위치</label>
          <select
            value={approvalBox.position}
            onChange={(e) =>
              onChange({ ...approvalBox, position: e.target.value as ApprovalBox['position'] })
            }
            className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="top-right">우측 상단</option>
            <option value="bottom-right">우측 하단</option>
            <option value="bottom-center">하단 중앙</option>
          </select>
        </div>
      </div>

      {/* Row editor */}
      <div className="space-y-3">
        {approvalBox.rows.map((row, rowIdx) => (
          <div key={row.id} className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-medium text-slate-600">행 {rowIdx + 1}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="xs"
                  icon={<Plus size={12} />}
                  onClick={() => addCell(row.id)}
                >
                  칸 추가
                </Button>
                {approvalBox.rows.length > 1 && (
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={<Trash2 size={12} />}
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => removeRow(row.id)}
                  >
                    행 삭제
                  </Button>
                )}
              </div>
            </div>

            {/* Cells */}
            <div className="grid divide-x divide-slate-200" style={{ gridTemplateColumns: `repeat(${row.cells.length}, 1fr)` }}>
              {row.cells.map((cell) => (
                <div key={cell.id} className="p-2.5 bg-white relative group">
                  <div className="space-y-1.5">
                    {/* Title with presets */}
                    <div className="relative">
                      <input
                        type="text"
                        value={cell.title}
                        onChange={(e) => updateCell(row.id, cell.id, 'title', e.target.value)}
                        className="w-full text-center text-xs font-semibold border-b border-dashed border-slate-300 pb-1 bg-transparent focus:outline-none focus:border-primary-400"
                        placeholder="직위/직함"
                      />
                      <button
                        onClick={() => setShowPresets(showPresets === cell.id ? null : cell.id)}
                        className="absolute right-0 top-0 text-slate-400 hover:text-slate-600"
                      >
                        <ChevronDown size={12} />
                      </button>
                      {showPresets === cell.id && (
                        <div className="absolute top-6 left-0 right-0 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto">
                          {APPROVAL_TITLE_PRESETS.map((preset) => (
                            <button
                              key={preset}
                              onClick={() => {
                                updateCell(row.id, cell.id, 'title', preset)
                                setShowPresets(null)
                              }}
                              className="block w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Signature area */}
                    <div className="h-12 border border-dashed border-slate-200 rounded flex items-center justify-center">
                      <span className="text-2xs text-slate-300">(서명)</span>
                    </div>
                  </div>

                  {/* Remove cell */}
                  {row.cells.length > 1 && (
                    <button
                      onClick={() => removeCell(row.id, cell.id)}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-2xs">×</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <Button
          variant="secondary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={addRow}
          className="w-full"
        >
          행 추가
        </Button>
      </div>

      {/* Preview */}
      <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
        <p className="text-xs font-medium text-slate-600 mb-2">미리보기</p>
        <div className="bg-white border border-slate-700 inline-block text-xs">
          <div className="bg-slate-100 text-center py-1 px-8 border-b border-slate-700 font-semibold text-slate-800">
            {approvalBox.title}
          </div>
          {approvalBox.rows.map((row) => (
            <div
              key={row.id}
              className="flex"
              style={{ borderBottom: '1px solid #334155' }}
            >
              {row.cells.map((cell, i) => (
                <div
                  key={cell.id}
                  className={cn(
                    'px-4 py-1 text-center min-w-[70px]',
                    i < row.cells.length - 1 && 'border-r border-slate-700',
                  )}
                >
                  <div className="font-semibold text-slate-800 text-center border-b border-slate-300 pb-1 mb-1">{cell.title}</div>
                  <div className="h-8" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
