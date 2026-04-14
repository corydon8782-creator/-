// Admin-specific types
export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalProjects: number
  activeProjects: number
  totalDocuments: number
  aiAnalysisCount: number
  aiAnalysisThisMonth: number
  storageUsedGB: number
  storageMaxGB: number
}

export interface AdminUser {
  id: string
  name: string
  email: string
  company: string
  department: string
  role: 'admin' | 'manager' | 'user'
  plan: 'free' | 'starter' | 'business' | 'enterprise'
  status: 'active' | 'inactive' | 'suspended'
  projectCount: number
  documentCount: number
  lastLoginAt: string
  createdAt: string
}

export interface SystemLog {
  id: string
  type: 'ai_analysis' | 'document_create' | 'user_join' | 'error' | 'export'
  message: string
  user: string
  company: string
  createdAt: string
  level: 'info' | 'warn' | 'error'
}

export interface PlanUsage {
  plan: string
  count: number
  color: string
}

// Dummy admin data
export const adminStats: AdminStats = {
  totalUsers: 312,
  activeUsers: 187,
  totalProjects: 1048,
  activeProjects: 214,
  totalDocuments: 2391,
  aiAnalysisCount: 8742,
  aiAnalysisThisMonth: 423,
  storageUsedGB: 284,
  storageMaxGB: 1000,
}

export const adminUsers: AdminUser[] = [
  {
    id: 'u-001', name: '김현준', email: 'hyunjun.kim@hanjin-const.co.kr',
    company: '(주)한진건설', department: '품질관리팀', role: 'manager',
    plan: 'business', status: 'active', projectCount: 12, documentCount: 47,
    lastLoginAt: '2024-04-14T09:23:00', createdAt: '2024-03-01T09:00:00',
  },
  {
    id: 'u-002', name: '이수진', email: 'sujin.lee@daesung-eng.co.kr',
    company: '(주)대성엔지니어링', department: '품질팀', role: 'manager',
    plan: 'starter', status: 'active', projectCount: 8, documentCount: 29,
    lastLoginAt: '2024-04-13T14:10:00', createdAt: '2024-02-15T09:00:00',
  },
  {
    id: 'u-003', name: '박성민', email: 'sungmin.park@posco-const.co.kr',
    company: '포스코건설(주)', department: '현장관리팀', role: 'user',
    plan: 'business', status: 'active', projectCount: 5, documentCount: 18,
    lastLoginAt: '2024-04-12T11:20:00', createdAt: '2024-01-10T09:00:00',
  },
  {
    id: 'u-004', name: '최지원', email: 'jiwon.choi@hdec.co.kr',
    company: '현대건설(주)', department: '품질안전팀', role: 'manager',
    plan: 'enterprise', status: 'active', projectCount: 31, documentCount: 124,
    lastLoginAt: '2024-04-11T17:30:00', createdAt: '2023-11-05T09:00:00',
  },
  {
    id: 'u-005', name: '정유민', email: 'youmin.jung@samsung-ct.co.kr',
    company: '삼성물산(주) 건설부문', department: 'QA팀', role: 'manager',
    plan: 'enterprise', status: 'active', projectCount: 28, documentCount: 98,
    lastLoginAt: '2024-04-10T10:15:00', createdAt: '2023-09-20T09:00:00',
  },
  {
    id: 'u-006', name: '한동훈', email: 'donghoon.han@daewoo-const.co.kr',
    company: '대우건설(주)', department: '품질관리부', role: 'user',
    plan: 'starter', status: 'inactive', projectCount: 3, documentCount: 11,
    lastLoginAt: '2024-03-25T09:00:00', createdAt: '2024-01-20T09:00:00',
  },
  {
    id: 'u-007', name: '오승현', email: 'seunghyun.oh@lotte-const.co.kr',
    company: '롯데건설(주)', department: '현장기술팀', role: 'user',
    plan: 'free', status: 'active', projectCount: 1, documentCount: 2,
    lastLoginAt: '2024-04-08T14:00:00', createdAt: '2024-04-05T09:00:00',
  },
  {
    id: 'u-008', name: '강민석', email: 'minseok.kang@gs-const.co.kr',
    company: 'GS건설(주)', department: 'CM팀', role: 'manager',
    plan: 'business', status: 'suspended', projectCount: 7, documentCount: 22,
    lastLoginAt: '2024-03-01T09:00:00', createdAt: '2023-12-10T09:00:00',
  },
]

export const systemLogs: SystemLog[] = [
  {
    id: 'log-001', type: 'ai_analysis', level: 'info',
    message: 'AI 분석 완료: ○○시 도시재생 뉴딜사업 (신뢰도 87%)',
    user: '김현준', company: '(주)한진건설', createdAt: '2024-04-14T10:15:00',
  },
  {
    id: 'log-002', type: 'document_create', level: 'info',
    message: '품질관리계획서 신규 생성: QP-2024-001',
    user: '이수진', company: '(주)대성엔지니어링', createdAt: '2024-04-14T09:42:00',
  },
  {
    id: 'log-003', type: 'export', level: 'info',
    message: 'PDF 출력 완료: △△역세권 복합개발 품질시험계획서',
    user: '박성민', company: '포스코건설(주)', createdAt: '2024-04-14T09:10:00',
  },
  {
    id: 'log-004', type: 'user_join', level: 'info',
    message: '신규 사용자 가입: 오승현 (롯데건설)',
    user: '오승현', company: '롯데건설(주)', createdAt: '2024-04-14T08:55:00',
  },
  {
    id: 'log-005', type: 'error', level: 'error',
    message: 'AI 분석 실패: 파일 형식 오류 (DWG 파싱 불가)',
    user: '최지원', company: '현대건설(주)', createdAt: '2024-04-13T17:45:00',
  },
  {
    id: 'log-006', type: 'ai_analysis', level: 'info',
    message: 'AI 분석 완료: 국도 □□호선 확장공사 4공구 (신뢰도 92%)',
    user: '정유민', company: '삼성물산(주) 건설부문', createdAt: '2024-04-13T16:20:00',
  },
  {
    id: 'log-007', type: 'document_create', level: 'info',
    message: '품질시험계획서 신규 생성: QT-2024-018',
    user: '최지원', company: '현대건설(주)', createdAt: '2024-04-13T15:10:00',
  },
  {
    id: 'log-008', type: 'error', level: 'warn',
    message: '파일 업로드 경고: 파일 크기 초과 (47MB / 제한 50MB)',
    user: '한동훈', company: '대우건설(주)', createdAt: '2024-04-13T11:30:00',
  },
]

export const planUsageData: PlanUsage[] = [
  { plan: '무료', count: 48, color: 'bg-slate-400' },
  { plan: 'Starter', count: 112, color: 'bg-blue-400' },
  { plan: 'Business', count: 118, color: 'bg-primary-600' },
  { plan: 'Enterprise', count: 34, color: 'bg-purple-600' },
]

export const monthlyAnalysisData = [
  { month: '11월', count: 312 },
  { month: '12월', count: 389 },
  { month: '1월', count: 421 },
  { month: '2월', count: 398 },
  { month: '3월', count: 467 },
  { month: '4월', count: 423 },
]
