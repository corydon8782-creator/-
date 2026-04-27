'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import DocumentPreview from '@/components/editor/DocumentPreview'
import { dummyDocument, dummyProjects } from '@/lib/dummy-data'
import { formatDate, formatDateTime } from '@/lib/utils'
import {
  Download,
  Printer,
  Eye,
  FileText,
  CheckCircle2,
  Clock,
  Edit3,
  Share2,
  History,
  ArrowLeft,
  Settings,
  AlertCircle,
  File,
} from 'lucide-react'

const project = dummyProjects[0]

const versions = [
  { id: 'v3', no: 'Rev.0 (최종)', date: '2024-04-13T16:40:00', by: '김현준', comment: '감리 확인 후 최종본', isCurrent: true },
  { id: 'v2', no: 'Rev.0', date: '2024-04-12T11:20:00', by: '김현준', comment: '시험 항목 수정', isCurrent: false },
  { id: 'v1', no: 'Rev.0 (초안)', date: '2024-04-10T10:30:00', by: '시스템(AI)', comment: 'AI 초안 생성', isCurrent: false },
]

interface PrintOption {
  id: string
  label: string
  description: string
  defaultValue: boolean
}

const printOptions: PrintOption[] = [
  { id: 'showHeader', label: '머리글 표시', description: '문서 번호, 개정번호, 회사명 표시', defaultValue: true },
  { id: 'showFooter', label: '바닥글 표시', description: '페이지 번호, 문서 제목 표시', defaultValue: true },
  { id: 'showApproval', label: '결재란 표시', description: '결재란 포함 출력', defaultValue: true },
  { id: 'showPageBreak', label: '섹션별 페이지 나누기', description: '주요 섹션마다 새 페이지 시작', defaultValue: false },
  { id: 'grayscale', label: '흑백 출력', description: '컬러 없이 흑백으로 출력', defaultValue: false },
]

