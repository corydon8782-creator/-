'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import SectionList from '@/components/editor/SectionList'
import SectionEditor from '@/components/editor/SectionEditor'
import ApprovalBoxEditor from '@/components/editor/ApprovalBoxEditor'
import DocumentPreview from '@/components/editor/DocumentPreview'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs'
import { dummyDocument, dummyProjects } from '@/lib/dummy-data'
import { DocumentSection, QualityDocument, SectionType } from '@/lib/types'
import { formatDateTime } from '@/lib/utils'
import {
  Save,
  Download,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Settings,
  History,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Printer,
} from 'lucide-react'

const project = dummyProjects[0]

const NEW_SECTION_TYPES: { type: SectionType; label: string; icon: string }[] = [
  { type: 'text', label: '텍스트 섹션', icon: '📝' },
  { type: 'table', label: '표 섹션', icon: '📊' },
  { type: 'heading', label: '소제목', icon: '📌' },
  { type: 'organization', label: '조직 구성', icon: '👥' },
  { type: 'material', label: '자재 관리', icon: '📦' },
  { type: 'test_items', label: '시험 항목 표', icon: '🧪' },
  { type: 'attachment', label: '첨부자료', icon: '📎' },
]

function createNewSection(type: SectionType, order: number): DocumentSection {
  const base = { id: Math.random().toString(36).slice(2), type, order, isVisible: true, isLocked: false }

  switch (type) {
    case 'text':
      return { ...base, title: '새 섹션', content: { kind: 'text', body: '', isAiGenerated: false } }
    case 'table':
      return {
        ...base, title: '새 표',
        content: { kind: 'table', headers: ['항목 1', '항목 2', '항목 3'], rows: [['', '', '']] },
      }
    case 'organization':
      return {
        ...base, title: '품질관리 조직',
        content: { kind: 'organization', members: [] },
      }
    case 'test_items':
      return {
        ...base, title: '시험 항목',
        content: { kind: 'test_items', items: [] },
      }
    default:
      return { ...base, title: '새 섹션', content: { kind: 'text', body: '', isAiGenerated: false } }
  }
}

