# Google Analytics 4 설정 가이드

## GA4 계정 및 속성 생성

### 1. Google Analytics 계정 만들기

1. https://analytics.google.com/ 접속
2. **시작하기** 클릭
3. 계정 이름 입력: `agentiXwork`
4. 데이터 공유 설정 확인 후 **다음**

### 2. 속성 만들기

1. 속성 이름: `agentiXwork.com`
2. 보고 시간대: `대한민국 (GMT+9:00) Seoul`
3. 통화: `대한민국 원 (₩)`
4. **다음** 클릭

### 3. 비즈니스 정보

1. 업종: `기술` → `소프트웨어`
2. 비즈니스 규모: 해당 사항 선택
3. 사용 목적: `고객 행동 이해`, `전환 측정`
4. **만들기** 클릭

### 4. 데이터 스트림 설정

1. 플랫폼 선택: **웹**
2. 웹사이트 URL: `https://agentixwork.com`
3. 스트림 이름: `agentiXwork Web`
4. **스트림 만들기** 클릭

### 5. 측정 ID 복사

- 형식: `G-XXXXXXXXXX`
- 이 ID를 복사하여 `index.html`의 GA4 스크립트에 붙여넣기

```html
<!-- Replace G-XXXXXXXXXX with your actual Measurement ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

## 전환 이벤트 설정

### 1. 주요 전환 이벤트

GA4 속성 → **이벤트** → **이벤트 만들기**

#### 데모 신청 완료
- **이벤트 이름**: `demo_request_success`
- **매개변수**:
  - `company`: 회사명
  - `has_use_case`: 사용 목적 입력 여부
- **전환으로 표시**: ✓

#### CTA 클릭
- **이벤트 이름**: `cta_click`
- **매개변수**:
  - `button_text`: 버튼 텍스트
  - `button_location`: 버튼 위치 (섹션)

#### 폼 제출 시작
- **이벤트 이름**: `form_submit`
- **매개변수**:
  - `form_name`: `demo_request`

#### 스크롤 깊이
- **이벤트 이름**: `scroll_depth`
- **매개변수**:
  - `percent`: 25, 50, 75, 90

#### 외부 링크 클릭
- **이벤트 이름**: `click_outbound`
- **매개변수**:
  - `url`: 링크 URL
  - `text`: 링크 텍스트

### 2. 전환 목표 설정

GA4 속성 → **관리** → **전환**

전환으로 표시할 이벤트:
- ✅ `demo_request_success` (주요 전환)
- ✅ `form_submit`
- ✅ `cta_click` (데모 신청 버튼만)

## 맞춤 보고서 생성

### 1. 랜딩 페이지 성과

**탐색** → **새 탐색 만들기** → **빈 보고서**

- **이름**: 랜딩 페이지 성과
- **측정기준**:
  - 페이지 경로 및 스크린 클래스
  - 기본 채널 그룹
  - 출처/매체
- **측정항목**:
  - 조회수
  - 사용자
  - 평균 참여 시간
  - 전환 (`demo_request_success`)
  - 전환율

### 2. 전환 유입 경로

**탐색** → **유입경로 탐색**

- **단계**:
  1. 페이지 조회 (랜딩)
  2. 스크롤 깊이 50% 이상
  3. CTA 클릭
  4. 폼 제출
  5. 데모 신청 완료

### 3. 사용자 행동 흐름

**탐색** → **경로 탐색**

- **시작점**: `page_view`
- **다음 단계**: 이벤트 또는 페이지
- **종료점**: `demo_request_success`

## 대시보드 위젯 추가

### 홈 대시보드 맞춤 설정

1. **보고서** → **홈**
2. **카드 맞춤설정** 클릭
3. 추가할 카드:
   - 실시간 사용자
   - 데모 신청 전환 (일별)
   - 트래픽 소스
   - 인기 페이지
   - 평균 참여 시간

## 추적 확인

### DebugView로 실시간 확인

1. GA4 속성 → **관리** → **DebugView**
2. 브라우저에서 테스트:
   ```javascript
   // 개발자 콘솔에서 실행
   gtag('event', 'test_event', { test_param: 'test_value' });
   ```
3. DebugView에서 이벤트 확인

### Chrome Extension 설치

- **GA Debugger**: GA4 이벤트 실시간 모니터링
- **Tag Assistant**: Google 태그 검증

## 권장 설정

### 데이터 보존 기간

GA4 속성 → **관리** → **데이터 설정** → **데이터 보존**
- 이벤트 데이터 보존: **14개월** (최대)

### 향상된 측정

GA4 속성 → 데이터 스트림 → 톱니바퀴 아이콘 → **향상된 측정**

활성화 권장:
- ✅ 페이지 조회수
- ✅ 스크롤 (자동 90% 추적)
- ✅ 이탈 클릭 (외부 링크)
- ✅ 사이트 검색
- ✅ 양식 상호작용
- ✅ 파일 다운로드

### Google Search Console 연결

GA4 속성 → **관리** → **Search Console 링크**
- 검색 유입 키워드 및 성과 분석

## 주요 지표 모니터링

### 일일 체크리스트

- [ ] 실시간 사용자 수
- [ ] 데모 신청 전환 수
- [ ] 전환율 (목표: 3% 이상)
- [ ] 평균 참여 시간 (목표: 2분 이상)
- [ ] 이탈률 (목표: 50% 이하)

### 주간 리포트

- 주요 유입 채널 분석
- 전환 유입 경로 병목 지점 파악
- CTA 클릭률 (목표: 10% 이상)
- 스크롤 깊이 분석 (90% 도달률)

## 문제 해결

### 이벤트가 추적되지 않는 경우

1. 개발자 도구 콘솔 확인
2. `gtag` 함수가 정의되었는지 확인
3. Measurement ID가 올바른지 확인
4. Ad Blocker 비활성화 후 테스트

### 전환이 집계되지 않는 경우

1. GA4 속성 → **이벤트**에서 이벤트 수신 확인
2. 전환으로 표시 여부 확인
3. 최대 24시간 지연 가능성 고려

## 참고 자료

- [GA4 공식 문서](https://support.google.com/analytics/answer/10089681)
- [GA4 이벤트 참조](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [전환 추적 가이드](https://support.google.com/analytics/answer/9267568)
