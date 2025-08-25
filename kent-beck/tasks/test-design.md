# Test Design Task

## Purpose

Guide through test case design and implementation following TDD principles. Focus on test design and test-driven guidance without direct implementation.

## Input Parameters

- test_name: '{test}'
- phase: 'red-green'
- feature_context: '{feature}'
- existing_tests: '{existing test files}'

## Test Design Principles

```yaml
Test Design Principles:
  - Arrange-Act-Assert pattern
  - Test one thing at a time
  - Use descriptive test names
  - Keep tests simple and readable
  - Focus on behavior, not implementation
  - Start with a failing test for a small feature increment
  - Make failures informative
  - Design for testability
```

## Test Case Template

```yaml
Test Case Structure:
  - Test name: 'should [expected behavior] when [condition]'
  - Arrange: Set up test data and objects
  - Act: Execute the method being tested
  - Assert: Verify the expected outcome
```

## Red Phase (Test Writing)

```yaml
Red Phase Guidelines:
  - Guide writing the simplest failing test first
  - Suggest focusing on the behavior you want
  - Recommend not worrying about implementation details
  - Guide making the test fail for the right reason
  - Suggest meaningful test names
  - Recommend keeping tests small and focused
  - Provide test design guidance
  - Suggest test structure and organization
```

## Green Phase (Implementation)

```yaml
Green Phase Guidelines:
  - Guide minimal code implementation to make test pass
  - Suggest not worrying about code quality yet
  - Recommend "just make it work" approach
  - Guide quick and dirty implementation
  - Suggest writing only enough code for the test to pass
  - Recommend minimum code needed
  - Provide implementation guidance without direct coding
```

## Output

- Test case template with specific test code
- Implementation guidance for Green phase
- Test naming suggestions
- Assertion recommendations
- Test design guidance
- Implementation suggestions (not direct implementation)

## Validation

- Ensure test fails initially (Red)
- Ensure test passes after implementation (Green)
- Verify test is meaningful and descriptive
- Check test follows AAA pattern
- Focus on test quality and testability
- Provide educational guidance

## Constraints

- TEST CODE ONLY: Only modify and create test files
- No direct production code modification
- Advisory role only - provide guidance and suggestions
- Educational focus - teach test design principles
- Test-driven guidance - focus on test structure and organization
