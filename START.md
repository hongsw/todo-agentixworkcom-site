# 🚀 시작 가이드 — todo-agentixworkcom-site

## ✅ 준비 체크리스트

### 1. 환경변수 설정 (필수)

```bash
cd /Users/hongmartin/dev/todo-agentixworkcom-site
code .env
```

다음 값들을 **실제 값으로 변경**하세요:

```bash
# 아래 xxx... 부분을 실제 값으로 바꿔야 함!
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_TODO_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_PROJECT_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**값 얻는 방법:**

1. **NOTION_API_KEY**
   - https://www.notion.so/my-integrations 접속
   - "+ New integration" 클릭
   - Integration 이름: "Claude Code Agency"
   - Submit → Token 복사

2. **NOTION_TODO_DB_ID**
   - Notion에서 TODO 보드 열기
   - 브라우저 주소창 URL 확인
   - `https://www.notion.so/{workspace}/{title}-{DB_ID}?v=...`
   - 32자리 ID 복사 (하이픈 없이)

3. **NOTION_PROJECT_PAGE_ID**
   - 프로젝트 메인 페이지 열기
   - 동일하게 URL에서 32자리 ID 복사

4. **Notion Integration 연결**
   - TODO 보드 페이지 우측 상단 "..." → "Connections" → Integration 추가
   - 프로젝트 메인 페이지에서도 동일하게 반복

### 2. Notion TODO DB 준비

TODO 보드에 다음 속성들이 있어야 합니다:

| 속성 | 타입 | 필수 값 |
|------|------|---------|
| Task | Title | 작업명 |
| Status | Select | 📋 대기, 🔄 진행중, 👀 리뷰중, ✅ 완료, ⏸️ 보류 |
| Priority | Select | 🔴 긴급, 🟠 높음, 🟡 보통, 🟢 낮음 |
| 담당 | Select | 팀원, Claude Code, 고객 |
| Phase | Select | 기획, 디자인, 개발, QA |
| 고객 확인 | Checkbox | |
| PR 링크 | URL | |
| 작업 요약 | Rich Text | |
| 시작일 | Date | |
| 완료일 | Date | |

### 3. 테스트 TODO 생성

Notion TODO 보드에 테스트 작업 1개를 추가하세요:

- **Task**: "README.md 업데이트"
- **Status**: 📋 대기
- **Priority**: 🟡 보통
- **담당**: Claude Code
- **Phase**: 개발

---

## 🎯 새 스레드에서 시작하는 방법

### 방법 1: 대화형 시작 (권장)

새 터미널 창에서:

```bash
cd /Users/hongmartin/dev/todo-agentixworkcom-site
claude
```

Claude Code가 실행되면:

```
> /brief
```

그러면 현황을 3줄 요약으로 보여줍니다.

```
> /dashboard
```

결정이 필요한 항목들만 보여줍니다.

```
> /kickoff
```

대기 중인 TODO를 자동으로 처리 시작합니다.

### 방법 2: 즉시 실행

```bash
cd /Users/hongmartin/dev/todo-agentixworkcom-site
./scripts/run-loop.sh --dry-run    # TODO 확인만
./scripts/run-loop.sh              # 바로 실행
```

---

## 💬 일반적인 대화 흐름

```
당신: /brief
AI: 📊 진행률 0%. 대기 1건. 특이사항 없음.

당신: /dashboard
AI: 📋 대기 작업 1건
    1. [개발] README.md 업데이트 (🟡 보통)

    ✅ 바로 시작하시려면: /kickoff

당신: /kickoff
AI: [자율 Loop 시작]
    → README.md 수정
    → PR 생성
    → Notion 업데이트
    ✅ 완료!

당신: /brief
AI: 📊 진행률 100%. 리뷰 대기 1건.

당신: /approve 1
AI: ✅ 승인 완료. main 브랜치에 머지되었습니다.
```

---

## 🔧 문제 해결

### Notion 연결 안 됨
```bash
# MCP 서버 확인
npx -y @notionhq/notion-mcp-server --help
```

### .env 값이 안 읽힘
```bash
source .env
echo $NOTION_API_KEY    # 값이 출력되는지 확인
```

### Git 설정 확인
```bash
git remote -v
git branch
```

---

## 📚 주요 커맨드 치트시트

| 커맨드 | 용도 | 예시 |
|--------|------|------|
| `/brief` | 30초 브리핑 | 진행률, 특이사항 |
| `/dashboard` | 현황판 | 결정 필요 항목 |
| `/kickoff` | 실행 지시 | 대기 작업 처리 |
| `/approve 1` | 승인 | 리뷰 항목 승인 |
| `/reject 1 "사유"` | 반려 | 수정 요청 |
| `/add 내용` | TODO 추가 | 자연어로 작업 추가 |
| `/week` | 주간 리포트 | Notion에 게시 |

---

**준비되었으면 새 터미널에서 시작하세요!**

```bash
cd /Users/hongmartin/dev/todo-agentixworkcom-site
claude
```

그리고:

```
> /brief
```
