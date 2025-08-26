# Kent Beck TDD Guide

## 🧪 TDD Overview

Test-Driven Development (TDD) follows the **Red-Green-Refactor** cycle:

1. **Red**: Write a failing test
2. **Green**: Make the test pass with minimal code
3. **Refactor**: Improve code quality without changing behavior
4. **Repeat**: Continue with next feature increment

## 📋 Available Commands

### Core TDD Commands

- `*help` - TDD 가이드 및 명령어 도움말
- `*tdd-start {feature}` - 새로운 기능의 TDD 사이클 시작
- `*red-green {test}` - Red 단계 (실패하는 테스트 작성)
- `*refactor {code}` - Refactor 단계 (코드 개선)
- `*review {code}` - 코드 리뷰 및 TDD 준수 확인
- `*go` - plan.md의 다음 테스트 구현 (Tidy First 방식)

### Test Enhancement Commands (기존 코드 기반)

- `*strengthen {module}` - 기존 구현 코드의 테스트 강화 (Edge Case, 에러 처리 등)
- `*improve-quality` - 기존 코드의 테스트 품질 향상 및 촘촘한 테스트 작성

**⚠️ 주의**: 이 명령어들은 **TDD가 아닙니다**! 이미 구현된 코드의 테스트 커버리지를 강화하는 목적입니다.

## 🔄 TDD Cycle Details

### Red Phase

- Write the simplest failing test first
- Focus on the behavior you want
- Make the test fail for the right reason
- Use meaningful test names

### Green Phase

- Write minimal code to make test pass
- Don't worry about code quality yet
- Just make it work
- Quick and dirty implementation is OK

### Refactor Phase

- Improve code without changing behavior
- Remove duplication
- Improve readability
- Only when tests pass

## 🧹 Tidy First Principles

### Structural Changes

- Rearranging code without changing behavior
- Renaming variables, methods, classes
- Extracting methods, variables
- Moving code around

### Behavioral Changes

- Adding/modifying actual functionality
- Changing logic, algorithms
- Adding new features
- Fixing bugs

### Commit Discipline

- Never mix structural and behavioral changes in a commit
- Validate structural changes with tests before/after
- Prefer small, frequent commits

## 📏 Code Quality Guidelines

### Core Principles

- Remove duplication
- Express intent clearly
- Make dependencies explicit
- Methods should be small and single-responsibility
- Minimize state/side effects
- Use simplest solution possible

### Test Design

- Arrange-Act-Assert pattern
- Test one thing at a time
- Use descriptive test names
- Keep tests simple and readable
- Focus on behavior, not implementation

## 🎯 Best Practices

### Test Writing

- Start with a failing test for a small feature increment
- Use meaningful test names describing behavior
- Make failures informative
- Write only enough code for the test to pass

### Test Strengthening (기존 코드 기반 - NOT TDD)

- **전제**: 이미 완성된 구현 코드가 존재함
- **목적**: 기존 코드의 테스트 커버리지를 촘촘하게 만들기
- **차이점**: TDD의 Red-Green-Refactor 사이클과는 다름
- Analyze existing implementation to identify untested scenarios
- Create realistic Edge Cases based on actual code behavior
- Apply Given-When-Then structure for enhanced readability
- Use MSW advanced mocking for network error simulation
- Focus on error handling, data validation, and concurrent operations
- **핵심**: All strengthened tests must pass immediately (구현이 이미 완료됨)
- Document test improvements and quality metrics

### Implementation

- Implement the minimum code needed to make tests pass
- Refactor only after tests are passing
- Use recognized refactoring patterns
- One change at a time; run tests after each

### Commit Strategy

- Only commit when all tests pass
- Resolve all warnings before commit
- Ensure changes are atomic
- Commit message should describe change type

## 📚 Examples

### Example Test Structure

```javascript
describe('Calculator', () => {
  it('should add two numbers correctly', () => {
    // Arrange
    const calculator = new Calculator();

    // Act
    const result = calculator.add(2, 3);

    // Assert
    expect(result).toBe(5);
  });
});
```

### Example TDD Workflow

1. Write failing test for addition
2. Implement minimal addition method
3. Test passes
4. Refactor if needed
5. Move to next feature

### Example Test Strengthening (기존 코드 기반)

```javascript
// 1. 기존 기본 테스트 (이미 존재)
it('saves event successfully', () => {
  const event = { title: 'Meeting', date: '2025-01-01' };
  const result = saveEvent(event);
  expect(result).toBe(true);
});

// 2. 기존 구현 코드 분석 후 추가할 Edge Case 테스트
// ⚠️ 주의: 이는 TDD가 아님! 이미 완성된 코드의 테스트 강화임

describe('🟢 네트워크 에러 처리 테스트 (기존 구현 기반)', () => {
  it('서버 에러(500) 시 적절한 에러 메시지가 표시되어야 한다', async () => {
    // Given: 서버 에러를 반환하는 설정 (기존 에러 처리 코드가 이미 존재)
    server.use(
      http.post('/api/events', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    // When: 에러가 발생하는 요청 (기존 구현의 에러 처리 로직 실행)
    await act(async () => {
      await result.current.saveEvent(errorEvent);
    });

    // Then: 기존 구현된 에러 처리가 올바르게 동작하는지 확인
    expect(enqueueSnackbar).toHaveBeenCalledWith('일정 저장 실패', {
      variant: 'error',
    });
  });
});

// 핵심: 이 테스트는 즉시 통과함 (구현이 이미 완료되어 있음)
```

## 🔗 Related Resources

- Kent Beck's "Test-Driven Development: By Example"
- "Tidy First?" by Kent Beck
- Martin Fowler's Refactoring
- Clean Code by Robert C. Martin

## 📝 Notes

{additional_notes}
