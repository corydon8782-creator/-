'use client'

import React, { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { currentUser } from '@/lib/dummy-data'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs'
import {
  User,
  Building,
  Bell,
  Lock,
  Shield,
  Save,
  Trash2,
  CheckCircle2,
  Key,
} from 'lucide-react'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    department: currentUser.department,
    company: currentUser.company,
  })
  const [notifications, setNotifications] = useState({
    emailOnComplete: true,
    emailOnReview: true,
    browserPush: false,
    weeklyReport: true,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    await new Promise((r) => setTimeout(r, 500))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AppLayout
      breadcrumbs={[{ label: '대시보드', href: '/dashboard' }, { label: '설정' }]}
    >
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <h1 className="text-xl font-bold text-slate-900">계정 설정</h1>

        <Tabs defaultTab="profile">
          <TabList className="mb-5">
            <Tab value="profile">프로필</Tab>
            <Tab value="notifications">알림 설정</Tab>
            <Tab value="security">보안</Tab>
            <Tab value="plan">플랜</Tab>
          </TabList>

          <TabPanel value="profile">
            <Card>
              <h2 className="text-sm font-semibold text-slate-800 mb-5 flex items-center gap-2">
                <User size={16} className="text-slate-500" /> 프로필 정보
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="성명"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  required
                />
                <Input
                  label="이메일"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  required
                />
                <Input
                  label="연락처"
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                />
                <Input
                  label="부서"
                  value={profile.department}
                  onChange={(e) => setProfile((p) => ({ ...p, department: e.target.value }))}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="회사명"
                    value={profile.company}
                    onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                {saved && (
                  <div className="flex items-center gap-1.5 text-sm text-green-600">
                    <CheckCircle2 size={15} /> 저장되었습니다.
                  </div>
                )}
                <div className="ml-auto">
                  <Button variant="primary" size="md" icon={<Save size={15} />} onClick={handleSave}>
                    저장
                  </Button>
                </div>
              </div>
            </Card>
          </TabPanel>

          <TabPanel value="notifications">
            <Card>
              <h2 className="text-sm font-semibold text-slate-800 mb-5 flex items-center gap-2">
                <Bell size={16} className="text-slate-500" /> 알림 설정
              </h2>
              <div className="space-y-4">
                {[
                  { id: 'emailOnComplete', label: '계획서 완성 시 이메일 알림', desc: 'AI 분석 및 초안 생성 완료 시 이메일을 발송합니다.' },
                  { id: 'emailOnReview', label: '검토 요청 시 이메일 알림', desc: '다른 사용자가 검토를 요청하면 이메일을 발송합니다.' },
                  { id: 'browserPush', label: '브라우저 푸시 알림', desc: '브라우저를 통해 실시간 알림을 받습니다.' },
                  { id: 'weeklyReport', label: '주간 업무 리포트', desc: '매주 월요일 오전 9시 주간 진행 현황을 이메일로 전송합니다.' },
                ].map((item) => (
                  <label key={item.id} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[item.id as keyof typeof notifications]}
                      onChange={(e) =>
                        setNotifications((n) => ({ ...n, [item.id]: e.target.checked }))
                      }
                      className="w-4 h-4 mt-0.5 text-primary-700 rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <Button variant="primary" size="md" icon={<Save size={15} />} className="mt-6" onClick={handleSave}>
                저장
              </Button>
            </Card>
          </TabPanel>

          <TabPanel value="security">
            <div className="space-y-4">
              <Card>
                <h2 className="text-sm font-semibold text-slate-800 mb-5 flex items-center gap-2">
                  <Lock size={16} className="text-slate-500" /> 비밀번호 변경
                </h2>
                <div className="space-y-3">
                  <Input label="현재 비밀번호" type="password" placeholder="현재 비밀번호를 입력하세요" />
                  <Input label="새 비밀번호" type="password" placeholder="새 비밀번호를 입력하세요" />
                  <Input label="새 비밀번호 확인" type="password" placeholder="새 비밀번호를 한 번 더 입력하세요" />
                </div>
                <Button variant="primary" size="md" className="mt-4">
                  비밀번호 변경
                </Button>
              </Card>
              <Card className="border-red-200 bg-red-50">
                <h2 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <Trash2 size={16} /> 계정 삭제
                </h2>
                <p className="text-xs text-red-600 mb-3">
                  계정을 삭제하면 모든 프로젝트, 문서, 템플릿이 영구적으로 삭제됩니다.
                  이 작업은 취소할 수 없습니다.
                </p>
                <Button variant="danger" size="sm">
                  계정 삭제 요청
                </Button>
              </Card>
            </div>
          </TabPanel>

          <TabPanel value="plan">
            <Card>
              <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Shield size={16} className="text-slate-500" /> 현재 플랜
              </h2>
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="info" className="mb-2">비즈니스 플랜</Badge>
                    <h3 className="text-xl font-bold text-slate-900">₩99,000 / 월</h3>
                    <p className="text-sm text-slate-500 mt-1">프로젝트 50개 · 팀원 10명 · AI 분석 무제한</p>
                  </div>
                  <Button variant="outline" size="sm">플랜 변경</Button>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'AI 분석', used: '23회', total: '무제한' },
                  { label: '프로젝트', used: '12개', total: '50개' },
                  { label: '문서 저장', used: '47건', total: '500건' },
                  { label: '파일 저장소', used: '2.4 GB', total: '10 GB' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-medium text-slate-800">
                      {item.used} / {item.total}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </TabPanel>
        </Tabs>
      </div>
    </AppLayout>
  )
}
