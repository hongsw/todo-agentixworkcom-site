#!/bin/bash

echo "🚀 Cloudflare Pages 배포 시작..."
echo ""

# 로그인 확인
if ! wrangler whoami &>/dev/null; then
    echo "🔐 Cloudflare 로그인 필요..."
    wrangler login
fi

echo ""
echo "📦 배포 중..."
wrangler pages deploy . --project-name agentixwork-site --branch main

echo ""
echo "✅ 배포 완료!"
