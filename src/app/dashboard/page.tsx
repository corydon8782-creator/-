'use client'

import React from 'react'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import {
  dummyProjects,
  dummyTemplates,
  dashboardStats,
  currentUser,
} from '@/lib/dummy-data'
import {
  DOCUMENT_TYPE_LABELS,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
} from '@/lib/types'
import { formatDateTime } from '@/lib/utils'
import {
  FilePlus,
  FolderOpen,
  FileText,
  BookTemplate,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Layers,
  ClipboardCheck,
} from 'lucide-react'

function StatCard({
  icon,
  label,
  value,
  trend,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  trend?: string
  color: string
}) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
        {trend && <p className="text-xs text-green-600 mt-0.5">{trend}</p>}
      </div>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    draft: 'default',
    analyzing: 'info',
    analyzed: 'purple',
    editing: 'warning',
    completed: 'success',
    archived: 'default',
  }
  return (
    <Badge variant={colorMap[status] as 'default'} dot>
      {PROJECT_STATUS_LABELS[status as keyof typeof PROJECT_STATUS_LABELS] ?? status}
    </Badge>
  )
}

export default function DashboardPage() {
  const recentProjects = [...dummyProjects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  ).slice(0, 5)

  const activeProjects = dummyProjects.filter(
    (p) => p.status === 'editing' || p.status === 'analyzing' || p.status === 'analyzed',
  )

  return (
    <AppLayout
      breadcrumbs={[{ label: '대시보드' }]}
      headerActions={
        <Link href="/projects/new">
          <Button variant="primary" size="sm" icon={<FilePlus size={15} />}>
            새 계획서 작성
          </Button>
        </Link>
      }
    >
      <div className="p-6 space-y-6">
        {/* Welcome */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              안녕하세요, {currentUser.name} 님
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {currentUser.company} · {currentUser.department}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-400">마지막 접속</p>
            <p className="text-sm text-slate-600">2024.04.14 09:23</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Layers size={22} className="text-primary-600" />}
            label="전체 프로젝트"
            value={dashboardStats.totalProjects}
            color="bg-primary-50"
          />
          <StatCard
            icon={<Clock size={22} className="text-amber-600" />}
            label="진행 중 프로젝트"
            value={dashboardStats.activeProjects}
            color="bg-amber-50"
          />
          <StatCard
            icon={<CheckCircle2 size={22} className="text-green-600" />}
            label="완료된 계획서"
            value={dashboardStats.completedDocuments}
            trend="이번 달 +3건"
            color="bg-green-50"
          />
          <StatCard
            icon={<ClipboardCheck size={22} className="text-purple-600" />}
            label="등록된 시험 항목"
            value={dashboardStats.totalTestItems}
            color="bg-purple-50"
          />
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">빠른 작업</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                href: '/projects/new',
                icon: <FilePlus size={24} className="text-primary-600" />,
                label: '새 계획서 작성',
                desc: '프로젝트 생성 및 문서 업로드',
                bg: 'bg-primary-50 hover:bg-primary-100',
                border: 'border-primary-200',
              },
              {
                href: '/projects',
                icon: <FolderOpen size={24} className="text-slate-600" />,
                label: '프로젝트 목록',
                desc: '작성 중인 계획서 확인',
                bg: 'bg-slate-50 hover:bg-slate-100',
                border: 'border-slate-200',
              },
              {
                href: '/templates',
                icon: <BookTemplate size={24} className="text-indigo-600" />,
                label: '템플릿 관리',
                desc: '표준 양식 및 맞춤 템플릿',
                bg: 'bg-indigo-50 hover:bg-indigo-100',
                border: 'border-indigo-200',
              },
              {
                href: '/export',
                icon: <FileText size={24} className="text-green-600" />,
                label: 'PDF 출력',
                desc: '완성된 계획서 다운로드',
                bg: 'bg-green-50 hover:bg-green-100',
                border: 'border-green-200',
              },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <div
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${action.bg} ${action.border}`}
                >
                  <div className="flex-shrink-0 mt-0.5">{action.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{action.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent projects */}
          <div className="lg:col-span-2">
            <Card padding="none">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200">
                <h2 className="text-sm font-semibold text-slate-900">최근 프로젝트</h2>
                <Link href="/projects" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
                  전체 보기 <ChevronRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}/edit`}
                    className="flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText size={16} className="text-primary-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {project.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-slate-400">{project.client}</span>
                        <span className="text-slate-300 text-xs">·</span>
                        <span className="text-xs text-slate-400">
                          {DOCUMENT_TYPE_LABELS[project.documentType]}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <StatusBadge status={project.status} />
                      <span className="text-2xs text-slate-400">
                        {formatDateTime(project.updatedAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Active projects alert */}
            {activeProjects.length > 0 && (
              <Card className="border-amber-200 bg-amber-50">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      진행 중인 작업 {activeProjects.length}건
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      완료 전 계획서가 있습니다. 확인해 주세요.
                    </p>
                    <Link href="/projects">
                      <Button variant="outline" size="xs" className="mt-2 border-amber-400 text-amber-700 hover:bg-amber-100">
                        확인하기
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}

            {/* Templates */}
            <Card padding="none">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200">
                <h2 className="text-sm font-semibold text-slate-900">자주 쓰는 템플릿</h2>
                <Link href="/templates" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
                  전체 <ChevronRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {dummyTemplates.slice(0, 3).map((tpl) => (
                  <div key={tpl.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
                    <BookTemplate size={16} className="text-indigo-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">{tpl.name}</p>
                      <p className="text-2xs text-slate-400">{tpl.client} · 사용 {tpl.usageCount}회</p>
                    </div>
                    <Link href={`/projects/new?template=${tpl.id}`}>
                      <Button variant="ghost" size="xs" className="text-primary-600">
                        사용
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tips */}
            <Card className="bg-primary-50 border-primary-200">
              <div className="flex items-start gap-2">
                <TrendingUp size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary-800">이용 팁</p>
                  <p className="text-xs text-primary-600 mt-1 leading-relaxed">
                    공사내역서(XLSX)와 시방서(PDF)를 함께 업로드하면
                    AI 분석 정확도가 높아집니다.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
