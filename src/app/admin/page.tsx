'use client'

import React from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import {
  adminStats,
  adminUsers,
  systemLogs,
  planUsageData,
  monthlyAnalysisData,
} from '@/lib/admin-data'
import { formatDateTime } from '@/lib/utils'
import {
  Users,
  FolderOpen,
  FileText,
  Brain,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronRight,
  Activity,
  Database,
  Cpu,
} from 'lucide-react'

function StatCard({
  label,
  value,
  sub,
  icon,
  color,
  trend,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ReactNode
  color: string
  trend?: string
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
          {trend && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp size={11} /> {trend}
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

function SimpleBarChart({ data }: { data: { month: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count))
  return (
    <div className="flex items-end gap-3 h-24">
      {data.map((d) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-2xs text-slate-500">{d.count}</span>
          <div
            className="w-full bg-primary-500 rounded-t-sm min-h-[4px] transition-all"
            style={{ height: `${(d.count / max) * 80}px` }}
          />
          <span className="text-2xs text-slate-400">{d.month}</span>
        </div>
      ))}
    </div>
  )
}

const LOG_ICONS: Record<string, React.ReactNode> = {
  info: <Info size={13} className="text-blue-500" />,
  warn: <AlertCircle size={13} className="text-amber-500" />,
  error: <AlertCircle size={13} className="text-red-500" />,
}

export default function AdminDashboard() {
  const recentLogs = systemLogs.slice(0, 6)
  const recentUsers = adminUsers.slice(0, 5)
  const storagePercent = Math.round((adminStats.storageUsedGB / adminStats.storageMaxGB) * 100)

  return (
    <AdminLayout
      breadcrumbs={[{ label: '관리자 대시보드' }]}
    >
      <div className="p-6 space-y-6">
        {/* Alert */}
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>오늘 1건의 AI 분석 오류</strong>가 발생했습니다.
            DWG 파일 파싱 모듈 점검이 필요합니다.
          </p>
          <Link href="/admin/logs" className="ml-auto">
            <Button variant="ghost" size="xs" className="text-amber-700 hover:bg-amber-100">
              로그 확인 <ChevronRight size={12} className="ml-1" />
            </Button>
          </Link>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="전체 사용자"
            value={adminStats.totalUsers.toLocaleString()}
            sub={`활성 ${adminStats.activeUsers}명`}
            icon={<Users size={22} className="text-primary-600" />}
            color="bg-primary-50"
            trend="이번 달 +28명"
          />
          <StatCard
            label="전체 프로젝트"
            value={adminStats.totalProjects.toLocaleString()}
            sub={`진행 중 ${adminStats.activeProjects}건`}
            icon={<FolderOpen size={22} className="text-slate-600" />}
            color="bg-slate-100"
            trend="이번 달 +67건"
          />
          <StatCard
            label="생성된 문서"
            value={adminStats.totalDocuments.toLocaleString()}
            icon={<FileText size={22} className="text-green-600" />}
            color="bg-green-50"
            trend="이번 달 +142건"
          />
          <StatCard
            label="AI 분석 (전체)"
            value={adminStats.aiAnalysisCount.toLocaleString()}
            sub={`이번 달 ${adminStats.aiAnalysisThisMonth}회`}
            icon={<Brain size={22} className="text-purple-600" />}
            color="bg-purple-50"
            trend="전월 대비 +12.8%"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* AI Analysis Chart */}
          <Card className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">월별 AI 분석 현황</h3>
              <Badge variant="info">최근 6개월</Badge>
            </div>
            <SimpleBarChart data={monthlyAnalysisData} />
          </Card>

          {/* Plan distribution */}
          <Card className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">플랜별 사용자 분포</h3>
            <div className="space-y-3">
              {planUsageData.map((p) => {
                const total = planUsageData.reduce((s, x) => s + x.count, 0)
                const pct = Math.round((p.count / total) * 100)
                return (
                  <div key={p.plan} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${p.color}`} />
                    <span className="text-xs text-slate-600 w-20">{p.plan}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${p.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-700 w-10 text-right">
                      {p.count}명
                    </span>
                    <span className="text-2xs text-slate-400 w-8 text-right">{pct}%</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-slate-900">
                  {planUsageData.reduce((s, p) => s + p.count, 0)}
                </p>
                <p className="text-2xs text-slate-500">전체 사용자</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  {planUsageData.filter(p => p.plan !== '무료').reduce((s, p) => s + p.count, 0)}
                </p>
                <p className="text-2xs text-slate-500">유료 사용자</p>
              </div>
            </div>
          </Card>

          {/* System health */}
          <Card className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">시스템 상태</h3>
            <div className="space-y-3">
              {[
                { label: 'AI 분석 서버', status: 'normal', value: '정상 운영' },
                { label: 'PDF 생성 서버', status: 'normal', value: '정상 운영' },
                { label: '파일 저장소', status: 'warn', value: `${storagePercent}% 사용 중` },
                { label: 'DB 서버', status: 'normal', value: '응답 12ms' },
                { label: 'DWG 파싱 모듈', status: 'error', value: '오류 점검 중' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      item.status === 'normal' ? 'bg-green-500' :
                      item.status === 'warn' ? 'bg-amber-400' : 'bg-red-500'
                    } ${item.status !== 'normal' ? 'animate-pulse' : ''}`} />
                    <span className="text-xs text-slate-700">{item.label}</span>
                  </div>
                  <span className={`text-xs font-medium ${
                    item.status === 'normal' ? 'text-green-600' :
                    item.status === 'warn' ? 'text-amber-600' : 'text-red-600'
                  }`}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Storage bar */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1"><Database size={11} /> 스토리지</span>
                <span className="font-medium">{adminStats.storageUsedGB} / {adminStats.storageMaxGB} GB</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${storagePercent > 80 ? 'bg-amber-500' : 'bg-primary-500'}`}
                  style={{ width: `${storagePercent}%` }}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent users */}
          <Card padding="none">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">최근 가입 사용자</h3>
              <Link href="/admin/users">
                <Button variant="ghost" size="xs" icon={<ChevronRight size={12} />} iconPosition="right">
                  전체 보기
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0">
                    {user.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.company}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge
                      variant={
                        user.plan === 'enterprise' ? 'purple' :
                        user.plan === 'business' ? 'info' :
                        user.plan === 'starter' ? 'success' : 'default'
                      }
                      className="text-2xs"
                    >
                      {user.plan}
                    </Badge>
                    <Badge
                      variant={user.status === 'active' ? 'success' : user.status === 'suspended' ? 'danger' : 'default'}
                      dot
                      className="text-2xs"
                    >
                      {user.status === 'active' ? '활성' : user.status === 'suspended' ? '정지' : '비활성'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* System logs */}
          <Card padding="none">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">최근 시스템 로그</h3>
              <Link href="/admin/logs">
                <Button variant="ghost" size="xs" icon={<ChevronRight size={12} />} iconPosition="right">
                  전체 보기
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start gap-3 px-4 py-3 ${log.level === 'error' ? 'bg-red-50' : log.level === 'warn' ? 'bg-amber-50' : ''}`}
                >
                  <div className="flex-shrink-0 mt-0.5">{LOG_ICONS[log.level]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-800 leading-snug">{log.message}</p>
                    <p className="text-2xs text-slate-400 mt-0.5">
                      {log.user} · {log.company}
                    </p>
                  </div>
                  <span className="text-2xs text-slate-400 flex-shrink-0 whitespace-nowrap">
                    {formatDateTime(log.createdAt).split(' ')[1]}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
