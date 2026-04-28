'use client'

import React, { useState, useMemo } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import {
  Plus,
  Trash2,
  Edit3,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  ClipboardCheck,
  Search,
  ChevronDown,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Material {
  id: string
  name: string        // 자재명
  spec: string        // 규격
  unit: string        // 단위
  standard: string    // 적용기준
  createdAt: string
}

type LedgerType = '입고' | '출고'

interface LedgerEntry {
  id: string
  materialId: string
  date: string
  type: LedgerType
  qty: number
  unitPrice: number
  note: string
  createdAt: string
}

type InspectionResult = '합격' | '불합격' | '보류'

interface InspectionEntry {
  id: string
  materialId: string
  date: string
  inspectionType: '신규' | '재검사'
  receivedQty: number
  passedQty: number
  failedQty: number
  inspector: string
  result: InspectionResult
  note: string
  createdAt: string
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const INIT_MATERIALS: Material[] = [
  { id: 'm1', name: '레미콘', spec: '25-24-15', unit: 'm³', standard: 'KS F 4009', createdAt: '2024-03-01' },
  { id: 'm2', name: '철근', spec: 'HD16', unit: 'ton', standard: 'KS D 3504', createdAt: '2024-03-01' },
  { id: 'm3', name: '시멘트', spec: '1종 보통', unit: '포(40kg)', standard: 'KS L 5201', createdAt: '2024-03-02' },
]

const INIT_LEDGER: LedgerEntry[] = [
  { id: 'l1', materialId: 'm1', date: '2024-03-05', type: '입고', qty: 120, unitPrice: 85000, note: '1차 반입', createdAt: '2024-03-05' },
  { id: 'l2', materialId: 'm1', date: '2024-03-10', type: '출고', qty: 40, unitPrice: 85000, note: '1층 기초 타설', createdAt: '2024-03-10' },
  { id: 'l3', materialId: 'm2', date: '2024-03-06', type: '입고', qty: 15, unitPrice: 980000, note: '1차 반입', createdAt: '2024-03-06' },
  { id: 'l4', materialId: 'm2', date: '2024-03-12', type: '출고', qty: 5, unitPrice: 980000, note: '기초 배근', createdAt: '2024-03-12' },
]

const INIT_INSPECTIONS: InspectionEntry[] = [
  { id: 'i1', materialId: 'm1', date: '2024-03-05', inspectionType: '신규', receivedQty: 120, passedQty: 120, failedQty: 0, inspector: '김현준', result: '합격', note: '슬럼프·공기량 적합', createdAt: '2024-03-05' },
  { id: 'i2', materialId: 'm2', date: '2024-03-06', inspectionType: '신규', receivedQty: 15, passedQty: 14, failedQty: 1, inspector: '이정호', result: '합격', note: '불합격 1ton 반송처리', createdAt: '2024-03-06' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function genId() {
  return Math.random().toString(36).slice(2, 10)
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function comma(n: number) {
  return n.toLocaleString('ko-KR')
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-14 text-center text-slate-400">
      <Package size={36} className="mx-auto mb-2 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

// ─── Tab: 자재 목록 ────────────────────────────────────────────────────────────

function MaterialsTab({
  materials,
  onAdd,
  onEdit,
  onDelete,
}: {
  materials: Material[]
  onAdd: (m: Omit<Material, 'id' | 'createdAt'>) => void
  onEdit: (m: Material) => void
  onDelete: (id: string) => void
}) {
  const blank = { name: '', spec: '', unit: '', standard: '' }
  const [form, setForm] = useState(blank)
  const [editTarget, setEditTarget] = useState<Material | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = materials.filter(
    (m) => m.name.includes(search) || m.spec.includes(search),
  )

  function openAdd() {
    setEditTarget(null)
    setForm(blank)
    setShowModal(true)
  }

  function openEdit(m: Material) {
    setEditTarget(m)
    setForm({ name: m.name, spec: m.spec, unit: m.unit, standard: m.standard })
    setShowModal(true)
  }

  function handleSave() {
    if (!form.name.trim() || !form.unit.trim()) return
    if (editTarget) {
      onEdit({ ...editTarget, ...form })
    } else {
      onAdd(form)
    }
    setShowModal(false)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="자재명, 규격으로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={15} />}
          />
        </div>
        <Button variant="primary" size="md" icon={<Plus size={15} />} onClick={openAdd}>
          자재 등록
        </Button>
      </div>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 w-8">No.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">자재명</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">규격</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">단위</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">적용기준</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">등록일</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState message="등록된 자재가 없습니다." />
                  </td>
                </tr>
              ) : (
                filtered.map((m, i) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{m.name}</td>
                    <td className="px-4 py-3 text-slate-600">{m.spec}</td>
                    <td className="px-4 py-3 text-slate-600">{m.unit}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{m.standard}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{m.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(m)}
                          className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(m.id)}
                          className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editTarget ? '자재 수정' : '자재 등록'}
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowModal(false)}>취소</Button>
            <Button variant="primary" onClick={handleSave} disabled={!form.name.trim() || !form.unit.trim()}>
              {editTarget ? '수정' : '등록'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              자재명 <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="예) 레미콘"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">규격</label>
              <Input
                placeholder="예) 25-24-15"
                value={form.spec}
                onChange={(e) => setForm((f) => ({ ...f, spec: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                단위 <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="예) m³, ton, 포"
                value={form.unit}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">적용기준</label>
            <Input
              placeholder="예) KS F 4009"
              value={form.standard}
              onChange={(e) => setForm((f) => ({ ...f, standard: e.target.value }))}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="자재 삭제"
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>취소</Button>
            <Button
              variant="danger"
              onClick={() => { onDelete(confirmDelete!); setConfirmDelete(null) }}
            >
              삭제
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600">
          이 자재를 삭제하면 관련 수불 기록과 검사 기록도 함께 삭제됩니다. 계속하시겠습니까?
        </p>
      </Modal>
    </div>
  )
}

// ─── Tab: 수불부 ──────────────────────────────────────────────────────────────

function LedgerTab({
  materials,
  ledger,
  onAdd,
  onDelete,
}: {
  materials: Material[]
  ledger: LedgerEntry[]
  onAdd: (e: Omit<LedgerEntry, 'id' | 'createdAt'>) => void
  onDelete: (id: string) => void
}) {
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0]?.id ?? '')
  const [showModal, setShowModal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [form, setForm] = useState({
    date: today(),
    type: '입고' as LedgerType,
    qty: '',
    unitPrice: '',
    note: '',
  })

  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId)

  const entries = useMemo(
    () =>
      ledger
        .filter((e) => e.materialId === selectedMaterialId)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [ledger, selectedMaterialId],
  )

  // Running balance
  const entriesWithBalance = useMemo(() => {
    let balance = 0
    let balanceAmt = 0
    return entries.map((e) => {
      if (e.type === '입고') {
        balance += e.qty
        balanceAmt += e.qty * e.unitPrice
      } else {
        balance -= e.qty
        balanceAmt -= e.qty * e.unitPrice
      }
      return { ...e, balance, balanceAmt }
    })
  }, [entries])

  const totalIn = entries.filter((e) => e.type === '입고').reduce((s, e) => s + e.qty, 0)
  const totalOut = entries.filter((e) => e.type === '출고').reduce((s, e) => s + e.qty, 0)
  const currentBalance = totalIn - totalOut

  function handleSave() {
    const qty = parseFloat(form.qty)
    const unitPrice = parseFloat(form.unitPrice) || 0
    if (!form.date || isNaN(qty) || qty <= 0) return
    onAdd({
      materialId: selectedMaterialId,
      date: form.date,
      type: form.type,
      qty,
      unitPrice,
      note: form.note,
    })
    setShowModal(false)
    setForm({ date: today(), type: '입고', qty: '', unitPrice: '', note: '' })
  }

  return (
    <div className="space-y-4">
      {/* Material selector */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1">자재 선택</label>
            <div className="relative">
              <select
                className="w-full h-10 pl-3 pr-8 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400"
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
              >
                {materials.length === 0 && (
                  <option value="">자재를 먼저 등록해주세요</option>
                )}
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.spec}) — {m.unit}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {selectedMaterial && (
            <div className="flex gap-4 sm:border-l sm:pl-4 border-slate-200">
              <div className="text-center">
                <p className="text-xs text-slate-400">총 입고</p>
                <p className="text-sm font-semibold text-blue-600">{comma(totalIn)} {selectedMaterial.unit}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">총 출고</p>
                <p className="text-sm font-semibold text-orange-500">{comma(totalOut)} {selectedMaterial.unit}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">현재 잔량</p>
                <p className="text-sm font-semibold text-green-600">{comma(currentBalance)} {selectedMaterial.unit}</p>
              </div>
            </div>
          )}

          <Button
            variant="primary"
            size="md"
            icon={<Plus size={15} />}
            onClick={() => setShowModal(true)}
            disabled={!selectedMaterialId}
          >
            수불 입력
          </Button>
        </div>
      </Card>

      {/* Ledger table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-3 py-3 text-xs font-semibold text-slate-500 w-8">No.</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-slate-500">연월일</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500">구분</th>
                <th className="text-right px-3 py-3 text-xs font-semibold text-slate-500">수량</th>
                <th className="text-right px-3 py-3 text-xs font-semibold text-slate-500">단가(원)</th>
                <th className="text-right px-3 py-3 text-xs font-semibold text-slate-500">금액(원)</th>
                <th className="text-right px-3 py-3 text-xs font-semibold text-slate-500">잔량</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-slate-500">비고</th>
                <th className="px-3 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entriesWithBalance.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState message="수불 기록이 없습니다. 입고/출고를 입력해주세요." />
                  </td>
                </tr>
              ) : (
                entriesWithBalance.map((e, i) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 text-slate-400 text-xs">{i + 1}</td>
                    <td className="px-3 py-2.5 text-slate-700 text-xs">{e.date}</td>
                    <td className="px-3 py-2.5 text-center">
                      {e.type === '입고' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                          <ArrowDownCircle size={11} /> 입고
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
                          <ArrowUpCircle size={11} /> 출고
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium text-slate-900">
                      {e.type === '입고'
                        ? <span className="text-blue-600">+{comma(e.qty)}</span>
                        : <span className="text-orange-500">-{comma(e.qty)}</span>
                      }
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-600 text-xs">{e.unitPrice ? comma(e.unitPrice) : '—'}</td>
                    <td className="px-3 py-2.5 text-right text-slate-600 text-xs">{e.unitPrice ? comma(e.qty * e.unitPrice) : '—'}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-green-700">{comma(e.balance)}</td>
                    <td className="px-3 py-2.5 text-slate-500 text-xs">{e.note}</td>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => setConfirmDelete(e.id)}
                        className="p-1 rounded text-slate-300 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {entriesWithBalance.length > 0 && selectedMaterial && (
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200">
                  <td colSpan={3} className="px-3 py-2.5 text-xs font-semibold text-slate-600">합계</td>
                  <td className="px-3 py-2.5 text-right text-xs font-semibold text-slate-700">
                    입고 {comma(totalIn)} / 출고 {comma(totalOut)}
                  </td>
                  <td colSpan={2} />
                  <td className="px-3 py-2.5 text-right text-sm font-bold text-green-700">
                    {comma(currentBalance)} {selectedMaterial.unit}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      {/* Input Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="수불 기록 입력"
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowModal(false)}>취소</Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!form.date || !form.qty || parseFloat(form.qty) <= 0}
            >
              저장
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {selectedMaterial && (
            <div className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-600">
              자재: <strong className="text-slate-900">{selectedMaterial.name}</strong>
              {selectedMaterial.spec && ` (${selectedMaterial.spec})`}
              {' · 단위: '}<strong>{selectedMaterial.unit}</strong>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                연월일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                구분 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mt-1">
                {(['입고', '출고'] as LedgerType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                    className={`flex-1 h-10 rounded-lg text-sm font-medium border transition-colors ${
                      form.type === t
                        ? t === '입고'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                수량 <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="0"
                value={form.qty}
                onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">단가 (원)</label>
              <Input
                type="number"
                placeholder="0"
                value={form.unitPrice}
                onChange={(e) => setForm((f) => ({ ...f, unitPrice: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">비고</label>
            <Input
              placeholder="용도, 출처 등"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            />
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="수불 기록 삭제"
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>취소</Button>
            <Button variant="danger" onClick={() => { onDelete(confirmDelete!); setConfirmDelete(null) }}>삭제</Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600">이 수불 기록을 삭제하시겠습니까?</p>
      </Modal>
    </div>
  )
}

// ─── Tab: 검사 기록 ───────────────────────────────────────────────────────────

function InspectionTab({
  materials,
  inspections,
  onAdd,
  onDelete,
}: {
  materials: Material[]
  inspections: InspectionEntry[]
  onAdd: (e: Omit<InspectionEntry, 'id' | 'createdAt'>) => void
  onDelete: (id: string) => void
}) {
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0]?.id ?? '')
  const [showModal, setShowModal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [form, setForm] = useState({
    date: today(),
    inspectionType: '신규' as '신규' | '재검사',
    receivedQty: '',
    passedQty: '',
    failedQty: '',
    inspector: '',
    result: '합격' as InspectionResult,
    note: '',
  })

  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId)

  const entries = useMemo(
    () =>
      inspections
        .filter((e) => e.materialId === selectedMaterialId)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [inspections, selectedMaterialId],
  )

  const passCount = entries.filter((e) => e.result === '합격').length
  const failCount = entries.filter((e) => e.result === '불합격').length
  const passRate = entries.length ? Math.round((passCount / entries.length) * 100) : 0

  function handleSave() {
    const receivedQty = parseFloat(form.receivedQty)
    const passedQty = parseFloat(form.passedQty) || 0
    const failedQty = parseFloat(form.failedQty) || 0
    if (!form.date || isNaN(receivedQty) || receivedQty <= 0) return
    onAdd({
      materialId: selectedMaterialId,
      date: form.date,
      inspectionType: form.inspectionType,
      receivedQty,
      passedQty,
      failedQty,
      inspector: form.inspector,
      result: form.result,
      note: form.note,
    })
    setShowModal(false)
    setForm({
      date: today(),
      inspectionType: '신규',
      receivedQty: '',
      passedQty: '',
      failedQty: '',
      inspector: '',
      result: '합격',
      note: '',
    })
  }

  const RESULT_STYLE: Record<InspectionResult, string> = {
    합격: 'text-green-700 bg-green-50',
    불합격: 'text-red-700 bg-red-50',
    보류: 'text-amber-700 bg-amber-50',
  }

  return (
    <div className="space-y-4">
      {/* Selector + stats */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1">자재 선택</label>
            <div className="relative">
              <select
                className="w-full h-10 pl-3 pr-8 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-400"
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
              >
                {materials.length === 0 && <option value="">자재를 먼저 등록해주세요</option>}
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.spec}) — {m.unit}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {entries.length > 0 && (
            <div className="flex gap-4 sm:border-l sm:pl-4 border-slate-200">
              <div className="text-center">
                <p className="text-xs text-slate-400">검사 횟수</p>
                <p className="text-sm font-semibold text-slate-800">{entries.length}회</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">합격</p>
                <p className="text-sm font-semibold text-green-600">{passCount}회</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">불합격</p>
                <p className="text-sm font-semibold text-red-500">{failCount}회</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">합격률</p>
                <p className="text-sm font-semibold text-blue-600">{passRate}%</p>
              </div>
            </div>
          )}

          <Button
            variant="primary"
            size="md"
            icon={<Plus size={15} />}
            onClick={() => setShowModal(true)}
            disabled={!selectedMaterialId}
          >
            검사 입력
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-3 py-3 text-xs font-semibold text-slate-500 w-8">No.</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-slate-500">검사일</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500">구분</th>
                <th className="text-right px-3 py-3 text-xs font-semibold text-slate-500">반입수량</th>
                <th className="text-right px-3 py-3 text-xs font-semibold text-slate-500">합격수량</th>
                <th className="text-right px-3 py-3 text-xs font-semibold text-slate-500">불합격수량</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500">검사결과</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-slate-500">검사자</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-slate-500">비고</th>
                <th className="px-3 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <EmptyState message="검사 기록이 없습니다. 검사 결과를 입력해주세요." />
                  </td>
                </tr>
              ) : (
                entries.map((e, i) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 text-slate-400 text-xs">{i + 1}</td>
                    <td className="px-3 py-2.5 text-slate-700 text-xs">{e.date}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        e.inspectionType === '신규'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {e.inspectionType}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-700">{comma(e.receivedQty)}</td>
                    <td className="px-3 py-2.5 text-right text-green-600 font-medium">{comma(e.passedQty)}</td>
                    <td className="px-3 py-2.5 text-right text-red-500 font-medium">{e.failedQty > 0 ? comma(e.failedQty) : '—'}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${RESULT_STYLE[e.result]}`}>
                        {e.result === '합격' ? <CheckCircle2 size={11} /> : e.result === '불합격' ? <XCircle size={11} /> : null}
                        {e.result}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 text-xs">{e.inspector || '—'}</td>
                    <td className="px-3 py-2.5 text-slate-500 text-xs max-w-[160px] truncate">{e.note || '—'}</td>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => setConfirmDelete(e.id)}
                        className="p-1 rounded text-slate-300 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Input Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="검사 기록 입력"
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowModal(false)}>취소</Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!form.date || !form.receivedQty || parseFloat(form.receivedQty) <= 0}
            >
              저장
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {selectedMaterial && (
            <div className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-600">
              자재: <strong className="text-slate-900">{selectedMaterial.name}</strong>
              {selectedMaterial.spec && ` (${selectedMaterial.spec})`}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                검사일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">검사구분</label>
              <div className="flex gap-2 mt-1">
                {(['신규', '재검사'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, inspectionType: t }))}
                    className={`flex-1 h-10 rounded-lg text-sm font-medium border transition-colors ${
                      form.inspectionType === t
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                반입수량 <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="0"
                value={form.receivedQty}
                onChange={(e) => setForm((f) => ({ ...f, receivedQty: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">합격수량</label>
              <Input
                type="number"
                placeholder="0"
                value={form.passedQty}
                onChange={(e) => setForm((f) => ({ ...f, passedQty: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">불합격수량</label>
              <Input
                type="number"
                placeholder="0"
                value={form.failedQty}
                onChange={(e) => setForm((f) => ({ ...f, failedQty: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">검사결과</label>
              <div className="flex gap-1 mt-1">
                {(['합격', '불합격', '보류'] as InspectionResult[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, result: r }))}
                    className={`flex-1 h-10 rounded-lg text-xs font-medium border transition-colors ${
                      form.result === r
                        ? r === '합격'
                          ? 'bg-green-600 text-white border-green-600'
                          : r === '불합격'
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">검사자</label>
              <Input
                placeholder="성명"
                value={form.inspector}
                onChange={(e) => setForm((f) => ({ ...f, inspector: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">비고</label>
            <Input
              placeholder="시험결과, 처리사항 등"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            />
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="검사 기록 삭제"
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>취소</Button>
            <Button variant="danger" onClick={() => { onDelete(confirmDelete!); setConfirmDelete(null) }}>삭제</Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600">이 검사 기록을 삭제하시겠습니까?</p>
      </Modal>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type TabId = 'materials' | 'ledger' | 'inspection'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'materials', label: '자재 목록', icon: <Package size={15} /> },
  { id: 'ledger', label: '수불부', icon: <ArrowDownCircle size={15} /> },
  { id: 'inspection', label: '검사 기록', icon: <ClipboardCheck size={15} /> },
]

export default function MaterialsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('materials')
  const [materials, setMaterials] = useState<Material[]>(INIT_MATERIALS)
  const [ledger, setLedger] = useState<LedgerEntry[]>(INIT_LEDGER)
  const [inspections, setInspections] = useState<InspectionEntry[]>(INIT_INSPECTIONS)

  // ── Material CRUD
  function addMaterial(data: Omit<Material, 'id' | 'createdAt'>) {
    setMaterials((prev) => [
      ...prev,
      { ...data, id: genId(), createdAt: today() },
    ])
  }

  function editMaterial(updated: Material) {
    setMaterials((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
  }

  function deleteMaterial(id: string) {
    setMaterials((prev) => prev.filter((m) => m.id !== id))
    setLedger((prev) => prev.filter((e) => e.materialId !== id))
    setInspections((prev) => prev.filter((e) => e.materialId !== id))
  }

  // ── Ledger CRUD
  function addLedgerEntry(data: Omit<LedgerEntry, 'id' | 'createdAt'>) {
    setLedger((prev) => [...prev, { ...data, id: genId(), createdAt: today() }])
  }

  function deleteLedgerEntry(id: string) {
    setLedger((prev) => prev.filter((e) => e.id !== id))
  }

  // ── Inspection CRUD
  function addInspection(data: Omit<InspectionEntry, 'id' | 'createdAt'>) {
    setInspections((prev) => [...prev, { ...data, id: genId(), createdAt: today() }])
  }

  function deleteInspection(id: string) {
    setInspections((prev) => prev.filter((e) => e.id !== id))
  }

  // Summary for header
  const totalMaterials = materials.length
  const totalLedger = ledger.length
  const totalInspections = inspections.length

  return (
    <AppLayout
      breadcrumbs={[
        { label: '대시보드', href: '/dashboard' },
        { label: '주요자재 검사 및 수불부' },
      ]}
      headerActions={
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="hidden sm:inline">서식 19</span>
          <Badge variant="default">건설사업관리 업무지침서</Badge>
        </div>
      }
    >
      <div className="p-6 space-y-5">
        {/* Page title + summary */}
        <div>
          <h1 className="text-lg font-bold text-slate-900">주요자재 검사 및 수불부</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            자재별 입출고 현황과 검사 기록을 통합 관리합니다.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '등록 자재', value: totalMaterials, color: 'bg-indigo-50', textColor: 'text-indigo-700', icon: <Package size={18} className="text-indigo-500" /> },
            { label: '수불 기록', value: totalLedger, color: 'bg-blue-50', textColor: 'text-blue-700', icon: <ArrowDownCircle size={18} className="text-blue-500" /> },
            { label: '검사 건수', value: totalInspections, color: 'bg-green-50', textColor: 'text-green-700', icon: <ClipboardCheck size={18} className="text-green-500" /> },
          ].map((s) => (
            <Card key={s.label} className={`flex items-center gap-3 ${s.color}`}>
              {s.icon}
              <div>
                <p className={`text-xl font-bold ${s.textColor}`}>{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex gap-1 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab panels */}
        {activeTab === 'materials' && (
          <MaterialsTab
            materials={materials}
            onAdd={addMaterial}
            onEdit={editMaterial}
            onDelete={deleteMaterial}
          />
        )}
        {activeTab === 'ledger' && (
          <LedgerTab
            materials={materials}
            ledger={ledger}
            onAdd={addLedgerEntry}
            onDelete={deleteLedgerEntry}
          />
        )}
        {activeTab === 'inspection' && (
          <InspectionTab
            materials={materials}
            inspections={inspections}
            onAdd={addInspection}
            onDelete={deleteInspection}
          />
        )}
      </div>
    </AppLayout>
  )
}