export default function EditorPage() {
  const router = useRouter()
  const [doc, setDoc] = useState<QualityDocument>(dummyDocument)
  const [activeSection, setActiveSection] = useState<string | null>(doc.sections[1]?.id ?? null)
  const [showPreview, setShowPreview] = useState(false)
  const [showAddSection, setShowAddSection] = useState(false)
  const [showVersions, setShowVersions] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [rightTab, setRightTab] = useState<'edit' | 'approval'>('edit')
  const [lastSaved, setLastSaved] = useState<string | null>('2024-04-13T16:40:00')
  const [isSaving, setIsSaving] = useState(false)
  const [leftCollapsed, setLeftCollapsed] = useState(false)

  // Autosave simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setIsSaving(true)
      setTimeout(() => {
        setLastSaved(new Date().toISOString())
        setIsSaving(false)
      }, 600)
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const currentSection = doc.sections.find((s) => s.id === activeSection)

  const updateSection = (updated: DocumentSection) => {
    setDoc((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === updated.id ? updated : s)),
      updatedAt: new Date().toISOString(),
    }))
  }

  const toggleVisible = (id: string) => {
    setDoc((d) => ({
      ...d,
      sections: d.sections.map((s) =>
        s.id === id && !s.isLocked ? { ...s, isVisible: !s.isVisible } : s,
      ),
    }))
  }

  const addSection = (type: SectionType) => {
    const newSection = createNewSection(type, doc.sections.length + 1)
    setDoc((d) => ({ ...d, sections: [...d.sections, newSection] }))
    setActiveSection(newSection.id)
    setShowAddSection(false)
  }

  const removeSection = (id: string) => {
    const section = doc.sections.find((s) => s.id === id)
    if (section?.isLocked) return
    setDoc((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== id) }))
    if (activeSection === id) setActiveSection(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    setLastSaved(new Date().toISOString())
    setIsSaving(false)
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: '프로젝트 목록', href: '/projects' },
        { label: project.name.slice(0, 20) + '...', href: '/projects' },
        { label: '계획서 편집' },
      ]}
      headerActions={
        <div className="flex items-center gap-2">
          {/* Save status */}
          <div className="flex items-center gap-1.5 text-xs">
            {isSaving ? (
              <>
                <div className="w-3 h-3 border-2 border-slate-300 border-t-primary-500 rounded-full animate-spin" />
                <span className="text-slate-500">저장 중...</span>
              </>
            ) : lastSaved ? (
              <>
                <CheckCircle2 size={13} className="text-green-500" />
                <span className="text-slate-500 hidden sm:block">
                  {formatDateTime(lastSaved)} 자동저장
                </span>
              </>
            ) : null}
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={<History size={14} />}
            onClick={() => setShowVersions(true)}
            className="hidden sm:flex"
          >
            버전
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? '편집' : '미리보기'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Save size={14} />}
            onClick={handleSave}
            loading={isSaving}
          >
            저장
          </Button>
          <Link href="/projects/p-001/export">
            <Button variant="primary" size="sm" icon={<Download size={14} />}>
              PDF 출력
            </Button>
          </Link>
        </div>
      }
    >
      <div className="flex h-full overflow-hidden">
        {/* LEFT: Section navigator */}
        <aside
          className={`flex flex-col border-r border-slate-200 bg-white transition-all duration-200 flex-shrink-0 ${
            leftCollapsed ? 'w-0 overflow-hidden' : 'w-64'
          }`}
        >
          <div className="flex items-center justify-between px-3 py-3 border-b border-slate-200 bg-slate-50">
            <span className="text-xs font-semibold text-slate-700">목차 구성</span>
            <button
              onClick={() => setShowAddSection(true)}
              className="p-1 rounded text-slate-500 hover:bg-slate-200 hover:text-slate-700"
            >
              <Plus size={15} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2 px-1.5">
            <SectionList
              sections={doc.sections}
              activeId={activeSection}
              onSelect={setActiveSection}
              onToggleVisible={toggleVisible}
            />
          </div>

          <div className="px-3 py-3 border-t border-slate-200 bg-slate-50">
            <button
              onClick={() => setShowAddSection(true)}
              className="w-full py-2 border-2 border-dashed border-slate-300 rounded-md text-xs text-slate-400 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center gap-1"
            >
              <Plus size={13} /> 섹션 추가
            </button>
          </div>
        </aside>

        {/* Toggle left panel */}
        <button
          onClick={() => setLeftCollapsed((v) => !v)}
          className="w-4 flex-shrink-0 flex items-center justify-center bg-slate-100 hover:bg-slate-200 border-r border-slate-200 transition-colors"
        >
          {leftCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* MAIN: Editor or Preview */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {showPreview ? (
            // Document Preview
            <div className="py-8 px-4 flex justify-center">
              <div className="no-print w-full max-w-[210mm] flex justify-end mb-2 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Printer size={14} />}
                  onClick={() => window.print()}
                >
                  인쇄
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<EyeOff size={14} />}
                  onClick={() => setShowPreview(false)}
                >
                  편집으로 돌아가기
                </Button>
              </div>
              <DocumentPreview document={doc} />
            </div>
          ) : (
            // Editor
            <div className="p-6">
              {currentSection ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-card">
                  {/* Section header */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="text-2xs">{currentSection.type}</Badge>
                      <span className="text-xs text-slate-500">
                        {currentSection.isLocked ? '🔒 잠금 섹션' : '편집 가능'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleVisible(currentSection.id)}
                        className="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        title={currentSection.isVisible ? '숨기기' : '표시'}
                      >
                        {currentSection.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      {!currentSection.isLocked && (
                        <button
                          onClick={() => removeSection(currentSection.id)}
                          className="p-1.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50"
                          title="섹션 삭제"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right tab: Edit / Approval */}
                  <div className="px-5 pt-5 pb-8">
                    <SectionEditor
                      section={currentSection}
                      onUpdate={updateSection}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FileText size={40} className="text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">왼쪽 목차에서 편집할 섹션을 선택하세요</p>
                  <p className="text-sm text-slate-400 mt-1">또는 새 섹션을 추가할 수 있습니다</p>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Plus size={14} />}
                    className="mt-4"
                    onClick={() => setShowAddSection(true)}
                  >
                    섹션 추가
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* RIGHT: Approval box editor */}
        <aside className="w-72 flex-shrink-0 border-l border-slate-200 bg-white flex flex-col hidden xl:flex">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <p className="text-xs font-semibold text-slate-700">결재란 설정</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ApprovalBoxEditor
              approvalBox={doc.approvalBox}
              onChange={(box) => setDoc((d) => ({ ...d, approvalBox: box }))}
            />
          </div>
        </aside>
      </div>

      {/* Add section modal */}
      <Modal
        open={showAddSection}
        onClose={() => setShowAddSection(false)}
        title="섹션 추가"
        description="문서에 추가할 섹션 유형을 선택하세요."
        size="sm"
      >
        <div className="grid grid-cols-2 gap-2">
          {NEW_SECTION_TYPES.map((s) => (
            <button
              key={s.type}
              onClick={() => addSection(s.type)}
              className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 text-left transition-colors"
            >
              <span className="text-xl">{s.icon}</span>
              <span className="text-sm font-medium text-slate-700">{s.label}</span>
            </button>
          ))}
        </div>
      </Modal>

      {/* Version history modal */}
      <Modal
        open={showVersions}
        onClose={() => setShowVersions(false)}
        title="저장 이력"
        description="문서의 저장 이력입니다. 이전 버전으로 되돌릴 수 있습니다."
        size="md"
      >
        <div className="space-y-2">
          {doc.versions.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  v.isAutoSave ? 'bg-slate-100' : 'bg-primary-100'
                }`}>
                  {v.isAutoSave ? <Clock size={13} className="text-slate-500" /> : <Save size={13} className="text-primary-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{v.versionNo}</p>
                  <p className="text-xs text-slate-500">{v.comment} · {v.createdBy}</p>
                  <p className="text-2xs text-slate-400">{formatDateTime(v.createdAt)}</p>
                </div>
              </div>
              <Button variant="ghost" size="xs">
                복원
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </AppLayout>
  )
}
