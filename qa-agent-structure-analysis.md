# QA Agent (Quinn) 구조 분석 문서

## 📋 목차

1. [개요](#개요)
2. [전체 아키텍처](#전체-아키텍처)
3. [단계별 구조 분석](#단계별-구조-분석)
4. [명령어 실행 흐름](#명령어-실행-흐름)
5. [파일 구조 상세](#파일-구조-상세)
6. [워크플로우 분석](#워크플로우-분석)
7. [권한 및 제약사항](#권한-및-제약사항)
8. [설계 원칙](#설계-원칙)

---

## 개요

QA Agent (Quinn)는 BMAD Core 프레임워크의 품질 보증 전문가로, **5단계 구조**로 설계되어 있습니다. 각 단계는 독립적이면서도 서로 연결되어 체계적인 품질 검토를 수행합니다.

### 핵심 특징

- **Advisory Only**: 팀의 자율성 존중, 차단하지 않고 조언만 제공
- **위험 기반 적응형**: 상황에 따라 검토 깊이 자동 조절
- **모듈화된 구조**: 각 기능이 독립적인 task로 분리
- **표준화된 출력**: 일관된 형식의 결과물 생성

---

## 전체 아키텍처

```
QA Agent (Quinn)
├── 🎯 1단계: Agent 정의 및 설정
│   ├── Agent 메타데이터
│   ├── Persona 정의
│   └── 핵심 원칙 (10개)
├── 🔧 2단계: 명령어 및 인터페이스
│   ├── 명령어 정의 (7개)
│   ├── 매개변수 처리
│   └── 출력 형식 정의
├── 📋 3단계: Task 및 워크플로우
│   ├── 6개 주요 Task
│   ├── 적응형 검토 프로세스
│   └── 게이트 결정 로직
├── 📄 4단계: Template 및 출력
│   ├── 게이트 파일 템플릿
│   ├── 스토리 템플릿
│   └── 동적 변수 처리
└── 🔒 5단계: 권한 및 제약사항
    ├── 파일 권한 제한
    ├── 섹션별 접근 제어
    └── 무결성 보호
```

---

## 단계별 구조 분석

### 🎯 1단계: Agent 정의 및 설정

#### 1.1 Agent 메타데이터

```yaml
agent:
  name: Quinn
  id: qa
  title: Test Architect & Quality Advisor
  icon: 🧪
  whenToUse: |
    Use for comprehensive test architecture review, quality gate decisions, 
    and code improvement. Provides thorough analysis including requirements 
    traceability, risk assessment, and test strategy. 
    Advisory only - teams choose their quality bar.
```

**구조 분석**:

- **식별자**: 고유 ID와 이름으로 agent 구분
- **역할 정의**: 명확한 책임과 사용 시기 정의
- **정책 설정**: Advisory Only 정책으로 팀 자율성 보장

#### 1.2 Persona 정의

```yaml
persona:
  role: Test Architect with Quality Advisory Authority
  style: Comprehensive, systematic, advisory, educational, pragmatic
  identity: Test architect who provides thorough quality assessment and actionable recommendations without blocking progress
  focus: Comprehensive quality analysis through test architecture, risk assessment, and advisory gates
```

**구조 분석**:

- **권한 수준**: Advisory Authority (실행 권한 없음)
- **행동 스타일**: 체계적이면서 실용적
- **목표 설정**: 진행 차단 없이 실행 가능한 권장사항 제공

#### 1.3 핵심 원칙 (10개)

```yaml
core_principles: 1. Depth As Needed - 위험 신호에 따른 깊이 조절
  2. Requirements Traceability - Given-When-Then 패턴으로 추적성 확보
  3. Risk-Based Testing - 확률 × 영향도로 우선순위 결정
  4. Quality Attributes - NFR 검증 (보안, 성능, 신뢰성)
  5. Testability Assessment - 제어/관찰/디버깅 가능성 평가
  6. Gate Governance - 명확한 PASS/CONCERNS/FAIL/WAIVED 결정
  7. Advisory Excellence - 문서화를 통한 교육, 임의 차단 금지
  8. Technical Debt Awareness - 기술 부채 식별 및 정량화
  9. LLM Acceleration - LLM을 활용한 효율적 분석
  10. Pragmatic Balance - 필수 수정 vs 개선사항 구분
```

**구조 분석**:

- **적응형 접근**: 상황에 따른 유연한 대응
- **체계적 방법론**: 표준화된 패턴과 프로세스
- **교육적 접근**: 지식 전달과 팀 성장 지원
- **실용적 균형**: 이상과 현실의 조화

### 🔧 2단계: 명령어 및 인터페이스

#### 2.1 명령어 정의 (7개)

```yaml
commands: 1. *help - 도움말 표시
  2. *review {story} - 포괄적 검토 (핵심 기능)
  3. *gate {story} - 게이트 결정
  4. *nfr-assess {story} - 비기능 요구사항 평가
  5. *risk-profile {story} - 위험 평가 매트릭스
  6. *test-design {story} - 테스트 시나리오 설계
  7. *trace {story} - 요구사항 추적성
  8. *exit - agent 종료
```

**구조 분석**:

- **명령어 접두사**: `*`로 명령어 구분
- **매개변수 처리**: `{story}` 형태로 동적 입력
- **기능 분류**: 핵심/특화/유틸리티로 구분

#### 2.2 명령어 매핑 구조

```yaml
*review {story}: |
  Adaptive, risk-aware comprehensive review.
  Produces: QA Results update in story file + gate file (PASS/CONCERNS/FAIL/WAIVED).
  Gate file location: qa.qaLocation/gates/{epic}.{story}-{slug}.yml
  Executes review-story task which includes all analysis and creates gate decision.
```

**구조 분석**:

- **입력 처리**: 스토리 식별자 파싱
- **출력 정의**: 2개 파일 생성 (스토리 업데이트 + 게이트 파일)
- **위치 지정**: 설정 파일에서 경로 동적 결정
- **Task 연결**: 명령어와 실행 task 매핑

### 📋 3단계: Task 및 워크플로우

#### 3.1 6개 주요 Task

```yaml
dependencies:
  tasks: 1. review-story.md - 포괄적 검토 (메인 task)
    2. qa-gate.md - 게이트 결정
    3. nfr-assess.md - 비기능 요구사항 평가
    4. risk-profile.md - 위험 평가
    5. test-design.md - 테스트 설계
    6. trace-requirements.md - 요구사항 추적
```

#### 3.2 review-story.md 구조 분석

**A. 입력 정의**

```yaml
required:
  - story_id: '{epic}.{story}' # e.g., "1.3"
  - story_path: '{devStoryLocation}/{epic}.{story}.*.md'
  - story_title: '{title}'
  - story_slug: '{slug}'
```

**B. 전제 조건**

```yaml
Prerequisites:
  - Story status must be "Review"
  - Developer has completed all tasks and updated the File List
  - All automated tests are passing
```

**C. 적응형 검토 프로세스 (5단계)**

**1단계: 위험 평가 (검토 깊이 결정)**

```yaml
Auto-escalate to deep review when:
  - Auth/payment/security files touched
  - No tests added to story
  - Diff > 500 lines
  - Previous gate was FAIL/CONCERNS
  - Story has > 5 acceptance criteria
```

**2단계: 포괄적 분석 (6개 영역)**

```yaml
A. Requirements Traceability - 요구사항 추적성
B. Code Quality Review - 코드 품질 검토
C. Test Architecture Assessment - 테스트 아키텍처 평가
D. Non-Functional Requirements (NFRs) - 비기능 요구사항
E. Testability Evaluation - 테스트 가능성 평가
F. Technical Debt Identification - 기술 부채 식별
```

**3단계: 적극적 리팩토링**

```yaml
- Refactor code where safe and appropriate
- Run tests to ensure changes don't break functionality
- Document all changes in QA Results section
- Do NOT alter story content beyond QA Results section
```

**4단계: 표준 준수 확인**

```yaml
- Verify adherence to docs/coding-standards.md
- Check compliance with docs/unified-project-structure.md
- Validate testing approach against docs/testing-strategy.md
```

**5단계: 수용 기준 검증**

```yaml
- Verify each AC is fully implemented
- Check for any missing functionality
```

#### 3.3 qa-gate.md 구조 분석

**A. 게이트 결정 기준**

```yaml
PASS:
  - All acceptance criteria met
  - No high-severity issues
  - Test coverage meets project standards

CONCERNS:
  - Non-blocking issues present
  - Should be tracked and scheduled
  - Can proceed with awareness

FAIL:
  - Acceptance criteria not met
  - High-severity issues present
  - Recommend return to InProgress

WAIVED:
  - Known issues accepted for MVP release
  - Will be addressed in future sprints
```

**B. 게이트 파일 스키마**

```yaml
Minimal Required Schema:
  - schema: 1
  - story: '{epic}.{story}'
  - gate: PASS|CONCERNS|FAIL|WAIVED
  - status_reason: '1-2 sentence explanation'
  - reviewer: 'Quinn'
  - updated: '{ISO-8601 timestamp}'
  - top_issues: []
  - waiver: { active: false }
```

### 📄 4단계: Template 및 출력

#### 4.1 qa-gate-tmpl.yaml 구조

**A. 템플릿 메타데이터**

```yaml
template:
  id: qa-gate-template-v1
  name: Quality Gate Decision
  version: 1.0
  output:
    format: yaml
    filename: qa.qaLocation/gates/{{epic_num}}.{{story_num}}-{{story_slug}}.yml
```

**B. 동적 변수 처리**

```yaml
Required fields:
  - story: '{{epic_num}}.{{story_num}}'
  - story_title: '{{story_title}}'
  - gate: '{{gate_status}}'
  - status_reason: '{{status_reason}}'
  - updated: '{{iso_timestamp}}'
```

**C. 예시 섹션**

```yaml
examples:
  with_issues: |
    top_issues:
      - id: "SEC-001"
        severity: high
        finding: "No rate limiting on login endpoint"
        suggested_action: "Add rate limiting middleware before production"
```

#### 4.2 출력 파일 구조

**A. 게이트 파일 예시**

```yaml
schema: 1
story: '1.3'
gate: CONCERNS
status_reason: 'Missing rate limiting on auth endpoints poses security risk.'
reviewer: 'Quinn'
updated: '2025-01-12T10:15:00Z'
top_issues:
  - id: 'SEC-001'
    severity: high
    finding: 'No rate limiting on login endpoint'
    suggested_action: 'Add rate limiting middleware before production'
waiver: { active: false }
```

**B. 스토리 파일 QA Results 섹션**

```markdown
## QA Results

### Review Summary

- **Gate Decision**: CONCERNS
- **Reviewer**: Quinn
- **Date**: 2025-01-12T10:15:00Z

### Key Findings

1. **Security Issue**: Missing rate limiting on auth endpoints
2. **Test Coverage**: Integration tests needed for auth flow

### Recommendations

1. Add rate limiting middleware before production
2. Implement comprehensive integration tests
```

### 🔒 5단계: 권한 및 제약사항

#### 5.1 파일 권한 제한

```yaml
story-file-permissions:
  - CRITICAL: When reviewing stories, you are ONLY authorized to update the "QA Results" section of story files
  - CRITICAL: DO NOT modify any other sections including Status, Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Testing, Dev Agent Record, Change Log, or any other sections
  - CRITICAL: Your updates must be limited to appending your review results in the QA Results section only
```

**구조 분석**:

- **격리 원칙**: QA 결과만 별도 섹션에 기록
- **무결성 보호**: 다른 섹션 수정 금지
- **추적 가능**: QA 결과의 독립적 관리

#### 5.2 섹션별 접근 제어

```yaml
Allowed Sections:
✅ QA Results - 읽기/쓰기 가능

Restricted Sections:
❌ Status - 읽기만 가능
❌ Story - 읽기만 가능
❌ Acceptance Criteria - 읽기만 가능
❌ Tasks/Subtasks - 읽기만 가능
❌ Dev Notes - 읽기만 가능
❌ Testing - 읽기만 가능
❌ Dev Agent Record - 읽기만 가능
❌ Change Log - 읽기만 가능
```

---

## 명령어 실행 흐름

### 🔄 전체 실행 흐름

```
1. 명령어 입력
   ↓
2. Agent 활성화
   ↓
3. 매개변수 파싱
   ↓
4. Task 선택 및 로드
   ↓
5. 전제 조건 확인
   ↓
6. 적응형 검토 프로세스 실행
   ↓
7. 결과 생성
   ↓
8. 출력 파일 생성
   ↓
9. 스토리 파일 업데이트
```

### 📊 단계별 상세 흐름

#### 1단계: 명령어 처리

```
Input: *review 1.3
↓
Parse: {story} = "1.3"
↓
Extract: epic = "1", story = "3"
↓
Validate: 스토리 파일 존재 확인
```

#### 2단계: Task 로드

```
Load: review-story.md
↓
Check: 전제 조건 확인
↓
Prepare: 입력 데이터 준비
```

#### 3단계: 적응형 검토

```
Risk Assessment → 검토 깊이 결정
↓
Comprehensive Analysis → 6개 영역 분석
↓
Active Refactoring → 안전한 개선 수행
↓
Standards Compliance → 표준 준수 확인
↓
Acceptance Validation → 수용 기준 검증
```

#### 4단계: 결과 생성

```
Generate: 게이트 결정
↓
Create: 게이트 파일
↓
Update: 스토리 파일 QA Results
↓
Output: 완료 메시지
```

---

## 파일 구조 상세

### 📁 전체 파일 구조

```
.bmad-core/
├── agents/
│   └── qa.md                    # Agent 정의 (1단계)
├── tasks/
│   ├── review-story.md          # 메인 검토 task (3단계)
│   ├── qa-gate.md              # 게이트 결정 task (3단계)
│   ├── nfr-assess.md           # NFR 평가 task (3단계)
│   ├── risk-profile.md         # 위험 평가 task (3단계)
│   ├── test-design.md          # 테스트 설계 task (3단계)
│   └── trace-requirements.md   # 요구사항 추적 task (3단계)
├── templates/
│   ├── qa-gate-tmpl.yaml       # 게이트 파일 템플릿 (4단계)
│   └── story-tmpl.yaml         # 스토리 템플릿 (4단계)
├── data/
│   └── technical-preferences.md # 기술 선호도 (참조)
└── core-config.yaml            # 프로젝트 설정
```

### 🔗 의존성 관계

```yaml
qa.md (Agent)
├── review-story.md (Task)
│   ├── qa-gate-tmpl.yaml (Template)
│   └── story-tmpl.yaml (Template)
├── qa-gate.md (Task)
│   └── qa-gate-tmpl.yaml (Template)
├── nfr-assess.md (Task)
├── risk-profile.md (Task)
├── test-design.md (Task)
├── trace-requirements.md (Task)
└── technical-preferences.md (Data)
```

---

## 워크플로우 분석

### 🔄 메인 워크플로우 (review-story)

#### Phase 1: 초기화

```
1. 스토리 파일 로드
2. 전제 조건 확인
3. 위험 평가 수행
4. 검토 깊이 결정
```

#### Phase 2: 분석

```
1. 요구사항 추적성 분석
2. 코드 품질 검토
3. 테스트 아키텍처 평가
4. 비기능 요구사항 검증
5. 테스트 가능성 평가
6. 기술 부채 식별
```

#### Phase 3: 개선

```
1. 안전한 리팩토링 수행
2. 테스트 실행
3. 변경사항 문서화
```

#### Phase 4: 검증

```
1. 표준 준수 확인
2. 수용 기준 검증
3. 게이트 결정 생성
```

#### Phase 5: 출력

```
1. 게이트 파일 생성
2. 스토리 파일 업데이트
3. 결과 요약 제공
```

### 📊 적응형 검토 매트릭스

| 위험 신호        | 검토 깊이 | 소요 시간  | 분석 영역     |
| ---------------- | --------- | ---------- | ------------- |
| 보안 파일 변경   | Deep      | 2-3시간    | 6개 영역 모두 |
| 테스트 없음      | Deep      | 2-3시간    | 6개 영역 모두 |
| 500줄 이상 변경  | Deep      | 2-3시간    | 6개 영역 모두 |
| 이전 게이트 FAIL | Deep      | 2-3시간    | 6개 영역 모두 |
| 5개 이상 AC      | Deep      | 2-3시간    | 6개 영역 모두 |
| 일반적인 변경    | Standard  | 30분-1시간 | 3-4개 영역    |
| 사소한 변경      | Light     | 15-30분    | 2-3개 영역    |

---

## 권한 및 제약사항

### 🔐 권한 구조

#### 읽기 권한

```yaml
✅ 모든 스토리 파일 섹션
✅ 프로젝트 설정 파일
✅ 코딩 표준 문서
✅ 테스트 전략 문서
```

#### 쓰기 권한

```yaml
✅ QA Results 섹션만
✅ 게이트 파일 생성
❌ 다른 모든 섹션 수정 금지
```

### 🚫 제약사항

#### 1. 파일 수정 제한

- **스토리 상태 변경 금지**: Status 섹션 수정 불가
- **개발 노트 수정 금지**: Dev Notes 섹션 수정 불가
- **수용 기준 수정 금지**: Acceptance Criteria 섹션 수정 불가

#### 2. 실행 권한 제한

- **Advisory Only**: 실제 차단 권한 없음
- **권장사항 제공**: 실행은 팀이 결정
- **교육적 접근**: 강제가 아닌 가이드

#### 3. 데이터 무결성 보호

- **원본 보존**: 기존 내용 변경 금지
- **추가만 가능**: QA Results에 추가만 허용
- **감사 추적**: 모든 변경사항 기록

---

## 설계 원칙

### 🎯 핵심 설계 원칙

#### 1. 모듈화 (Modularity)

```yaml
- 각 기능이 독립적인 task로 분리
- 재사용 가능한 컴포넌트 설계
- 명확한 인터페이스 정의
```

#### 2. 적응형 (Adaptive)

```yaml
- 상황에 따른 검토 깊이 조절
- 위험 기반 접근법
- 효율성과 완전성의 균형
```

#### 3. 표준화 (Standardization)

```yaml
- 일관된 출력 형식
- 표준화된 프로세스
- 재현 가능한 결과
```

#### 4. 확장성 (Extensibility)

```yaml
- 새로운 task 쉽게 추가
- 템플릿 기반 확장
- 설정 기반 커스터마이징
```

#### 5. 안전성 (Safety)

```yaml
- 권한 제한으로 무결성 보호
- 안전한 리팩토링만 수행
- 롤백 가능한 변경사항
```

### 🔧 기술적 설계 패턴

#### 1. 템플릿 패턴

```yaml
- 동적 변수 처리
- 일관된 출력 형식
- 버전 관리 지원
```

#### 2. 전략 패턴

```yaml
- 적응형 검토 전략
- 위험 기반 접근법
- 상황별 대응 방식
```

#### 3. 관찰자 패턴

```yaml
- 이벤트 기반 처리
- 상태 변화 추적
- 결과 알림 시스템
```

#### 4. 팩토리 패턴

```yaml
- Task 동적 생성
- Template 기반 파일 생성
- 설정 기반 객체 생성
```

---

## 결론

QA Agent (Quinn)는 **5단계 구조**로 설계된 체계적이고 확장 가능한 품질 보증 시스템입니다:

1. **🎯 Agent 정의 및 설정**: 명확한 역할과 정책 정의
2. **🔧 명령어 및 인터페이스**: 사용자 친화적 명령어 체계
3. **📋 Task 및 워크플로우**: 모듈화된 실행 가능한 작업들
4. **📄 Template 및 출력**: 표준화된 결과물 생성
5. **🔒 권한 및 제약사항**: 안전하고 제어된 접근

이 구조는 **팀의 자율성을 존중**하면서도 **체계적인 품질 검토**를 제공하는 균형잡힌 설계로, 현대적인 소프트웨어 개발 환경에 최적화되어 있습니다.
