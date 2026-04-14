import type {
  User,
  Project,
  AnalysisResult,
  QualityDocument,
  DocumentTemplate,
  DocumentSection,
  ApprovalBox,
  TestItem,
} from './types'

// ─────────────────────────────────────────────
//  현재 사용자
// ─────────────────────────────────────────────
export const currentUser: User = {
  id: 'u-001',
  name: '김현준',
  email: 'hyunjun.kim@hanjin-const.co.kr',
  company: '(주)한진건설',
  role: 'manager',
  department: '품질관리팀',
  phone: '010-3210-5678',
  createdAt: '2024-03-01T09:00:00',
}

// ─────────────────────────────────────────────
//  프로젝트 목록
// ─────────────────────────────────────────────
export const dummyProjects: Project[] = [
  {
    id: 'p-001',
    name: '○○시 도시재생 뉴딜사업 기반시설 공사',
    workType: '토목',
    location: '경기도 ○○시 ○○동 일원',
    client: 'LH한국토지주택공사',
    contractor: '(주)한진건설',
    supervisor: '(주)○○건설사업관리',
    contractAmount: '38,500,000,000',
    startDate: '2024-02-01',
    endDate: '2026-01-31',
    status: 'editing',
    documentType: 'quality_plan',
    createdAt: '2024-04-10T09:15:00',
    updatedAt: '2024-04-13T16:40:00',
    uploadedFiles: [
      {
        id: 'f-001',
        name: '공사시방서_도시재생뉴딜.pdf',
        size: 4823040,
        type: 'application/pdf',
        category: 'specification',
        categoryLabel: '공사시방서',
        uploadedAt: '2024-04-10T09:20:00',
        status: 'done',
      },
      {
        id: 'f-002',
        name: '설계도서_토목공사.pdf',
        size: 12582912,
        type: 'application/pdf',
        category: 'design',
        categoryLabel: '설계도서',
        uploadedAt: '2024-04-10T09:21:00',
        status: 'done',
      },
      {
        id: 'f-003',
        name: '공사내역서_2024.xlsx',
        size: 1048576,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'bill',
        categoryLabel: '공사내역서',
        uploadedAt: '2024-04-10T09:22:00',
        status: 'done',
      },
    ],
  },
  {
    id: 'p-002',
    name: '△△역세권 복합개발 건축공사 (A동)',
    workType: '건축',
    location: '서울특별시 △△구 △△동 100번지',
    client: '△△개발(주)',
    contractor: '(주)한진건설',
    supervisor: '△△감리(주)',
    contractAmount: '25,800,000,000',
    startDate: '2024-03-15',
    endDate: '2025-12-31',
    status: 'analyzed',
    documentType: 'test_plan',
    createdAt: '2024-04-05T11:00:00',
    updatedAt: '2024-04-12T14:20:00',
    uploadedFiles: [
      {
        id: 'f-004',
        name: '건축공사_시방서.pdf',
        size: 3670016,
        type: 'application/pdf',
        category: 'specification',
        categoryLabel: '공사시방서',
        uploadedAt: '2024-04-05T11:05:00',
        status: 'done',
      },
    ],
  },
  {
    id: 'p-003',
    name: '국도 □□호선 확장공사 4공구',
    workType: '도로',
    location: '충청북도 □□군 □□면 일원',
    client: '국토교통부(□□국도유지사무소)',
    contractor: '(주)한진건설',
    supervisor: '□□기술단(주)',
    contractAmount: '52,300,000,000',
    startDate: '2023-10-01',
    endDate: '2026-09-30',
    status: 'completed',
    documentType: 'quality_plan',
    createdAt: '2023-10-05T08:30:00',
    updatedAt: '2023-10-20T17:00:00',
    uploadedFiles: [],
  },
  {
    id: 'p-004',
    name: '◇◇산단 기계설비 설치공사',
    workType: '기계설비',
    location: '인천광역시 ◇◇구 ◇◇동 산업단지',
    client: '◇◇산업단지관리공단',
    contractor: '(주)한진건설',
    supervisor: '-',
    contractAmount: '8,200,000,000',
    startDate: '2024-01-10',
    endDate: '2024-11-30',
    status: 'analyzing',
    documentType: 'test_plan',
    createdAt: '2024-04-14T10:00:00',
    updatedAt: '2024-04-14T10:05:00',
    uploadedFiles: [
      {
        id: 'f-005',
        name: '기계설비_시방서.pdf',
        size: 2097152,
        type: 'application/pdf',
        category: 'specification',
        categoryLabel: '공사시방서',
        uploadedAt: '2024-04-14T10:01:00',
        status: 'done',
      },
    ],
  },
]

