'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void
      isInitialized: () => boolean
      Channel: {
        createChatButton: (options: {
          container: string | HTMLElement
          channelPublicId: string
          title?: string
          size?: 'small' | 'large'
          color?: 'yellow' | 'mono'
          shape?: 'pc' | 'mobile'
          supportMultipleDensities?: boolean
        }) => void
      }
    }
  }
}

const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY ?? ''
const KAKAO_CHANNEL_ID = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_PUBLIC_ID ?? ''

// Kakao SDK를 사용하는 공식 채널 채팅 버튼 방식
function KakaoSDKButton() {
  const containerRef = useRef<HTMLDivElement>(null)

  const initChatButton = () => {
    const kakao = window.Kakao
    if (!kakao || !containerRef.current) return
    if (!kakao.isInitialized()) {
      kakao.init(KAKAO_APP_KEY)
    }
    containerRef.current.innerHTML = ''
    kakao.Channel.createChatButton({
      container: containerRef.current,
      channelPublicId: KAKAO_CHANNEL_ID,
      title: 'consult',
      size: 'large',
      color: 'yellow',
      shape: 'pc',
      supportMultipleDensities: true,
    })
  }

  useEffect(() => {
    if (window.Kakao) initChatButton()
  }, [])

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onLoad={initChatButton}
      />
      <div
        ref={containerRef}
        className="fixed bottom-6 right-6 z-50"
        aria-label="카카오 채널 채팅 상담"
      />
    </>
  )
}

// Kakao SDK 없이 채널 URL로 직접 연결하는 플로팅 버튼 방식
function KakaoLinkButton() {
  const chatUrl = `https://pf.kakao.com/${KAKAO_CHANNEL_ID}/chat`

  return (
    <a
      href={chatUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="카카오 채널 채팅 상담"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      style={{ backgroundColor: '#FEE500' }}
    >
      {/* KakaoTalk 말풍선 로고 SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="#3A1D1D"
        aria-hidden="true"
      >
        <path d="M12 3C6.477 3 2 6.701 2 11.25c0 2.905 1.782 5.46 4.5 6.972L5.6 21.3a.375.375 0 0 0 .525.432L10.26 19.5A11.89 11.89 0 0 0 12 19.5c5.523 0 10-3.701 10-8.25S17.523 3 12 3z" />
      </svg>
    </a>
  )
}

// App Key가 있으면 SDK 방식, 없으면 링크 방식으로 렌더링
export default function KakaoChannelChat() {
  if (!KAKAO_CHANNEL_ID) return null

  if (KAKAO_APP_KEY) {
    return <KakaoSDKButton />
  }

  return <KakaoLinkButton />
}
