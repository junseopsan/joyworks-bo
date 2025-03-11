<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# 사내 QnA 시스템

회사 내부 질문 및 답변을 공유하고 협업하는 플랫폼입니다.

## 주요 기능

- 회원가입 및 로그인 (이메일, OAuth)
- 질문 및 답변 작성
- 댓글을 통한 추가 질문
- 답변 채택 및 도움이 된 답변 표시
- 유사 질문 추천
- 관리자 기능

## 기술 스택

- **프론트엔드**: Next.js, React, TypeScript, Tailwind CSS
- **백엔드**: Supabase (PostgreSQL, Auth, Storage)
- **배포**: Vercel

## 개발 환경 설정

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn
- Supabase 계정

### 설치 및 실행

1. 저장소 클론

```bash
git clone https://github.com/your-username/joyworks-bo.git
cd joyworks-bo
```

2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

3. 환경 변수 설정

`.env` 파일을 생성하고 다음 변수를 설정합니다:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

4. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

5. 브라우저에서 `http://localhost:3000` 접속

## Supabase 설정

1. Supabase 프로젝트 생성
2. 데이터베이스 스키마 설정 (Prisma 스키마 참조)
3. 인증 설정 (이메일, OAuth 등)
4. SQL 함수 및 트리거 설정 (`prisma/supabase-functions.sql` 참조)

## 프로젝트 구조

```
src/
├── app/                  # Next.js App Router
│   ├── (auth)/           # 인증 관련 페이지
│   ├── questions/        # 질문 관련 페이지
│   ├── api/              # API 라우트
│   └── ...
├── components/           # 재사용 가능한 컴포넌트
│   ├── auth/             # 인증 관련 컴포넌트
│   ├── questions/        # 질문 관련 컴포넌트
│   ├── answers/          # 답변 관련 컴포넌트
│   ├── comments/         # 댓글 관련 컴포넌트
│   └── ...
├── lib/                  # 유틸리티 함수 및 설정
│   ├── supabase.ts       # Supabase 클라이언트
│   └── ...
└── types/                # TypeScript 타입 정의
```

## 배포

이 프로젝트는 Vercel에 배포할 수 있습니다:

1. Vercel 계정 생성
2. GitHub 저장소 연결
3. 환경 변수 설정
4. 배포

## 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다.
>>>>>>> 77ef2f57fd5a1fd90913989b938bfec3da466817
