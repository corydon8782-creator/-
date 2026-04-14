// ─────────────────────────────────────────────
//  사용자 / 인증
// ─────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  company: string
  role: 'admin' | 'manager' | 'user'
  department: string
  phone: string
  createdAt: string
}

// ─────────────────────────────────────────────
//  프로젝트
// ─────────────────────────────────────────────
export type ProjectStatus =
  | 'draft'       // 초안
  | 'analyzing'   // AI 분석 중
  | 'analyzed'    // 분석 완료
  | 'editing'     // 편집 중
  | 'completed'   // 완료
  | 'archived'    // 보관

export interface Project {
  id: string
  name: string
  workType: string       // 공사 종류 (토목, 건축, 기계설비 등)
  location: string       // 공사 위치
  client: string         // 발주처
  contractor: string     // 시공사
  supervisor: string     // 감리사
  contractAmount: string // 계약금액
  startDate: string
  endDate: string
  status: ProjectStatus
  documentType: DocumentType
  createdAt: string
  updatedAt: string
  uploadedFiles: UploadedFile[]
}

// ─────────────────────────────────────────────
//  파일 업로드
// ─────────────────────────────────────────────
export type FileCategory =
  | 'specification'   // 공사시방서
  | 'design'          // 설계도서
  | 'bill'            // 공사내역서
  | 'drawing'         // 도면
  | 'contract'        // 계약서
  | 'standard'        // 표준시방서
  | 'etc'             // 기타

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  category: FileCategory
  categoryLabel: string
  uploadedAt: string
  status: 'pending' | 'processing' | 'done' | 'error'
}

// ─────────────────────────────────────────────
//  AI 분석 결과
// ─────────────────────────────────────────────
export interface AnalysisResult {
  projectId: string
  workSummary: string
  workTypes: WorkTypeItem[]       // 공종 목록
  materials: MaterialItem[]       // 자재 목록
  testItems: TestItem[]           // 시험 항목
  qualityTargets: string[]        // 품질관리 대상
  missingFields: string[]         // 누락 항목
  confidence: number              // 분석 신뢰도 (0~100)
  analyzedAt: string
}

export interface WorkTypeItem {
  id: string
  name: string        // 공종명
  code: string        // 공종 코드
  ratio: string       // 비율
  isIncluded: boolean
}

export interface MaterialItem {
  id: string
  name: string        // 자재명
  spec: string        // 규격
  standard: string    // 적용기준
  unit: string        // 단위
  isIncluded: boolean
}

export interface TestItem {
  id: string
  workType: string    // 해당 공종
  itemName: string    // 시험 항목명
  testMethod: string  // 시험 방법
  frequency: string   // 시험 빈도
  standard: string    // 합격 기준
  remark: string      // 비고
  isRequired: boolean
  isAiGenerated: boolean
  isModified: boolean
}

// ─────────────────────────────────────────────
//  문서 (계획서)
// ─────────────────────────────────────────────
export type DocumentType = 'quality_plan' | 'test_plan'
// quality_plan = 품질관리계획서
// test_plan    = 품질시험계획서

export interface QualityDocument {
  id: string
  projectId: string
  type: DocumentType
  title: string
  documentNo: string   // 문서번호
  revision: string     // 개정번호
  status: 'draft' | 'review' | 'approved' | 'issued'
  sections: DocumentSection[]
  approvalBox: ApprovalBox
  headerInfo: HeaderInfo
  footerInfo: FooterInfo
  createdAt: string
  updatedAt: string
  versions: DocumentVersion[]
}

export interface HeaderInfo {
  showLogo: boolean
  companyName: string
  documentTitle: string
  documentNo: string
  revision: string
  date: string
}

export interface FooterInfo {
  showPageNumber: boolean
  showDocumentTitle: boolean
  leftText: string
  rightText: string
}

