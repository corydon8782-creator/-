'use client'

import React, { useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { dummyProjects } from '@/lib/dummy-data'
import { DOCUMENT_TYPE_LABELS, PROJECT_STATUS_LABELS, ProjectStatus } from '@/lib/types'
import { formatDate, formatDateTime } from '@/lib/utils'
import { Search, FolderOpen, Download, Eye, Trash2, Filter, FileText } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: '', label: '전체 상태' },
  { value: 'draft', label: '초안' },
  { value: 'analyzing', label: '분석 중' },
  { value: 'analyzed', label: '분석 완료' },
  { value: 'editing', label: '편집 중' },
  { value: 'completed', label: '완료' },
  { value: 'archived', label: '보관' },
]

// Simulate more projects for admin view
const allProjects = [
  ...dummyProjects,
  {
    id: 'p-005', name: '서울 □□구 도심재생 공공주택 건설공사', workType: '건축',
    location: '서울특별시 □□구', client: 'SH공사', contractor: '(주)한진건설',
    supervisor: '□□감리단', contractAmount: '42,100,000,000',
    startDate: '2024-01-10', endDate: '2025-12-31', status: 'completed' as const,
    documentType: 'quality_plan' as const, createdAt: '2024-01-12T09:00:00', updatedAt: '2024-03-20T15:00:00',
    uploadedFiles: [],
  },
  {
    id: 'p-006', name: '○○하수처리장 증설 및 고도화 공사', workType: '상하수도',
    location: '경기도 ○○시 ○○동', client: '○○시청', contractor: '대성엔지니어링',
    supervisor: '-', contractAmount: '15,700,000,000',
    startDate: '2024-03-01', endDate: '2025-08-31', status: 'editing' as const,
    documentType: 'test_plan' as const, createdAt: '2024-03-05T09:00:00', updatedAt: '2024-04-13T11:30:00',
    uploadedFiles: [],
  },
]

const STATUS_BADGE: Record<ProjectStatus, 'default' | 'info' | 'purple' | 'warning' | 'success'> = {
  draft: 'default', analyzing: 'info', analyzed: 'purple',
  editing: 'warning', completed: 'success', archived: 'default',
}

export default function AdminProjectsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = allProjects.filter((p) => {
    const matchSearch = p.name.includes(search) || p.client.includes(search) || p.contractor.includes(search)
    const matchStatus = !statusFilter || p.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <AdminLayout
      breadcrumbs={[{ label: '관리자 대시보드', href: '/admin' }, { label: '프로젝트 관리' }]}
    >
      <div className="p-6 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: '전체', count: allProjects.length, color: 'bg-slate-100' },
            { label: '초안', count: allProjects.filter(p => p.status === 'draft').length, color: 'bg-slate-100' },
            { label: '분석 중', count: allProjects.filter(p => p.status === 'analyzing').length, color: 'bg-blue-50' },
            { label: '편집 중', count: allProjects.filter(p => p.status === 'editing').length, color: 'bg-amber-50' },
            { label: '완료', count: allProjects.filter(p => p.status === 'completed').length, color: 'bg-green-50' },
            { label: '보관', count: allProjects.filter(p => p.status === 'archived').length, color: 'bg-slate-50' },
          ].map((s) => (
            <div key={s.label} className={`${s.color} border border-slate-200 rounded-xl px-3 py-2.5 text-center`}>
              <p className="text-xl font-bold text-slate-800">{s.count}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input placeholder="프로젝트명, 발주처, 시공사 검색" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search size={16} />} />
            </div>
            <Select options={STATUS_OPTIONS} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="min-w-[130px]" />
            <Button variant="secondary" size="md" icon={<Download size={14} />}>내보내기</Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">전체 {allProjects.length}건 중 {filtered.length}건 표시</p>
        </Card>

        {/* Project table */}
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {['프로젝트명', '발주처', '시공사', '문서 유형', '상태', '최종 수정', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText size={15} className="text-primary-400 flex-shrink-0" />
                        <span className="font-medium text-slate-800 line-clamp-1 max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{p.client}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{p.contractor}</td>
                    <td className="px-4 py-3">
                      <Badge variant="default" className="text-2xs">{DOCUMENT_TYPE_LABELS[p.documentType]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE[p.status]} dot className="text-2xs">
                        {PROJECT_STATUS_LABELS[p.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDate(p.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="xs" icon={<Eye size={13} />} />
                        <Button variant="ghost" size="xs" icon={<Download size={13} />} />
                        <Button variant="ghost" size="xs" icon={<Trash2 size={13} />} className="text-red-400 hover:bg-red-50" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
