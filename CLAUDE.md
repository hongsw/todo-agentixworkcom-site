# CLAUDE.md — AI 에이전시 이중 기록 체계 (Dual Recording System)

## 🎯 이 프로젝트의 핵심 원칙

이 프로젝트는 **AI 에이전시 모델**로 운영된다.
작업의 실행은 Claude Code가 수행하고, 고객과의 소통은 Notion을 통해 이루어진다.

**모든 작업은 반드시 2곳에 기록한다:**

| 기록 위치 | 대상 독자 | 기록 내용 | 목적 |
|-----------|-----------|-----------|------|
| **GitHub PR** | 개발자/내부팀 | 코드 변경사항, 기술적 설명, 테스트 결과 | 코드 리뷰, 기술 추적 |
| **Notion TODO** | 고객/비개발자 | 작업 요약(쉬운 말), 스크린샷, 확인 요청 | 고객 소통, 진행 확인 |

---

## 📋 Notion TODO DB 정보

- **DB 위치**: 프로젝트 Notion 페이지 내 "📋 프로젝트 TODO 보드"
- **DB ID**: 환경변수 `NOTION_TODO_DB_ID`에 설정
- **프로젝트 페이지 ID**: 환경변수 `NOTION_PROJECT_PAGE_ID`에 설정

### TODO DB 스키마

| 속성 | 타입 | 값 |
|------|------|-----|
| Task | Title | 작업명 (한국어, 고객이 이해할 수 있게) |
| Status | Select | `📋 대기` `🔄 진행중` `👀 리뷰중` `✅ 완료` `⏸️ 보류` |
| Priority | Select | `🔴 긴급` `🟠 높음` `🟡 보통` `🟢 낮음` |
| 담당 | Select | `팀원` `Claude Code` `고객` |
| Phase | Select | `기획` `디자인` `개발` `QA` |
| 고객 확인 | Checkbox | 고객이 결과물을 확인했는지 여부 |
| PR 링크 | URL | GitHub PR 링크 |
| 작업 요약 | Rich Text | 비개발자용 설명 |
| 시작일 | Date | 작업 시작 날짜 |
| 완료일 | Date | 작업 완료 날짜 |

---

## 🔄 작업 사이클 (Loop 1회)

작업을 수행할 때 반드시 아래 순서를 따른다:

### Step 1: Notion에서 TODO 읽기
```
Notion TODO DB에서 Status가 "📋 대기"인 항목을 Priority 순으로 확인한다.
```

### Step 2: 작업 시작 알림
```
해당 TODO의 Status를 "🔄 진행중"으로 변경한다.
시작일을 오늘 날짜로 설정한다.
```

### Step 3: 코드 작업 수행
```
격리된 Git worktree 또는 feature branch에서 작업한다.
브랜치명: feature/{todo-id}-{간단한-설명}
```

### Step 4: PR 생성 (개발자 기록)
```
GitHub에 PR을 생성한다.
PR 설명에는 기술적 변경사항을 상세히 기록한다.
```

### Step 5: Notion 업데이트 (고객 기록)
```
해당 TODO의:
- Status → "👀 리뷰중"
- PR 링크 → 생성된 PR URL
- 작업 요약 → 고객용 설명 (아래 가이드 참고)
- 완료일 → 오늘 날짜
```

### Step 6: 다음 TODO로 이동
```
다음 "📋 대기" 항목으로 넘어간다.
```

---

## ✍️ 작업 요약 작성 가이드 (Notion 기록용)

**핵심 규칙: 고객은 개발자가 아니다. 기술 용어를 쓰지 마라.**

### ❌ 나쁜 예시 (개발자 언어)
> "React 컴포넌트를 리팩토링하고 useEffect 의존성 배열을 수정하여 리렌더링 이슈를 해결했습니다"

### ✅ 좋은 예시 (고객 언어)
> "제품 소개 섹션의 애니메이션이 가끔 끊기는 문제를 수정했습니다. 이제 스크롤할 때 부드럽게 나타납니다. 확인 부탁드립니다."

### 작성 템플릿
```
[무엇을 했는지 - 1문장]
[결과가 어떻게 달라졌는지 - 1문장]  
[고객에게 요청할 것 - 1문장 (선택)]
```

### 카테고리별 예시