// ─────────────────────────────────────────────
//  문서 섹션 (블록 기반)
// ─────────────────────────────────────────────
export type SectionType =
  | 'title'           // 문서 제목
  | 'overview'        // 공사 개요
  | 'scope'           // 적용 범위
  | 'organization'    // 품질관리 조직
  | 'material'        // 자재 관리
  | 'test_plan'       // 시험 및 검사 계획
  | 'work_quality'    // 공종별 품질관리
  | 'test_items'      // 시험 항목 테이블
  | 'attachment'      // 첨부자료
  | 'approval'        // 결재란
  | 'text'            // 일반 텍스트
  | 'table'           // 일반 표
  | 'heading'         // 소제목

export interface DocumentSection {
  id: string
  type: SectionType
  order: number
  title: string
  isVisible: boolean
  isLocked: boolean     // 고정 섹션 여부
  content: SectionContent
}

export type SectionContent =
  | TextContent
  | TableContent
  | TestItemsContent
  | OverviewContent
  | OrganizationContent

export interface TextContent {
  kind: 'text'
  body: string
  isAiGenerated: boolean
}

export interface TableContent {
  kind: 'table'
  headers: string[]
  rows: string[][]
  caption?: string
}

export interface TestItemsContent {
  kind: 'test_items'
  items: TestItem[]
}

export interface OverviewContent {
  kind: 'overview'
  fields: { label: string; value: string; isModified: boolean }[]
}

export interface OrganizationContent {
  kind: 'organization'
  members: OrgMember[]
}

export interface OrgMember {
  id: string
  role: string
  name: string
  qualification: string
  remark: string
}

// ─────────────────────────────────────────────
//  결재란
// ─────────────────────────────────────────────
export interface ApprovalBox {
  title: string
  position: 'top-right' | 'bottom-right' | 'bottom-center'
  rows: ApprovalRow[]
}

export interface ApprovalRow {
  id: string
  cells: ApprovalCell[]
}

export interface ApprovalCell {
  id: string
  title: string    // 직위/직함
  name: string     // 성명 (출력용 빈칸)
  date: string     // 날짜 (출력용 빈칸)
  colSpan?: number
}

// ─────────────────────────────────────────────
//  템플릿
// ─────────────────────────────────────────────
export interface DocumentTemplate {
  id: string
  name: string
  type: DocumentType
  client: string         // 발주처 (범용이면 '공통')
  description: string
  isDefault: boolean
  isCustom: boolean
  sections: DocumentSection[]
  approvalBox: ApprovalBox
  usageCount: number
  createdAt: string
  updatedAt: string
}

// ─────────────────────────────────────────────
//  버전 이력
// ─────────────────────────────────────────────
export interface DocumentVersion {
  id: string
  versionNo: string
  comment: string
  createdBy: string
  createdAt: string
  isAutoSave: boolean
}

// ─────────────────────────────────────────────
//  공통 유틸
// ─────────────────────────────────────────────
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  quality_plan: '품질관리계획서',
  test_plan: '품질시험계획서',
}

export const FILE_CATEGORY_LABELS: Record<FileCategory, string> = {
  specification: '공사시방서',
  design: '설계도서',
  bill: '공사내역서',
  drawing: '도면',
  contract: '계약서',
  standard: '표준시방서',
  etc: '기타',
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: '초안',
  analyzing: '분석 중',
  analyzed: '분석 완료',
  editing: '편집 중',
  completed: '완료',
  archived: '보관',
}

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  analyzing: 'bg-blue-100 text-blue-700',
  analyzed: 'bg-indigo-100 text-indigo-700',
  editing: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  archived: 'bg-slate-100 text-slate-500',
}

export const APPROVAL_TITLE_PRESETS = [
  '담당자',
  '팀장',
  '부장',
  '이사',
  '현장소장',
  '품질관리자',
  '공무팀장',
  '감리단장',
  '책임건설사업관리기술인',
  '발주처 담당자',
]
