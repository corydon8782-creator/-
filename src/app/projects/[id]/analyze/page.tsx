'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs'
import { dummyAnalysisResult, dummyProjects } from '@/lib/dummy-data'
import {
  CheckCircle2,
  AlertCircle,
  Edit3,
  Plus,
  Trash2,
  ChevronRight,
  Sparkles,
  Brain,
  FileText,
  Layers,
  Package,
  FlaskConical,
  X,
} from 'lucide-react'

const project = dummyProjects[0]

export default function AnalyzePage() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState(dummyAnalysisResult)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [docType, setDocType] = useState<'quality_plan' | 'test_plan'>('quality_plan')

  const toggleWorkType = (id: string) => {
    setAnalysis((a) => ({
      ...a,
      workTypes: a.workTypes.map((w) =>
        w.id === id ? { ...w, isIncluded: !w.isIncluded } : w,
      ),
    }))
  }

  const toggleMaterial = (id: string) => {
    setAnalysis((a) => ({
      ...a,
      materials: a.materials.map((m) =>
        m.id === id ? { ...m, isIncluded: !m.isIncluded } : m,
      ),
    }))
  }

  const toggleTestItem = (id: string) => {
    setAnalysis((a) => ({
      ...a,
      testItems: a.testItems.map((t) =>
        t.id === id ? { ...t, isIncluded: !t.isRequired } : t,
      ),
    }))
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: '대시보드', href: '/dashboard' },
        { label: '프로젝트 목록', href: '/projects' },
        { label: 'AI 분석 결과' },
      ]}
      headerActions={
        <Button
          variant="primary"
          size="sm"
          icon={<ChevronRight size={15} />}
          iconPosition="right"
          onClick={() => router.push('/projects/p-001/edit')}
        >
          계획서 편집 시작
        </Button>
      }
    >
      <div className="p-6 space-y-5 max-w-6xl mx-auto">
        {/* Header summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Brain size={24} className="text-primary-700" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-bold text-slate-900">AI 분석 완료</h2>
                  <Badge variant="success" dot>분석 완료</Badge>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {analysis.workSummary}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  분석 시각: 2024.04.10 10:15 · 신뢰도: {analysis.confidence}%
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            {/* Confidence */}
            <Card className="py-3">
              <p className="text-xs text-slate-500 mb-1">분석 신뢰도</p>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-primary-700">{analysis.confidence}</span>
                <span className="text-xl font-bold text-primary-400 mb-0.5">%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                <div
                  className="h-1.5 rounded-full bg-primary-600"
                  style={{ width: `${analysis.confidence}%` }}
                />
              </div>
            </Card>

            {/* Missing fields */}
            {analysis.missingFields.length > 0 && (
              <Card className="bg-amber-50 border-amber-200 py-3">
                <div className="flex items-start gap-2">
                  <AlertCircle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800 mb-1">
                      확인 필요 항목 {analysis.missingFields.length}건
                    </p>
                    {analysis.missingFields.map((f) => (
                      <p key={f} className="text-2xs text-amber-700">• {f}</p>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Document type selection */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-800 mb-3">생성할 계획서 유형 선택</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                value: 'quality_plan' as const,
                label: '품질관리계획서',
                desc: '품질방침, 조직, 자재관리, 시험계획 등 전반적인 품질관리 체계를 수립하는 문서. 발주처 제출용.',
                icon: <FileText size={22} className="text-primary-600" />,
              },
              {
                value: 'test_plan' as const,
                label: '품질시험계획서',
                desc: '공종별 시험 항목, 시험 빈도, 합격 기준 등을 정의하는 문서. 현장 품질시험 근거 자료.',
                icon: <FlaskConical size={22} className="text-purple-600" />,
              },
            ].map((opt) => (
              <div
                key={opt.value}
                onClick={() => setDocType(opt.value)}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  docType === opt.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">{opt.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{opt.label}</p>
                    {docType === opt.value && (
                      <CheckCircle2 size={15} className="text-primary-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Analysis tabs */}
        <Card padding="none">
          <Tabs defaultTab="workTypes">
            <TabList className="px-4 border-b border-slate-200">
              <Tab value="workTypes">
                <span className="flex items-center gap-1.5">
                  <Layers size={14} />공종 ({analysis.workTypes.filter((w) => w.isIncluded).length})
                </span>
              </Tab>
              <Tab value="materials">
                <span className="flex items-center gap-1.5">
                  <Package size={14} />자재 ({analysis.materials.filter((m) => m.isIncluded).length})
                </span>
              </Tab>
              <Tab value="testItems">
                <span className="flex items-center gap-1.5">
                  <FlaskConical size={14} />시험 항목 ({analysis.testItems.length})
                </span>
              </Tab>
            </TabList>

            <TabPanel value="workTypes" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-500">
                  포함할 공종을 선택하세요. 선택된 공종을 기준으로 계획서가 작성됩니다.
                </p>
                <Badge variant="info">{analysis.workTypes.filter((w) => w.isIncluded).length}/{analysis.workTypes.length} 선택</Badge>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {analysis.workTypes.map((wt) => (
                  <div
                    key={wt.id}
                    onClick={() => toggleWorkType(wt.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      wt.isIncluded
                        ? 'bg-primary-50 border-primary-300'
                        : 'bg-white border-slate-200 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                        wt.isIncluded ? 'bg-primary-600' : 'border-2 border-slate-300'
                      }`}
                    >
                      {wt.isIncluded && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{wt.name}</p>
                      <p className="text-xs text-slate-400">{wt.code} · 공사 비율 {wt.ratio}</p>
                    </div>
                    <Badge variant={wt.isIncluded ? 'info' : 'default'} className="text-2xs">
                      {wt.isIncluded ? '포함' : '제외'}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabPanel>

            <TabPanel value="materials" className="p-4">
              <p className="text-xs text-slate-500 mb-3">
                AI가 추출한 주요 자재 목록입니다. 품질관리 대상 자재를 확인하고 수정하세요.
              </p>
              <div className="overflow-x-auto">
                <table className="editor-table w-full">
                  <thead>
                    <tr>
                      <th className="w-10 text-center">포함</th>
                      <th>자재명</th>
                      <th>규격</th>
                      <th>적용기준</th>
                      <th>단위</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.materials.map((m) => (
                      <tr
                        key={m.id}
                        className={!m.isIncluded ? 'opacity-50' : ''}
                        onClick={() => toggleMaterial(m.id)}
                      >
                        <td className="text-center">
                          <div
                            className={`w-4 h-4 rounded mx-auto flex items-center justify-center cursor-pointer ${
                              m.isIncluded ? 'bg-primary-600' : 'border-2 border-slate-300'
                            }`}
                          >
                            {m.isIncluded && <CheckCircle2 size={10} className="text-white" />}
                          </div>
                        </td>
                        <td className="font-medium">{m.name}</td>
                        <td className="text-slate-500">{m.spec}</td>
                        <td className="text-slate-500">{m.standard}</td>
                        <td className="text-slate-500">{m.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabPanel>

            <TabPanel value="testItems" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-500">
                  AI가 제안한 시험 항목입니다. 편집 화면에서 상세 수정이 가능합니다.
                </p>
                <Badge variant="info">{analysis.testItems.length}개 추출됨</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="editor-table w-full text-xs">
                  <thead>
                    <tr>
                      <th>공종</th>
                      <th>시험 항목</th>
                      <th>시험 방법</th>
                      <th>시험 빈도</th>
                      <th>합격 기준</th>
                      <th className="text-center">구분</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.testItems.map((ti) => (
                      <tr key={ti.id}>
                        <td className="text-slate-500 whitespace-nowrap">{ti.workType}</td>
                        <td className="font-medium whitespace-nowrap">{ti.itemName}</td>
                        <td className="text-slate-500">{ti.testMethod}</td>
                        <td className="text-slate-500 whitespace-nowrap">{ti.frequency}</td>
                        <td className="text-slate-500">{ti.standard}</td>
                        <td className="text-center">
                          {ti.isAiGenerated && (
                            <Badge variant="info" className="text-2xs">AI 추출</Badge>
                          )}
                          {ti.isRequired && (
                            <Badge variant="danger" className="text-2xs ml-1">필수</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabPanel>
          </Tabs>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={() => router.push('/projects/new')}>
            처음으로
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" icon={<Sparkles size={15} />}>
              재분석
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<ChevronRight size={16} />}
              iconPosition="right"
              onClick={() => router.push('/projects/p-001/edit')}
            >
              계획서 편집 시작
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
