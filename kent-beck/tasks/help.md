# Help Task

## Purpose

Provide comprehensive TDD guidance and command help for users. Focus on test-first development guidance and educational support.

## Input Parameters

- command: '{specific command}' (optional)
- context: '{user context}'
- experience_level: '{beginner|intermediate|advanced}'

## Help Content Structure

```yaml
Help Sections:
  - TDD Overview
  - Available Commands
  - TDD Cycle Explanation
  - Tidy First Principles
  - Code Quality Guidelines
  - Examples and Best Practices
  - Test-First Development Focus
  - Educational Guidance
```

## TDD Overview

```yaml
TDD Cycle:
  - Red: Write a failing test
  - Green: Make the test pass with minimal code
  - Refactor: Improve code quality without changing behavior
  - Repeat: Continue with next feature increment
  - Focus: Test-first development and test design
```

## Available Commands

```yaml
Commands:
  *help: TDD 가이드 및 명령어 도움말
  *tdd-start {feature}: 새로운 기능의 TDD 사이클 시작 (테스트 중심 가이드)
  *red-green {test}: Red 단계 (실패하는 테스트 작성 가이드)
  *refactor {code}: Refactor 단계 (코드 개선 가이드)
  *review {code}: 코드 리뷰 및 TDD 준수 확인 (테스트 중심 분석)
  *go: plan.md의 다음 테스트 구현 가이드 (Tidy First 방식)
```

## Tidy First Principles

```yaml
Tidy First Approach:
  - Structural changes: Rearranging code without changing behavior
  - Behavioral changes: Adding/modifying actual functionality
  - Never mix both changes in a commit
  - Validate structural changes with tests before/after
  - Focus on test structure and organization
```

## Code Quality Guidelines

```yaml
Quality Principles:
  - Remove duplication
  - Express intent clearly
  - Make dependencies explicit
  - Methods should be small and single-responsibility
  - Minimize state/side effects
  - Use simplest solution possible
  - Focus on test quality and testability
```

## Test-First Development Focus

```yaml
Test-First Principles:
  - Write tests before implementation
  - Design for testability
  - Focus on test structure and organization
  - Use meaningful test names
  - Keep tests simple and readable
  - Follow AAA pattern (Arrange-Act-Assert)
  - Test one thing at a time
```

## Educational Guidance

```yaml
Educational Focus:
  - Guide rather than implement
  - Explain reasoning behind test design
  - Provide context for TDD decisions
  - Encourage learning and understanding
  - Support gradual skill development
  - Focus on test-driven thinking
  - Teach test design principles
```

## Output

- Comprehensive help documentation
- Command-specific guidance
- TDD best practices
- Examples and use cases
- Test-first development guidance
- Educational resources

## Validation

- Ensure help content is accurate
- Verify command descriptions match implementation
- Check examples are practical and clear
- Focus on test-first development principles
- Provide educational value

## Constraints

- TEST CODE ONLY: Only modify and create test files
- No direct production code modification
- Advisory role only - provide guidance and suggestions
- Educational focus - teach TDD principles
- Test-driven guidance - focus on test design and structure
