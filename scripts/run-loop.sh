#!/bin/bash
# ============================================
# Claude Code 자율 Loop 실행
# ============================================
# 사용법:
#   ./scripts/run-loop.sh              # Loop 실행
#   ./scripts/run-loop.sh --dry-run    # TODO 목록만 확인
#
# crontab 자동화:
#   0 9,14,18 * * 1-5 /path/to/project/scripts/run-loop.sh >> /var/log/claude-loop.log 2>&1

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

# .env 로드
if [ ! -f .env ]; then
    echo "❌ .env 파일 없음. cp .env.example .env 후 값 입력하세요."
    exit 1
fi
set -a; source .env; set +a

# 필수값 확인
for var in NOTION_API_KEY NOTION_TODO_DB_ID; do
    if [ -z "${!var:-}" ]; then echo "❌ $var 미설정"; exit 1; fi
done

echo "🤖 Claude Code Loop — $(date '+%Y-%m-%d %H:%M:%S')"
echo "📁 $PROJECT_DIR"
echo ""

# Git 정리
DEFAULT_BRANCH="${GITHUB_DEFAULT_BRANCH:-develop}"
if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
    git stash push -m "auto-stash $(date +%s)" 2>/dev/null || true
fi
git checkout "$DEFAULT_BRANCH" 2>/dev/null && git pull origin "$DEFAULT_BRANCH" 2>/dev/null || true

# Dry run
if [ "${1:-}" = "--dry-run" ]; then
    echo "🔍 [DRY RUN] TODO 확인만 합니다"
    claude -p "CLAUDE.md를 읽어라. Notion TODO DB에서 Status='📋 대기'이고 담당='Claude Code'인 항목을 Priority 순으로 조회해서 목록만 출력하라. 작업은 실행하지 마라."
    exit 0
fi

# Loop 실행
exec claude -p --loop \
"CLAUDE.md를 읽고 LOOP 프로토콜을 즉시 실행하라.

지금 할 것:
1. Notion TODO DB에서 Status='📋 대기', 담당='Claude Code'인 항목을 Priority 순으로 가져와라
2. 1건씩 처리하라: Notion 상태변경 → 브랜치 생성 → 코드 작업 → commit/push → PR 생성 → Notion 작업요약 기록
3. 1건 끝나면 멈추지 말고 다음 TODO를 가져와서 같은 과정을 반복하라
4. 대기 TODO가 0이 될 때까지 계속하라

절대 규칙: PR과 Notion 양쪽 모두 기록하라. Notion에는 기술 용어 쓰지 마라."
