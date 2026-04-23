# Testing Guidelines Reference (Testing Rails)

## Test Suite Quality Characteristics

An effective test suite is:
- **Fast**: Run frequently, quick feedback loop
- **Complete**: All public code paths covered
- **Reliable**: No false positives or intermittent failures
- **Isolated**: Tests run independently, clean up after themselves
- **Maintainable**: Easy to add new tests and modify existing ones
- **Expressive**: Tests serve as documentation

---

## Testing Pyramid

Structure your test suite as a pyramid:
- **Base**: Many fast unit/model tests
- **Middle**: Some integration tests
- **Top**: Few slow feature/system tests

---

## Test Types Coverage Requirements

### Feature/System Specs (Integration)
**Required Coverage**:
- All critical user flows
- Happy paths for main features
- Key error handling paths

**Audit Checks**:
- [ ] Login/authentication flow tested
- [ ] Main CRUD operations tested
- [ ] Payment flows tested (if applicable)
- [ ] Critical business workflows tested

### Model Specs
**Required Coverage**:
- All validations
- All public instance methods
- All public class methods
- Associations (if complex logic)

**Audit Checks**:
- [ ] Each model has corresponding spec file
- [ ] All validations have tests (do not require shoulda-matchers — plain RSpec expectations are preferred)
- [ ] Business logic methods have unit tests
- [ ] Edge cases covered

### Controller Specs (or Request Specs)
**Only required for controllers with endpoints not accessed via the UI** (e.g., API-only controllers, webhook receivers, JSON APIs consumed externally). UI-accessible endpoints should be covered by system tests instead.

**Required Coverage** (for applicable controllers):
- Authorization checks
- Error handling paths
- Response formats

**Use When**:
- API-only controllers, or endpoints not reachable through the application UI (e.g., webhook receivers, JSON APIs consumed externally), should be tested via request specs
- Any controller endpoint exercised through the UI should be covered by a system test — not a request spec

### View Specs
**Required Coverage**:
- Conditional rendering logic
- Complex view logic

**Use When**:
- Significant conditional logic in views
- Avoiding duplicate feature specs

### Helper Specs
**Required Coverage**:
- All public helper methods

### Mailer Specs
**Required Coverage**:
- Email sent to correct recipients
- Correct subject
- Body contains expected content

---

## Given/When/Then Test Pattern

Every test should follow the Given/When/Then structure. Setup shared across multiple tests belongs in `let` variables (the "Given"); the action under test is the "When"; expectations are the "Then".

```ruby
RSpec.describe User, "#full_name" do
  # Given
  let(:user) { create(:user, first_name: "John", last_name: "Doe") }

  it "returns the user's full name" do
    # When
    result = user.full_name

    # Then
    expect(result).to eq "John Doe"
  end
end
```

- **Given**: Expressed via `let` variables — objects and state the test depends on, defined once and reused across examples
- **When**: The action being tested — exercise the code under test
- **Then**: The assertion — verify the expected outcome

**Audit Check**: Tests should have clear phase separation. Setup shared across multiple examples should use `let`; setup used only once should be inline.

---

## Testing Antipatterns to Flag

### 1. Slow Tests

**Symptoms**:
- Test suite takes more than 5 minutes
- Developers avoid running tests

**Causes**:
- Too many feature specs
- Not using factories efficiently
- Unnecessary database hits

**Audit Check**: Flag if average spec takes > 100ms

### 2. Intermittent Failures

**Symptoms**:
- Tests pass/fail randomly
- "Works on my machine"

**Causes**:
- Shared state between tests
- Time-dependent tests
- Order-dependent tests
- Race conditions in async code

**Audit Check**: Look for `sleep`, time manipulation without proper cleanup

### 3. Brittle Tests

**Symptoms**:
- Tests break when implementation changes
- Tests coupled to HTML structure

**Causes**:
- Testing implementation not behavior
- Over-reliance on specific selectors
- Excessive mocking

**Audit Check**: Flag tests with hardcoded CSS selectors, deep mocking

### 4. Duplication

**Symptoms**:
- Same setup code repeated
- Similar tests with minor variations

**Causes**:
- Missing shared examples
- Missing custom matchers
- Over-extracted test helpers

**Audit Check**: Look for repeated `let` blocks, identical setup

### 5. Mystery Guest

