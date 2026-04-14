'use client'

import React, { useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { systemLogs, SystemLog } from '@/lib/admin-data'
import { formatDateTime } from '@/lib/utils'
import {
  Search,
  AlertCircle,
  Info,
  CheckCircle2,
  RefreshCw,
  Download,
  Brain,
  FileText,
  UserPlus,
  Activity,
  Printer,
} from 'lucide-react'

// Extend logs for a richer demo
const allLogs: SystemLog[] = [
  ...systemLogs,
  {
    id: 'log-009', type: 'ai_analysis', level: 'info',
    message: 'AI 분석 완료: ◇◇산단 기계설비 설치공사 (신뢰도 79%)',
    user: '오승현', company: '롯데건설(주)', createdAt: '2024-04-13T10:05:00',
  },
  {
    id: 'log-010', type: 'export', level: 'info',
    message: 'PDF 출력 완료: 국도 □□호선 확장공사 4공구 품질관리계획서',
    user: '정유민', company: '삼성물산(주) 건설부문', createdAt: '2024-04-13T09:50:00',
  },
  {
    id: 'log-011', type: 'document_create', level: 'info',
    message: '품질시험계획서 신규 생성: QT-2024-017',
    user: '박성민', company: '포스코건설(주)', createdAt: '2024-04-12T16:30:00',
  },
  {
    id: 'log-012', type: 'error', level: 'error',
    message: 'AI 분석 오류: PDF 페이지 수 초과 (최대 200페이지 / 요청 347페이지)',
    user: '강민석', company: 'GS건설(주)', createdAt: '2024-04-12T15:15:00',
  },
  {
    id: 'log-013', type: 'user_join', level: 'info',
    message: '신규 사용자 가입: 김미래 ((주)현대ENG)',
    user: '김미래', company: '(주)현대ENG', createdAt: '2024-04-12T11:00:00',
  },
]

const TYPE_OPTIONS = [
  { value: '', label: '전체 유형' },
  { value: 'ai_analysis', label: 'AI 분석' },
  { value: 'document_create', label: '문서 생성' },
  { value: 'export', label: 'PDF 출력' },
  { value: 'user_join', label: '사용자 가입' },
  { value: 'error', label: '오류' },
]

const LEVEL_OPTIONS = [
  { value: '', label: '전체 레벨' },
  { value: 'info', label: '정보' },
  { value: 'warn', label: '경고' },
  { value: 'error', label: '오류' },
]

function LogTypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'ai_analysis': return <Brain size={14} className="text-purple-500" />
    case 'document_create': return <FileText size={14} className="text-blue-500" />
    case 'export': return <Printer size={14} className="text-green-500" />
    case 'user_join': return <UserPlus size={14} className="text-teal-500" />
    default: return <Activity size={14} className="text-red-500" />
  }
}

function LevelBadge({ level }: { level: string }) {
  if (level === 'error') return <Badge variant="danger" className="text-2xs">오류</Badge>
  if (level === 'warn') return <Badge variant="warning" className="text-2xs">경고</Badge>
  return <Badge variant="default" className="text-2xs">정보</Badge>
}

export default function AdminLogsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')

  const filtered = allLogs.filter((log) => {
    const matchSearch =
      log.message.includes(search) ||
      log.user.includes(search) ||
      log.company.includes(search)
    const matchType = !typeFilter || log.type === typeFilter
    const matchLevel = !levelFilter || log.level === levelFilter
    return matchSearch && matchType && matchLevel
  })

  const errorCount = allLogs.filter((l) => l.level === 'error').length
  const warnCount = allLogs.filter((l) => l.level === 'warn').length

  return (
    <AdminLayout
      breadcrumbs={[
        { label: '관리자 대시보드', href: '/admin' },
        { label: '시스템 로그' },
      ]}
      headerActions={
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={<RefreshCw size={14} />}>
            새로고침
          </Button>
          <Button variant="secondary" size="sm" icon={<Download size={14} />}>
            로그 내보내기
          </Button>
        </div>
      }
    >
      <div className="p-6 space-y-4">
        {/* Error alert */}
        {errorCount > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">
              오늘 <strong>{errorCount}건의 오류</strong>와 <strong>{warnCount}건의 경고</strong>가 발생했습니다.
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '전체 로그', count: allLogs.length, icon: <Activity size={18} />, color: 'bg-slate-100 text-slate-700' },
            { label: 'AI 분석', count: allLogs.filter(l => l.type === 'ai_analysis').length, icon: <Brain size={18} />, color: 'bg-purple-100 text-purple-700' },
            { label: '경고', count: warnCount, icon: <AlertCircle size={18} />, color: 'bg-amber-100 text-amber-700' },
            { label: '오류', count: errorCount, icon: <AlertCircle size={18} />, color: 'bg-red-100 text-red-700' },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-xl px-4 py-3 flex items-center gap-3 border border-slate-200 bg-opacity-60`}>
              {s.icon}
              <div>
                <p className="text-xl font-bold">{s.count}</p>
                <p className="text-xs opacity-70">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="메시지, 사용자, 회사로 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search size={16} />}
              />
            </div>
            <div className="flex gap-2">
              <Select options={TYPE_OPTIONS} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="min-w-[110px]" />
              <Select options={LEVEL_OPTIONS} value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="min-w-[100px]" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            전체 {allLogs.length}건 중 <strong>{filtered.length}건</strong> 표시 중
          </p>
        </Card>

        {/* Log list */}
        <Card padding="none">
          <div className="divide-y divide-slate-100">
            {filtered.map((log) => (
              <div
                key={log.id}
                className={`flex items-start gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors ${
                  log.level === 'error' ? 'bg-red-50/60' : log.level === 'warn' ? 'bg-amber-50/60' : ''
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <LogTypeIcon type={log.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 leading-snug">{log.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{log.user}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{log.company}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <LevelBadge level={log.level} />
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {formatDateTime(log.createdAt)}
                  </span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-16 text-center text-slate-400">검색 결과가 없습니다.</div>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