// ─────────────────────────────────────────────
//  AI 분석 결과 (p-001 기준)
// ─────────────────────────────────────────────
export const dummyAnalysisResult: AnalysisResult = {
  projectId: 'p-001',
  workSummary:
    '경기도 ○○시 도시재생 뉴딜사업의 일환으로 진행되는 기반시설 공사로, 도로, 상·하수도, 공원 및 녹지 조성 등을 포함합니다. LH한국토지주택공사 발주 공사이며 총 공사 기간은 2024년 2월부터 2026년 1월까지입니다.',
  workTypes: [
    { id: 'wt-01', name: '도로공사', code: 'R01', ratio: '35%', isIncluded: true },
    { id: 'wt-02', name: '상수도 배관공사', code: 'W01', ratio: '20%', isIncluded: true },
    { id: 'wt-03', name: '하수도 배관공사', code: 'W02', ratio: '18%', isIncluded: true },
    { id: 'wt-04', name: '조경 및 공원 조성', code: 'L01', ratio: '12%', isIncluded: true },
    { id: 'wt-05', name: '전기·통신 공사', code: 'E01', ratio: '10%', isIncluded: true },
    { id: 'wt-06', name: '안전시설 설치', code: 'S01', ratio: '5%', isIncluded: false },
  ],
  materials: [
    { id: 'm-01', name: '아스팔트 혼합물', spec: 'AC 13mm', standard: 'KS F 2349', unit: 'ton', isIncluded: true },
    { id: 'm-02', name: '레미콘(콘크리트)', spec: '25-24-150', standard: 'KS F 4009', unit: 'm³', isIncluded: true },
    { id: 'm-03', name: '철근', spec: 'HD22 이상', standard: 'KS D 3504', unit: 'ton', isIncluded: true },
    { id: 'm-04', name: '흄관', spec: 'ø450mm', standard: 'KS F 4403', unit: 'm', isIncluded: true },
    { id: 'm-05', name: '강관(상수도)', spec: 'ø200mm SGP', standard: 'KS D 3507', unit: 'm', isIncluded: true },
    { id: 'm-06', name: '맨홀', spec: '1000×1000', standard: 'KS F 4419', unit: '개', isIncluded: true },
    { id: 'm-07', name: '투수콘크리트', spec: '설계기준', standard: '공사시방서', unit: 'm²', isIncluded: false },
  ],
  testItems: generateDummyTestItems(),
  qualityTargets: [
    '노상 및 노반 지지력 (CBR, 다짐도)',
    '아스팔트 포장 품질 (밀도, 두께)',
    '콘크리트 강도 (압축강도)',
    '배관 누수 시험',
    '철근 이음 및 피복두께',
    '구조물 균열 점검',
  ],
  missingFields: [
    '책임기술자 성명 및 자격번호',
    '현장 품질시험실 위치',
    '공사 착공일 (추정: 2024.02.01)',
  ],
  confidence: 87,
  analyzedAt: '2024-04-10T10:15:00',
}

