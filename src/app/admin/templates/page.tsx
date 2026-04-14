'use client'

import React, { useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { dummyTemplates } from '@/lib/dummy-data'
import { formatDate } from '@/lib/utils'
import {
  BookTemplate, Star, FileText, FlaskConical,
  Search, Plus, Edit3, Trash2, Globe, Lock,
  Users, Eye, Download, Upload,
} from 'lucide-react'

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState(dummyTemplates)
  const [search, setSearch] = useState('')
  const [showUpload, setShowUpload] = useState(false)

  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.client.includes(search)
  )

  const toggleDefault = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, isDefault: !t.isDefault } : t))
  }

  return (
    <AdminLayout
      breadcrumbs={[{ label: '관리자 대시보드', href: '/admin' }, { label: '템플릿 관리' }]}
      headerActions={
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={<Upload size={14} />} onClick={() => setShowUpload(true)}>
            양식 업로드
          </Button>
          <Button variant="primary" size="sm" icon={<Plus size={14} />}>
            표준 양식 추가
          </Button>
        </div>
      }
    >
      <div className="p-6 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '전체 템플릿', count: templates.length, icon: <BookTemplate size={20} />, color: 'bg-slate-100 text-slate-700' },
            { label: '표준 양식', count: templates.filter(t => t.isDefault).length, icon: <Star size={20} />, color: 'bg-amber-100 text-amber-700' },
            { label: '사용자 정의', count: templates.filter(t => t.isCustom).length, icon: <Globe size={20} />, color: 'bg-blue-100 text-blue-700' },
          ].map(s => (
            <Card key={s.label}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{s.count}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search */}
        <Card>
          <Input placeholder="템플릿명, 발주처로 검색" value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search size={16} />} />
        </Card>

        {/* Template table */}
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {['템플릿명', '유형', '발주처', '구분', '사용 횟수', '수정일', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(tpl => (
                  <tr key={tpl.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {tpl.type === 'quality_plan'
                          ? <FileText size={15} className="text-primary-500 flex-shrink-0" />
                          : <FlaskConical size={15} className="text-purple-500 flex-shrink-0" />
                        }
                        <span className="font-medium text-slate-800">{tpl.name}</span>
                        {tpl.isDefault && <Star size={11} className="text-amber-500 flex-shrink-0" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default" className="text-2xs">
                        {tpl.type === 'quality_plan' ? '품질관리계획서' : '품질시험계획서'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{tpl.client}</td>
                    <td className="px-4 py-3">
                      {tpl.isDefault
                        ? <Badge variant="warning" className="text-2xs flex items-center gap-1 w-fit"><Star size={9} /> 표준</Badge>
                        : <Badge variant="info" className="text-2xs flex items-center gap-1 w-fit"><Globe size={9} /> 사용자 정의</Badge>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Users size={12} />
                        <span>{tpl.usageCount}회</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(tpl.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="xs" icon={<Eye size={13} />} title="미리보기" />
                        <Button variant="ghost" size="xs" icon={<Edit3 size={13} />} title="편집" />
                        <Button
                          variant="ghost" size="xs"
                          icon={<Star size={13} className={tpl.isDefault ? 'text-amber-500' : 'text-slate-400'} />}
                          onClick={() => toggleDefault(tpl.id)}
                          title={tpl.isDefault ? '표준 해제' : '표준으로 지정'}
                        />
                        <Button variant="ghost" size="xs" icon={<Trash2 size={13} />} className="text-red-400 hover:bg-red-50" title="삭제" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Modal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        title="표준 양식 업로드"
        description="새 표준 양식 파일을 업로드합니다. DOCX 또는 JSON 형식을 지원합니다."
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowUpload(false)}>취소</Button>
            <Button variant="primary">업로드</Button>
          </>
        }
      >
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
          <Upload size={28} className="text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">파일을 드래그하거나 클릭하여 업로드</p>
          <p className="text-xs text-slate-400 mt-1">DOCX, JSON 지원 · 최대 20MB</p>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          업로드된 양식은 관리자 검토 후 표준 양식으로 게시됩니다.
        </p>
      </Modal>
    </AdminLayout>
  )
}