**Symptoms**:
- Test data defined elsewhere
- Hard to understand what test depends on

**Causes**:
- Over-use of fixtures
- Factory defaults that matter

**Audit Check**: Flag fixtures usage, flag factories with too many defaults

### 6. Stubbing System Under Test

**Symptoms**:
- Test stubs the object it's testing

**Causes**:
- Testing implementation details
- Poorly designed code

**Audit Check**: Flag `allow(subject).to receive(...)`

### 7. False Positives

**Symptoms**:
- Test passes but code is broken

**Causes**:
- Not testing the right thing
- Overly broad assertions

**Audit Check**: Look for `expect(page).to have_content("")`

### 8. Using Factories Like Fixtures

**Symptoms**:
- Named factories for every scenario
- `create(:admin_user_with_premium_subscription)`

**Causes**:
- Misunderstanding factory purpose

**Audit Check**: Flag factories with many trait combinations

### 9. Bloated Factories

**Symptoms**:
- Factories create unnecessary associations
- Factory creates too much data

**Causes**:
- Adding defaults "just in case"

**Audit Check**: Flag factories with > 5 attributes, unnecessary associations

### 10. Misuse of `let`, `subject`, `before`

**Symptoms**:
- Single-use variables declared as `let` (adding indirection for no reuse benefit)
- Repeated inline setup that could be extracted to `let` (violating DRY across examples)
- Tests hard to read because you must scroll to find what an example depends on

**Causes**:
- DRY applied uniformly rather than contextually

**Rules**:
- Variables used in only one example should be defined inline in that example, not as `let`
- Variables referenced in multiple examples should be extracted to `let`
- Exception: `result = object.method` assignments inside an example to capture a return value for expectations should always remain inline — these are not candidates for `let`
- `before` blocks follow the same logic: a `before` shared across all examples in a context is appropriate; a `before` that is effectively overridden or negated by setup in specific examples is a smell — the per-example setup should be inline instead

**Audit Check**: Flag `let` variables referenced in only one example. Flag repeated inline setup (same `create`/`build` call across multiple examples) that should be a `let`. Flag `before` blocks whose effects are overridden or contradicted in individual examples.

---

## Coverage Requirements by File Type

| File Type | Min Coverage | Test Type |
|-----------|--------------|-----------|
| Model | 90% | Model spec |
| Controller (API/webhook only) | 80% | Request spec |
| Service/PORO | 95% | Unit spec |
| Helper | 100% | Helper spec |
| Mailer | 100% | Mailer spec |
| Job | 90% | Job spec |

---

## Missing Test Detection

For each Ruby file in `app/`:

1. Check for corresponding spec:
   - `app/models/user.rb` → `spec/models/user_spec.rb`
   - `app/controllers/api/registrations_controller.rb` → `spec/controllers/api/registrations_controller_spec.rb` or `spec/api/registrations_controller_spec.rb` or `spec/requests/api/registrations_spec.rb`
     **Exception**: Controllers whose endpoints are accessed via the application UI do **not** require a controller or request spec — their coverage comes from system/feature specs. Only flag missing specs for API-only controllers, webhook receivers, or other endpoints not reachable through the UI.

2. Check public methods are tested:
   - Extract public method names from source
   - Search for those names in spec file

3. Report:
   - Files without any tests → **High** severity (skip this check for UI-facing controllers per the exception above)
   - Files with partial coverage → **Medium** severity

---

## FactoryBot Best Practices

**Good Factory**:
```ruby
factory :link do
  title { "Testing Rails" }
  url { "http://example.com" }
  # Only required fields with sensible defaults
end
```

**Bad Factory**:
```ruby
factory :link do
  title { "Testing Rails" }
  url { "http://example.com" }
  upvotes { 10 }  # Not required
  user  # Creates unnecessary association
  created_at { 1.day.ago }  # Unnecessary
end
```

---

## RSpec Best Practices

**Good Test Structure**:
```ruby
RSpec.describe Link, "#score" do
  it "returns upvotes minus downvotes" do
    link = build(:link, upvotes: 5, downvotes: 2)

    expect(link.score).to eq 3
  end
end
```

**Avoid**:
- Nested contexts more than 2 levels deep
- `it` blocks without clear descriptions
- Multiple expectations per test (usually)
- Testing private methods directly
