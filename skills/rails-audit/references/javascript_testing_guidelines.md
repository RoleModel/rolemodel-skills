# Testing Guidelines Reference (JavaScript)

## Test Suite Quality Characteristics

An effective test suite is:
- **Fast**: Most tests run in seconds and provide quick feedback
- **Complete**: Critical user journeys and public module APIs are covered
- **Reliable**: No flaky tests or order-dependent behavior
- **Isolated**: Tests control their own state, time, network, and randomness
- **Maintainable**: Easy to update when behavior changes
- **Expressive**: Tests read like executable documentation

---

## Testing Pyramid

Structure your test suite as a pyramid:
- **Base**: Many fast unit tests (pure functions, utilities, hooks, small modules)
- **Middle**: Some integration/component tests (module boundaries, UI + state + API contracts)
- **Top**: A small number of boundary-focused integration tests for high-risk interactions

---

## Test Types Coverage Requirements

### Component/Integration Tests (React/Vue/Svelte + Testing Library)
**Required Coverage**:
- Component behavior driven by props/state/user interactions
- Conditional rendering branches
- Integration with routing, stores, and API boundaries (mocked at network boundary)

**Audit Checks**:
- [ ] Components with non-trivial logic have tests
- [ ] Accessibility queries (`getByRole`, labels, names) are preferred over brittle selectors
- [ ] Loading, empty, success, and error states are covered
- [ ] Interaction tests assert user-visible outcomes, not internals

### API/Server Integration Tests (Node/Express/Fastify/Nest)
**Required Coverage**:
- Authorization/authentication checks
- Request validation and error handling
- Response shapes and status codes

**Use When**:
- Endpoint behavior is consumed externally or by multiple clients
- Business rules span middleware, controllers, and persistence layers

### Unit Tests (Modules, Utilities, Domain Logic)
**Required Coverage**:
- Public exported functions/classes
- Validation and boundary conditions
- Error branches and edge cases

**Audit Checks**:
- [ ] Each core module has a corresponding test file
- [ ] Business logic has unit tests independent of UI
- [ ] Edge cases and invalid inputs are covered
- [ ] Floating-point/date/time logic has explicit assertions

---

## Given/When/Then Test Pattern

Every test should follow the Given/When/Then structure. Shared setup across multiple tests belongs in reusable helpers or `beforeEach`; setup used once should stay inside the test.

```javascript
describe("formatFullName", () => {
  // Given
  const user = { firstName: "John", lastName: "Doe" };

  it("returns the user's full name", () => {
    // When
    const result = formatFullName(user);

    // Then
    expect(result).toBe("John Doe");
  });
});
```

- **Given**: Test data and preconditions (builders/factories/fixtures local to the spec)
- **When**: The action under test
- **Then**: Assertions on observable behavior

**Audit Check**: Tests should clearly separate setup, action, and assertion phases. Shared setup should be reused intentionally; one-off setup should remain inline.

---

## Testing Antipatterns to Flag

### 1. Slow Tests

**Symptoms**:
- Local test runs are too slow to run frequently
- Developers skip running the suite before commits

**Causes**:
- Too many high-level integration tests for low-level logic
- Over-mocking with heavy setup in every test
- Unnecessary real network/database usage

**Audit Check**: Flag suites where the median unit test runtime is high and integration tests dominate total runtime.

### 2. Flaky Tests

**Symptoms**:
- Non-deterministic failures in CI
- Retries hide real instability

**Causes**:
- Reliance on `setTimeout`/fixed waits
- Shared mutable state across tests
- Uncontrolled timers, random values, or clock drift

**Audit Check**: Flag `sleep`, arbitrary waits, and missing fake timer cleanup.

### 3. Brittle UI Tests

**Symptoms**:
- Tests break on harmless DOM refactors
- Frequent selector maintenance

**Causes**:
- Overuse of CSS selectors and test IDs for user-facing assertions
- Assertions tied to implementation details

**Audit Check**: Flag heavy `querySelector` usage when semantic queries are available.

### 4. Over-Mocking

**Symptoms**:
- Tests pass while real integration is broken
- Refactors require rewriting many mocks

**Causes**:
- Mocking internals instead of boundaries
- Stubbing the same module under test

**Audit Check**: Flag tests that mock sibling/private internals instead of external boundaries (network, time, third-party SDKs).

### 5. Shared State Leakage

**Symptoms**:
- Order-dependent failures
- Test results differ when run alone vs full suite

**Causes**:
- Globals not reset
- Persistent spies/mocks not restored
- Test data mutation shared across examples

