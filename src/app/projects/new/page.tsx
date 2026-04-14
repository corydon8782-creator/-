'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { formatFileSize } from '@/lib/utils'
import { FILE_CATEGORY_LABELS, FileCategory } from '@/lib/types'
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  ChevronRight,
  Info,
  AlertCircle,
  Sparkles,
  FileSpreadsheet,
  Image,
  File,
} from 'lucide-react'

const STEPS = [
  { id: 1, label: '프로젝트 정보' },
  { id: 2, label: '문서 업로드' },
  { id: 3, label: 'AI 분석 실행' },
]

const WORK_TYPE_OPTIONS = [
  { value: '토목', label: '토목공사' },
  { value: '건축', label: '건축공사' },
  { value: '도로', label: '도로공사' },
  { value: '기계설비', label: '기계설비공사' },
  { value: '전기', label: '전기공사' },
  { value: '통신', label: '통신공사' },
  { value: '조경', label: '조경공사' },
  { value: '상하수도', label: '상·하수도공사' },
  { value: '기타', label: '기타' },
]

const DOCUMENT_TYPE_OPTIONS = [
  { value: 'quality_plan', label: '품질관리계획서' },
  { value: 'test_plan', label: '품질시험계획서' },
]

const FILE_CATEGORY_OPTIONS = Object.entries(FILE_CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}))

interface UploadFile {
  id: string
  file: File
  category: FileCategory
  progress: number
  status: 'uploading' | 'done' | 'error'
}

function getFileIcon(type: string) {
  if (type.includes('pdf')) return <FileText size={20} className="text-red-500" />
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('xlsx'))
    return <FileSpreadsheet size={20} className="text-green-600" />
  if (type.includes('image')) return <Image size={20} className="text-blue-500" />
  return <File size={20} className="text-slate-500" />
}

function guessCategory(name: string): FileCategory {
  const n = name.toLowerCase()
  if (n.includes('시방') || n.includes('spec')) return 'specification'
  if (n.includes('설계') || n.includes('design')) return 'design'
  if (n.includes('내역') || n.includes('물량')) return 'bill'
  if (n.includes('도면') || n.includes('drawing') || n.includes('dwg')) return 'drawing'
  if (n.includes('계약')) return 'contract'
  return 'etc'
}

