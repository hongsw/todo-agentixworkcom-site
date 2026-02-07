# 🤖 Claude Code Agency Starter Kit

Claude Code가 Notion TODO를 자동으로 처리하는 **자율 Loop 시스템**.
작업마다 GitHub PR (개발자용) + Notion 기록 (고객용)을 동시에 남긴다.

```
Notion TODO (📋 대기)  →  Claude Code가 자동 처리  →  PR + Notion 동시 기록
    ↑                                                        ↓
고객 피드백 (Notion 코멘트)  ←────────────────  고객이 Notion에서 확인
```

---

## 🚀 시작하기

```bash
# 1. 프로젝트에 복사
cp -r claude-code-agency-starter/{CLAUDE.md,.claude,.github,.env.example,.gitignore,scripts} your-project/

# 2. 환경변수 설정
cd your-project
cp .env.example .env
# .env 편집: NOTION_API_KEY, NOTION_TODO_DB_ID 입력

# 3. 설정 확인
chmod +x scripts/*.sh
./scripts/setup.sh
```

---

## 🏃 Loop 실행 (3가지 방법)

### 방법 1: 쉘 스크립트 (권장)
```bash
./scripts/run-loop.sh              # Loop 실행
./scripts/run-loop.sh --dry-run    # TODO 확인만
```

### 방법 2: Claude Code 슬래시 커맨드
```bash
claude
> /loop-start    # 즉시 Loop 시작
```

### 방법 3: 직접 실행
```bash
claude --loop "CLAUDE.md를 읽고 LOOP 프로토콜을 실행하라."
```

### 자동화 (crontab / GitHub Actions)
```bash
# 평일 9시/14시/18시 자동 실행
0 9,14,18 * * 1-5 /path/to/project/scripts/run-loop.sh
```

`.github/workflows/claude-loop.yml`로 GitHub Actions 자동 트리거도 가능.

---

## 📁 파일 구조

| 파일 | 역할 |
|------|------|
| `CLAUDE.md` | **핵심** — Loop 프로토콜, 이중 기록 규칙 |
| `.claude/settings.json` | Notion MCP 서버 설정 |
| `.claude/commands/loop-start.md` | `/loop-start` 슬래시 커맨드 |
| `.claude/commands/sync-notion.md` | `/sync-notion` 수동 동기화 |
| `.claude/commands/weekly-report.md` | `/weekly-report` 주간 리포트 |
| `.claude/commands/new-todo.md` | `/new-todo` TODO 생성 |
| `.claude/commands/check-feedback.md` | `/check-feedback` 피드백 확인 |
| `scripts/run-loop.sh` | Loop 실행 스크립트 |
| `scripts/setup.sh` | 초기 설정 |
| `.github/workflows/claude-loop.yml` | GitHub Actions |

---

## 필요한 Notion DB 속성

Task (title), Status (select), Priority (select), 담당 (select), Phase (select), 고객 확인 (checkbox), PR 링크 (url), 작업 요약 (rich_text), 시작일 (date), 완료일 (date)

---

MIT License — Baryon Labs 2025
