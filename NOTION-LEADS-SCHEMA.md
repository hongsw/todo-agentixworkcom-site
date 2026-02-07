# Notion Leads Database Schema

데모 신청 폼에서 수집된 리드를 저장하는 Notion 데이터베이스 구조입니다.

## Database Properties

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| **회사명** | Title | 회사명 | ✅ |
| **담당자명** | Rich Text | 담당자 이름 | ✅ |
| **이메일** | Email | 담당자 이메일 주소 | ✅ |
| **사용 목적** | Rich Text | 제품 사용 목적 또는 니즈 | ❌ |
| **신청일** | Date | 데모 신청 날짜 | ✅ |
| **상태** | Select | 리드 처리 상태 | ✅ |
| **Slack 초대** | Checkbox | Slack 초대 완료 여부 | ❌ |
| **메모** | Rich Text | 내부 메모 | ❌ |

## Select Options for '상태'

- 🆕 **신규** - 새로 등록된 리드 (기본값)
- 📞 **연락중** - 첫 연락 완료
- 📅 **데모 예정** - 데모 일정 잡힘
- ✅ **데모 완료** - 데모 진행 완료
- 🤝 **전환** - 고객으로 전환
- ❌ **거절** - 관심 없음 또는 부적합
- ⏸️ **보류** - 나중에 다시 연락

## Database Creation Steps

### 1. Notion에서 새 Database 생성

1. Notion 워크스페이스에서 새 페이지 생성
2. `/database` 입력 후 **Table - Inline** 선택
3. Database 이름: **📊 Leads - agentiXwork**

### 2. Properties 추가

위 표의 순서대로 Properties를 생성합니다:

#### Title Property
- **기본 Name 컬럼 이름 변경**: `회사명`

#### Rich Text Properties
```
담당자명 (Rich Text)
사용 목적 (Rich Text)
메모 (Rich Text)
```

#### Email Property
```
이메일 (Email)
```

#### Date Property
```
신청일 (Date)
```

#### Select Property
```
상태 (Select)
Options:
  - 신규 (Gray)
  - 연락중 (Blue)
  - 데모 예정 (Purple)
  - 데모 완료 (Green)
  - 전환 (Green)
  - 거절 (Red)
  - 보류 (Yellow)
```

#### Checkbox Property
```
Slack 초대 (Checkbox)
```

### 3. Database ID 확인

1. Database 페이지 열기
2. **Share** → **Copy link** 클릭
3. URL에서 Database ID 추출:
   ```
   https://www.notion.so/{workspace}/{database_id}?v={view_id}
                                    ^^^^^^^^^^^^^^^^
                                    이 부분이 Database ID
   ```
4. `.env` 파일에 `NOTION_LEADS_DB_ID` 설정

### 4. Integration 연동

1. [Notion Integrations](https://www.notion.so/my-integrations) 페이지 접속
2. **New integration** 클릭
3. Integration 이름: `agentiXwork API`
4. Associated workspace 선택
5. **Submit** 클릭
6. **Internal Integration Token** 복사
7. `.env` 파일에 `NOTION_API_KEY` 설정

### 5. Database에 Integration 권한 부여

1. Leads Database 페이지 열기
2. 우측 상단 **...** → **Connections** → **Connect to** 선택
3. `agentiXwork API` Integration 선택
4. **Confirm** 클릭

## API Response Example

```json
{
  "success": true,
  "message": "데모 신청이 완료되었습니다.",
  "notionPageId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

## Notion에 저장되는 데이터 예시

| 회사명 | 담당자명 | 이메일 | 사용 목적 | 신청일 | 상태 |
|--------|----------|--------|-----------|--------|------|
| 테스트(주) | 홍길동 | hong@test.com | 사내 프로젝트 자동화 | 2026-02-07 | 🆕 신규 |
| ABC Corp | 김철수 | kim@abc.com | 고객사 랜딩 페이지 제작 | 2026-02-07 | 🆕 신규 |

## View 추천 설정

### 기본 View: All Leads
- **Filter**: 없음
- **Sort**: 신청일 (내림차순)
- **Group**: 상태별

### View 2: 신규 리드
- **Filter**: 상태 = 신규
- **Sort**: 신청일 (내림차순)

### View 3: 진행중
- **Filter**: 상태 = 연락중, 데모 예정, 데모 완료
- **Sort**: 신청일 (내림차순)
- **Group**: 상태별

### View 4: 전환 완료
- **Filter**: 상태 = 전환
- **Sort**: 신청일 (내림차순)

## 자동화 추천 (Notion Automation)

### 1. Slack 초대 리마인더
- **Trigger**: 상태가 "연락중"으로 변경
- **Action**: 담당자에게 Slack 초대 보내기 알림

### 2. 데모 후 피드백 요청
- **Trigger**: 상태가 "데모 완료"로 변경, 7일 경과
- **Action**: 피드백 요청 알림

## 참고 사항

- Database는 워크스페이스의 어느 페이지에 있어도 API 접근 가능
- Integration은 명시적으로 권한을 부여한 페이지만 접근 가능
- Database ID는 URL에서 직접 확인 가능 (Share 메뉴 사용)
