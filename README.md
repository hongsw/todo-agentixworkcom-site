# agentiXwork.com — AI 에이전시 운영 시스템

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange)](https://agentixwork.com)
[![Notion API](https://img.shields.io/badge/Notion-API-black)](https://notion.so)

AI로 자율 실행하는 에이전시. Notion에서 지시하면 Claude Code가 코드 작업부터 PR까지 자동화합니다.

## 🌐 라이브 사이트

- **Production**: https://agentixwork.com
- **Preview**: https://main.agentixwork-site.pages.dev

---

## 🚀 빠른 시작

### 1. 로컬 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/hongsw/todo-agentixworkcom-site.git
cd todo-agentixworkcom-site

# 환경 변수 설정
cp .env.cloudflare.example .dev.vars
# .dev.vars 파일 편집하여 실제 값 입력

# Wrangler 설치
npm install -g wrangler

# 로컬 개발 서버 시작
wrangler pages dev . --port 8000
```

http://localhost:8000 에서 확인 가능합니다.

자세한 내용은 [LOCAL-DEV.md](./LOCAL-DEV.md)를 참조하세요.

### 2. API 테스트

```bash
curl -X POST http://localhost:8000/api/submit-demo \
  -H "Content-Type: application/json" \
  -d '{
    "company": "테스트회사",
    "name": "홍길동",
    "email": "test@example.com",
    "useCase": "테스트",
    "timestamp": "2026-02-07T10:00:00Z"
  }'
```

---

## 📦 개발 워크플로우

### Git 브랜치 전략

```
main       ← 개발 및 테스트 (Preview 자동 배포)
production ← 프로덕션 배포 (Production 자동 배포)
```

### 개발 프로세스

1. **기능 개발**
   ```bash
   # main 브랜치에서 작업
   git checkout main
   git pull origin main

   # 코드 수정
   # ...

   # 커밋 및 푸시
   git add .
   git commit -m "feat: 새로운 기능"
   git push origin main
   ```

2. **Preview 배포 자동 실행**
   - main 브랜치 푸시 시 자동 Preview 배포
   - URL: https://main.agentixwork-site.pages.dev

3. **프로덕션 배포**
   ```bash
   # production 브랜치로 머지
   git checkout production
   git merge main
   git push origin production
   ```

4. **Production 배포 자동 실행**
   - production 브랜치 푸시 시 자동 Production 배포
   - URL: https://agentixwork.com

### 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
style: 스타일 변경 (코드 포맷팅, 세미콜론 누락 등)
refactor: 코드 리팩토링
docs: 문서 수정
chore: 빌드 업무 수정, 패키지 매니저 수정
```

---

## 🏗️ 프로젝트 구조

```
todo-agentixworkcom-site/
├── index.html              # 메인 HTML
├── styles.css              # 스타일시트 (30KB+)
├── script.js               # 클라이언트 JavaScript
│
├── functions/              # Cloudflare Pages Functions
│   └── api/
│       ├── submit-demo.js  # 데모 신청 API (Notion + Slack)
│       ├── slack-invite.js # Slack 초대 API
│       └── debug-env.js    # 환경 변수 디버그
│
├── public/                 # 정적 파일
│   ├── _headers            # Security headers (CSP, HSTS, etc.)
│   ├── _redirects          # URL redirects (www → non-www)
│   ├── robots.txt          # SEO
│   ├── sitemap.xml         # SEO
│   └── site.webmanifest    # PWA manifest
│
├── .dev.vars               # 로컬 환경 변수 (gitignored)
├── wrangler.toml           # Cloudflare Pages 설정
│
├── CLAUDE.md               # AI 에이전시 운영 시스템
├── LOCAL-DEV.md            # 로컬 개발 가이드
├── DEPLOYMENT.md           # 배포 가이드
├── CLOUDFLARE-ENV-SETUP.md # 환경 변수 설정 가이드
└── NOTION-LEADS-SCHEMA.md  # Notion DB 스키마
```

---

## 🔧 주요 기능

### 1. 데모 신청 폼 (`/api/submit-demo`)

```javascript
// 기능
✓ Notion 데이터베이스에 리드 저장
✓ Slack 알림 발송 (선택사항)
✓ 이메일 유효성 검증
✓ CORS 지원

// 응답 예시
{
  "success": true,
  "message": "데모 신청이 완료되었습니다.",
  "notionPageId": "300af259-..."
}
```

### 2. 반응형 디자인

- Mobile-first 접근
- 4단계 브레이크포인트: <375px, 320-640px, 768-968px, >968px
- 터치 친화적 (44x44px 최소 터치 타겟)
- WCAG 2.1 AA 접근성 준수

### 3. SEO 최적화

- Open Graph 메타 태그
- Twitter Card 지원
- JSON-LD 구조화 데이터
- Sitemap.xml 및 robots.txt

### 4. 보안

- Content Security Policy (CSP)
- HSTS (Strict-Transport-Security)
- X-Frame-Options
- X-Content-Type-Options

---

## 🔐 환경 변수

### 필수 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `NOTION_API_KEY` | Notion Integration Secret | `ntn_xxx...` |
| `NOTION_LEADS_DB_ID` | 리드 수집용 데이터베이스 ID | `300af259fd05...` |

### 선택 환경 변수

| 변수명 | 설명 | 용도 |
|--------|------|------|
| `SLACK_WEBHOOK_URL` | Slack Incoming Webhook URL | 신규 리드 알림 |
| `ADMIN_API_KEY` | Admin API 인증 키 | Slack 초대 API 보호 |

### 환경 변수 설정 방법

#### 로컬 개발 (.dev.vars)
```bash
cp .env.cloudflare.example .dev.vars
# .dev.vars 파일 편집
```

#### Cloudflare Pages (Dashboard)
1. https://dash.cloudflare.com
2. Pages → agentixwork-site → Settings
3. Environment variables
4. Production/Preview 환경에 변수 추가

자세한 내용은 [CLOUDFLARE-ENV-SETUP.md](./CLOUDFLARE-ENV-SETUP.md)를 참조하세요.

---

## 📚 문서

- [LOCAL-DEV.md](./LOCAL-DEV.md) - 로컬 개발 환경 설정 및 테스트
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Cloudflare Pages 배포 가이드
- [CLOUDFLARE-ENV-SETUP.md](./CLOUDFLARE-ENV-SETUP.md) - 환경 변수 설정 방법
- [NOTION-LEADS-SCHEMA.md](./NOTION-LEADS-SCHEMA.md) - Notion Leads DB 스키마
- [CLAUDE.md](./CLAUDE.md) - AI 에이전시 운영 시스템 규칙

---

## 🐛 트러블슈팅

### API 401 Unauthorized

**증상**: API 호출 시 "API token is invalid" 오류

**해결**:
1. Cloudflare Pages Dashboard에서 환경 변수 확인
2. `NOTION_API_KEY`가 올바르게 설정되었는지 확인
3. Notion Integration이 데이터베이스에 연결되었는지 확인

### 배포 후 404 에러

**증상**: agentixwork.com 접속 시 404 또는 "Deployment Not Found"

**해결**:
1. Cloudflare Pages에서 production 브랜치 배포 상태 확인
2. Custom domains 설정에서 도메인이 올바른 브랜치에 연결되었는지 확인
3. production 브랜치에 최신 코드가 푸시되었는지 확인

### 로컬 개발 시 CORS 에러

**증상**: 로컬에서 API 호출 시 CORS 에러

**해결**:
1. Python HTTP 서버 대신 `wrangler pages dev` 사용
2. `.dev.vars` 파일이 존재하는지 확인
3. Port 8000 사용 권장

### manifest 파일 에러

**증상**: "Manifest: Syntax error" in DevTools

**해결**:
1. site.webmanifest 파일에 BOM 문자 제거
2. UTF-8 인코딩 확인
3. JSON 유효성 검증

---

## 🎮 AI 에이전시 운영 시스템

이 프로젝트는 Claude Code 기반 이중 기록 체계로 운영됩니다.

### 이중 기록 체계란?

| | GitHub PR | Notion TODO |
|---|---|---|
| **독자** | 개발자 | 고객/비개발자 |
| **언어** | 기술 용어 OK | 쉬운 한국어만 |
| **내용** | 코드 diff, 테스트 결과 | "버튼 색 바꿨습니다" |
| **목적** | 코드 리뷰 | 진행 확인, 피드백 |

### Notion TODO DB 스키마

| 속성 | 타입 | 값 |
|------|------|-----|
| Task | Title | 작업명 |
| Status | Select | 📋 대기 / 🔄 진행중 / 👀 리뷰중 / ✅ 완료 / ⏸️ 보류 |
| Priority | Select | 🔴 긴급 / 🟠 높음 / 🟡 보통 / 🟢 낮음 |
| 담당 | Select | 팀원 / Claude Code / 고객 |
| Phase | Select | 기획 / 디자인 / 개발 / QA |

자세한 내용은 [CLAUDE.md](./CLAUDE.md)를 참조하세요.

---

## 🤝 기여

1. main 브랜치에서 작업
2. 변경사항 커밋 및 푸시
3. Preview 배포로 테스트
4. production 브랜치로 머지
5. Production 배포

---

## 📞 문의

- Website: https://agentixwork.com
- GitHub: https://github.com/hongsw/todo-agentixworkcom-site

---

## 📄 라이선스

Private - 모든 권리 보유 © 2026 agentiXwork