export default function ExportPage() {
  const [showPreview, setShowPreview] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [options, setOptions] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(printOptions.map((o) => [o.id, o.defaultValue])),
  )

  const handleDownload = async () => {
    setDownloading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setDownloading(false)
    // In real app: generate PDF and download
    alert('PDF 다운로드가 완료되었습니다.\n(데모 환경에서는 실제 파일이 생성되지 않습니다.)')
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: '프로젝트 목록', href: '/projects' },
        { label: project.name.slice(0, 20) + '...', href: '/projects' },
        { label: 'PDF 출력' },
      ]}
      headerActions={
        <Link href="/projects/p-001/edit">
          <Button variant="secondary" size="sm" icon={<Edit3 size={14} />}>
            편집으로 돌아가기
          </Button>
        </Link>
      }
    >
      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Options */}
          <div className="lg:col-span-1 space-y-4">
            {/* Document summary */}
            <Card>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-primary-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {dummyDocument.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {dummyDocument.documentNo} · {dummyDocument.revision}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant="success" dot>완료</Badge>
                    <span className="text-2xs text-slate-400">
                      {formatDateTime(dummyDocument.updatedAt)} 수정
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {[
                  { label: '전체 섹션', value: dummyDocument.sections.filter((s) => s.isVisible).length },
                  { label: '시험 항목', value: 11 },
                  { label: '자재 항목', value: 6 },
                  { label: '결재란', value: `${dummyDocument.approvalBox.rows[0].cells.length}칸` },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 rounded-lg px-3 py-2 text-center">
                    <p className="text-lg font-bold text-slate-900">{s.value}</p>
                    <p className="text-2xs text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Print options */}
            <Card>
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Settings size={15} className="text-slate-500" />
                출력 설정
              </h3>
              <div className="space-y-3">
                {printOptions.map((opt) => (
                  <label key={opt.id} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options[opt.id]}
                      onChange={(e) =>
                        setOptions((o) => ({ ...o, [opt.id]: e.target.checked }))
                      }
                      className="w-4 h-4 mt-0.5 text-primary-700 rounded flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{opt.label}</p>
                      <p className="text-xs text-slate-400">{opt.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Card>

            {/* Version history */}
            <Card>
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <History size={15} className="text-slate-500" />
                버전 이력
              </h3>
              <div className="space-y-2">
                {versions.map((v) => (
                  <div
                    key={v.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg ${
                      v.isCurrent ? 'bg-primary-50 border border-primary-200' : 'bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-2xs font-bold flex-shrink-0 ${
                        v.isCurrent ? 'bg-primary-600 text-white' : 'bg-slate-300 text-slate-600'
                      }`}>
                        {v.isCurrent ? '●' : '○'}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-800">{v.no}</p>
                        <p className="text-2xs text-slate-400">{formatDate(v.date)} · {v.by}</p>
                      </div>
                    </div>
                    {!v.isCurrent && (
                      <button className="text-xs text-primary-600 hover:underline">다운로드</button>
                    )}
                    {v.isCurrent && (
                      <Badge variant="success" className="text-2xs">현재</Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Caution */}
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                출력 전 결재란이 올바르게 설정되어 있는지 확인하세요.
                결재자 직위 및 서명란 공간을 꼭 점검하세요.
              </p>
            </div>
          </div>

          {/* Right: Preview & Actions */}
          <div className="lg:col-span-2 space-y-4">
            {/* Action buttons */}
            <Card>
              <h3 className="text-sm font-semibold text-slate-800 mb-3">출력 / 다운로드</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Download size={18} />}
                  onClick={handleDownload}
                  loading={downloading}
                  className="flex-col h-20 gap-2"
                >
                  <span>PDF 다운로드</span>
                  <span className="text-2xs font-normal opacity-80">A4, 고화질</span>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  icon={<Printer size={18} />}
                  onClick={() => window.print()}
                  className="flex-col h-20 gap-2"
                >
                  <span>인쇄</span>
                  <span className="text-2xs font-normal opacity-70">브라우저 인쇄</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon={<Eye size={18} />}
                  onClick={() => setShowPreview((v) => !v)}
                  className="flex-col h-20 gap-2"
                >
                  <span>미리보기</span>
                  <span className="text-2xs font-normal opacity-70">전체 화면</span>
                </Button>
              </div>

              {/* Format options */}
              <div className="mt-3 flex flex-wrap gap-2">
                {['PDF (A4, 고화질)', 'PDF (A4, 표준)', 'DOCX (Word)', 'XLSX (엑셀)'].map((fmt) => (
                  <button
                    key={fmt}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    <File size={12} /> {fmt}
                  </button>
                ))}
              </div>
            </Card>

            {/* Preview */}
            <Card padding="none">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-800">문서 미리보기</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">페이지 1 / 약 4~6페이지</span>
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={<Printer size={13} />}
                    onClick={() => window.print()}
                  >
                    인쇄
                  </Button>
                </div>
              </div>

              <div className="overflow-auto max-h-[600px] p-4 bg-slate-200">
                <div className="mx-auto shadow-xl" style={{ maxWidth: '210mm' }}>
                  <DocumentPreview document={dummyDocument} />
                </div>
              </div>
            </Card>

            {/* Checklist */}
            <Card>
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-green-600" />
                출력 전 체크리스트
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { label: '공사 개요 정보 확인', done: true },
                  { label: '시험 항목 및 빈도 확인', done: true },
                  { label: '자재 목록 확인', done: true },
                  { label: '품질관리 조직 확인', done: true },
                  { label: '결재란 직위/직함 확인', done: true },
                  { label: '문서번호 및 개정번호 확인', done: true },
                  { label: '머리글/바닥글 확인', done: true },
                  { label: '첨부자료 목록 확인', done: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    {item.done ? (
                      <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
                    )}
                    <span className={item.done ? 'text-slate-700' : 'text-amber-700'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