**UI/디자인 변경:**
> "히어로 섹션에 데모 신청 버튼을 추가했습니다. 파란색 버튼이 화면 중앙에 크게 표시됩니다. 버튼 색상과 문구를 확인해 주세요."

**기능 구현:**
> "자료 요청 폼을 만들었습니다. 이름, 이메일, 회사명을 입력하면 자동으로 스프레드시트에 기록됩니다. 테스트 제출을 해보시고 정상 동작 확인 부탁드립니다."

**버그 수정:**
> "모바일에서 메뉴가 열리지 않던 문제를 수정했습니다. iPhone Safari와 Android Chrome 모두 정상 동작합니다."

**성능 개선:**
> "페이지 로딩 속도를 개선했습니다. 기존 3.5초 → 1.2초로 빨라졌습니다."

---

## 🔔 고객 피드백 처리

Notion TODO에 고객이 코멘트를 남기면:

1. 코멘트 내용을 확인한다
2. 새 TODO를 생성하거나 기존 TODO를 재오픈한다
3. 위의 작업 사이클을 다시 수행한다

**고객 코멘트 예시와 대응:**
- "버튼 색상을 빨간색으로 바꿔주세요" → 새 TODO 생성 후 처리
- "확인했습니다 👍" → 고객 확인 체크박스 체크
- "이 부분이 이상해요" → 해당 TODO 재오픈 후 수정

---

## 📊 주간 리포트 (매주 금요일)

매주 금요일 자동으로 Notion 프로젝트 페이지에 주간 리포트를 추가한다:

```markdown
## 📊 주간 리포트 — {날짜}

### ✅ 이번 주 완료
- {완료된 TODO 목록}

### 🔄 진행 중
- {진행 중인 TODO 목록}

### 📋 다음 주 예정
- {대기 중 상위 우선순위 TODO 목록}

### ⚠️ 이슈/논의 필요
- {보류 중이거나 고객 확인 필요한 항목}
```

---

## 🛠️ 기술 환경

### MCP 서버 연동
- **Notion MCP**: TODO DB 읽기/쓰기, 페이지 업데이트
- **GitHub MCP**: PR 생성, 브랜치 관리 (선택)

### Git 워크플로우
- `main` — 프로덕션 (배포용)
- `develop` — 개발 통합 브랜치
- `feature/*` — 개별 작업 브랜치 (TODO별)

### 브랜치 네이밍
```
feature/{phase}-{간단한설명}
예: feature/dev-hero-section
예: feature/dev-lead-form
예: feature/qa-mobile-responsive
```

---

## ⚙️ 환경변수

프로젝트 루트의 `.env`에 설정:

```bash
# Notion
NOTION_API_KEY=secret_xxxxx
NOTION_TODO_DB_ID=xxxxx       # TODO 보드 DB ID
NOTION_PROJECT_PAGE_ID=xxxxx  # 프로젝트 메인 페이지 ID

# GitHub (선택 — GitHub MCP 사용 시)
GITHUB_REPO=baryonlabs/agentixwork-landing
GITHUB_DEFAULT_BRANCH=develop
```

---

## 📁 프로젝트 구조

```
project-root/
├── CLAUDE.md                    # ← 이 파일 (Claude Code 지침)
├── .claude/
│   ├── settings.json            # MCP 서버 설정
│   └── commands/
│       ├── loop-start.md        # /loop-start 커맨드
│       ├── sync-notion.md       # /sync-notion 커맨드
│       └── weekly-report.md     # /weekly-report 커맨드
├── .env                         # 환경변수 (git 제외)
├── .env.example                 # 환경변수 템플릿
├── scripts/
│   └── setup.sh                 # 초기 설정 스크립트
├── src/                         # 실제 소스코드 (프로젝트별)
└── README.md                    # 프로젝트 설명
```

---

## 🚨 주의사항

1. **절대 고객 Notion에 기술 용어를 쓰지 마라** — PR에만 기술 내용을 쓴다
2. **작업 전에 반드시 Notion Status를 변경하라** — 고객이 실시간으로 본다
3. **작업 완료 후 반드시 Notion에 요약을 기록하라** — PR만 만들면 안 된다
4. **고객 코멘트는 무시하지 마라** — 확인 후 반드시 대응한다
5. **스크린샷을 첨부하라** — 시각적 변경은 말보다 이미지가 효과적이다
