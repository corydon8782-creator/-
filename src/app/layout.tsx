import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QualityAI - 건설현장 품질관리 AI 플랫폼',
  description: '공사 문서 업로드 후 AI가 품질관리계획서·품질시험계획서를 자동으로 작성해드립니다.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-slate-50">{children}</body>
    </html>
  )
}
