'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, User, Mail, Lock, Phone, Building, ChevronLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

const ROLE_OPTIONS = [
  { value: 'manager', label: '품질관리자' },
  { value: 'user', label: '실무 담당자' },
  { value: 'admin', label: '관리자' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    company: '',
    department: '',
    role: 'manager',
    phone: '',
    agreeTerms: false,
    agreePrivacy: false,
  })

  const update = (key: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.passwordConfirm) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
          >
            <ChevronLeft size={16} />
            로그인으로 돌아가기
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-700 flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">QualityAI</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-3">회원가입</h1>
          <p className="text-sm text-slate-500">계정을 생성하고 서비스를 시작하세요.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${s === step ? 'text-primary-700' : s < step ? 'text-green-600' : 'text-slate-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  s === step ? 'border-primary-700 bg-primary-700 text-white'
                  : s < step ? 'border-green-500 bg-green-500 text-white'
                  : 'border-slate-300 text-slate-400'
                }`}>{s}</div>
                <span className="text-sm font-medium hidden sm:block">
                  {s === 1 ? '기본 정보' : '회사 정보'}
                </span>
              </div>
              {s < 2 && <div className={`flex-1 h-0.5 ${s < step ? 'bg-green-400' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-card space-y-4">
            {step === 1 && (
              <>
                <h2 className="text-base font-semibold text-slate-800 mb-4">기본 정보 입력</h2>

                <Input
                  label="성명"
                  placeholder="홍길동"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  leftIcon={<User size={16} />}
                  required
                />
                <Input
                  label="이메일"
                  type="email"
                  placeholder="example@company.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  leftIcon={<Mail size={16} />}
                  required
                />
                <Input
                  label="비밀번호"
                  type="password"
                  placeholder="8자 이상, 영문·숫자 포함"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  leftIcon={<Lock size={16} />}
                  hint="8자 이상, 영문·숫자를 조합하여 설정하세요."
                  required
                />
                <Input
                  label="비밀번호 확인"
                  type="password"
                  placeholder="비밀번호를 한 번 더 입력하세요"
                  value={form.passwordConfirm}
                  onChange={(e) => update('passwordConfirm', e.target.value)}
                  leftIcon={<Lock size={16} />}
                  error={form.passwordConfirm && form.password !== form.passwordConfirm ? '비밀번호가 일치하지 않습니다.' : undefined}
                  required
                />
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  onClick={() => setStep(2)}
                  disabled={!form.name || !form.email || !form.password || form.password !== form.passwordConfirm}
                >
                  다음 단계
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-base font-semibold text-slate-800 mb-4">회사 정보 입력</h2>

                <Input
                  label="회사명"
                  placeholder="(주)○○건설"
                  value={form.company}
                  onChange={(e) => update('company', e.target.value)}
                  leftIcon={<Building size={16} />}
                  required
                />
                <Input
                  label="부서"
                  placeholder="품질관리팀"
                  value={form.department}
                  onChange={(e) => update('department', e.target.value)}
                  required
                />
                <Select
                  label="직무"
                  options={ROLE_OPTIONS}
                  value={form.role}
                  onChange={(e) => update('role', e.target.value)}
                  required
                />
                <Input
                  label="연락처"
                  type="tel"
                  placeholder="010-0000-0000"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  leftIcon={<Phone size={16} />}
                />

                {/* 약관 동의 */}
                <div className="border border-slate-200 rounded-lg p-4 space-y-2.5 bg-slate-50">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.agreeTerms && form.agreePrivacy}
                      onChange={(e) => {
                        update('agreeTerms', e.target.checked)
                        update('agreePrivacy', e.target.checked)
                      }}
                      className="w-4 h-4 text-primary-700 rounded"
                    />
                    <span className="text-sm font-medium text-slate-700">전체 동의</span>
                  </label>
                  <div className="pl-6 space-y-2 border-t border-slate-200 pt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.agreeTerms}
                        onChange={(e) => update('agreeTerms', e.target.checked)}
                        className="w-4 h-4 text-primary-700 rounded"
                      />
                      <span className="text-xs text-slate-600">
                        <span className="text-red-500 font-medium">[필수]</span> 서비스 이용약관 동의
                      </span>
                      <button type="button" className="ml-auto text-xs text-primary-600 hover:underline">보기</button>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.agreePrivacy}
                        onChange={(e) => update('agreePrivacy', e.target.checked)}
                        className="w-4 h-4 text-primary-700 rounded"
                      />
                      <span className="text-xs text-slate-600">
                        <span className="text-red-500 font-medium">[필수]</span> 개인정보 처리방침 동의
                      </span>
                      <button type="button" className="ml-auto text-xs text-primary-600 hover:underline">보기</button>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    이전
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    className="flex-1"
                    disabled={!form.company || !form.department || !form.agreeTerms || !form.agreePrivacy}
                  >
                    회원가입
                  </Button>
                </div>
              </>
            )}
          </div>
        </form>

        <p className="mt-4 text-xs text-center text-slate-400">
          이미 계정이 있으신가요?{' '}
          <Link href="/auth/login" className="text-primary-600 hover:underline font-medium">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