export default function NewProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [dragOver, setDragOver] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisStep, setAnalysisStep] = useState('')

  const [projectInfo, setProjectInfo] = useState({
    name: '',
    workType: '토목',
    location: '',
    client: '',
    contractor: '(주)한진건설',
    supervisor: '',
    contractAmount: '',
    startDate: '',
    endDate: '',
    documentType: 'quality_plan',
  })
  const [files, setFiles] = useState<UploadFile[]>([])

  const updateInfo = (key: string, value: string) =>
    setProjectInfo((f) => ({ ...f, [key]: value }))

  // File drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const dropped = Array.from(e.dataTransfer.files)
      addFiles(dropped)
    },
    [],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files))
  }

  const addFiles = (newFiles: File[]) => {
    const uploaded: UploadFile[] = newFiles.map((f) => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      category: guessCategory(f.name),
      progress: 0,
      status: 'uploading' as const,
    }))
    setFiles((prev) => [...prev, ...uploaded])

    // Simulate upload progress
    uploaded.forEach((uf) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 20 + 10
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uf.id ? { ...f, progress: 100, status: 'done' } : f,
            ),
          )
        } else {
          setFiles((prev) =>
            prev.map((f) => (f.id === uf.id ? { ...f, progress } : f)),
          )
        }
      }, 200)
    })
  }

  const removeFile = (id: string) => setFiles((f) => f.filter((x) => x.id !== id))

  const updateFileCategory = (id: string, category: FileCategory) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, category } : f)))
  }

  const startAnalysis = async () => {
    setAnalyzing(true)
    const steps = [
      { msg: '업로드된 문서를 불러오는 중...', pct: 15 },
      { msg: '공사 개요 및 공종 분석 중...', pct: 35 },
      { msg: '자재 및 시험 항목 추출 중...', pct: 60 },
      { msg: '품질관리 기준 검토 중...', pct: 80 },
      { msg: '계획서 초안 생성 중...', pct: 95 },
      { msg: '분석 완료!', pct: 100 },
    ]

    for (const s of steps) {
      await new Promise((r) => setTimeout(r, 800))
      setAnalysisStep(s.msg)
      setAnalysisProgress(s.pct)
    }

    await new Promise((r) => setTimeout(r, 500))
    router.push('/projects/p-001/analyze')
  }

  const isStep1Valid =
    projectInfo.name && projectInfo.location && projectInfo.client && projectInfo.startDate

  return (
    <AppLayout
      breadcrumbs={[
        { label: '대시보드', href: '/dashboard' },
        { label: '프로젝트 목록', href: '/projects' },
        { label: '새 계획서 작성' },
      ]}
    >
      <div className="p-6 max-w-4xl mx-auto">
        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    step > s.id
                      ? 'bg-green-500 border-green-500 text-white'
                      : step === s.id
                      ? 'bg-primary-700 border-primary-700 text-white'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {step > s.id ? <CheckCircle2 size={16} /> : s.id}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    step === s.id ? 'text-primary-700' : step > s.id ? 'text-green-600' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 ${step > s.id ? 'bg-green-400' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Project Info */}
        {step === 1 && (
          <Card>
            <h2 className="text-base font-bold text-slate-900 mb-1">프로젝트 기본 정보 입력</h2>
            <p className="text-sm text-slate-500 mb-5">
              공사 개요를 입력하세요. AI 분석 결과와 함께 자동으로 계획서에 반영됩니다.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="공사명"
                  placeholder="○○○○ 공사"
                  value={projectInfo.name}
                  onChange={(e) => updateInfo('name', e.target.value)}
                  required
                />
              </div>
              <Select
                label="공사 종류"
                options={WORK_TYPE_OPTIONS}
                value={projectInfo.workType}
                onChange={(e) => updateInfo('workType', e.target.value)}
                required
              />
              <Select
                label="생성할 문서 유형"
                options={DOCUMENT_TYPE_OPTIONS}
                value={projectInfo.documentType}
                onChange={(e) => updateInfo('documentType', e.target.value)}
                required
              />
              <div className="md:col-span-2">
                <Input
                  label="공사 위치"
                  placeholder="○○시 ○○구 ○○동 일원"
                  value={projectInfo.location}
                  onChange={(e) => updateInfo('location', e.target.value)}
                  required
                />
              </div>
              <Input
                label="발주처"
                placeholder="LH한국토지주택공사"
                value={projectInfo.client}
                onChange={(e) => updateInfo('client', e.target.value)}
                required
              />
              <Input
                label="시공사"
                placeholder="(주)한진건설"
                value={projectInfo.contractor}
                onChange={(e) => updateInfo('contractor', e.target.value)}
              />
              <Input
                label="감리사"
                placeholder="(주)○○건설사업관리"
                value={projectInfo.supervisor}
                onChange={(e) => updateInfo('supervisor', e.target.value)}
              />
              <Input
                label="계약금액 (원)"
                placeholder="38,500,000,000"
                value={projectInfo.contractAmount}
                onChange={(e) => updateInfo('contractAmount', e.target.value)}
              />
              <Input
                label="착공일"
                type="date"
                value={projectInfo.startDate}
                onChange={(e) => updateInfo('startDate', e.target.value)}
                required
              />
              <Input
                label="준공예정일"
                type="date"
                value={projectInfo.endDate}
                onChange={(e) => updateInfo('endDate', e.target.value)}
              />
            </div>

            <div className="flex justify-end mt-6">
              <Button
                variant="primary"
                size="md"
                icon={<ChevronRight size={16} />}
                iconPosition="right"
                disabled={!isStep1Valid}
                onClick={() => setStep(2)}
              >
                다음 단계: 문서 업로드
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: File Upload */}
        {step === 2 && (
          <div className="space-y-4">
            <Card>
              <h2 className="text-base font-bold text-slate-900 mb-1">공사 관련 문서 업로드</h2>
              <p className="text-sm text-slate-500 mb-5">
                공사시방서, 설계도서, 공사내역서, 도면 등 관련 문서를 업로드하세요.
                여러 파일을 동시에 업로드할 수 있습니다.
              </p>

              {/* Info banner */}
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 mb-4">
                <Info size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  지원 형식: PDF, DOCX, XLSX, JPG, PNG, DWG.
                  공사내역서(XLSX)와 시방서(PDF)를 함께 업로드하면 AI 분석 정확도가 높아집니다.
                </p>
              </div>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                  dragOver
                    ? 'border-primary-400 bg-primary-50'
                    : 'border-slate-300 bg-slate-50 hover:border-primary-300 hover:bg-primary-50/30'
                }`}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload size={32} className={`mx-auto mb-3 ${dragOver ? 'text-primary-500' : 'text-slate-400'}`} />
                <p className="text-sm font-medium text-slate-700">
                  파일을 여기에 드래그하거나 클릭하여 업로드
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PDF, DOCX, XLSX, JPG, PNG 지원 · 파일당 최대 50MB
                </p>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept=".pdf,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.dwg"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </div>
            </Card>

            {/* File list */}
            {files.length > 0 && (
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    업로드된 파일 ({files.length}개)
                  </h3>
                  <p className="text-xs text-slate-500">
                    파일별 문서 종류를 확인하고 필요 시 변경하세요.
                  </p>
                </div>

                <div className="space-y-2">
                  {files.map((uf) => (
                    <div
                      key={uf.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-shrink-0">{getFileIcon(uf.file.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {uf.file.name}
                          </p>
                          <span className="text-xs text-slate-400 flex-shrink-0">
                            {formatFileSize(uf.file.size)}
                          </span>
                        </div>
                        {uf.status === 'uploading' && (
                          <div className="mt-1.5 w-full bg-slate-200 rounded-full h-1">
                            <div
                              className="h-1 bg-primary-500 rounded-full transition-all"
                              style={{ width: `${uf.progress}%` }}
                            />
                          </div>
                        )}
                        {uf.status === 'done' && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <CheckCircle2 size={11} className="text-green-500" />
                            <span className="text-2xs text-green-600">업로드 완료</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <select
                          value={uf.category}
                          onChange={(e) => updateFileCategory(uf.id, e.target.value as FileCategory)}
                          className="text-xs border border-slate-300 rounded px-2 py-1 bg-white text-slate-700"
                        >
                          {FILE_CATEGORY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeFile(uf.id)}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setStep(1)}>
                이전
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={<ChevronRight size={16} />}
                iconPosition="right"
                onClick={() => setStep(3)}
              >
                다음 단계: AI 분석
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Analysis */}
        {step === 3 && (
          <div className="space-y-4">
            <Card>
              <h2 className="text-base font-bold text-slate-900 mb-1">AI 분석 실행</h2>
              <p className="text-sm text-slate-500 mb-5">
                업로드한 문서를 기반으로 AI가 공사 개요, 공종, 시험 항목 등을 자동 추출합니다.
              </p>

              {/* Upload summary */}
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 mb-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">업로드 요약</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">공사명</p>
                    <p className="text-sm font-medium text-slate-800">{projectInfo.name || '(미입력)'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">발주처</p>
                    <p className="text-sm font-medium text-slate-800">{projectInfo.client || '(미입력)'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">문서 유형</p>
                    <p className="text-sm font-medium text-slate-800">
                      {projectInfo.documentType === 'quality_plan' ? '품질관리계획서' : '품질시험계획서'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">업로드 파일</p>
                    <p className="text-sm font-medium text-slate-800">
                      {files.length > 0 ? `${files.length}개 파일` : '데모 데이터 사용'}
                    </p>
                  </div>
                </div>
              </div>

              {!analyzing ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={32} className="text-primary-600" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    AI 분석 준비 완료
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                    분석에는 약 30초~2분이 소요됩니다. 분석 완료 후 결과를 검토하고
                    계획서를 편집할 수 있습니다.
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<Sparkles size={16} />}
                    onClick={startAnalysis}
                    className="px-8"
                  >
                    AI 분석 시작
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-5" />
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{analysisStep}</h3>
                  <div className="w-64 mx-auto">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>분석 진행률</span>
                      <span>{analysisProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 bg-primary-600 rounded-full transition-all duration-300"
                        style={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    {[
                      '공사 개요 분석',
                      '공종 및 자재 추출',
                      '시험 항목 매핑',
                      '품질기준 검토',
                    ].map((item, i) => (
                      <div key={item} className="flex items-center justify-center gap-2">
                        {analysisProgress > i * 25 ? (
                          <CheckCircle2 size={13} className="text-green-500" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300" />
                        )}
                        <span className={`text-xs ${analysisProgress > i * 25 ? 'text-green-600' : 'text-slate-400'}`}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {!analyzing && (
              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  이전
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
