'use client'

import React, { useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs'
import { CheckCircle2, Save, AlertTriangle, Brain, Shield, Database, Mail, Bell } from 'lucide-react'

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [aiSettings, setAiSettings] = useState({
    model: 'claude-opus-4-6',
    maxPages: '200',
    maxFileSizeMB: '50',
    confidenceThreshold: '70',
    autoRetryOnFail: true,
    enableDwgParsing: false,
  })
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.qualityai.co.kr',
    smtpPort: '587',
    senderName: 'QualityAI 알림',
    senderEmail: 'noreply@qualityai.co.kr',
    enableWelcomeEmail: true,
    enableAnalysisComplete: true,
  })
  const [planSettings] = useState([
    { plan: 'free', label: '무료', projects: 2, docs: 5, aiAnalysis: 3, storage: '500 MB', price: 0 },
    { plan: 'starter', label: 'Starter', projects: 10, docs: 50, aiAnalysis: 30, storage: '5 GB', price: 29000 },
    { plan: 'business', label: 'Business', projects: 50, docs: 500, aiAnalysis: -1, storage: '10 GB', price: 99000 },
    { plan: 'enterprise', label: 'Enterprise', projects: -1, docs: -1, aiAnalysis: -1, storage: '무제한', price: 299000 },
  ])

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 500))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AdminLayout
      breadcrumbs={[
        { label: '관리자 대시보드', href: '/admin' },
        { label: '시스템 설정' },
      ]}
      headerActions={
        <Button variant="primary" size="sm" icon={<Save size={14} />} onClick={handleSave}>
          {saved ? '저장됨 ✓' : '저장'}
        </Button>
      }
    >
      <div className="p-6 max-w-4xl">
        <Tabs defaultTab="ai">
          <TabList className="mb-5">
            <Tab value="ai">AI 설정</Tab>
            <Tab value="plans">플랜 설정</Tab>
            <Tab value="email">이메일/알림</Tab>
            <Tab value="security">보안 설정</Tab>
          </TabList>

          {/* AI Settings */}
          <TabPanel value="ai">
            <div className="space-y-4">
              <Card>
                <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Brain size={16} className="text-purple-500" /> AI 분석 엔진 설정
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label="AI 모델"
                    options={[
                      { value: 'claude-opus-4-6', label: 'Claude Opus 4.6 (최고 정확도)' },
                      { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (균형)' },
                      { value: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 (빠른 처리)' },
                    ]}
                    value={aiSettings.model}
                    onChange={(e) => setAiSettings(s => ({ ...s, model: e.target.value }))}
                  />
                  <Input
                    label="최소 신뢰도 기준 (%)"
                    type="number"
                    value={aiSettings.confidenceThreshold}
                    onChange={(e) => setAiSettings(s => ({ ...s, confidenceThreshold: e.target.value }))}
                    hint="이 기준 미만 시 경고 표시"
                  />
                  <Input
                    label="최대 파일 크기 (MB)"
                    type="number"
                    value={aiSettings.maxFileSizeMB}
                    onChange={(e) => setAiSettings(s => ({ ...s, maxFileSizeMB: e.target.value }))}
                  />
                  <Input
                    label="최대 PDF 페이지 수"
                    type="number"
                    value={aiSettings.maxPages}
                    onChange={(e) => setAiSettings(s => ({ ...s, maxPages: e.target.value }))}
                  />
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    {
                      key: 'autoRetryOnFail',
                      label: '분석 실패 시 자동 재시도',
                      desc: '분석 오류 발생 시 최대 2회 자동으로 재시도합니다.',
                    },
                    {
                      key: 'enableDwgParsing',
                      label: 'DWG 파일 파싱 활성화',
                      desc: '현재 점검 중. 활성화 전 모듈 업데이트가 필요합니다.',
                      warn: true,
                    },
                  ].map((item) => (
                    <label key={item.key} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiSettings[item.key as keyof typeof aiSettings] as boolean}
                        onChange={(e) => setAiSettings(s => ({ ...s, [item.key]: e.target.checked }))}
                        className="w-4 h-4 mt-0.5 text-primary-700 rounded"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-700">{item.label}</p>
                          {item.warn && <Badge variant="warning" className="text-2xs">점검 중</Badge>}
                        </div>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </Card>

              <Card className="bg-amber-50 border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">DWG 파싱 모듈 오류</p>
                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                      DWG 파일 파싱 모듈에서 오류가 발생하고 있습니다. 현재 비활성화 상태이며,
                      모듈 v2.3.1 업데이트 후 활성화 예정입니다. 예상 복구 시간: 2024-04-15 14:00
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabPanel>

          {/* Plan settings */}
          <TabPanel value="plans">
            <Card>
              <h3 className="text-sm font-semibold text-slate-800 mb-4">플랜별 제한 설정</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      {['플랜', '프로젝트', '문서', 'AI 분석', '저장소', '월정가'].map(h => (
                        <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-slate-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {planSettings.map((p) => (
                      <tr key={p.plan} className="hover:bg-slate-50">
                        <td className="px-3 py-3 font-semibold text-slate-800">{p.label}</td>
                        <td className="px-3 py-3 text-slate-600">{p.projects === -1 ? '무제한' : `${p.projects}개`}</td>
                        <td className="px-3 py-3 text-slate-600">{p.docs === -1 ? '무제한' : `${p.docs}건`}</td>
                        <td className="px-3 py-3 text-slate-600">{p.aiAnalysis === -1 ? '무제한' : `${p.aiAnalysis}회/월`}</td>
                        <td className="px-3 py-3 text-slate-600">{p.storage}</td>
                        <td className="px-3 py-3 font-medium text-slate-800">
                          {p.price === 0 ? '무료' : `₩${p.price.toLocaleString()}/월`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 mt-3">
                * 플랜 설정 변경 시 기존 사용자에게 즉시 적용됩니다. 변경 전 공지가 필요합니다.
              </p>
            </Card>
          </TabPanel>

          {/* Email settings */}
          <TabPanel value="email">
            <Card>
              <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Mail size={16} className="text-slate-500" /> 이메일 서버 설정
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="SMTP 호스트" value={emailSettings.smtpHost} onChange={(e) => setEmailSettings(s => ({ ...s, smtpHost: e.target.value }))} />
                <Input label="SMTP 포트" value={emailSettings.smtpPort} onChange={(e) => setEmailSettings(s => ({ ...s, smtpPort: e.target.value }))} />
                <Input label="발신자 이름" value={emailSettings.senderName} onChange={(e) => setEmailSettings(s => ({ ...s, senderName: e.target.value }))} />
                <Input label="발신 이메일" type="email" value={emailSettings.senderEmail} onChange={(e) => setEmailSettings(s => ({ ...s, senderEmail: e.target.value }))} />
              </div>

              <div className="mt-5 space-y-3">
                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Bell size={14} /> 알림 이메일 설정
                </h4>
                {[
                  { key: 'enableWelcomeEmail', label: '신규 가입 환영 이메일', desc: '회원가입 완료 시 환영 이메일을 발송합니다.' },
                  { key: 'enableAnalysisComplete', label: 'AI 분석 완료 알림', desc: 'AI 분석 완료 시 사용자에게 이메일을 발송합니다.' },
                ].map((item) => (
                  <label key={item.key} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailSettings[item.key as keyof typeof emailSettings] as boolean}
                      onChange={(e) => setEmailSettings(s => ({ ...s, [item.key]: e.target.checked }))}
                      className="w-4 h-4 mt-0.5 text-primary-700 rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <Button variant="secondary" size="sm" className="mt-4">테스트 이메일 발송</Button>
            </Card>
          </TabPanel>

          {/* Security */}
          <TabPanel value="security">
            <div className="space-y-4">
              <Card>
                <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Shield size={16} className="text-slate-500" /> 인증 및 보안 설정
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="세션 만료 시간 (시간)" type="number" defaultValue="24" />
                  <Input label="최대 로그인 실패 횟수" type="number" defaultValue="5" />
                  <Input label="비밀번호 최소 길이" type="number" defaultValue="8" />
                  <Input label="계정 잠금 시간 (분)" type="number" defaultValue="30" />
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { label: '2단계 인증 (2FA) 강제 적용', desc: '관리자 계정에 2FA를 강제 적용합니다.' },
                    { label: 'IP 기반 접근 로그 기록', desc: '모든 로그인 시도의 IP 주소를 기록합니다.' },
                    { label: '파일 업로드 바이러스 검사', desc: '업로드된 파일을 자동으로 검사합니다.' },
                  ].map((item) => (
                    <label key={item.label} className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 mt-0.5 text-primary-700 rounded" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">{item.label}</p>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Database size={16} className="text-slate-500" /> 데이터 백업
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { label: '마지막 백업', value: '2024-04-14 03:00', status: 'success' },
                    { label: '백업 주기', value: '매일 오전 3시', status: 'info' },
                    { label: '백업 보존 기간', value: '30일', status: 'info' },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className="text-sm font-medium text-slate-800 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
                <Button variant="secondary" size="sm" className="mt-3">수동 백업 실행</Button>
              </Card>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
