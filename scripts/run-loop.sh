#!/bin/bash
# Claude Code 자율 Loop 실행
# 사용: ./scripts/run-loop.sh [--dry-run]
# cron: 0 9,14,18 * * 1-5 /path/to/project/scripts/run-loop.sh >> /var/log/claude-loop.log 2>&1

set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

[ ! -f .env ] && echo "❌ .env 없음" && exit 1
set -a; source .env; set +a

for var in NOTION_API_KEY NOTION_TODO_DB_ID; do
    [ -z "${!var:-}" ] && echo "❌ $var 미설정" && exit 1
done

echo "🤖 $(date '+%Y-%m-%d %H:%M:%S') — Loop 시작"

# Git 정리
DEFAULT_BRANCH="${GITHUB_DEFAULT_BRANCH:-develop}"
[ -n "$(git status --porcelain 2>/dev/null)" ] && git stash push -m "auto $(date +%s)" 2>/dev/null || true
git checkout "$DEFAULT_BRANCH" 2>/dev/null && git pull origin "$DEFAULT_BRANCH" 2>/dev/null || true

if [ "${1:-}" = "--dry-run" ]; then
    claude -p "CLAUDE.md를 읽어라. Notion TODO DB에서 Status='📋 대기', 담당='Claude Code' 항목을 Priority 순으로 목록만 출력하라."
    exit 0
fi

exec claude -p --loop \
"CLAUDE.md를 읽고 자율 Loop 프로토콜을 즉시 실행하라.
Notion TODO DB에서 Status='📋 대기', 담당='Claude Code'인 항목을 Priority 순으로 1건씩 처리하라.
각 TODO: Notion 상태변경 → 브랜치 → 코드 → commit/push → PR → Notion 작업요약.
대기 항목이 0이 될 때까지 멈추지 마라.
PR과 Notion 양쪽 모두 기록하라. Notion에 기술 용어 쓰지 마라."
