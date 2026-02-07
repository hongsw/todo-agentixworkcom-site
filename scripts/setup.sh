#!/bin/bash
# ============================================
# AI 에이전시 이중 기록 체계 — 초기 설정 스크립트
# ============================================

set -e

echo "🚀 AI 에이전시 이중 기록 체계 설정을 시작합니다..."
echo ""

# 1. .env 파일 확인
if [ ! -f .env ]; then
    echo "📋 .env 파일이 없습니다. .env.example에서 복사합니다..."
    cp .env.example .env
    echo "⚠️  .env 파일을 열어서 실제 API 키와 DB ID를 입력해주세요!"
    echo "   vim .env  또는  code .env"
    echo ""
    exit 1
fi

# 2. 필수 환경변수 확인
source .env

if [ -z "$NOTION_API_KEY" ] || [ "$NOTION_API_KEY" = "secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" ]; then
    echo "❌ NOTION_API_KEY가 설정되지 않았습니다."
    echo "   .env 파일에서 Notion Integration Token을 입력해주세요."
    echo "   발급: https://www.notion.so/my-integrations"
    exit 1
fi

if [ -z "$NOTION_TODO_DB_ID" ] || [ "$NOTION_TODO_DB_ID" = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" ]; then
    echo "❌ NOTION_TODO_DB_ID가 설정되지 않았습니다."
    echo "   .env 파일에서 Notion TODO DB ID를 입력해주세요."
    exit 1
fi

echo "✅ 환경변수 확인 완료"

# 3. Notion MCP 서버 확인
echo ""
echo "📡 Notion MCP 서버 확인 중..."
if npx -y @notionhq/notion-mcp-server --help 2>/dev/null; then
    echo "✅ Notion MCP 서버 사용 가능"
else
    echo "⚠️  Notion MCP 서버 설치 확인이 필요합니다."
    echo "   npx -y @notionhq/notion-mcp-server 실행 시 자동 설치됩니다."
fi

# 4. Git 설정 확인
echo ""
echo "🔀 Git 설정 확인 중..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "✅ Git 리포지토리 확인 ($(git remote get-url origin 2>/dev/null || echo 'remote 없음'))"
else
    echo "⚠️  Git 리포지토리가 초기화되지 않았습니다."
    echo "   git init && git remote add origin <repo-url>"
fi

# 5. .gitignore 확인
echo ""
if [ -f .gitignore ]; then
    if grep -q "^\.env$" .gitignore; then
        echo "✅ .env가 .gitignore에 포함되어 있습니다"
    else
        echo ".env" >> .gitignore
        echo "✅ .env를 .gitignore에 추가했습니다"
    fi
else
    echo ".env" > .gitignore
    echo "node_modules/" >> .gitignore
    echo "✅ .gitignore 파일을 생성했습니다"
fi

# 6. 완료
echo ""
echo "============================================"
echo "🎉 설정 완료!"
echo "============================================"
echo ""
echo "사용 가능한 Claude Code 커맨드:"
echo "  /loop-start       — TODO 자동 처리 루프 시작"
echo "  /sync-notion      — 현재 작업을 Notion에 동기화"
echo "  /weekly-report    — 주간 리포트 생성"
echo "  /new-todo         — 새 TODO 생성"
echo "  /check-feedback   — 고객 피드백 확인"
echo ""
echo "시작하려면:"
echo "  claude 실행 후 /loop-start 입력"
echo ""
