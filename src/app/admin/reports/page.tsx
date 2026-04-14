'use client'

import React, { useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { adminStats, planUsageData, monthlyAnalysisData } from '@/lib/admin-data'
import { Download, TrendingUp, TrendingDown, BarChart3, Users, Brain, FileText, Calendar } from 'lucide-react'

const PERIOD_OPTIONS = [
  { value: '6m', label: '최근 6개월' },
  { value: '3m', label: '최근 3개월' },
  { value: '1m', label: '이번 달' },
  { value: '1y', label: '최근 1년' },
]

function HorizontalBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-600 w-36 truncate">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-700 w-8 text-right">{value}</span>
    </div>
  )
}

function MiniLineChart({ data }: { data: { month: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count))
  const min = Math.min(...data.map(d => d.count))
  const range = max - min || 1
  const H = 60, W = 100
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((d.count - min) / range) * (H - 10)
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-14">
        <polyline
          points={points}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * W
          const y = H - ((d.count - min) / range) * (H - 10)
          return <circle key={i} cx={x} cy={y} r="2.5" fill="#2563eb" />
        })}
      </svg>
      <div className="flex justify-between text-2xs text-slate-400 mt-1">
        {data.map((d) => <span key={d.month}>{d.month}</span>)}
      </div>
    </div>
  )
}

const topCompanies = [
  { name: '삼성물산(주) 건설부문', docs: 98, projects: 28 },
  { name: '현대건설(주)', docs: 124, projects: 31 },
  { name: '(주)한진건설', docs: 47, projects: 12 },
  { name: '포스코건설(주)', docs: 41, projects: 10 },
  { name: 'GS건설(주)', docs: 22, projects: 7 },
]

const docTypeStats = [
  { label: '품질관리계획서', count: 1284, pct: 54 },
  { label: '품질시험계획서', count: 1107, pct: 46 },
]

const workTypeStats = [
  { label: '토목공사', count: 612, color: 'bg-blue-500' },
  { label: '건축공사', count: 489, color: 'bg-green-500' },
  { label: '도로공사', count: 398, color: 'bg-amber-500' },
  { label: '기계설비', count: 287, color: 'bg-purple-500' },
  { label: '상·하수도', count: 214, color: 'bg-teal-500' },
  { label: '기타', count: 391, color: 'bg-slate-400' },
]