function generateDummyTestItems(): TestItem[] {
  return [
    {
      id: 'ti-01', workType: '토공사', itemName: '현장 다짐도 시험',
      testMethod: 'KS F 2312 (흙의 다짐 시험)', frequency: '매 2,000m²당 1회',
      standard: '최대건조밀도 95% 이상', remark: '노상, 노반 구분 관리',
      isRequired: true, isAiGenerated: true, isModified: false,
    },
    {
      id: 'ti-02', workType: '토공사', itemName: 'CBR 시험',
      testMethod: 'KS F 2320', frequency: '토취장별, 토사 변화 시',
      standard: '노상 CBR 10% 이상, 노반 CBR 30% 이상', remark: '',
      isRequired: true, isAiGenerated: true, isModified: false,
    },
    {
      id: 'ti-03', workType: '콘크리트공사', itemName: '콘크리트 압축강도 시험',
      testMethod: 'KS F 2405 (공시체 압축강도)', frequency: '타설 150m³당 1회, 최소 1일 1회',
      standard: '설계기준강도 이상 (24MPa)', remark: '재령 28일 기준',
      isRequired: true, isAiGenerated: true, isModified: false,
    },
    {
      id: 'ti-04', workType: '콘크리트공사', itemName: '슬럼프 시험',
      testMethod: 'KS F 2402', frequency: '타설 150m³당 1회 및 배합 변화 시',
      standard: '150±25mm', remark: '현장 반입 시 즉시 검사',
      isRequired: true, isAiGenerated: true, isModified: false,
    },
    {
      id: 'ti-05', workType: '콘크리트공사', itemName: '공기량 시험',
      testMethod: 'KS F 2421', frequency: '슬럼프 시험과 동시',
      standard: '4.5±1.5%', remark: 'AE콘크리트 적용 시',
      isRequired: false, isAiGenerated: true, isModified: false,
    },
    {
      id: 'ti-06', workType: '아스팔트 포장', itemName: '아스팔트 혼합물 밀도 시험',
      testMethod: 'KS F 2337 (코어 채취)', frequency: '시공 면적 1,500m²당 1회',
      standard: '기준밀도의 96% 이상', remark: '노면 코어 채취',
      isRequired: true, isAiGenerated: true, isModified: false,
    },
    {
      id: 'ti-07', workType: '아스팔트 포장', itemName: '마샬 안정도 시험',
      testMethod: 'KS F 2337', frequency: '배합설계 시 및 재료 변경 시',
      standard: '7.5kN 이상 (교통량에 따라 상이)', remark: '',
      isRequired: true, isAiGenerated: true, isModified: false,
    },
    {
      id: 'ti-08', workType: '아스팔트 포장', itemName: '포장 두께 측정',
      testMethod: '코어 채취 후 측정', frequency: '시공 구간별 300m당 1개소',
      standard: '설계두께의 -5mm 이내', remark: '',
      isRequired: true, isAiGenerated: true, isModified: false,
    },
    {
      id: 'ti-09', workType: '상수도 배관', itemName: '수압 시험 (누수 시험)',
      testMethod: '공사시방서 기준', frequency: '배관 구간별 전수 시험',
      standard: '시험압력 유지 (1시간 이상, 압력강하 없음)', remark: '관경별 시험압력 상이',
      isRequired: true, isAiGenerated: true, isModified: false,
    },
    {
      id: 'ti-10', workType: '하수도 배관', itemName: '관로 수밀 시험',
      testMethod: 'KS F 4403 기준', frequency: '관 200m 이내 구간별',
      standard: '수압 시험 기준 내 압력 유지', remark: '준공 전 전체 구간 시험',
      isRequired: true, isAiGenerated: true, isModified: false,
    },
    {
      id: 'ti-11', workType: '철근공사', itemName: '철근 인장강도 시험',
      testMethod: 'KS D 3504', frequency: '동일 철근 30ton당 1회',
      standard: 'SD400: fy ≥ 400MPa, fu ≥ 560MPa', remark: '납품서류 확인 병행',
      isRequired: true, isAiGenerated: true, isModified: false,
    },
  ]
}

