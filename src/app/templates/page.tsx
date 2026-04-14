'use client'

import React, { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs'
import { dummyTemplates } from '@/lib/dummy-data'
import { DocumentTemplate } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import {
  BookTemplate,
  Plus,
  Copy,
  Edit3,
  Trash2,
  Star,
  Users,
  FileText,
  FlaskConical,
  Search,
  Download,
  Upload,
  Settings,
  ChevronRight,
} from 'lucide-react'

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(dummyTemplates)
  const [showCreate, setShowCreate] = useState(false)
  const [showDelete, setShowDelete] = useState<DocumentTemplate | null>(null)
  const [search, setSearch] = useState('')
  const [newTpl, setNewTpl] = useState({ name: '', type: 'quality_plan', client: '', description: '' })

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.client.includes(search),
  )

  const defaultTpls = filtered.filter((t) => t.isDefault)
  const customTpls = filtered.filter((t) => t.isCustom)

  const copyTemplate = (tpl: DocumentTemplate) => {
    const copy: DocumentTemplate = {
      ...tpl,
      id: Math.random().toString(36).slice(2),
      name: `${tpl.name} (복사본)`,
      isDefault: false,
      isCustom: true,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTemplates((prev) => [...prev, copy])
  }

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id))
    setShowDelete(null)
  }

  const createTemplate = () => {
    const tpl: DocumentTemplate = {
      id: Math.random().toString(36).slice(2),
      name: newTpl.name,
      type: newTpl.type as 'quality_plan' | 'test_plan',
      client: newTpl.client || '공통',
      description: newTpl.description,
      isDefault: false,
      isCustom: true,
      sections: [],
      approvalBox: {
        title: '결재',
        position: 'top-right',
        rows: [{ id: 'r1', cells: [
          { id: 'c1', title: '담당자', name: '', date: '' },
          { id: 'c2', title: '현장소장', name: '', date: '' },
        ]}],
      },
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTemplates((prev) => [...prev, tpl])
    setShowCreate(false)
    setNewTpl({ name: '', type: 'quality_plan', client: '', description: '' })
  }

  return (
    <AppLayout
      breadcrumbs={[{ label: '대시보드', href: '/dashboard' }, { label: '템플릿 관리' }]}
      headerActions={
        <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={() => setShowCreate(true)}>
          새 템플릿 만들기
        </Button>
      }
    >
      <div className="p-6 space-y-5">
        {/* Search */}
        <Card>
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <Input
                placeholder="템플릿명, 발주처로 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search size={16} />}
              />
            </div>
            <Button variant="secondary" size="md" icon={<Upload size={15} />}>
              가져오기
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            전체 {templates.length}개 · 표준 양식 {defaultTpls.length}개 · 사용자 정의 {customTpls.length}개
          </p>
        </Card>

        <Tabs defaultTab="all">
          <TabList className="mb-4">
            <Tab value="all">전체 ({filtered.length})</Tab>
            <Tab value="default">표준 양식 ({defaultTpls.length})</Tab>
            <Tab value="custom">사용자 정의 ({customTpls.length})</Tab>
          </TabList>

          {(['all', 'default', 'custom'] as const).map((tab) => {
            const list = tab === 'all' ? filtered : tab === 'default' ? defaultTpls : customTpls
            return (
              <TabPanel key={tab} value={tab}>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {list.map((tpl) => (
                    <Card key={tpl.id} hover padding="none">
                      <div className="p-4">
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            tpl.type === 'quality_plan' ? 'bg-primary-100' : 'bg-purple-100'
                          }`}>
                            {tpl.type === 'quality_plan'
                              ? <FileText size={18} className="text-primary-700" />
                              : <FlaskConical size={18} className="text-purple-700" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-1.5 flex-wrap">
                              <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                                {tpl.name}
                              </h3>
                              {tpl.isDefault && (
                                <Badge variant="info" className="text-2xs flex-shrink-0">
                                  <Star size={9} /> 표준
                                </Badge>
                              )}
                              {tpl.isCustom && (
                                <Badge variant="purple" className="text-2xs flex-shrink-0">
                                  맞춤
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {tpl.type === 'quality_plan' ? '품질관리계획서' : '품질시험계획서'}
                              {tpl.client !== '공통' && ` · ${tpl.client}`}
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                          {tpl.description}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-2xs text-slate-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Users size={10} /> 사용 {tpl.usageCount}회
                          </span>
                          <span>·</span>
                          <span>수정: {formatDate(tpl.updatedAt)}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1.5">
                          <Button
                            variant="primary"
                            size="xs"
                            icon={<ChevronRight size={12} />}
                            iconPosition="right"
                            className="flex-1"
                            onClick={() => {/* Apply template */}}
                          >
                            이 양식으로 시작
                          </Button>
                          <Button
                            variant="secondary"
                            size="xs"
                            icon={<Copy size={12} />}
                            onClick={() => copyTemplate(tpl)}
                            title="복사"
                          />
                          {tpl.isCustom && (
                            <Button
                              variant="secondary"
                              size="xs"
                              icon={<Edit3 size={12} />}
                              title="편집"
                            />
                          )}
                          {tpl.isCustom && (
                            <Button
                              variant="ghost"
                              size="xs"
                              icon={<Trash2 size={12} />}
                              className="text-red-500 hover:bg-red-50"
                              onClick={() => setShowDelete(tpl)}
                              title="삭제"
                            />
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* Create new card */}
                  {tab !== 'default' && (
                    <button
                      onClick={() => setShowCreate(true)}
                      className="flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                      <Plus size={28} />
                      <span className="text-sm font-medium">새 템플릿 만들기</span>
                    </button>
                  )}
                </div>

                {list.length === 0 && tab !== 'all' && (
                  <Card className="py-16 text-center">
                    <BookTemplate size={40} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">
                      {tab === 'custom' ? '사용자 정의 템플릿이 없습니다.' : '표준 양식이 없습니다.'}
                    </p>
                    {tab === 'custom' && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Plus size={14} />}
                        className="mt-3"
                        onClick={() => setShowCreate(true)}
                      >
                        새로 만들기
                      </Button>
                    )}
                  </Card>
                )}
              </TabPanel>
            )
          })}
        </Tabs>
      </div>

      {/* Create template modal */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="새 템플릿 만들기"
        description="사용자 정의 양식 템플릿을 생성합니다."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>취소</Button>
            <Button
              variant="primary"
              onClick={createTemplate}
              disabled={!newTpl.name}
            >
              만들기
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="템플릿 이름"
            placeholder="예: ○○공단 품질관리계획서 양식"
            value={newTpl.name}
            onChange={(e) => setNewTpl((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Select
            label="문서 유형"
            options={[
              { value: 'quality_plan', label: '품질관리계획서' },
              { value: 'test_plan', label: '품질시험계획서' },
            ]}
            value={newTpl.type}
            onChange={(e) => setNewTpl((f) => ({ ...f, type: e.target.value }))}
            required
          />
          <Input
            label="발주처 (선택)"
            placeholder="특정 발주처용이면 입력, 없으면 비워두세요"
            value={newTpl.client}
            onChange={(e) => setNewTpl((f) => ({ ...f, client: e.target.value }))}
            hint="비워두면 '공통' 으로 저장됩니다."
          />
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">설명</label>
            <textarea
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
              placeholder="이 템플릿에 대한 설명을 입력하세요"
              value={newTpl.description}
              onChange={(e) => setNewTpl((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
            <strong>TIP:</strong> 기존 표준 양식을 복사한 후 수정하면 더 빠르게 맞춤 템플릿을 만들 수 있습니다.
          </div>
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        open={!!showDelete}
        onClose={() => setShowDelete(null)}
        title="템플릿 삭제"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDelete(null)}>취소</Button>
            <Button variant="danger" onClick={() => showDelete && deleteTemplate(showDelete.id)}>
              삭제
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-700">
          <strong>{showDelete?.name}</strong> 템플릿을 삭제하시겠습니까?
        </p>
        <p className="text-xs text-slate-500 mt-1">이 작업은 되돌릴 수 없습니다.</p>
      </Modal>
    </AppLayout>
  )
}
