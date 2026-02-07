# 🚀 빠른 시작 가이드

## 1단계: 환경 설정

### .env 파일 편집
```bash
code .env  # 또는 vim .env
```

다음 값을 입력하세요:
```bash
NOTION_API_KEY=secret_your_actual_key_here
NOTION_TODO_DB_ID=your_32_char_db_id_here
NOTION_PROJECT_PAGE_ID=your_32_char_page_id_here
```

### Notion API Key 발급
1. https://www.notion.so/my-integrations 접속
2. "+ New integration" 클릭
3. Integration 이름 입력 (예: "Claude Code Agency")
4. "Submit" 클릭
5. "Internal Integration Token" 복사 → `NOTION_API_KEY`에 붙여넣기

### Notion DB/Page ID 찾기
1. Notion에서 TODO 보드 열기
2. 브라우저 주소창 URL 확인:
   ```
   https://www.notion.so/{workspace}/{db-title}-{DB_ID}?v=...
                                                   ^^^^^^
   ```
3. 32자리 ID 복사 → `NOTION_TODO_DB_ID`에 붙여넣기
4. 프로젝트 메인 페이지도 동일하게 → `NOTION_PROJECT_PAGE_ID`

### Integration 연결
1. Notion에서 프로젝트 페이지 열기
2. 우측 상단 "..." → "Connections" → Integration 추가
3. TODO 보드 DB에서도 동일하게 반복

---

## 2단계: 설정 확인

```bash
./scripts/setup.sh
```

모든 ✅가 나오면 성공!

---

## 3단계: Claude Code 실행

```bash
claude
```

그리고 다음 커맨드 입력:

```
/loop-start
```

이제 Claude Code가:
1. Notion TODO DB에서 "📋 대기" 작업을 읽어오고
2. 코드를 작성/수정하고
3. GitHub PR을 생성하고
4. Notion에 고객용 작업 요약을 기록합니다

---

## 📚 주요 커맨드

| 커맨드 | 사용 시점 |
|--------|----------|
| `/loop-start` | 대기중인 TODO를 자동으로 처리할 때 |
| `/sync-notion` | 수동으로 작업한 후 Notion 기록할 때 |
| `/weekly-report` | 매주 금요일, 주간 리포트 생성 |
| `/new-todo` | 새 작업을 Notion에 등록할 때 |
| `/check-feedback` | 고객이 Notion에 코멘트를 남겼을 때 |

---

## 🔄 워크플로우 예시

### 일반적인 작업 흐름:

1. **고객이 Notion에 요청 코멘트 남김**
   ```
   "버튼 색상을 파란색으로 바꿔주세요"
   ```

2. **팀원이 TODO 생성**
   - Task: "버튼 색상 변경 (파란색)"
   - Status: 📋 대기
   - Priority: 🟠 높음
   - 담당: Claude Code

3. **Claude Code 실행**
   ```bash
   claude
   /loop-start
   ```

4. **Claude가 자동으로:**
   - TODO 읽기
   - 코드 수정 (버튼 색상 변경)
   - PR 생성
   - Notion 업데이트:
     - Status → 👀 리뷰중
     - 작업 요약: "버튼 색상을 파란색(#007AFF)으로 변경했습니다. 확인 부탁드립니다."
     - PR 링크 추가

5. **고객이 Notion에서 확인**
   - 코멘트: "확인했습니다 👍"
   - 고객 확인 체크박스 체크

---

## ⚠️ 문제 해결

### Notion MCP 연결 실패
```bash
npx -y @notionhq/notion-mcp-server --help
```
성공하면 MCP 서버가 정상 작동하는 것입니다.

### .env 값이 안 읽힘
```bash
source .env
echo $NOTION_API_KEY
```
값이 출력되는지 확인하세요.

### Git 리포지토리 없음
```bash
git init
git remote add origin <your-repo-url>
```

---

## 📖 더 알아보기

- **CLAUDE.md**: 전체 시스템 아키텍처와 작동 원리
- **README.md**: 프로젝트 개요와 구조
- **.claude/commands/**: 각 커맨드의 상세 동작 방식
