// 환경변수 타입 정의

interface CloudflareEnv {
  // 환경변수 예시 (Vercel 대시보드 또는 .env.local에서 설정)
  // NEXT_PUBLIC_API_URL: string
  // AI_API_KEY: string
  // DB_URL: string
}

namespace NodeJS {
  interface ProcessEnv {
    // 카카오 채널 채팅 연동 (https://developers.kakao.com)
    // 카카오 디벨로퍼스 앱 키 (JavaScript 키) - SDK 채팅 버튼 방식에 필요
    NEXT_PUBLIC_KAKAO_APP_KEY?: string
    // 카카오 채널 공개 ID (예: _xAbcDe) - 카카오 비즈니스 > 채널 관리자센터에서 확인
    NEXT_PUBLIC_KAKAO_CHANNEL_PUBLIC_ID?: string
  }
}
