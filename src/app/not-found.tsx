'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-primary-700 flex items-center justify-center mx-auto mb-6">
          <Building2 size={32} className="text-white" />
        </div>
        <h1 className="text-7xl font-black text-primary-500 mb-2">404</h1>
        <h2 className="text-xl font-bold text-white mb-3">페이지를 찾을 수 없습니다</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.<br />
          URL을 다시 확인하거나 아래 버튼을 통해 이동하세요.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Home size={16} /> 대시보드로 이동
          </Link>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <ArrowLeft size={16} /> 뒤로 가기
          </button>
        </div>
      </div>
    </div>
  )
}
