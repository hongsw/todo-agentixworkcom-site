#!/bin/bash
set -e
cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "🔧 설정 확인..."

[ ! -f .env ] && cp .env.example .env && echo "⚠️  .env 생성됨 → 값 입력 후 재실행" && exit 1
source .env

for var in NOTION_API_KEY NOTION_TODO_DB_ID; do
    val="${!var:-}"
    if [ -z "$val" ] || [[ "$val" == *"xxx"* ]]; then echo "❌ $var 미설정"; exit 1; fi
    echo "✅ $var"
done

grep -q "^\.env$" .gitignore 2>/dev/null || echo ".env" >> .gitignore
chmod +x scripts/*.sh 2>/dev/null || true

echo ""
echo "🎉 준비 완료!"
echo "  /dashboard    — 현황판"
echo "  /kickoff      — Loop 실행"
echo "  /brief        — 30초 브리핑"
