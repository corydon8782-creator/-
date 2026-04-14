'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { dummyProjects } from '@/lib/dummy-data'
import {
  DOCUMENT_TYPE_LABELS,
  PROJECT_STATUS_LABELS,
  ProjectStatus,
} from '@/lib/types'
import { formatDate } from '@/lib/utils'
import {
  FilePlus,
  Search,
  FileText,
  MoreHorizontal,
  Edit3,
  Download,
  Trash2,
  Eye,
  Filter,
} from 'lucide-react'

const STATUS_OPTIONS = [
  { value: '', label: '전체 상태' },
  { value: 'draft', label: '초안' },
  { value: 'analyzing', label: '분석 중' },
  { value: 'analyzed', label: '분석 완료' },
  { value: 'editing', label: '편집 중' },
  { value: 'completed', label: '완료' },
  { value: 'archived', label: '보관' },
]

const TYPE_OPTIONS = [
  { value: '', label: '전체 문서 유형' },
  { value: 'quality_plan', label: '품질관리계획서' },
  { value: 'test_plan', label: '품질시험계획서' },
]

const STATUS_BADGE_MAP: Record<ProjectStatus, 'default' | 'info' | 'purple' | 'warning' | 'success'> = {
  draft: 'default',
  analyzing: 'info',
  analyzed: 'purple',
  editing: 'warning',
  completed: 'success',
  archived: 'default',
}

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const filtered = dummyProjects.filter((p) => {
    const matchSearch =
      p.name.includes(search) ||
      p.client.includes(search) ||
      p.location.includes(search)
    const matchStatus = !statusFilter || p.status === statusFilter
    const matchType = !typeFilter || p.documentType === typeFilter
    return matchSearch && matchStatus && matchType
  })

  return (
    <AppLayout
      breadcrumbs={[{ label: '대시보드', href: '/dashboard' }, { label: '프로젝트 목록' }]}
      headerActions={
        <Link href="/projects/new">
          <Button variant="primary" size="sm" icon={<FilePlus size={15} />}>
            새 계획서 작성
          </Button>
        </Link>
      }
    >
      <div className="p-6 space-y-4">
        {/* Filters */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="프로젝트명, 발주처, 위치로 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search size={16} />}
              />
            </div>
            <div className="flex gap-2">
              <Select
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="min-w-[130px]"
              />
              <Select
                options={TYPE_OPTIONS}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="min-w-[150px]"
              />
              <Button variant="secondary" size="md" icon={<Filter size={15} />}>
                필터
              </Button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            전체 {dummyProjects.length}건 중 {filtered.length}건 표시 중
          </p>
        </Card>

        {/* Project list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card className="py-16 text-center">
              <FileText size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">검색 결과가 없습니다.</p>
              <p className="text-sm text-slate-400 mt-1">다른 검색어나 필터를 사용해 보세요.</p>
            </Card>
          ) : (
            filtered.map((project) => (
              <Card key={project.id} hover padding="none">
                <div className="flex items-stretch">
                  {/* Status indicator */}
                  <div className={`w-1.5 rounded-l-lg flex-shrink-0 ${
                    project.status === 'completed' ? 'bg-green-500' :
                    project.status === 'editing' ? 'bg-amber-500' :
                    project.status === 'analyzing' ? 'bg-blue-500' :
                    project.status === 'analyzed' ? 'bg-indigo-500' :
                    'bg-slate-300'
                  }`} />

                  <div className="flex-1 flex items-center gap-4 px-4 py-4">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <FileText size={18} className="text-primary-700" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                          {project.name}
                        </h3>
                        <Badge variant={STATUS_BADGE_MAP[project.status]} dot>
                          {PROJECT_STATUS_LABELS[project.status]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          발주처: <strong className="text-slate-700">{project.client}</strong>
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-xs text-slate-500">
                          공사 기간: {formatDate(project.startDate)} ~ {formatDate(project.endDate)}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-xs text-slate-500">
                          <Badge variant="default" className="text-2xs">
                            {DOCUMENT_TYPE_LABELS[project.documentType]}
                          </Badge>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-right hidden md:block">
                        <p className="text-2xs text-slate-400">최종 수정</p>
                        <p className="text-xs text-slate-600">{formatDate(project.updatedAt)}</p>
                      </div>

                      {project.status === 'editing' || project.status === 'analyzed' ? (
                        <Link href={`/projects/${project.id}/edit`}>
                          <Button variant="primary" size="sm" icon={<Edit3 size={14} />}>
                            편집
                          </Button>
                        </Link>
                      ) : project.status === 'completed' ? (
                        <Link href={`/projects/${project.id}/export`}>
                          <Button variant="secondary" size="sm" icon={<Download size={14} />}>
                            출력
                          </Button>
                        </Link>
                      ) : project.status === 'analyzing' ? (
                        <Button variant="secondary" size="sm" disabled>
                          분석 중...
                        </Button>
                      ) : (
                        <Link href={`/projects/${project.id}/analyze`}>
                          <Button variant="outline" size="sm" icon={<Eye size={14} />}>
                            결과 확인
                          </Button>
                        </Link>
                      )}

                      {/* Menu */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenMenuId(openMenuId === project.id ? null : project.id)
                          }}
                          className="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        {openMenuId === project.id && (
                          <div className="absolute right-0 top-8 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[140px]">
                            <Link href={`/projects/${project.id}/edit`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                              <Edit3 size={14} /> 편집
                            </Link>
                            <Link href={`/projects/${project.id}/export`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                              <Download size={14} /> PDF 출력
                            </Link>
                            <hr className="my-1 border-slate-200" />
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                              <Trash2 size={14} /> 삭제
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  )
}
