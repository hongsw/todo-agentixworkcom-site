# Cloudflare Pages 환경 변수 설정 가이드

## ⚠️ 문제 상황
- CLI로 추가한 시크릿이 제대로 작동하지 않음
- Notion API 401 Unauthorized 오류 발생

## ✅ 해결 방법: Dashboard에서 직접 설정

### 1단계: Cloudflare Dashboard 접속
```
https://dash.cloudflare.com
→ Pages
→ agentixwork-site
→ Settings 탭
→ Environment variables 섹션
```

### 2단계: 기존 시크릿 제거
**Production** 환경에서:
- `NOTION_API_KEY` 삭제
- `NOTION_LEADS_DB_ID` 삭제

### 3단계: 새로 추가
**Environment variable (not encrypted)** 옵션으로 추가:

```plaintext
변수명: NOTION_API_KEY
값: [.dev.vars 파일에서 복사]
환경: Production
```

```plaintext
변수명: NOTION_LEADS_DB_ID
값: [.dev.vars 파일에서 복사]
환경: Production
```

### 4단계: 재배포
```bash
# Dashboard에서
Deployments 탭 → 최신 배포 → ⋯ → Retry deployment

# 또는 CLI에서
wrangler pages deploy . --project-name agentixwork-site --branch main
```

### 5단계: 테스트
```bash
curl -X POST https://agentixwork.com/api/submit-demo \
  -H "Content-Type: application/json" \
  -d '{
    "company": "테스트",
    "name": "테스터",
    "email": "test@example.com",
    "useCase": "테스트",
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }'
```

## 📝 참고사항

### 왜 Secret이 아닌 Environment Variable로?
- Pages Functions에서 Secret 접근 시 타이밍 이슈가 있을 수 있음
- Environment Variable은 즉시 적용됨
- Notion API Key는 이미 Cloudflare에서 암호화되어 저장됨

### 디버깅 팁
1. Dashboard에서 Environment variables가 정확히 입력되었는지 확인
2. 값에 공백이나 개행문자가 없는지 확인
3. Production 환경에 추가되었는지 확인 (Preview 아님)
4. 재배포 후 5-10초 대기

## 🔧 CLI 명령어 (참고용)

```bash
# 시크릿 확인
wrangler pages secret list --project-name agentixwork-site

# 시크릿 삭제
wrangler pages secret delete NOTION_API_KEY --project-name agentixwork-site
wrangler pages secret delete NOTION_LEADS_DB_ID --project-name agentixwork-site

# 배포
wrangler pages deploy . --project-name agentixwork-site --branch main
```
