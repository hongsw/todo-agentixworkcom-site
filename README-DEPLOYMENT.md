# Deployment Guide — agentiXwork.com

## Cloudflare Pages 배포

### 1. Cloudflare Pages 프로젝트 생성

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) 로그인
2. **Pages** → **Create a project** 클릭
3. **Connect to Git** → GitHub 리포지토리 선택
4. Build settings:
   - **Framework preset**: None
   - **Build command**: (비워두기)
   - **Build output directory**: `/`
   - **Root directory**: `/`

### 2. 환경변수 설정

**Settings > Environment variables**에서 다음 변수들을 추가:

#### Production 환경

```
NOTION_API_KEY=secret_xxx
NOTION_LEADS_DB_ID=xxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/xxx/xxx
SLACK_BOT_TOKEN=xoxb-xxx
SLACK_TEAM_ID=Txxx
ADMIN_API_KEY=your-secure-random-key
```

#### Preview 환경 (선택사항)

동일한 변수를 Preview 환경에도 설정하거나, 테스트용 별도 값 사용

### 3. Notion Leads DB 준비

데모 신청 데이터를 저장할 Notion 데이터베이스를 생성:

| 속성 | 타입 | 설명 |
|------|------|------|
| 회사명 | Title | 신청 회사명 |
| 담당자명 | Text | 담당자 이름 |
| 이메일 | Email | 연락처 이메일 |
| 사용목적 | Text | 사용 목적 (선택) |
| 신청일 | Date | 신청 날짜 |
| Status | Select | 신청 접수, 승인 대기, 초대 완료, 거절 |

**Integration 연결**: TODO 보드와 동일하게 Notion Integration 연결 필요

### 4. Slack 설정 (선택사항)

#### Slack Webhook (알림용)

1. https://api.slack.com/apps 접속
2. **Create New App** → **From scratch**
3. **Incoming Webhooks** 활성화
4. **Add New Webhook to Workspace**
5. Webhook URL 복사 → `SLACK_WEBHOOK_URL`에 설정

#### Slack Bot Token (초대용)

1. Slack App 설정 → **OAuth & Permissions**
2. **Scopes** 추가:
   - `admin.users:write` (사용자 초대)
3. **Install to Workspace**
4. **Bot User OAuth Token** 복사 → `SLACK_BOT_TOKEN`에 설정
5. Workspace Team ID 확인:
   ```bash
   curl -X POST https://slack.com/api/team.info \
     -H "Authorization: Bearer xoxb-your-token"
   ```
   응답의 `team.id` 값을 `SLACK_TEAM_ID`에 설정

### 5. 도메인 연결

1. Cloudflare Pages 프로젝트 → **Custom domains**
2. **Set up a custom domain** 클릭
3. `agentixwork.com` 입력
4. DNS 레코드 자동 설정 확인
5. SSL/TLS 인증서 자동 발급 대기 (5-10분)

### 6. 배포 확인

```bash
# 로컬 테스트 (Wrangler 사용)
npm install -g wrangler
wrangler pages dev .

# 프로덕션 배포 확인
curl https://agentixwork.com/api/submit-demo \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Test Corp",
    "name": "Test User",
    "email": "test@example.com",
    "useCase": "Testing"
  }'
```

## API 엔드포인트

### POST /api/submit-demo

데모 신청 폼 제출

**Request:**
```json
{
  "company": "회사명",
  "name": "담당자명",
  "email": "email@example.com",
  "useCase": "사용 목적 (선택)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "데모 신청이 완료되었습니다."
}
```

### POST /api/slack-invite

Slack 워크스페이스 초대 (관리자 전용)

**Headers:**
```
Authorization: Bearer {ADMIN_API_KEY}
```

**Request:**
```json
{
  "email": "user@example.com",
  "channels": ["C01234567"]  // 선택사항
}
```

**Response:**
```json
{
  "success": true,
  "message": "Slack 초대장을 발송했습니다."
}
```

## 문제 해결

### Notion API 연결 실패

- Integration이 Leads DB에 연결되었는지 확인
- `NOTION_LEADS_DB_ID`가 하이픈 없이 32자리인지 확인
- Notion API 버전 `2022-06-28` 사용 확인

### Slack 초대 실패

- Slack Bot Token 권한 확인: `admin.users:write`
- Workspace에 Bot이 설치되었는지 확인
- Team ID 형식 확인: `T`로 시작하는 ID

### CORS 오류

- Cloudflare Pages Functions는 자동으로 CORS 헤더 추가
- 로컬 테스트 시 Wrangler 사용 권장

## 모니터링

- **Cloudflare Analytics**: 방문자 통계
- **Functions Logs**: API 호출 로그 (실시간)
- **Notion Database**: 신청 현황 확인
