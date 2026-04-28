'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Lock, Mail, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }
    setLoading(true)
    setError('')
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
            <Building2 size={22} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">QualityAI</span>
            <p className="text-xs text-slate-400">건설현장 품질관리 AI 플랫폼</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              품질관리 문서를<br />
              <span className="text-primary-400">AI로 자동 작성</span>
            </h1>
            <p className="mt-4 text-slate-400 leading-relaxed">
              공사 문서를 업로드하면 AI가 자동으로 품질관리계획서와
              품질시험계획서를 작성해드립니다. 업무 시간을 획기적으로 단축하세요.
            </p>
          </div>

          <div className="space-y-3">
            {[
              '공사 문서 업로드 → AI 자동 분석',
              '표준 양식 기반 초안 자동 생성',
              '발주처별 맞춤 편집 및 즉시 PDF 출력',
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-primary-400 flex-shrink-0" />
                <span className="text-sm text-slate-300">{text}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: '작성 시간 단축', value: '~80%' },
              { label: '처리 문서 수', value: '2,400+' },
              { label: '사용 기업', value: '180+' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary-400">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-600">
          © 2024 QualityAI. All rights reserved.
        </p>
      </div>

      {/* Right panel - login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary-700 flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">QualityAI</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">로그인</h2>
          <p className="text-sm text-slate-500 mt-1">계정에 로그인하여 서비스를 이용하세요.</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <Input
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@company.com"
              leftIcon={<Mail size={16} />}
              required
            />

            <div>
              <Input
                label="비밀번호"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                leftIcon={<Lock size={16} />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                required
              />
              <div className="flex justify-end mt-1">
                <button type="button" className="text-xs text-primary-600 hover:underline">
                  비밀번호를 잊으셨나요?
                </button>
              </div>
            </div>

            {error && (
              <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              로그인
            </Button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-sm text-slate-500">계정이 없으신가요? </span>
            <Link href="/auth/register" className="text-sm font-medium text-primary-700 hover:underline">
              회원가입
            </Link>
          </div>

          {/* Demo hint */}
          <div className="mt-8 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">데모 계정 안내</p>
            <p className="text-xs text-blue-600">
              이메일: hyunjun.kim@hanjin-const.co.kr<br />
              비밀번호: 1234
            </p>
            <button
              type="button"
              onClick={() => {
                setEmail('hyunjun.kim@hanjin-const.co.kr')
                setPassword('1234')
                setError('')
              }}
              className="mt-2 w-full text-xs font-medium text-blue-700 bg-white border border-blue-300 rounded px-3 py-1.5 hover:bg-blue-100 transition-colors"
            >
              데모 계정으로 자동 입력
            </button>
          </div>

          <p className="mt-6 text-xs text-center text-slate-400">
            로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}