**Audit Check**: Flag missing `afterEach` cleanup (`vi.restoreAllMocks()`/`jest.restoreAllMocks()`, DOM cleanup, storage reset).

### 6. False Positives

**Symptoms**:
- Test passes without proving behavior
- Assertions are too broad to catch regressions

**Causes**:
- Assertions like "contains text" with weak expectations
- No assertion on side effects or outputs

**Audit Check**: Flag tests with no meaningful expectations or overly permissive assertions.

### 7. Snapshot Abuse

**Symptoms**:
- Large snapshots updated blindly
- Regressions slip through snapshot churn

**Causes**:
- Snapshotting full trees for dynamic components
- Missing targeted behavioral assertions

**Audit Check**: Flag large snapshots without companion behavioral checks.

### 8. Duplicate Setup

**Symptoms**:
- Repeated object creation and mock wiring
- Hard-to-maintain copy/paste tests

**Causes**:
- No test builders/factories
- Missed extraction of shared setup

**Audit Check**: Flag repeated setup blocks that should be helpers/builders.

### 9. Factory/Fixture Bloat

**Symptoms**:
- Fixtures include unrelated fields and nested objects
- Tests depend on accidental defaults

**Causes**:
- "Kitchen sink" factories
- Lack of focused builders per domain concept

**Audit Check**: Flag fixtures/builders with unnecessary defaults and deep object graphs.

### 10. Async Misuse

**Symptoms**:
- Assertions run before behavior completes
- Promise rejections are swallowed

**Causes**:
- Missing `await` on async actions
- Not waiting for UI to settle (`findBy*`, `waitFor`)

**Audit Check**: Flag async tests without awaited expectations and unhandled promise warnings.

---

## Coverage Requirements by File Type

| File Type | Min Coverage | Test Type |
|-----------|--------------|-----------|
| Utilities / Pure functions | 95% | Unit tests |
| Domain services / business logic | 95% | Unit + integration tests |
| API handlers/controllers | 90% | Integration tests |
| UI components with logic | 85% | Component tests |
| Hooks/composables | 90% | Unit/component tests |

---

## Missing Test Detection

For each JavaScript/TypeScript file in `src/` (or `app/javascript/`):

1. Check for corresponding test file:
   - `src/utils/date.ts` -> `src/utils/date.test.ts`
   - `src/components/UserCard.tsx` -> `src/components/UserCard.test.tsx`
   - `src/api/users.ts` -> `src/api/users.test.ts`

2. Check public exports are tested:
   - Extract named/default exports
   - Search for behavior-oriented tests covering each export

3. Check critical branches are tested:
   - Success, failure, empty, and permission/validation states

4. Report:
   - Files without any tests -> **High** severity
   - Files with partial path/branch coverage -> **Medium** severity

---

## Test Data Best Practices

**Good Test Builder**:
```javascript
const buildUser = (overrides = {}) => ({
  id: "user-1",
  email: "test@example.com",
  role: "member",
  ...overrides,
});
```

**Bad Fixture Pattern**:
```javascript
const userFixture = {
  id: "user-1",
  email: "test@example.com",
  role: "member",
  profile: { /* large nested object not needed for this test */ },
  permissions: [/* unrelated defaults */],
  createdAt: "2020-01-01T00:00:00.000Z",
};
```

**Rules**:
- Keep data minimal and explicit for the behavior under test
- Prefer per-domain builders over global mega-fixtures
- Override only fields needed by a specific example

---

## Framework Best Practices (Jest/Vitest/Testing Library)

### Jest/Vitest
- Prefer behavior assertions over implementation details
- Mock only external boundaries (network, time, third-party SDKs)
- Reset/restore spies and mocks between tests
- Use fake timers deliberately and always restore real timers

### Testing Library
- Query like a user (`getByRole`, `getByLabelText`, `findByRole`)
- Use `userEvent` over low-level event dispatch where possible
- Assert accessibility-relevant behavior and visible outcomes

### API Mocking (MSW/Nock/etc.)
- Mock at HTTP boundary, not internal function boundaries
- Assert both request intent (method/path/payload) and response handling
- Include unhappy paths (timeouts, 4xx/5xx, malformed payloads)

---

## JavaScript Test Review Checklist

- [ ] Critical user journeys are covered by integration/component tests
- [ ] Core business logic is covered by fast unit tests
- [ ] Component tests assert user-observable behavior, not internals
- [ ] API tests cover auth, validation, and error handling
- [ ] Async tests correctly await outcomes and clean up side effects
- [ ] Test data setup is minimal, explicit, and maintainable

````

