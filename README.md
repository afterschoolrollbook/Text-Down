# Text-Down - YouTube 썸네일 다운로더

유튜브 URL을 입력하면 HD/HQ/SD 등 모든 해상도의 썸네일을 무료로 다운로드할 수 있는 웹 서비스입니다.
Google AdSense를 통한 수익화 전략이 내장되어 있습니다.

---

## ✨ 주요 기능

- 🖼️ 4가지 해상도 썸네일 다운로드 (HD, SD, HQ, MQ)
- 🌐 한국어 / 영어 이중 언어 지원
- ⏱️ 쿨다운 타이머 (요청 사이 광고 강제 노출 → 수익 최적화)
- 💰 4개 광고 슬롯 (상단, 쿨다운, 결과하단, 푸터)
- 🔧 관리자 패널 (쿨다운 설정, 광고 on/off)
- 📱 반응형 디자인

---

## 🚀 배포 방법 (Vercel)

### 1. 로컬에서 테스트

```bash
npm install
npm run dev
# http://localhost:3000 에서 확인
```

### 2. GitHub에 올리기

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/text-down.git
git push -u origin main
```

### 3. Vercel 배포

1. https://vercel.com 접속
2. "Add New Project" 클릭
3. GitHub 저장소 연결
4. **Environment Variables 설정** (아래 참고)
5. Deploy!

---

## ⚙️ 환경 변수 설정

Vercel 대시보드 → 프로젝트 → Settings → Environment Variables

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `NEXT_PUBLIC_ADSENSE_CLIENT` | 애드센스 게시자 ID | `ca-pub-1234567890` |
| `NEXT_PUBLIC_AD_SLOT_TOP` | 상단 광고 슬롯 ID | `1111111111` |
| `NEXT_PUBLIC_AD_SLOT_COOLDOWN` | 쿨다운 광고 슬롯 ID ⭐ | `2222222222` |
| `NEXT_PUBLIC_AD_SLOT_MIDDLE` | 중간 광고 슬롯 ID | `3333333333` |
| `NEXT_PUBLIC_AD_SLOT_FOOTER` | 푸터 광고 슬롯 ID | `4444444444` |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | 관리자 비밀번호 | `안전한비밀번호` |

---

## 💰 수익화 전략

1. **쿨다운 광고 (핵심)**: 사용자가 썸네일을 가져올 때마다 10~15초 쿨다운이 시작되며, 이 동안 광고가 크게 표시됩니다.
2. **3개 추가 슬롯**: 페이지 상단/결과 하단/푸터에 배너 광고
3. **영어 지원**: 영어권 사용자는 CPC(클릭당 단가)가 더 높아 수익이 올라갑니다.

---

## 🔧 관리자 패널

`/admin` 경로로 접속 (기본 비밀번호: `admin1234`)

- 쿨다운 시간 조절 (5~30초)
- 광고 활성화/비활성화
- 애드센스 설정 가이드

---

## 📁 파일 구조

```
text-down/
├── pages/
│   ├── index.js          # 메인 페이지
│   ├── admin.js          # 관리자 패널
│   └── api/
│       └── download.js   # 썸네일 다운로드 API
├── styles/
│   └── globals.css       # 전체 스타일
├── next.config.js
├── package.json
└── .env.example          # 환경변수 예시
```
