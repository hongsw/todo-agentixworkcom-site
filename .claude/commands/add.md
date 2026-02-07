# /add — 작업 추가

의사결정자가 자연어로 말하면 너(Claude Code)가 구조화된 TODO로 변환하여 Notion에 등록한다.

## 사용법
```
/add 랜딩페이지에 고객 후기 섹션 추가해
/add 모바일에서 폰트가 너무 작음. 확인 필요
/add 긴급: 데모 신청 폼이 작동 안 한다고 고객 연락옴
```

## 실행할 것

1. 의사결정자의 자연어 입력을 파싱한다
2. 자동으로 추정:
   - Task명: 명확하고 구체적으로 재작성
   - Priority: "긴급" 언급 → 🔴, 기본 → 🟡 보통
   - Phase: 내용에 따라 추정 (디자인/개발/QA 등)
   - 담당: 코드 작업이면 "Claude Code", 아니면 "팀원"
3. Notion TODO DB에 생성 (Status: 📋 대기)
4. 확인 출력:
```
✅ TODO 추가됨:
  Task: {Task명}
  Priority: {Priority}
  Phase: {Phase}
  담당: {담당}

📋 현재 대기 {N}건. /kickoff로 실행 가능.
```

## 규칙
- 의사결정자에게 "어떤 Priority로 할까요?" 같은 걸 되묻지 마라. 알아서 추정하라.
- 추정이 틀렸으면 의사결정자가 /reprioritize로 바꿀 것이다.
- 담당 판단이 애매하면 "Claude Code"로 설정하라.
