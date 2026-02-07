# Cloudflare Pages 배포 가이드

## 1. Cloudflare Pages 프로젝트 생성

### 1.1. GitHub 연동
1. [Cloudflare Dashboard](https://dash.cloudflare.com/) 로그인
2. **Pages** → **Create a project**
3. **Connect to Git** → GitHub 연동
4. 저장소 선택: `todo-agentixworkcom-site`

### 1.2. 빌드 설정
```yaml
Framework preset: None
Build command: (비워둠)
Build output directory: public
Root directory: /
```

### 1.3. 환경 변수 설정
**Settings** → **Environment variables** → **Add variable**:

```bash
# Production
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_LEADS_DB_ID=xxxxxxxxxxxxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/xxx/xxx
SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxxx
SLACK_TEAM_ID=Txxxxxxxxxx
ADMIN_API_KEY=your-secure-random-key
```

**주의**: `.env` 파일의 값을 복사하되, Git에는 절대 커밋하지 마세요!

---

## 2. 커스텀 도메인 연결

### 2.1. Cloudflare DNS 설정
1. **Pages** → 프로젝트 선택 → **Custom domains**
2. **Set up a custom domain** 클릭
3. 도메인 입력: `agentixwork.com`
4. DNS 레코드 자동 생성:
   ```
   Type: CNAME
   Name: @
   Target: agentixwork-site.pages.dev
   Proxy: Enabled (orange cloud)
   ```

### 2.2. www 서브도메인 리다이렉트
1. **Custom domains** → **Add a custom domain**
2. 도메인 입력: `www.agentixwork.com`
3. DNS 레코드 자동 생성
4. `public/_redirects` 파일이 자동으로 www → non-www 리다이렉트 처리

---

## 3. 배포 확인

### 3.1. 자동 배포
- **main 브랜치 푸시** → 프로덕션 배포
- **다른 브랜치 푸시** → 프리뷰 배포 (unique URL)

### 3.2. 배포 상태 확인
1. Cloudflare Dashboard → **Pages** → 프로젝트 선택
2. **Deployments** 탭에서 배포 로그 확인
3. 성공 시 URL: `https://agentixwork.com`

### 3.3. 프리뷰 URL
각 PR마다 자동 생성:
```
https://[branch-name].agentixwork-site.pages.dev
```

---

## 4. 헤더 및 보안 설정

### 4.1. Security Headers
`public/_headers` 파일 참조:
- **X-Frame-Options**: DENY (클릭재킹 방지)
- **X-Content-Type-Options**: nosniff
- **CSP**: Content Security Policy
- **Referrer-Policy**: strict-origin-when-cross-origin

### 4.2. Cache Control
- **HTML**: `max-age=3600` (1시간)
- **Static Assets** (CSS/JS/Fonts/Images): `max-age=31536000, immutable` (1년)
- **API**: `no-cache, no-store` (캐시 비활성화)

---

## 5. API Functions 배포

Cloudflare Pages Functions는 `functions/` 디렉토리의 파일을 자동으로 서버리스 함수로 배포합니다.

### 현재 API 엔드포인트:
- `/api/submit-demo` - 데모 신청 폼 제출
- `/api/slack-invite` - Slack 워크스페이스 초대

### 환경 변수 접근 (Functions 내):
```javascript
export async function onRequest(context) {
  const { env } = context;
  const NOTION_API_KEY = env.NOTION_API_KEY;
  // ...
}
```

---

## 6. 배포 후 체크리스트

### 6.1. 기능 테스트
- [ ] 페이지 로딩 정상
- [ ] 반응형 디자인 동작 (모바일/태블릿)
- [ ] 데모 신청 폼 제출 테스트
- [ ] GA4 이벤트 추적 확인 (Real-time 리포트)
- [ ] Slack 알림 수신 확인

### 6.2. SEO 테스트
- [ ] Google Search Console 등록
- [ ] robots.txt 접근: `https://agentixwork.com/robots.txt`
- [ ] sitemap.xml 접근: `https://agentixwork.com/sitemap.xml`
- [ ] Open Graph 미리보기 테스트:
  - [Facebook Debugger](https://developers.facebook.com/tools/debug/)
  - [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 6.3. 성능 테스트
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) 테스트
- [ ] Core Web Vitals 확인 (LCP <2.5s, FID <100ms, CLS <0.1)
- [ ] [GTmetrix](https://gtmetrix.com/) 성능 분석

### 6.4. 보안 테스트
- [ ] [Security Headers](https://securityheaders.com/) 테스트
- [ ] HTTPS 강제 리다이렉트 확인
- [ ] CSP 정책 동작 확인

---

## 7. 트러블슈팅

### 문제: 배포 실패 (Build failed)
**해결**:
1. Deployment 로그 확인
2. `wrangler.toml` 설정 검증
3. `public/` 디렉토리에 `index.html` 존재 확인

### 문제: 환경 변수 접근 불가
**해결**:
1. Cloudflare Dashboard → Settings → Environment variables 확인
2. Production/Preview 환경별 설정 확인
3. 재배포 (환경 변수 변경 후 재배포 필요)

### 문제: 커스텀 도메인 SSL 인증서 발급 실패
**해결**:
1. DNS 전파 대기 (최대 24시간)
2. Cloudflare DNS Proxy 활성화 확인 (orange cloud)
3. SSL/TLS 암호화 모드: **Full** 선택

### 문제: API Functions 500 에러
**해결**:
1. Functions 로그 확인 (Dashboard → Functions → Logs)
2. 환경 변수 누락 확인
3. CORS 헤더 설정 확인

---

## 8. 유지보수

### 8.1. 모니터링
- Cloudflare Analytics: 트래픽, 성능, 보안
- GA4 Dashboard: 사용자 행동, 전환율
- Notion DB: 리드 수집 현황

### 8.2. 정기 업데이트
- 월 1회: Dependencies 업데이트
- 분기 1회: SEO 성능 리뷰
- 반기 1회: 보안 헤더 정책 검토

---

## 참고 문서
- [Cloudflare Pages 공식 문서](https://developers.cloudflare.com/pages/)
- [Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [Custom Domains](https://developers.cloudflare.com/pages/platform/custom-domains/)
