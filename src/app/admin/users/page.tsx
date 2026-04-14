'use client'

import React, { useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import { adminUsers, AdminUser } from '@/lib/admin-data'
import { formatDate, formatDateTime } from '@/lib/utils'
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Edit3,
  Trash2,
  Ban,
  CheckCircle2,
  Mail,
  Building,
  Shield,
  Filter,
  Download,
  Eye,
  RefreshCw,
} from 'lucide-react'

const PLAN_OPTIONS = [
  { value: '', label: '전체 플랜' },
  { value: 'free', label: '무료' },
  { value: 'starter', label: 'Starter' },
  { value: 'business', label: 'Business' },
  { value: 'enterprise', label: 'Enterprise' },
]

const STATUS_OPTIONS = [
  { value: '', label: '전체 상태' },
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
  { value: 'suspended', label: '정지' },
]

const ROLE_OPTIONS_FILTER = [
  { value: '', label: '전체 역할' },
  { value: 'admin', label: '관리자' },
  { value: 'manager', label: '매니저' },
  { value: 'user', label: '일반 사용자' },
]

const PLAN_BADGE: Record<string, 'default' | 'info' | 'purple' | 'success'> = {
  free: 'default',
  starter: 'success',
  business: 'info',
  enterprise: 'purple',
}

const PLAN_LABELS: Record<string, string> = {
  free: '무료',
  starter: 'Starter',
  business: 'Business',
  enterprise: 'Enterprise',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState(adminUsers)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.includes(search) ||
      u.email.includes(search) ||
      u.company.includes(search)
    const matchPlan = !planFilter || u.plan === planFilter
    const matchStatus = !statusFilter || u.status === statusFilter
    const matchRole = !roleFilter || u.role === roleFilter
    return matchSearch && matchPlan && matchStatus && matchRole
  })

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u,
      ),
    )
    setOpenMenuId(null)
  }

  const activeCount = users.filter((u) => u.status === 'active').length
  const suspendedCount = users.filter((u) => u.status === 'suspended').length

  return (
    <AdminLayout
      breadcrumbs={[
        { label: '관리자 대시보드', href: '/admin' },
        { label: '사용자 관리' },
      ]}
      headerActions={
        <Button variant="primary" size="sm" icon={<UserPlus size={15} />}>
          사용자 초대
        </Button>
      }
    >
      <div className="p-6 space-y-4">
        {/* Summary row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '전체', count: users.length, color: 'text-slate-700', bg: 'bg-slate-100' },
            { label: '활성', count: activeCount, color: 'text-green-700', bg: 'bg-green-50' },
            { label: '비활성', count: users.filter(u => u.status === 'inactive').length, color: 'text-slate-500', bg: 'bg-slate-50' },
            { label: '정지', count: suspendedCount, color: 'text-red-700', bg: 'bg-red-50' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3 text-center border border-slate-200`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="이름, 이메일, 회사명으로 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search size={16} />}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select options={PLAN_OPTIONS} value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="min-w-[110px]" />
              <Select options={STATUS_OPTIONS} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="min-w-[100px]" />
              <Select options={ROLE_OPTIONS_FILTER} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="min-w-[120px]" />
              <Button variant="secondary" size="md" icon={<Download size={14} />}>내보내기</Button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            전체 {users.length}명 중 <strong>{filtered.length}명</strong> 표시 중
          </p>
        </Card>

        {/* User table */}
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">사용자</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">회사 / 부서</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">플랜</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">상태</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">프로젝트</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">최근 접속</th>
                  <th className="px-4 py-3 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700">{user.company}</p>
                      <p className="text-xs text-slate-400">{user.department}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={PLAN_BADGE[user.plan]} className="text-2xs">
                        {PLAN_LABELS[user.plan]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={user.status === 'active' ? 'success' : user.status === 'suspended' ? 'danger' : 'default'}
                        dot
                        className="text-2xs"
                      >
                        {user.status === 'active' ? '활성' : user.status === 'suspended' ? '계정 정지' : '비활성'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="font-semibold text-slate-800">{user.projectCount}</p>
                          <p className="text-2xs text-slate-400">프로젝트</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-slate-800">{user.documentCount}</p>
                          <p className="text-2xs text-slate-400">문서</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {formatDateTime(user.lastLoginAt)}
                    </td>
                    <td className="px-4 py-3 relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                        className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openMenuId === user.id && (
                        <div className="absolute right-4 top-10 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[150px]">
                          <button
                            onClick={() => { setSelectedUser(user); setShowDetail(true); setOpenMenuId(null) }}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full"
                          >
                            <Eye size={14} /> 상세 보기
                          </button>
                          <button
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full"
                          >
                            <Mail size={14} /> 이메일 발송
                          </button>
                          <button
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full"
                          >
                            <Edit3 size={14} /> 플랜 변경
                          </button>
                          <hr className="my-1 border-slate-200" />
                          <button
                            onClick={() => toggleStatus(user.id)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm w-full ${
                              user.status === 'active'
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {user.status === 'active'
                              ? <><Ban size={14} /> 계정 정지</>
                              : <><CheckCircle2 size={14} /> 계정 활성화</>
                            }
                          </button>
                          <button
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                          >
                            <Trash2 size={14} /> 계정 삭제
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-slate-400">검색 결과가 없습니다.</p>
            </div>
          )}
        </Card>
      </div>

      {/* User detail modal */}
      <Modal
        open={showDetail && !!selectedUser}
        onClose={() => setShowDetail(false)}
        title={selectedUser?.name ?? ''}
        description={`${selectedUser?.company} · ${selectedUser?.department}`}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDetail(false)}>닫기</Button>
            <Button variant="primary">플랜 변경</Button>
          </>
        }
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: '이메일', value: selectedUser.email },
                { label: '플랜', value: PLAN_LABELS[selectedUser.plan] },
                { label: '역할', value: selectedUser.role },
                { label: '가입일', value: formatDate(selectedUser.createdAt) },
                { label: '최근 접속', value: formatDateTime(selectedUser.lastLoginAt) },
                { label: '프로젝트', value: `${selectedUser.projectCount}건` },
                { label: '생성 문서', value: `${selectedUser.documentCount}건` },
                { label: '상태', value: selectedUser.status === 'active' ? '활성' : selectedUser.status === 'suspended' ? '계정 정지' : '비활성' },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                  <p className="font-medium text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>

            {selectedUser.status === 'suspended' && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                <Ban size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">이 계정은 현재 정지 상태입니다. 계정 활성화를 통해 접속을 허용할 수 있습니다.</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}
