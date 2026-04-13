# Text-Down

무료 온라인 텍스트 도구 모음. -Down 세계관 시리즈.

## 설치

```bash
npm install
npm run dev
```

## 환경변수 (Vercel)

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_SECRET_TOKEN=  # 랜덤 문자열
NEXT_PUBLIC_ADMIN_PASSWORD=  # 초기 어드민 비밀번호
```

## Supabase 테이블

```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);
```

## 어드민

`/admin` 경로로 접속
