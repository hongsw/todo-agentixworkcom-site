# 🌐 agentiXwork.com 사이트 개발 프로젝트

**Claude Code Agency** 기반 AI 에이전시 이중 기록 체계로 운영되는 프로젝트입니다.

> Claude Code가 작업하고, 고객은 Notion에서 확인합니다.

---

## 📌 프로젝트 정보

- **사이트**: [agentixwork.com](https://agentixwork.com)
- **GitHub**: https://github.com/hongsw/todo-agentixworkcom-site
- **기반 템플릿**: [claude-code-agency-starter](https://github.com/hongsw/claude-code-agency-starter)

---

## 🔄 이중 기록 체계란?

Claude Code가 작업할 때 **동시에 Notion에도 고객용 기록을 남깁니다**.

```
고객 요청 (Notion 코멘트)
       ↓
팀원이 TODO 생성 (Notion DB)
       ↓
Claude Code Loop 실행
  ├─ 코드 작성/수정
  ├─ Git commit + PR 생성 (개발 기록)
  └─ Notion TODO 상태 업데이트 + 작업 요약 기록 (고객 기록)
       ↓
고객이 Notion에서 확인 + 코멘트로 피드백
       ↓
피드백 반영 → Loop 재실행
```

---

## 🚀 빠른 시작

### 1. 환경변수 설정

```bash
cp .env.example .env
# .env 파일을 열어서 실제 값을 입력
```

필요한 값:
- **NOTION_API_KEY**: [Notion Integration 생성](https://www.notion.so/my-integrations)에서 발급
- **NOTION_TODO_DB_ID**: Notion TODO 보드 DB의 ID
- **NOTION_PROJECT_PAGE_ID**: 프로젝트 메인 페이지 ID

### 2. Notion Integration 연결

1. https://www.notion.so/my-integrations 에서 새 Integration 생성
2. 프로젝트 Notion 페이지에서 "Share" → Integration 추가
3. TODO 보드 DB에서도 동일하게 Integration 추가

### 3. 설정 확인

```bash
./scripts/setup.sh
```

### 4. Claude Code 실행

```bash
claude
# 그리고:
/loop-start
```

---

## 📁 파일 구조

```
project-root/
├── CLAUDE.md                         # Claude Code 핵심 지침서
├── .claude/
│   ├── settings.json                 # MCP 서버 설정 (Notion)
│   └── commands/
│       ├── loop-start.md             # /loop-start — TODO 자동 처리
│       ├── sync-notion.md            # /sync-notion — 수동 동기화
│       ├── weekly-report.md          # /weekly-report — 주간 리포트
│       ├── new-todo.md               # /new-todo — 새 TODO 생성
│       └── check-feedback.md         # /check-feedback — 고객 피드백 확인
├── .env.example                      # 환경변수 템플릿
├── .gitignore                        # Git 제외 파일
├── scripts/
│   └── setup.sh                      # 초기 설정 스크립트
└── README.md                         # 이 파일
```

---

## 🎮 사용 가능한 커맨드

| 커맨드 | 설명 | 언제 사용? |
|--------|------|-----------|
| `/loop-start` | TODO 자동 처리 루프 시작 | 대기중인 작업을 일괄 처리할 때 |
| `/sync-notion` | 현재 작업을 Notion에 동기화 | 수동 작업 후 Notion 기록할 때 |
| `/weekly-report` | 주간 리포트 생성 | 매주 금요일 |
| `/new-todo` | 새 TODO 생성 | 고객 요청이나 새 작업 등록 시 |
| `/check-feedback` | 고객 피드백 확인 | 고객이 Notion에 코멘트 남겼을 때 |

---

## 🔄 이중 기록 체계

| | GitHub PR | Notion TODO |
|---|---|---|
| **독자** | 개발자 | 고객/비개발자 |
| **언어** | 기술 용어 OK | 쉬운 한국어만 |
| **내용** | 코드 diff, 테스트 결과 | "버튼 색 바꿨습니다" |
| **목적** | 코드 리뷰 | 진행 확인, 피드백 |

---

## 📋 Notion TODO DB 스키마

프로젝트에 필요한 Notion DB 구조:

| 속성 | 타입 | 설명 |
|------|------|------|
| Task | Title | 작업명 (한국어) |
| Status | Select | 📋 대기 / 🔄 진행중 / 👀 리뷰중 / ✅ 완료 / ⏸️ 보류 |
| Priority | Select | 🔴 긴급 / 🟠 높음 / 🟡 보통 / 🟢 낮음 |
| 담당 | Select | 팀원 / Claude Code / 고객 |
| Phase | Select | 기획 / 디자인 / 개발 / QA |
| 고객 확인 | Checkbox | 고객 승인 여부 |
| PR 링크 | URL | GitHub PR |
| 작업 요약 | Rich Text | 비개발자용 설명 |
| 시작일 | Date | 작업 시작 |
| 완료일 | Date | 작업 완료 |

---

## 🏢 Baryon Labs

이 스타터 킷은 [Baryon Labs](https://miri.dev)의 AI 에이전시 운영 모델의 일부입니다.

- **agentiXwork**: [agentixwork.com](https://agentixwork.com)
- **GitHub**: [github.com/baryonlabs](https://github.com/baryonlabs)
- **VS Code Extension**: "Baryon Agents" (Visual Studio Marketplace)

---

## 📄 License

MIT License — Baryon Labs 2025