// ─────────────────────────────────────────────
//  품질관리계획서 문서 (p-001 기준)
// ─────────────────────────────────────────────
export const dummyDocument: QualityDocument = {
  id: 'doc-001',
  projectId: 'p-001',
  type: 'quality_plan',
  title: '○○시 도시재생 뉴딜사업 기반시설 공사 품질관리계획서',
  documentNo: 'QP-2024-001',
  revision: 'Rev.0',
  status: 'draft',
  headerInfo: {
    showLogo: true,
    companyName: '(주)한진건설',
    documentTitle: '품질관리계획서',
    documentNo: 'QP-2024-001',
    revision: 'Rev.0',
    date: '2024-04-15',
  },
  footerInfo: {
    showPageNumber: true,
    showDocumentTitle: true,
    leftText: '○○시 도시재생 뉴딜사업 기반시설 공사',
    rightText: '(주)한진건설',
  },
  approvalBox: {
    title: '결재',
    position: 'top-right',
    rows: [
      {
        id: 'ar-01',
        cells: [
          { id: 'ac-01', title: '담당자', name: '', date: '' },
          { id: 'ac-02', title: '팀장', name: '', date: '' },
          { id: 'ac-03', title: '현장소장', name: '', date: '' },
          { id: 'ac-04', title: '감리단장', name: '', date: '' },
        ],
      },
    ],
  },
  sections: generateDummySections(),
  createdAt: '2024-04-10T10:30:00',
  updatedAt: '2024-04-13T16:40:00',
  versions: [
    {
      id: 'v-001', versionNo: 'Rev.0',
      comment: 'AI 초안 생성',
      createdBy: '시스템(AI)', createdAt: '2024-04-10T10:30:00', isAutoSave: false,
    },
    {
      id: 'v-002', versionNo: 'Rev.0 (자동저장)',
      comment: '자동 저장',
      createdBy: '김현준', createdAt: '2024-04-13T14:10:00', isAutoSave: true,
    },
    {
      id: 'v-003', versionNo: 'Rev.0 (자동저장)',
      comment: '자동 저장',
      createdBy: '김현준', createdAt: '2024-04-13T16:40:00', isAutoSave: true,
    },
  ],
}

