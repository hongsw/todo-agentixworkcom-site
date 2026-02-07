# 🤖 Claude Code Agency Starter Kit

AI가 실행하고, 당신은 결정만 합니다.

```
당신이 하는 것          Claude Code가 하는 것
─────────────          ─────────────────────
/dashboard 확인    ←    Notion TODO 자동 처리
/approve 승인      ←    코드 작성 + PR 생성
/reject 반려       ←    Notion 고객 기록
/add 작업 추가     ←    에러 처리 + 다음 작업
/kickoff 실행 지시 ←    Loop 자율 반복
```

---

## 🚀 시작

```bash
cp .env.example .env        # NOTION_API_KEY, NOTION_TODO_DB_ID 입력
chmod +x scripts/*.sh
./scripts/setup.sh
```

---

## 🎮 당신이 쓸 커맨드

Claude Code 실행 후 (`claude`) 아래 커맨드를 사용합니다.

### 상황 파악
| 커맨드 | 설명 |
|--------|------|
| `/brief` | 30초 브리핑. 3줄 요약. |
| `/dashboard` | 현황판. 내가 확인할 것만 보여줌. |
| `/feedback` | 고객 피드백 확인. 단순 승인은 자동 처리됨. |

### 의사결정
| 커맨드 | 설명 |
|--------|------|
| `/decide {번호}` | 특정 항목의 상황 + 선택지 보기 |
| `/approve {번호}` | 승인. 나머지는 자동 처리. |
| `/approve all` | 리뷰 항목 일괄 승인 |
| `/reject {번호} "사유"` | 반려. 수정 TODO 자동 생성. |

### 지시
| 커맨드 | 설명 |
|--------|------|
| `/kickoff` | 대기 작업 전체 자율 실행 시작 |
| `/kickoff 3` | 상위 3건만 실행 |
| `/add 내용` | 자연어로 TODO 추가. 구조화는 AI가 함. |
| `/reprioritize` | 실행 순서 변경 |

### 보고
| 커맨드 | 설명 |
|--------|------|
| `/week` | 주간 요약 + 고객용 리포트 Notion 게시 |
| `/sync` | 현재 상태 Notion 동기화 |

---

## 일반적인 하루

```
아침:
  claude
  > /brief              → "진행률 45%. 확인 필요 2건."
  > /dashboard           → 결정 필요 항목 확인
  > /approve 1           → 히어로 섹션 승인
  > /decide 2            → 보류 항목 선택지 확인
  > "B로 진행해"         → 결정 완료
  > /kickoff             → 대기 작업 전체 실행 지시

오후:
  > /brief               → "3건 완료. 특이사항 없음."

퇴근 전 (금요일):
  > /week                → 주간 요약 확인 → Notion 게시
```

---

## 자동 실행 (선택)

```bash
# crontab: 평일 9시/14시/18시
0 9,14,18 * * 1-5 /path/to/project/scripts/run-loop.sh

# 또는 GitHub Actions (평일 9시 KST 자동)
# .github/workflows/claude-loop.yml 이미 포함됨
```

---

## 📁 파일 구조

```
CLAUDE.md                          # AI 실행 규칙 (당신이 볼 필요 없음)
.claude/settings.json              # MCP 설정
.claude/commands/
  ├── brief.md                     # /brief
  ├── dashboard.md                 # /dashboard
  ├── feedback.md                  # /feedback
  ├── decide.md                    # /decide
  ├── approve.md                   # /approve
  ├── reject.md                    # /reject
  ├── kickoff.md                   # /kickoff
  ├── add.md                       # /add
  ├── reprioritize.md              # /reprioritize
  ├── week.md                      # /week
  └── sync.md                      # /sync
scripts/
  ├── run-loop.sh                  # 자율 Loop 스크립트
  └── setup.sh                     # 초기 설정
.github/workflows/claude-loop.yml  # GitHub Actions
```

---

## Notion TODO DB 필요 속성

Task(title), Status(select), Priority(select), 담당(select), Phase(select), 고객 확인(checkbox), PR 링크(url), 작업 요약(rich_text), 시작일(date), 완료일(date)

---

MIT — Baryon Labs 2025
