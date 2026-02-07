# /loop-start

CLAUDE.md의 LOOP 프로토콜을 **지금 즉시 시작**하라.

## 지금 할 것

### 초기화
1. `.env`에서 `NOTION_TODO_DB_ID`를 읽어라
2. Notion MCP로 해당 DB에 접근하라
3. `git fetch origin && git checkout develop && git pull origin develop`
4. Status="📋 대기" AND 담당="Claude Code"인 TODO를 Priority 순으로 조회하라
5. "📋 처리 예정 N건" 출력

TODO가 0건이면 "✅ 대기 작업 없음" 출력 후 종료.

### 반복 실행
조회된 TODO를 **1건씩 순서대로** 아래를 실행하라:

1. **Notion 상태 변경**: Status → "🔄 진행중", 시작일 → 오늘
2. **브랜치 생성**: `git checkout -b feature/{phase}-{task-slug}` (develop에서 분기)
3. **코드 작업**: Task명을 보고 실제 코드를 구현하라
4. **커밋 & 푸시**: `git add . && git commit && git push`
5. **PR 생성**: `gh pr create --base develop` (기술 설명 포함)
6. **Notion 업데이트**:
   - Status → "👀 리뷰중"
   - PR 링크 → 방금 만든 PR URL
   - 작업 요약 → **고객이 읽을 수 있는 쉬운 한국어** (기술 용어 금지!)
   - 완료일 → 오늘

**그리고 나서 멈추지 말고 다음 "📋 대기" TODO를 가져와서 같은 과정을 반복하라.**
**대기 TODO가 없을 때까지 계속하라.**

에러가 나면: 해당 TODO를 "⏸️ 보류"로 바꾸고, 작업 요약에 "기술적 문제로 보류합니다"라고 쓰고, 다음 TODO로 넘어가라.