function generateDummySections(): DocumentSection[] {
  return [
    {
      id: 's-01', type: 'title', order: 1, title: '문서 제목', isVisible: true, isLocked: true,
      content: {
        kind: 'text',
        body: '○○시 도시재생 뉴딜사업 기반시설 공사\n품질관리계획서',
        isAiGenerated: false,
      },
    },
    {
      id: 's-02', type: 'overview', order: 2, title: '1. 공사 개요', isVisible: true, isLocked: false,
      content: {
        kind: 'overview',
        fields: [
          { label: '공사명', value: '○○시 도시재생 뉴딜사업 기반시설 공사', isModified: false },
          { label: '공사위치', value: '경기도 ○○시 ○○동 일원', isModified: false },
          { label: '발주처', value: 'LH한국토지주택공사', isModified: false },
          { label: '설계자', value: '(주)○○엔지니어링', isModified: false },
          { label: '시공자', value: '(주)한진건설', isModified: false },
          { label: '감리자', value: '(주)○○건설사업관리', isModified: false },
          { label: '계약금액', value: '금 삼백팔십오억 원 (₩38,500,000,000)', isModified: false },
          { label: '착공일', value: '2024년 02월 01일', isModified: false },
          { label: '준공예정일', value: '2026년 01월 31일', isModified: false },
          { label: '공사기간', value: '24개월', isModified: false },
        ],
      },
    },
    {
      id: 's-03', type: 'scope', order: 3, title: '2. 적용 범위', isVisible: true, isLocked: false,
      content: {
        kind: 'text',
        body: `본 품질관리계획서는 ○○시 도시재생 뉴딜사업 기반시설 공사의 전 공정에 걸쳐 적용되며, 아래의 공종을 포함합니다.

가. 도로공사 (포장, 노면, 보도블록 포함)
나. 상수도 배관공사 (관 부설, 밸브, 계량기함 포함)
다. 하수도 배관공사 (오수관, 우수관, 맨홀 포함)
라. 조경 및 공원 조성 공사
마. 전기·통신 기반시설 공사

단, 전기·통신 공사 중 일부 전문 공사는 별도 품질관리계획서를 수립하며, 본 계획서와 상충되지 않도록 관리한다.`,
        isAiGenerated: true,
      },
    },
    {
      id: 's-04', type: 'organization', order: 4, title: '3. 품질관리 조직', isVisible: true, isLocked: false,
      content: {
        kind: 'organization',
        members: [
          { id: 'om-01', role: '현장소장', name: '이○○', qualification: '토목시공기술사', remark: '' },
          { id: 'om-02', role: '품질관리자', name: '김현준', qualification: '토질및기초기술사', remark: '전임' },
          { id: 'om-03', role: '공무팀장', name: '박○○', qualification: '건설관리기사', remark: '' },
          { id: 'om-04', role: '토목공사 담당', name: '최○○', qualification: '토목기사', remark: '' },
          { id: 'om-05', role: '기계설비 담당', name: '정○○', qualification: '기계기사', remark: '' },
        ],
      },
    },
    {
      id: 's-05', type: 'material', order: 5, title: '4. 자재 관리', isVisible: true, isLocked: false,
      content: {
        kind: 'table',
        caption: '표 4-1. 주요 자재 목록 및 품질 관리 기준',
        headers: ['번호', '자재명', '규격', '적용기준', '단위', '품질관리 방법', '비고'],
        rows: [
          ['1', '아스팔트 혼합물', 'AC 13mm', 'KS F 2349', 'ton', '배합설계서 제출, 마샬안정도 시험', ''],
          ['2', '레미콘(콘크리트)', '25-24-150', 'KS F 4009', 'm³', '압축강도 시험, 슬럼프 시험', '레미콘 납품서 확인'],
          ['3', '철근', 'HD22 이상', 'KS D 3504', 'ton', '인장강도 시험, 밀시트 확인', ''],
          ['4', '흄관', 'ø450mm', 'KS F 4403', 'm', '외관검사, 수밀시험', ''],
          ['5', '강관(상수도)', 'ø200mm SGP', 'KS D 3507', 'm', '외관검사, 수압시험', ''],
          ['6', '맨홀', '1000×1000', 'KS F 4419', '개', '규격확인, 외관검사', ''],
        ],
      },
    },
    {
      id: 's-06', type: 'test_plan', order: 6, title: '5. 시험 및 검사 계획', isVisible: true, isLocked: false,
      content: {
        kind: 'text',
        body: `5.1 일반사항
본 공사의 시험 및 검사는 관련 KS 규격, 공사시방서, 설계도서 및 발주처 요구 기준에 따라 실시하며, 모든 시험 결과는 품질시험성적서로 기록·보관한다.

5.2 시험 실시 원칙
- 시험은 자격을 갖춘 품질시험기관 또는 현장 품질시험실에서 실시한다.
- 시험 결과 불합격 시 즉시 시공 중단 후 원인 분석 및 재시험을 실시한다.
- 발주처 또는 감리단의 입회 하에 시험을 실시하는 것을 원칙으로 한다.
- 시험 빈도는 최소 기준이며, 현장 여건에 따라 증가할 수 있다.

5.3 시험 기록 및 보고
- 모든 시험 결과는 시험성적서 및 품질관리대장에 기록한다.
- 월별 품질관리보고서를 작성하여 발주처에 보고한다.`,
        isAiGenerated: true,
      },
    },
    {
      id: 's-07', type: 'test_items', order: 7, title: '6. 공종별 시험 항목', isVisible: true, isLocked: false,
      content: {
        kind: 'test_items',
        items: generateDummyTestItems(),
      },
    },
    {
      id: 's-08', type: 'attachment', order: 8, title: '7. 첨부자료', isVisible: true, isLocked: false,
      content: {
        kind: 'table',
        caption: '표 7-1. 첨부자료 목록',
        headers: ['번호', '첨부자료명', '문서번호', '비고'],
        rows: [
          ['1', '품질관리 조직도', 'QP-2024-001-A01', ''],
          ['2', '시험·검사 체크리스트', 'QP-2024-001-A02', '공종별'],
          ['3', '자재 반입 검수 절차서', 'QP-2024-001-A03', ''],
          ['4', '품질시험성적서 양식', 'QP-2024-001-A04', '표준양식'],
          ['5', '불합격 자재 처리 절차', 'QP-2024-001-A05', ''],
        ],
      },
    },
  ]
}

