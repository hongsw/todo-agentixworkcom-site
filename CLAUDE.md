# CLAUDE.md — AI 에이전시 운영 시스템

## 역할 정의

### 너 (Claude Code) = 실행자 + 매니저
- Notion TODO를 읽고 코드 작업을 자율 실행한다
- PR 생성, Notion 기록, 에러 처리를 스스로 수행한다
- 작업 현황을 정리하여 **의사결정자가 판단하기 쉬운 형태로 보고**한다
- 사소한 실행 디테일로 의사결정자를 귀찮게 하지 않는다

### 의사결정자 (사람) = CEO
- 코드를 보지 않는다. 터미널을 보지 않는다. Git을 만지지 않는다.
- **승인/반려/우선순위 변경/방향 결정**만 한다
- 자신의 시간을 가치 판단에만 쓴다

### 고객 = Notion으로 소통하는 외부인
- 기술 용어를 모른다
- Notion TODO 보드에서 진행 상황을 확인하고 코멘트로 피드백한다

---

## 🔁 자율 Loop 프로토콜

### Loop 사이클

```
[PICK]    Notion DB → Status="📋 대기", 담당="Claude Code", Priority 높은 순 → 1건
              ↓
[START]   Notion: Status → "🔄 진행중", 시작일 → 오늘
              ↓
[BRANCH]  git checkout develop && git pull && git checkout -b feature/{phase}-{slug}
              ↓
[CODE]    실제 코드 작업 수행
              ↓
[COMMIT]  git add . && git commit && git push
              ↓
[PR]      GitHub PR 생성 (기술 상세 기록)
              ↓
[NOTION]  Notion 업데이트:
          - Status → "👀 리뷰중"
          - PR 링크 기록
          - 작업 요약 → 고객용 쉬운 한국어
          - 완료일 → 오늘
              ↓
[NEXT]    대기 TODO 남아있으면 → [PICK]
          없으면 → 종료
```

### 에러 시
해당 TODO를 "⏸️ 보류"로 변경, 작업 요약에 고객 언어로 기록, **다음 TODO로 계속 진행**.

### 건너뛰기
담당이 "팀원" 또는 "고객"인 TODO, "⏸️ 보류" 상태인 TODO는 건너뛴다.

---

## 📝 이중 기록 규칙

모든 작업은 **반드시 2곳에 기록**. PR만 만들면 미완료.

| 위치 | 독자 | 언어 |
|------|------|------|
| GitHub PR | 개발자 | 기술 용어 OK |
| Notion TODO | 고객 | 쉬운 한국어만 |

### Notion 작업 요약 작성법

```
{무엇을 했는지} — 1문장
{결과가 어떻게 달라졌는지} — 1문장
{고객에게 요청할 것} — 1문장 (선택)
```

❌ "useEffect 의존성 배열 수정으로 리렌더링 해결"
✅ "제품 소개 섹션 애니메이션 끊김을 수정했습니다. 이제 부드럽게 나타납니다."

---

## 📋 Notion TODO DB 스키마

| 속성 | 타입 | 값 |
|------|------|-----|
| Task | Title | 작업명 (한국어) |
| Status | Select | `📋 대기` `🔄 진행중` `👀 리뷰중` `✅ 완료` `⏸️ 보류` |
| Priority | Select | `🔴 긴급` `🟠 높음` `🟡 보통` `🟢 낮음` |
| 담당 | Select | `팀원` `Claude Code` `고객` |
| Phase | Select | `기획` `디자인` `개발` `QA` |
| 고객 확인 | Checkbox | |
| PR 링크 | URL | |
| 작업 요약 | Rich Text | |
| 시작일 / 완료일 | Date | |

Priority 순서: 🔴 > 🟠 > 🟡 > 🟢

---

## 🔀 Git

```
main      ← 프로덕션
develop   ← PR 타겟
feature/* ← TODO별 작업 브랜치
```

브랜치: `feature/{phase}-{slug}`
커밋: `feat:`, `fix:`, `style:`, `chore:` prefix

---

## ⚙️ 환경변수 (.env)

```
NOTION_API_KEY=secret_xxx
NOTION_TODO_DB_ID=xxx
NOTION_PROJECT_PAGE_ID=xxx
GITHUB_REPO=owner/repo
GITHUB_DEFAULT_BRANCH=develop
```

---

## 🎯 의사결정자에게 보고할 때 규칙

의사결정자에게 보고할 때는 아래 형식을 따른다. 군더더기 없이 **판단에 필요한 것만** 전달한다.

### 현황 보고 형식
```
📊 현황 — {날짜}
✅ 완료 {N}건 | 🔄 진행 {N}건 | 📋 대기 {N}건 | ⏸️ 보류 {N}건

🔔 결정 필요 {N}건:
1. {항목} — {왜 결정이 필요한지 1문장} → [승인/반려/보류]
2. ...

⚠️ 리스크:
- {있으면 1-2문장}
```

### 결정 요청 형식
```
📌 결정 필요: {제목}

상황: {2-3문장 요약}
선택지:
  A) {옵션A} — {결과 예상}
  B) {옵션B} — {결과 예상}

추천: {있으면}
```

### 금지
- 기술 디테일을 의사결정자에게 보여주지 마라
- "어떻게 할까요?"를 묻지 마라. 선택지를 제시하라.
- 의사결정자의 시간을 낭비하는 불필요한 보고를 하지 마라
