# Text-Down

무료 온라인 텍스트 도구 모음. -Down 세계관 시리즈.

글자수 세기, 공백 정리, 대소문자 변환, 텍스트 제거, 줄 정렬, 텍스트 비교(Diff) 등 다양한 텍스트 도구를 무료로 제공합니다.

---

## ✨ 주요 기능

- 📝 글자수 세기 (공백 포함/제외, 단어수, 줄수, 바이트)
- 🧹 공백/줄바꿈 정리
- 🔤 대소문자 변환
- ✂️ 텍스트 제거 (HTML 태그, 특수문자, 중복 줄 등)
- 🔃 줄 정렬 / 뒤집기 / 랜덤 섞기
- 🔍 텍스트 비교 (Diff)
- 🌐 한국어 / 영어 이중 언어 지원
- 💰 광고 슬롯 (상단, 사이드바 좌우, 중간, 푸터)
- 🔧 관리자 패널 (광고 on/off, 블로그 글 관리)
- 📱 반응형 디자인

---

## 🚀 배포 방법 (Vercel)

```bash
npm install
npm run dev
# http://localhost:3000 에서 확인
```

---

## ⚙️ 환경 변수 설정

Vercel 대시보드 → 프로젝트 → Settings → Environment Variables

| 변수명 | 설명 |
|--------|------|
| `SUPABASE_URL` | Supabase 프로젝트 URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key |
| `ADMIN_SECRET_TOKEN` | 어드민 API 보안 토큰 (랜덤 문자열) |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | 관리자 초기 비밀번호 |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | 애드센스 게시자 ID |
| `NEXT_PUBLIC_AD_SLOT_TOP` | 상단 광고 슬롯 ID |
| `NEXT_PUBLIC_AD_SLOT_LEFT` | 왼쪽 사이드바 광고 슬롯 ID |
| `NEXT_PUBLIC_AD_SLOT_RIGHT` | 오른쪽 사이드바 광고 슬롯 ID |
| `NEXT_PUBLIC_AD_SLOT_MIDDLE` | 중간 광고 슬롯 ID |
| `NEXT_PUBLIC_AD_SLOT_FOOTER` | 푸터 광고 슬롯 ID |

---

## 🗄️ Supabase 테이블

```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

CREATE TABLE blog_posts (
  id BIGSERIAL PRIMARY KEY,
  site TEXT NOT NULL,
  slug TEXT NOT NULL,
  title_ko TEXT,
  title_en TEXT,
  description_ko TEXT,
  description_en TEXT,
  content_ko TEXT,
  content_en TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔧 관리자 패널

`/admin` 경로로 접속

- 광고 활성화/비활성화
- 블로그 글 작성/수정/삭제
- 비밀번호 변경

---

## 📁 파일 구조

```
text-down/
├── pages/
│   ├── index.js              # 메인 페이지 (텍스트 도구)
│   ├── admin.js              # 관리자 패널
│   ├── faq.js                # FAQ
│   ├── privacy.js            # 개인정보처리방침
│   ├── terms.js              # 이용약관
│   ├── blog/
│   │   ├── index.js          # 블로그 목록
│   │   └── [slug].js         # 블로그 상세
│   └── api/
│       ├── blog/
│       │   └── posts.js      # 블로그 API
│       └── settings/
│           ├── get.js        # 설정 읽기
│           ├── save.js       # 설정 저장
│           ├── login.js      # 어드민 로그인
│           └── password.js   # 비밀번호 변경
├── styles/
│   └── globals.css
├── public/
│   ├── sitemap.xml
│   └── ads.txt
├── next.config.js
└── package.json
```