// ─────────────────────────────────────────────
//  템플릿 목록
// ─────────────────────────────────────────────
export const dummyTemplates: DocumentTemplate[] = [
  {
    id: 'tpl-001',
    name: 'LH 품질관리계획서 표준 양식',
    type: 'quality_plan',
    client: 'LH한국토지주택공사',
    description: 'LH 발주 공사에 적용되는 품질관리계획서 표준 양식입니다. 2024년 개정판을 반영하였습니다.',
    isDefault: true,
    isCustom: false,
    sections: [],
    approvalBox: {
      title: '결재',
      position: 'top-right',
      rows: [{ id: 'r1', cells: [
        { id: 'c1', title: '담당자', name: '', date: '' },
        { id: 'c2', title: '팀장', name: '', date: '' },
        { id: 'c3', title: '현장소장', name: '', date: '' },
        { id: 'c4', title: '감리단장', name: '', date: '' },
      ]}],
    },
    usageCount: 23,
    createdAt: '2024-01-15T09:00:00',
    updatedAt: '2024-03-01T11:00:00',
  },
  {
    id: 'tpl-002',
    name: '국토부 품질시험계획서 표준 양식',
    type: 'test_plan',
    client: '국토교통부',
    description: '국도·지방도 공사에 적용되는 품질시험계획서 표준 양식입니다. 국토관리청 요구사항을 반영합니다.',
    isDefault: true,
    isCustom: false,
    sections: [],
    approvalBox: {
      title: '결재',
      position: 'top-right',
      rows: [{ id: 'r1', cells: [
        { id: 'c1', title: '담당자', name: '', date: '' },
        { id: 'c2', title: '현장소장', name: '', date: '' },
        { id: 'c3', title: '책임건설사업관리기술인', name: '', date: '' },
      ]}],
    },
    usageCount: 17,
    createdAt: '2024-01-15T09:00:00',
    updatedAt: '2024-02-20T14:00:00',
  },
  {
    id: 'tpl-003',
    name: '범용 품질관리계획서 (토목)',
    type: 'quality_plan',
    client: '공통',
    description: '발주처 무관 토목공사 일반 품질관리계획서입니다. 내용 수정 후 사용하세요.',
    isDefault: true,
    isCustom: false,
    sections: [],
    approvalBox: {
      title: '결재',
      position: 'top-right',
      rows: [{ id: 'r1', cells: [
        { id: 'c1', title: '담당자', name: '', date: '' },
        { id: 'c2', title: '팀장', name: '', date: '' },
        { id: 'c3', title: '현장소장', name: '', date: '' },
      ]}],
    },
    usageCount: 41,
    createdAt: '2024-01-10T09:00:00',
    updatedAt: '2024-01-10T09:00:00',
  },
  {
    id: 'tpl-004',
    name: '한진건설 사내 품질시험계획서',
    type: 'test_plan',
    client: '공통',
    description: '(주)한진건설 사내 기준을 반영한 품질시험계획서 양식입니다.',
    isDefault: false,
    isCustom: true,
    sections: [],
    approvalBox: {
      title: '결재',
      position: 'top-right',
      rows: [{ id: 'r1', cells: [
        { id: 'c1', title: '품질관리자', name: '', date: '' },
        { id: 'c2', title: '공무팀장', name: '', date: '' },
        { id: 'c3', title: '부장', name: '', date: '' },
        { id: 'c4', title: '현장소장', name: '', date: '' },
        { id: 'c5', title: '감리단장', name: '', date: '' },
      ]}],
    },
    usageCount: 8,
    createdAt: '2024-02-05T11:00:00',
    updatedAt: '2024-04-01T09:30:00',
  },
]

// ─────────────────────────────────────────────
//  통계 데이터
// ─────────────────────────────────────────────
export const dashboardStats = {
  totalProjects: 12,
  activeProjects: 4,
  completedDocuments: 31,
  totalTestItems: 248,
}
