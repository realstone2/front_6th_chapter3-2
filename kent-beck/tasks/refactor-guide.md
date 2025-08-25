# Refactor Guide Task

## Purpose

Guide through the Refactor phase of TDD, ensuring code quality improvement without changing behavior. Focus on refactoring guidance and test analysis without direct implementation.

## Input Parameters

- code_context: '{code}'
- phase: 'refactor'
- existing_tests: '{test files}'
- current_behavior: '{current functionality}'

## Refactoring Guidelines

```yaml
Refactoring Principles:
  - Only when tests pass (Green phase)
  - Use recognized refactoring patterns
  - One change at a time; run tests after each
  - Prioritize duplication removal/clarity
  - Validate that structural changes do not alter behavior
  - Guide refactoring decisions through test analysis
  - Provide refactoring suggestions based on test feedback
  - Focus on test-driven refactoring guidance
```

## Code Quality Principles

```yaml
Code Quality Guidelines:
  - Remove duplication
  - Express intent clearly
  - Make dependencies explicit
  - Methods should be small and single-responsibility
  - Minimize state/side effects
  - Use simplest solution possible
  - Maintain high code quality throughout development
  - Focus on test quality and testability
  - Guide quality improvements through test analysis
```

## Refactoring Patterns

```yaml
Common Refactoring Patterns:
  - Extract Method
  - Extract Variable
  - Rename Variable/Method
  - Remove Duplicate Code
  - Simplify Conditional Logic
  - Improve Variable Names
  - Break Large Methods
  - Extract Constants
  - Suggest refactoring patterns based on test analysis
```

## Tidy First Approach

```yaml
Tidy First Principles:
  - Separate structural changes from behavioral changes
  - Structural changes: Rearranging code without changing behavior
  - Behavioral changes: Adding/modifying actual functionality
  - Never mix both changes in a single commit
  - Validate structural changes with tests before/after
  - Follow plan.md instructions for systematic implementation
  - Guide test structure and organization
  - Provide refactoring guidance based on test feedback
```

## Output

- Refactoring suggestions
- Code quality improvements
- Before/after code examples
- Test validation steps
- Refactoring guidance (not direct implementation)
- Test analysis and recommendations

## Validation

- Ensure all tests still pass after refactoring
- Verify behavior remains unchanged
- Check code quality improvements
- Validate against Tidy First principles
- Focus on test quality and testability
- Provide educational guidance

## Constraints

- TEST CODE ONLY: Only modify and create test files
- No direct production code modification
- Advisory role only - provide guidance and suggestions
- Educational focus - teach refactoring principles
- Test-driven guidance - focus on test analysis and feedback
- Refactoring suggestions based on test analysis only
