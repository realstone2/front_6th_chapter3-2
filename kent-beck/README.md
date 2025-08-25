# Kent Beck TDD Agent

🧪 **TDD Guide & Refactoring Mentor** - 켄트백의 TDD 철학과 Tidy First 원칙을 바탕으로 한 테스트 주도 개발 가이드

## 📋 개요

Kent Beck TDD Agent는 **TDD(Test-Driven Development) 가이드** 역할을 하는 AI 에이전트로, 켄트백의 TDD 철학과 원칙을 바탕으로 개발자들이 테스트 주도 개발을 효과적으로 수행할 수 있도록 안내합니다.

### 핵심 특징

- **TDD 중심**: Red-Green-Refactor 사이클 기반 가이드
- **교육적 접근**: 단계별 학습과 실습 지원
- **간략화된 구조**: 핵심 기능에 집중한 설계
- **실용적 조언**: 즉시 적용 가능한 TDD 팁 제공
- **plan.md 기반**: 체계적인 테스트 구현 워크플로우
- **테스트 전용**: 테스트 코드만 수정 및 작성, 실제 개발 코드는 수정 금지

## 🏗️ 구조

```
kent-beck/
├── agent.md                    # Agent 메인 설정 (MD 파일)
├── README.md                   # 프로젝트 개요 및 사용법
├── tasks/                      # Task 정의
│   ├── tdd-cycle.md
│   ├── test-design.md
│   ├── refactor-guide.md
│   ├── plan-workflow.md
│   └── help.md
└── templates/                  # 출력 템플릿
    ├── tdd-cycle-template.md
    ├── test-case-template.md
    ├── plan-progress-template.md
    ├── refactor-template.md
    └── help-template.md
```

## 🚀 사용법

### 기본 명령어

- `*help` - TDD 가이드 및 명령어 도움말
- `*tdd-start {feature}` - 새로운 기능의 TDD 사이클 시작 (테스트 중심 가이드)
- `*red-green {test}` - Red 단계 (실패하는 테스트 작성 가이드)
- `*refactor {code}` - Refactor 단계 (코드 개선 가이드)
- `*review {code}` - 코드 리뷰 및 TDD 준수 확인 (테스트 중심 분석)
- `*go` - plan.md의 다음 테스트 구현 가이드 (Tidy First 방식)

### TDD 사이클

1. **Red**: 실패하는 테스트 작성
2. **Green**: 최소한의 코드로 테스트 통과
3. **Refactor**: 코드 품질 개선 (행동 변경 없이)

### Tidy First 원칙

- **구조적 변경**: 코드 재배치 (행동 변경 없음)
- **행동적 변경**: 실제 기능 추가/수정
- **Commit 규율**: 두 변경을 한 번에 커밋하지 않음

## 📚 핵심 원칙

1. **Test-First Development** - Red-Green-Refactor 사이클
2. **Small Steps** - 점진적 개발과 테스트
3. **Clean Code** - 무자비한 리팩토링
4. **Simple Design** - YAGNI 원칙
5. **Feedback Loop** - 테스트를 통한 빠른 피드백
6. **Test-Only Focus** - 테스트 코드만 수정 및 작성
7. **Educational Approach** - 개발자를 TDD 프로세스로 안내
8. **Advisory Role** - 직접 구현 없이 가이드 제공

## 🎯 코드 품질 원칙

- 중복 제거
- 의도를 명확히 표현
- 의존성을 명시적으로 만들기
- 메서드는 작고 단일 책임을 가지도록
- 상태/부작용 최소화
- 가능한 가장 간단한 해결책 사용
- 테스트 품질과 테스트 가능성에 집중

## 🔒 제약사항

### 핵심 제약

- **TEST CODE ONLY**: 테스트 코드만 수정 및 작성, 실제 개발 코드는 수정 금지
- **Advisory Role**: 조언 역할만 수행, 직접 구현 금지
- **Educational Focus**: 교육적 접근 방식
- **Test-First Guidance**: 테스트 우선 가이드

### 권한

- 테스트 파일 생성/수정 가능
- plan.md 파일 읽기/수정 가능
- 코드 리뷰 및 제안
- 교육적 가이드 제공
- TDD 사이클 가이드
- 테스트 설계 지원
- 리팩토링 가이드

## 📖 참고 자료

- Kent Beck's "Test-Driven Development: By Example"
- "Tidy First?" by Kent Beck
- Martin Fowler's Refactoring
- Clean Code by Robert C. Martin

## 🔧 개발

이 Agent는 켄트백의 TDD 철학과 Tidy First 원칙을 충실히 반영하여 설계되었습니다. **테스트 코드만 수정 및 작성**하며, 실제 개발 코드는 직접 수정하지 않고 가이드와 조언을 제공합니다. plan.md 기반의 체계적인 워크플로우를 통해 일관된 개발 프로세스를 지원하며, 교육적 접근을 통해 개발자들이 TDD 방법론을 효과적으로 학습하고 적용할 수 있도록 지원합니다.

## 📝 라이선스

이 프로젝트는 교육 목적으로 제작되었으며, 켄트백의 TDD 방법론을 학습하고 적용하는 데 도움을 주기 위한 것입니다.
