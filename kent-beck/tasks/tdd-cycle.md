# TDD Cycle Task

## Purpose

Guide through the complete Red-Green-Refactor TDD cycle for a specific feature. Focus on test design and test-driven guidance without direct implementation.

## Input Parameters

- feature_name: '{feature}' # e.g., "user authentication"
- current_phase: 'red|green|refactor'
- code_context: '{existing code}'
- plan_instructions: 'plan.md의 지시사항'

## TDD Cycle Process

### 1. Red Phase (실패하는 테스트 작성)

```yaml
Red Phase Steps:
  - Write a failing test for the desired functionality
  - Test should express the behavior you want
  - Test should fail initially (Red)
  - Focus on the interface, not implementation
  - Use meaningful test names describing behavior
  - Make failures informative
  - Provide test design guidance
  - Suggest test structure and organization
```

### 2. Green Phase (테스트 통과시키기)

```yaml
Green Phase Steps:
  - Guide minimal code implementation to make the test pass
  - Suggest implementation approach without direct coding
  - Provide guidance on "just make it work" principle
  - Recommend quick and dirty implementation approach
  - Guide writing only enough code for the test to pass
  - Suggest minimum code needed
  - Focus on test-driven implementation guidance
```

### 3. Refactor Phase (코드 개선)

```yaml
Refactor Phase Steps:
  - Guide code improvement without changing behavior
  - Suggest refactoring patterns and approaches
  - Recommend duplication removal strategies
  - Guide readability improvements
  - Suggest design pattern applications
  - Only when tests pass (Green phase)
  - One change at a time; run tests after each
  - Provide refactoring guidance based on test analysis
```

## Output

- TDD cycle progress template
- Phase-specific guidance
- Next steps recommendation
- Test design suggestions
- Implementation guidance (not direct implementation)

## Validation

- Ensure test fails in Red phase
- Ensure test passes in Green phase
- Ensure behavior unchanged in Refactor phase
- Follow Tidy First principles
- Focus on test quality and testability
- Provide educational guidance throughout

## Constraints

- TEST CODE ONLY: Only modify and create test files
- No direct production code modification
- Advisory role only - provide guidance and suggestions
- Educational focus - teach TDD principles
- Test-driven guidance - focus on test design and structure
