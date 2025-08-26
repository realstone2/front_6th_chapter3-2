# Test Case: {test_name}

## Description

{test_description}

## Test Code

```{language}
describe('{feature}', () => {
  it('should {expected_behavior} when {condition}', () => {
    // Arrange
    {
      setup_code;
    }

    // Act
    {
      action_code;
    }

    // Assert
    {
      assertion_code;
    }
  });
});
```

## Phase: {phase}

### Red Phase Checklist

- [ ] Test fails initially
- [ ] Test expresses desired behavior
- [ ] Test name is descriptive
- [ ] Failure message is informative

### Green Phase Checklist

- [ ] Minimal implementation written
- [ ] Test passes
- [ ] Only necessary code included
- [ ] No premature optimization

## Implementation Guidance

### Red Phase

{red_phase_guidance}

### Green Phase

{green_phase_guidance}

## Notes

- {additional_notes}

## Related Tests

{related_tests}

## Next Steps

{next_steps}


