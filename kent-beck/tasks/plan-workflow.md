# Plan Workflow Task

## Purpose

Execute the \*go command workflow: find next unmarked test in plan.md, guide test implementation (Red phase), then guide minimal code implementation (Green phase). Focus on test design and test-driven guidance without direct implementation.

## Input Parameters

- plan_file: 'plan.md'
- workflow_type: 'tidy-first'
- current_context: '{current codebase}'
- existing_tests: '{existing test files}'

## Plan Compliance Principles

```yaml
Plan Compliance:
  - Always follow instructions in plan.md
  - When user says "go", find next unmarked test
  - Guide test implementation (Red phase)
  - Guide minimal code implementation (Green phase)
  - Mark test as complete in plan.md
  - Maintain systematic approach
  - Provide test design guidance
```

## \*go Command Processing

```yaml
*go Command Steps:
  1. Parse plan.md for next unmarked test
  2. Guide test implementation (Red phase)
  3. Guide minimal code implementation (Green phase)
  4. Mark test as complete in plan.md
  5. Provide feedback on progress
  6. Suggest next steps
  7. Focus on test-driven guidance
```

## Tidy First Workflow

```yaml
Tidy First Approach:
  - Separate structural changes from behavioral changes
  - Structural changes: Rearranging code without changing behavior
  - Behavioral changes: Adding/modifying actual functionality
  - Never mix both changes in a commit
  - Validate structural changes with tests before/after
  - Follow plan.md instructions for systematic implementation
  - Guide test structure and organization
```

## Plan-based Workflow

```yaml
Plan-based Workflow:
  - Always follow the instructions in plan.md
  - Find the next unmarked test in plan.md
  - Guide test implementation (Red phase)
  - Guide minimal code implementation (Green phase)
  - Mark test as complete in plan.md
  - Move to next unmarked test
  - Follow Tidy First principles throughout
  - Provide test design guidance
```

## Commit Discipline

```yaml
Commit Guidelines:
  - Only commit when all tests pass
  - Resolve all warnings before commit
  - Ensure changes are atomic
  - Commit message should describe change type
  - Prefer small, frequent commits
  - Never mix structural and behavioral changes in a commit
  - Separate test commits from implementation commits
```

## Output

- Next test identification from plan.md
- Test implementation guidance (Red phase)
- Minimal code implementation guidance (Green phase)
- Plan.md update with completion status
- Progress feedback and next steps
- Test design suggestions

## Validation

- Ensure test fails initially (Red)
- Ensure test passes after implementation (Green)
- Verify plan.md is updated correctly
- Check Tidy First principles compliance
- Validate commit discipline
- Focus on test quality and testability

## Constraints

- TEST CODE ONLY: Only modify and create test files
- No direct production code modification
- Advisory role only - provide guidance and suggestions
- Educational focus - teach TDD principles
- Test-driven guidance - focus on test design and structure
- Plan.md compliance - follow plan instructions strictly
