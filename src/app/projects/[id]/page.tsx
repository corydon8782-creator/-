'use client'

export const runtime = 'edge'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { dummyProjects, dummyDocument } from '@/lib/dummy-data'
import {
  DOCUMENT_TYPE_LABELS,
  PROJECT_STATUS_LABELS,
  FILE_CATEGORY_LABELS,
  ProjectStatus,
} from '@/lib/types'
import { formatDate, formatDateTime, formatFileSize } from '@/lib/utils'
import {
  Edit3,
  Download,
  FileText,
  Eye,
  Calendar,
  Building,
  MapPin,
  DollarSign,
  Upload,
  File,
  CheckCircle2,
  Clock,
  Sparkles,
  History,
  ChevronRight,
} from 'lucide-react'

const STATUS_BADGE: Record<ProjectStatus, 'default' | 'info' | 'purple' | 'warning' | 'success'> = {
  draft: 'default', analyzing: 'info', analyzed: 'purple',
  editing: 'warning', completed: 'success', archived: 'default',
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-b-0">
      <div className="text-slate-400 flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800 mt-0.5">{value || '-'}</p>
      </div>
    </div>
  )
}

export default function ProjectDetailPage() {
  const params = useParams()
  const project = dummyProjects.find((p) => p.id === params.id) ?? dummyProjects[0]

  const canEdit = project.status === 'editing' || project.status === 'analyzed'
  const canExport = project.status === 'completed' || project.status === 'editing'

  return (
    <AppLayout
      breadcrumbs={[
        { label: '프로젝트 목록', href: '/projects' },
        { label: project.name.slice(0, 25) + (project.name.length > 25 ? '...' : '') },
      ]}
      headerActions={
        <div className="flex gap-2">
          {canEdit && (
            <Link href={`/projects/${project.id}/edit`}>
              <Button variant="primary" size="sm" icon={<Edit3 size={14} />}>
                계획서 편집
              </Button>
            </Link>
          )}
          {canExport && (
            <Link href={`/projects/${project.id}/export`}>
              <Button variant="secondary" size="sm" icon={<Download size={14} />}>
                PDF 출력
              </Button>
            </Link>
          )}
        </div>
      }
    >
      <div className="p-6 max-w-5xl mx-auto space-y-5">
        {/* Header card */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
              <FileText size={26} className="text-primary-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap mb-1">
                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                  {project.name}
                </h1>
                <Badge variant={STATUS_BADGE[project.status]} dot className="flex-shrink-0 mt-0.5">
                  {PROJECT_STATUS_LABELS[project.status]}
                </Badge>
              </div>
              <div className="flex items-center gap-3 flex-wrap text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Building size={13} /> {project.client}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {project.location}
                </span>
                <span>·</span>
                <Badge variant="default">
                  {DOCUMENT_TYPE_LABELS[project.documentType]}
                </Badge>
              </div>
            </div>
            <div className="text-right flex-shrink-0 hidden md:block">
              <p className="text-xs text-slate-400">최종 수정</p>
              <p className="text-sm text-slate-600">{formatDateTime(project.updatedAt)}</p>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Project info */}
          <Card className="md:col-span-2">
            <h2 className="text-sm font-semibold text-slate-800 mb-2">공사 개요</h2>
            <div className="divide-y divide-slate-100">
              <InfoRow icon={<Building size={15} />} label="발주처" value={project.client} />
              <InfoRow icon={<Building size={15} />} label="시공사" value={project.contractor} />
              <InfoRow icon={<Building size={15} />} label="감리사" value={project.supervisor} />
              <InfoRow icon={<MapPin size={15} />} label="공사 위치" value={project.location} />
              <InfoRow icon={<DollarSign size={15} />} label="계약금액" value={project.contractAmount ? `₩${Number(project.contractAmount.replace(/,/g, '')).toLocaleString()}` : '-'} />
              <InfoRow
                icon={<Calendar size={15} />}
                label="공사 기간"
                value={`${formatDate(project.startDate)} ~ ${formatDate(project.endDate)}`}
              />
            </div>
          </Card>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Action steps */}
            <Card>
              <h2 className="text-sm font-semibold text-slate-800 mb-3">작업 단계</h2>
              <div className="space-y-2">
                {[
                  { label: '프로젝트 생성', done: true, href: null },
                  { label: '문서 업로드', done: project.uploadedFiles.length > 0, href: `/projects/new` },
                  { label: 'AI 분석', done: ['analyzed', 'editing', 'completed'].includes(project.status), href: `/projects/${project.id}/analyze` },
                  { label: '계획서 편집', done: ['editing', 'completed'].includes(project.status), href: `/projects/${project.id}/edit` },
                  { label: 'PDF 출력', done: project.status === 'completed', href: `/projects/${project.id}/export` },
                ].map((step) => (
                  <div key={step.label} className="flex items-center gap-2.5">
                    {step.done
                      ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                      : <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                    }
                    <span className={`text-sm ${step.done ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                    {!step.done && step.href && (
                      <Link href={step.href} className="ml-auto">
                        <ChevronRight size={14} className="text-primary-500" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Version history */}
            <Card>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <History size={14} /> 저장 이력
                </h2>
              </div>
              <div className="space-y-2">
                {dummyDocument.versions.slice(0, 3).map((v) => (
                  <div key={v.id} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${v.isAutoSave ? 'bg-slate-100' : 'bg-primary-100'}`}>
                      {v.isAutoSave
                        ? <Clock size={10} className="text-slate-500" />
                        : <CheckCircle2 size={10} className="text-primary-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{v.versionNo}</p>
                      <p className="text-2xs text-slate-400">{formatDateTime(v.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Uploaded files */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-800">
              업로드된 문서 ({project.uploadedFiles.length}개)
            </h2>
            <Button variant="secondary" size="xs" icon={<Upload size={13} />}>
              파일 추가
            </Button>
          </div>
          {project.uploadedFiles.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <Upload size={24} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">업로드된 파일이 없습니다.</p>
              <Button variant="outline" size="sm" icon={<Upload size={14} />} className="mt-2">
                파일 업로드
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {project.uploadedFiles.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <File size={18} className="text-primary-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{f.name}</p>
                    <p className="text-xs text-slate-400">
                      {FILE_CATEGORY_LABELS[f.category]} · {formatFileSize(f.size)} · {formatDateTime(f.uploadedAt)}
                    </p>
                  </div>
                  <Badge variant={f.status === 'done' ? 'success' : 'info'} className="text-2xs flex-shrink-0">
                    {f.status === 'done' ? '완료' : '처리 중'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Document summary (if exists) */}
        {project.status !== 'draft' && (
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-800">
                생성된 계획서
              </h2>
              <div className="flex gap-2">
                <Link href={`/projects/${project.id}/edit`}>
                  <Button variant="outline" size="xs" icon={<Edit3 size={13} />}>편집</Button>
                </Link>
                <Link href={`/projects/${project.id}/export`}>
                  <Button variant="secondary" size="xs" icon={<Download size={13} />}>출력</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-primary-50 border border-primary-200 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{dummyDocument.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {dummyDocument.documentNo} · {dummyDocument.revision}
                  &nbsp;·&nbsp;섹션 {dummyDocument.sections.filter(s => s.isVisible).length}개
                  &nbsp;·&nbsp;시험항목 11개
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant={
                    dummyDocument.status === 'approved' ? 'success' :
                    dummyDocument.status === 'review' ? 'warning' : 'default'
                  }>
                    {dummyDocument.status === 'draft' ? '초안' : dummyDocument.status === 'review' ? '검토 중' : '승인됨'}
                  </Badge>
                  <span className="text-2xs text-slate-400 flex items-center gap-1">
                    <Sparkles size={10} className="text-blue-400" /> AI 초안 기반
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
