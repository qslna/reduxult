# REDUX Portfolio Website

## 프로젝트 개요

REDUX는 6인의 패션 디자이너로 구성된 창작 집단의 포트폴리오 웹사이트입니다. Next.js 15를 기반으로 구축되었으며, ImageKit을 통한 이미지 관리 시스템이 통합되어 있습니다.

## 기술 스택

- **Framework**: Next.js 15.1.0 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Image CDN**: ImageKit
- **Icons**: Lucide React

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── about/             # About 섹션 페이지
│   ├── designers/         # 디자이너 프로필 페이지
│   ├── exhibitions/       # 전시 정보 페이지
│   ├── contact/          # 연락처 페이지
│   └── api/              # API 라우트
├── components/            # React 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── home/             # 홈페이지 컴포넌트
│   ├── designers/        # 디자이너 관련 컴포넌트
│   ├── about/            # About 관련 컴포넌트
│   ├── exhibitions/      # 전시 관련 컴포넌트
│   ├── contact/          # 연락처 컴포넌트
│   ├── ui/               # UI 컴포넌트
│   └── admin/            # 관리자 컴포넌트
├── lib/                   # 유틸리티 라이브러리
├── types/                 # TypeScript 타입 정의
└── utils/                 # 유틸리티 함수
```

## 주요 기능

### 1. 디자이너 프로필 시스템
- 6인의 디자이너 개별 페이지
- 프로필 이미지 및 포트폴리오 갤러리
- Instagram 연동

### 2. About 섹션
- 5개의 카테고리 (Collective, Visual Art, Fashion Film, Installation, Memory)
- 각 카테고리별 상세 페이지
- 이미지 갤러리

### 3. CMS 기능
- ImageKit 기반 이미지 업로드/관리
- 관리자 모드에서 실시간 이미지 변경
- 드래그 앤 드롭 지원

### 4. 반응형 디자인
- 모바일, 태블릿, 데스크탑 최적화
- 다크 테마 기본 적용

## 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 설정해야 합니다:

```env
# ImageKit Configuration
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
IMAGEKIT_PRIVATE_KEY=your_private_key
```

## 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm run start

# 타입 체크
npm run type-check

# 린트
npm run lint
```

## 배포

이 프로젝트는 Vercel에 배포되어 있습니다. GitHub 저장소와 연동되어 있어 main 브랜치에 푸시하면 자동으로 배포됩니다.

배포 URL: https://reduxult.vercel.app/

## 향후 개발 예정

1. **관리자 인증 시스템**
   - 현재는 개발 모드에서만 관리자 기능 활성화
   - 실제 인증 시스템 구축 필요

2. **API 백엔드**
   - 현재는 정적 데이터 사용
   - 실제 데이터베이스 연동 필요

3. **이메일 전송 기능**
   - Contact 폼 제출 시 실제 이메일 전송

4. **다국어 지원**
   - 한국어/영어 전환 기능

5. **SEO 최적화**
   - 메타 태그 개선
   - 구조화된 데이터 추가

## 주의사항

- 이미지는 반드시 ImageKit CDN을 통해 제공되어야 합니다
- 모든 컴포넌트는 TypeScript로 작성되어야 합니다
- 새로운 기능 추가 시 반드시 타입 체크와 린트를 통과해야 합니다

## 문제 해결

### ImageKit 인증 오류
- 환경 변수가 올바르게 설정되었는지 확인
- ImageKit 대시보드에서 API 키 재확인

### 빌드 오류
- `npm run type-check`로 타입 오류 확인
- `npm run lint`로 코드 스타일 확인

### 이미지 로딩 문제
- ImageKit URL endpoint가 올바른지 확인
- 이미지 경로가 정확한지 확인