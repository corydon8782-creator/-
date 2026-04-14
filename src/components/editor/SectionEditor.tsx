'use client'

import React, { useState } from 'react'
import {
  DocumentSection,
  TextContent,
  TableContent,
  TestItemsContent,
  OverviewContent,
  OrganizationContent,
  OrgMember,
} from '@/lib/types'
import TestItemsTable from './TestItemsTable'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { Sparkles, Plus, Trash2, Edit3 } from 'lucide-react'

interface SectionEditorProps {
  section: DocumentSection
  onUpdate: (section: DocumentSection) => void
}

// Text Section
function TextSectionEditor({
  content,
  onChange,
}: {
  content: TextContent
  onChange: (c: TextContent) => void
}) {
  return (
    <div className="space-y-2">
      {content.isAiGenerated && (
        <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-2.5 py-1.5">
          <Sparkles size={13} />
          AI가 작성한 초안입니다. 내용을 직접 수정하세요.
        </div>
      )}
      <textarea
        value={content.body}
        onChange={(e) =>
          onChange({ ...content, body: e.target.value, isAiGenerated: false })
        }
        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 min-h-[200px] resize-y"
      />
    </div>
  )
}

// Overview Section (Key-value pairs)
function OverviewSectionEditor({
  content,
  onChange,
}: {
  content: OverviewContent
  onChange: (c: OverviewContent) => void
}) {
  const updateField = (idx: number, field: 'label' | 'value', value: string) => {
    onChange({
      ...content,
      fields: content.fields.map((f, i) =>
        i === idx ? { ...f, [field]: value, isModified: field === 'value' } : f,
      ),
    })
  }

  const addField = () => {
    onChange({
      ...content,
      fields: [...content.fields, { label: '', value: '', isModified: false }],
    })
  }

  const removeField = (idx: number) => {
    onChange({
      ...content,
      fields: content.fields.filter((_, i) => i !== idx),
    })
  }

  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="w-1/4 px-4 py-2 text-left text-xs font-semibold text-slate-700 border-r border-slate-200">
                항목
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700">
                내용
              </th>
              <th className="w-10 border-l border-slate-200" />
            </tr>
          </thead>
          <tbody>
            {content.fields.map((field, idx) => (
              <tr
                key={idx}
                className={cn(
                  'border-t border-slate-100',
                  field.isModified && 'bg-amber-50',
                )}
              >
                <td className="border-r border-slate-200 px-1">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(idx, 'label', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm font-medium text-slate-700 bg-transparent focus:outline-none focus:bg-white focus:border focus:border-primary-300 rounded"
                  />
                </td>
                <td className="px-1">
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => updateField(idx, 'value', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm text-slate-800 bg-transparent focus:outline-none focus:bg-white focus:border focus:border-primary-300 rounded"
                    placeholder="내용 입력..."
                  />
                </td>
                <td className="border-l border-slate-200 text-center">
                  <button
                    onClick={() => removeField(idx)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button variant="secondary" size="xs" icon={<Plus size={13} />} onClick={addField}>
        항목 추가
      </Button>
    </div>
  )
}

// Table Section
function TableSectionEditor({
  content,
  onChange,
}: {
  content: TableContent
  onChange: (c: TableContent) => void
}) {
  const updateCell = (rowIdx: number, colIdx: number, value: string) => {
    const newRows = content.rows.map((row, r) =>
      r === rowIdx ? row.map((cell, c) => (c === colIdx ? value : cell)) : row,
    )
    onChange({ ...content, rows: newRows })
  }

  const updateHeader = (colIdx: number, value: string) => {
    onChange({
      ...content,
      headers: content.headers.map((h, i) => (i === colIdx ? value : h)),
    })
  }

  const addRow = () => {
    onChange({ ...content, rows: [...content.rows, new Array(content.headers.length).fill('')] })
  }

  const addColumn = () => {
    onChange({
      ...content,
      headers: [...content.headers, '새 열'],
      rows: content.rows.map((r) => [...r, '']),
    })
  }

  const removeRow = (idx: number) => {
    onChange({ ...content, rows: content.rows.filter((_, i) => i !== idx) })
  }

  const removeColumn = (colIdx: number) => {
    if (content.headers.length <= 1) return
    onChange({
      ...content,
      headers: content.headers.filter((_, i) => i !== colIdx),
      rows: content.rows.map((r) => r.filter((_, i) => i !== colIdx)),
    })
  }

  return (
    <div className="space-y-2">
      {content.caption && (
        <input
          type="text"
          value={content.caption}
          onChange={(e) => onChange({ ...content, caption: e.target.value })}
          className="text-sm font-medium text-slate-700 border-b border-dashed border-slate-300 bg-transparent focus:outline-none w-full pb-0.5"
          placeholder="표 제목"
        />
      )}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              {content.headers.map((header, ci) => (
                <th key={ci} className="border-b border-r border-slate-200 last:border-r-0 px-1 py-1 relative group">
                  <input
                    type="text"
                    value={header}
                    onChange={(e) => updateHeader(ci, e.target.value)}
                    className="w-full text-center text-xs font-semibold bg-transparent focus:outline-none min-w-[60px]"
                  />
                  {content.headers.length > 1 && (
                    <button
                      onClick={() => removeColumn(ci)}
                      className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-400 rounded-full text-white text-2xs items-center justify-center opacity-0 group-hover:opacity-100 hidden group-hover:flex"
                    >×</button>
                  )}
                </th>
              ))}
              <th className="border-b border-slate-200 w-8">
                <button onClick={addColumn} className="text-slate-400 hover:text-primary-600 p-1">
                  <Plus size={12} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row, ri) => (
              <tr key={ri} className="group border-b border-slate-100 last:border-b-0">
                {row.map((cell, ci) => (
                  <td key={ci} className="border-r border-slate-100 last:border-r-0 px-1">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      className="w-full px-2 py-1.5 text-sm bg-transparent focus:outline-none focus:bg-white focus:border focus:border-primary-300 rounded"
                    />
                  </td>
                ))}
                <td className="w-8 text-center border-r-0">
                  <button
                    onClick={() => removeRow(ri)}
                    className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button variant="secondary" size="xs" icon={<Plus size={13} />} onClick={addRow}>
        행 추가
      </Button>
    </div>
  )
}

// Organization Section
function OrgSectionEditor({
  content,
  onChange,
}: {
  content: OrganizationContent
  onChange: (c: OrganizationContent) => void
}) {
  const updateMember = (id: string, field: keyof OrgMember, value: string) => {
    onChange({
      ...content,
      members: content.members.map((m) =>
        m.id === id ? { ...m, [field]: value } : m,
      ),
    })
  }

  const addMember = () => {
    onChange({
      ...content,
      members: [
        ...content.members,
        { id: Math.random().toString(36).slice(2), role: '', name: '', qualification: '', remark: '' },
      ],
    })
  }

  const removeMember = (id: string) => {
    onChange({ ...content, members: content.members.filter((m) => m.id !== id) })
  }

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              {['직위/직책', '성명', '자격/면허', '비고', ''].map((h) => (
                <th key={h} className="border-b border-r border-slate-200 last:border-r-0 px-3 py-2 text-left text-xs font-semibold text-slate-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.members.map((m) => (
              <tr key={m.id} className="border-b border-slate-100 last:border-b-0 group">
                {(['role', 'name', 'qualification', 'remark'] as const).map((field) => (
                  <td key={field} className="border-r border-slate-100 px-1">
                    <input
                      type="text"
                      value={m[field]}
                      onChange={(e) => updateMember(m.id, field, e.target.value)}
                      className="w-full px-2 py-1.5 text-sm bg-transparent focus:outline-none focus:bg-white focus:border focus:border-primary-300 rounded"
                    />
                  </td>
                ))}
                <td className="w-8 text-center">
                  <button
                    onClick={() => removeMember(m.id)}
                    className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button variant="secondary" size="xs" icon={<Plus size={13} />} onClick={addMember}>
        구성원 추가
      </Button>
    </div>
  )
}

// Main SectionEditor
export default function SectionEditor({ section, onUpdate }: SectionEditorProps) {
  const [titleEditing, setTitleEditing] = useState(false)
  const [titleDraft, setTitleDraft] = useState(section.title)

  const commitTitle = () => {
    onUpdate({ ...section, title: titleDraft })
    setTitleEditing(false)
  }

  const updateContent = (content: DocumentSection['content']) => {
    onUpdate({ ...section, content })
  }

  return (
    <div className="space-y-4">
      {/* Section title */}
      <div className="flex items-center gap-2">
        {titleEditing ? (
          <>
            <input
              autoFocus
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => { if (e.key === 'Enter') commitTitle() }}
              className="flex-1 text-base font-bold text-slate-900 border-b-2 border-primary-500 bg-transparent focus:outline-none pb-0.5"
            />
          </>
        ) : (
          <div className="flex items-center gap-2 group flex-1">
            <h2 className="text-base font-bold text-slate-900">{section.title}</h2>
            {!section.isLocked && (
              <button
                onClick={() => { setTitleDraft(section.title); setTitleEditing(true) }}
                className="text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100"
              >
                <Edit3 size={13} />
              </button>
            )}
          </div>
        )}
        {section.content && 'isAiGenerated' in section.content && (section.content as TextContent).isAiGenerated && (
          <Badge variant="info" className="flex items-center gap-1">
            <Sparkles size={10} /> AI 작성
          </Badge>
        )}
      </div>

      {/* Content editor */}
      {section.content.kind === 'text' && (
        <TextSectionEditor
          content={section.content as TextContent}
          onChange={(c) => updateContent(c)}
        />
      )}
      {section.content.kind === 'overview' && (
        <OverviewSectionEditor
          content={section.content as OverviewContent}
          onChange={(c) => updateContent(c)}
        />
      )}
      {section.content.kind === 'table' && (
        <TableSectionEditor
          content={section.content as TableContent}
          onChange={(c) => updateContent(c)}
        />
      )}
      {section.content.kind === 'test_items' && (
        <TestItemsTable
          items={(section.content as TestItemsContent).items}
          onChange={(items) => updateContent({ kind: 'test_items', items })}
        />
      )}
      {section.content.kind === 'organization' && (
        <OrgSectionEditor
          content={section.content as OrganizationContent}
          onChange={(c) => updateContent(c)}
        />
      )}
    </div>
  )
}
