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

## 🔗 Related Resources

- Kent Beck's "Test-Driven Development: By Example"
- "Tidy First?" by Kent Beck
- Martin Fowler's Refactoring
- Clean Code by Robert C. Martin

## 📝 Notes

{additional_notes}