export default function AdminReportsPage() {
  const [period, setPeriod] = useState('6m')

  return (
    <AdminLayout
      breadcrumbs={[
        { label: '관리자 대시보드', href: '/admin' },
        { label: '통계/리포트' },
      ]}
      headerActions={
        <div className="flex gap-2 items-center">
          <Select
            options={PERIOD_OPTIONS}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="min-w-[130px]"
          />
          <Button variant="secondary" size="sm" icon={<Download size={14} />}>
            리포트 다운로드
          </Button>
        </div>
      }
    >
      <div className="p-6 space-y-5">
        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: '신규 사용자',
              value: '+28',
              unit: '명',
              sub: '전월 대비',
              trend: '+12.4%',
              up: true,
              icon: <Users size={20} className="text-primary-600" />,
              bg: 'bg-primary-50',
            },
            {
              label: 'AI 분석 건수',
              value: '423',
              unit: '회',
              sub: '이번 달',
              trend: '+8.7%',
              up: true,
              icon: <Brain size={20} className="text-purple-600" />,
              bg: 'bg-purple-50',
            },
            {
              label: '생성 문서',
              value: '142',
              unit: '건',
              sub: '이번 달',
              trend: '+5.2%',
              up: true,
              icon: <FileText size={20} className="text-green-600" />,
              bg: 'bg-green-50',
            },
            {
              label: '평균 분석 신뢰도',
              value: '86.3',
              unit: '%',
              sub: '이번 달',
              trend: '-0.8%p',
              up: false,
              icon: <BarChart3 size={20} className="text-amber-600" />,
              bg: 'bg-amber-50',
            },
          ].map((kpi) => (
            <Card key={kpi.label}>
              <div className="flex items-start justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                  {kpi.icon}
                </div>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>
                  {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpi.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {kpi.value}<span className="text-base font-normal text-slate-500 ml-0.5">{kpi.unit}</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{kpi.label} · {kpi.sub}</p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Monthly AI analysis */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">월별 AI 분석 추이</h3>
              <Badge variant="info">최근 6개월</Badge>
            </div>
            <MiniLineChart data={monthlyAnalysisData} />
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span>최솟값: {Math.min(...monthlyAnalysisData.map(d => d.count))}회</span>
              <span>최댓값: {Math.max(...monthlyAnalysisData.map(d => d.count))}회</span>
              <span>평균: {Math.round(monthlyAnalysisData.reduce((s, d) => s + d.count, 0) / monthlyAnalysisData.length)}회</span>
            </div>
          </Card>

          {/* Document type breakdown */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">문서 유형별 생성 현황</h3>
            <div className="space-y-4">
              {docTypeStats.map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-700">{d.label}</span>
                    <span className="text-slate-500">{d.count.toLocaleString()}건 ({d.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                      className="h-3 bg-primary-500 rounded-full transition-all"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs text-blue-700 leading-relaxed">
                <strong>인사이트:</strong> 품질관리계획서 비중이 54%로 더 높으나, 품질시험계획서 생성 건수가 전월 대비 14% 증가했습니다.
                발주처의 시험계획 분리 요구가 증가하는 추세입니다.
              </p>
            </div>
          </Card>

          {/* Work type stats */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">공사 종류별 분포</h3>
            <div className="space-y-2.5">
              {workTypeStats.map((w) => (
                <HorizontalBar
                  key={w.label}
                  label={w.label}
                  value={w.count}
                  max={Math.max(...workTypeStats.map(x => x.count))}
                  color={w.color}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">* 전체 분석 요청 기준</p>
          </Card>

          {/* Top companies */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">활성 기업 Top 5</h3>
              <Badge variant="default">문서 생성 기준</Badge>
            </div>
            <div className="space-y-3">
              {topCompanies.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-amber-400 text-white' :
                    i === 1 ? 'bg-slate-400 text-white' :
                    i === 2 ? 'bg-amber-700 text-white' :
                    'bg-slate-200 text-slate-500'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{c.name}</p>
                    <p className="text-xs text-slate-400">문서 {c.docs}건 · 프로젝트 {c.projects}건</p>
                  </div>
                  <div className="w-20 bg-slate-100 rounded-full h-1.5 flex-shrink-0">
                    <div
                      className="h-1.5 bg-primary-500 rounded-full"
                      style={{ width: `${(c.docs / topCompanies[0].docs) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Revenue placeholder */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">매출 현황 (이번 달)</h3>
              <p className="text-xs text-slate-500 mt-0.5">플랜 구독 기준</p>
            </div>
            <Badge variant="success">목표 대비 +8.3%</Badge>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Starter', count: 112, price: 29000 },
              { label: 'Business', count: 118, price: 99000 },
              { label: 'Enterprise', count: 34, price: 299000 },
              { label: '합계', count: null, price: 112 * 29000 + 118 * 99000 + 34 * 299000 },
            ].map((r) => (
              <div key={r.label} className={`px-4 py-3 rounded-xl border ${r.label === '합계' ? 'bg-primary-50 border-primary-200' : 'bg-slate-50 border-slate-200'}`}>
                <p className="text-xs text-slate-500 mb-0.5">{r.label}</p>
                {r.count !== null && (
                  <p className="text-xs text-slate-400">{r.count}명 × ₩{r.price.toLocaleString()}</p>
                )}
                <p className={`text-lg font-bold mt-1 ${r.label === '합계' ? 'text-primary-700' : 'text-slate-800'}`}>
                  ₩{(r.count !== null ? r.count * r.price : r.price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
