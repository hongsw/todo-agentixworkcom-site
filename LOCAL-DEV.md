# 로컬 개발 가이드

## 🚀 빠른 시작

### 1. 환경 변수 설정

`.env` 파일을 생성하고 필요한 환경 변수를 설정합니다:

```bash
cp .env.cloudflare.example .env
```

`.env` 파일 편집:
```bash
# Notion Integration
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_LEADS_DB_ID=xxxxxxxxxxxxx

# Slack Integration (선택사항)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/xxx/xxx
SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxxx
SLACK_TEAM_ID=Txxxxxxxxxx

# Admin API
ADMIN_API_KEY=your-secure-api-key
```

**중요**: `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.

### 2. Notion Database 생성

`NOTION-LEADS-SCHEMA.md` 문서를 참고하여 Notion Leads Database를 생성합니다.

---

## 🧪 로컬 테스트 방법

### 방법 1: Cloudflare Wrangler (권장)

Cloudflare Pages Functions를 로컬에서 실행하는 공식 방법입니다.

#### 1.1. Wrangler 설치

```bash
npm install -g wrangler
```

#### 1.2. 로컬 서버 실행

```bash
wrangler pages dev . --port 8000
```

이제 http://localhost:8000 에서 페이지와 API 모두 테스트 가능합니다.

#### 1.3. API 테스트

**데모 신청 폼 제출 테스트**:
```bash
curl -X POST http://localhost:8000/api/submit-demo \
  -H "Content-Type: application/json" \
  -d '{
    "company": "테스트회사",
    "name": "홍길동",
    "email": "test@example.com",
    "useCase": "사내 프로젝트 자동화",
    "timestamp": "2026-02-07T10:00:00Z"
  }'
```

**Slack 초대 테스트** (Admin API Key 필요):
```bash
curl -X POST http://localhost:8000/api/slack-invite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-admin-api-key" \
  -d '{
    "email": "test@example.com"
  }'
```

---

### 방법 2: Python HTTP Server (정적 파일만)

API 없이 프론트엔드만 테스트할 때 사용합니다.

```bash
python3 -m http.server 8000
```

**주의**: 이 방법은 `/api/*` 엔드포인트가 작동하지 않습니다. 폼 제출 시 404 에러가 발생합니다.

---

## 📁 프로젝트 구조

```
todo-agentixworkcom-site/
├── index.html              # 메인 HTML
├── styles.css              # 스타일시트
├── script.js               # 클라이언트 JavaScript
├── functions/              # Cloudflare Pages Functions
│   └── api/
│       ├── submit-demo.js  # 데모 신청 API
│       └── slack-invite.js # Slack 초대 API
├── public/                 # 정적 파일
│   ├── _headers            # Security headers
│   ├── _redirects          # Redirects
│   ├── robots.txt          # SEO
│   ├── sitemap.xml         # SEO
│   └── site.webmanifest    # PWA
├── .env                    # 환경 변수 (git ignored)
├── .env.cloudflare.example # 환경 변수 예시
└── wrangler.toml           # Cloudflare 설정
```

---

## 🧪 API 테스트 시나리오

### 1. 정상 제출 테스트

```javascript
// 브라우저 개발자 도구 콘솔에서 실행
fetch('/api/submit-demo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    company: '테스트회사',
    name: '홍길동',
    email: 'test@example.com',
    useCase: '테스트 목적',
    timestamp: new Date().toISOString()
  })
})
.then(r => r.json())
.then(console.log);
```

**예상 응답**:
```json
{
  "success": true,
  "message": "데모 신청이 완료되었습니다.",
  "notionPageId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

### 2. 필수 필드 누락 테스트

```javascript
fetch('/api/submit-demo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    company: '테스트회사'
    // name, email 누락
  })
})
.then(r => r.json())
.then(console.log);
```

**예상 응답**:
```json
{
  "success": false,
  "error": "필수 항목을 모두 입력해주세요."
}
```

### 3. 이메일 형식 오류 테스트

```javascript
fetch('/api/submit-demo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    company: '테스트회사',
    name: '홍길동',
    email: 'invalid-email',
    timestamp: new Date().toISOString()
  })
})
.then(r => r.json())
.then(console.log);
```

**예상 응답**:
```json
{
  "success": false,
  "error": "올바른 이메일 주소를 입력해주세요."
}
```

---

## 🐛 문제 해결

### wrangler 명령어를 찾을 수 없습니다

```bash
npm install -g wrangler
# 또는
npx wrangler pages dev . --port 8000
```

### API 호출 시 CORS 에러

wrangler dev를 사용하지 않고 Python HTTP 서버를 사용하는 경우 발생합니다.
→ wrangler dev를 사용하세요.

### Notion API 401 Unauthorized

- `NOTION_API_KEY`가 올바른지 확인
- Integration이 Database에 연결되었는지 확인
- Database ID가 정확한지 확인

### Slack 알림이 오지 않습니다

- `SLACK_WEBHOOK_URL`이 올바른지 확인
- Webhook URL이 활성화되어 있는지 확인
- Slack 알림은 선택사항이므로 실패해도 API는 성공합니다

---

## 🚀 배포 테스트

### Preview 배포

```bash
git push origin feature-branch
```

Cloudflare Pages가 자동으로 Preview URL을 생성합니다:
```
https://[branch-name].agentixwork-site.pages.dev
```

### Production 배포

```bash
git push origin main
```

자동으로 https://agentixwork.com 에 배포됩니다.

---

## 📊 로그 확인

### Cloudflare Dashboard
1. Pages → 프로젝트 선택
2. **Functions** 탭
3. **Logs** 에서 실시간 로그 확인

### 로컬 개발
```bash
wrangler pages dev . --port 8000 --log-level debug
```

---

## 참고 문서

- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Notion API](https://developers.notion.com/)
- [Slack API](https://api.slack.com/)
