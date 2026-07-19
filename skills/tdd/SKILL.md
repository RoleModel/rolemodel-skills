---
name: tdd
description: >
  Test-driven development and testing patterns for Rails applications. Drives
  implementation from tests using an outside-in approach with RSpec, Capybara,
  and FactoryBot. Use when building new features, writing or improving
  tests, adding test coverage, fixing bugs with a test-first workflow, or when
  the user mentions TDD, test-driven, test-first, outside-in, spec plan, RSpec,
  Capybara, system specs, model specs, testing patterns, writing tests, or
  improving test coverage.
compatibility: Requires Ruby on Rails, RSpec, Capybara, and FactoryBot
metadata:
  author: rolemodelsoftware
  version: "2.0"
allowed-tools: Bash(bundle exec rspec:*) Read
---

# TDD Workflow

Drive feature implementation from the outside in: start with what the user sees, work inward to the models and logic, writing a failing test before every piece of implementation.

If asked to implement a feature or fix a bug without tests, write the test first. Always.

## Philosophy

### Outside-in

Start at the outermost seam (system test) and let failures pull you inward. A system test fails because a route is missing. Adding the route fails because the controller action is missing. The controller fails because the model has no scope. At each layer, the failure tells you what to build next. This is the outside-in progression: the tests drive the design rather than the other way around.

### Seams

A seam is the public boundary you test at: the interface where you observe behavior without reaching inside. Before writing tests, identify your seams:

- **System test seam:** the browser. Does the user see the right thing?
- **Model test seam:** the public method or scope. Does it return the right result?
- **Request test seam:** the HTTP response. Does the endpoint do the right thing?

Test at the seam. Don't reach past it into private methods or internal state.

### Tests as documentation

Tests serve two purposes: confidence that the code works, and documentation of what the code does. A well-named describe/context/it structure should read like a specification when run with `--format documentation`. Write test names that express business behavior, not implementation details.

Structure every test with a clear Given/When/Then shape:
- **Given:** the setup (factories, state, preconditions)
- **When:** the action (visit, click, call)
- **Then:** the assertion (expect)

Separate these three sections with blank lines so the structure is visible at a glance.

### DAMP over DRY

Tests should be Descriptive And Meaningful. Duplication across tests is acceptable when it makes each test independently readable. A reader should understand what a test does without scrolling to shared setup or tracing through helper methods. Optimize for clarity, not for removing repetition.

### Vertical slices

Work in vertical slices: one feature, one test, one implementation, then the next. Do not write all your tests first and then implement. That tests imagined behavior instead of actual behavior.

### Anti-patterns

Avoid these:

- **Implementation-coupled tests:** Tests that break during refactoring even though behavior hasn't changed. Test what the code does, not how it does it.
- **Tautological tests:** Assertions that recompute the expected value the same way the code does. If your test duplicates the logic, it can't catch bugs in that logic.
- **Horizontal slicing:** Writing all tests across the whole feature before any implementation. You end up testing a design that doesn't exist yet.

## Process

### 1. Plan the test coverage (the spec plan)

Unless the user provides a spec plan, before writing any code, create one at `docs/plans/<feature>-spec-plan.md`. This is where you decide **what to test and why**. If you've done a BRAVE breakdown, the Brainstorm section is your feature summary and the Approach section tells you which seams to test at.

Start with a **Feature summary** that describes what the user can do and any key constraints. Then organize by spec file and test name, with a checklist of requirements each test verifies.

```markdown
# Feature: Team roster page

## Feature summary

Admins can view a roster of team members showing name, role, and join date. The page shows active members by default. Admins can filter to see archived members. Only admins can access the roster.

## Test coverage

### `spec/system/rosters_spec.rb` (new file)

#### admin views the team roster
- [ ] shows active team members with name, role, and join date
- [ ] does not show archived members by default
- [ ] shows archived members when filter is toggled
- [ ] redirects non-admin users to the dashboard

### `spec/models/member_spec.rb` (modify existing)

#### .active scope
- [ ] returns members who are not archived
- [ ] excludes archived members

#### .by_join_date scope
- [ ] returns members ordered by most recent join date first

## Related specs (regression check)

- `spec/system/dashboard_spec.rb` - navigation links; may need a "Roster" link added
- `spec/models/user_spec.rb` - admin role association
```

Each test should trace back to the feature summary. If a behavior in the summary has no test, add one. If a test doesn't trace back, cut it.

**Stop and let the user review the plan before proceeding.** They may adjust scope, reorder priorities, or cut tests. Only move to step 2 after they confirm.

### 2. Write the first failing test

Write one test. Run it. Confirm it fails for the right reason (missing route, missing method, missing template), not a syntax error or typo.

```bash
bundle exec rspec spec/system/rosters_spec.rb
```

**Stop and let the user review the test before implementing.** They may adjust assertions, rename examples, or restructure the test. When the user continues, re-read the spec file to pick up any changes they made, then proceed to step 3.

### 3. Make it pass

Write the minimum code to make the failing test pass. Follow this loop:

1. **Read the failure message.** What's missing?
2. **If the missing piece has its own testable behavior** (a model scope, a validation, complex logic), write a focused spec for it first. Run it, confirm it fails, implement, confirm it passes.
3. **If the missing piece is mechanical** (a route, a simple controller action, a view template), implement it directly.
4. **Re-run the test.** It should get further. Repeat until green.

After the test passes, briefly summarize what was implemented. Ask the user upfront (during spec plan review) whether they want to review each test and sub-spec before moving on or prefer continuous flow. This applies to both the outer system tests and any focused specs written in the inner loop (step 3.2). Default to a brief checkpoint: "Here's what I implemented to make it pass. Moving to the next test unless you want to adjust."

### 4. Mark progress and continue

After each test passes, check off the requirements in your spec plan (`[x]`). Move to the next test in the plan and repeat steps 2-3.

### 5. Verify completeness

Once all planned tests pass:

1. **Completeness check:** re-read the feature summary. Is every behavior covered by a passing test? If there's a gap, flag it.
2. **Regression check:** run every spec listed in the Related specs section. If any fail, fix the regression before stopping.

```bash
# Run the related specs
bundle exec rspec spec/system/dashboard_spec.rb spec/models/user_spec.rb
```

## Bug fixes: the Prove-It pattern

When fixing a bug, always start with a reproduction test:

1. **Write a test that reproduces the bug.** The test should fail, demonstrating the broken behavior.
2. **Run it and confirm it fails.** If it passes, your test doesn't capture the actual bug and it needs to be rewritten. In that case, consider if you've correctly diagnosed the problem.
3. **Fix the bug.** Write the minimum code to make the test pass.
4. **Run the full suite.** Confirm the fix doesn't break anything else.

## What gets its own spec

Not everything needs a separate test file. Add a lower-level spec only when it tests behavior the system test doesn't adequately cover.

| Layer | Write a spec when... | Skip the spec when... |
|-------|---------------------|-----------------------|
| **Model** | There's a scope, validation, or method with meaningful logic | It's a simple association or delegation |
| **System** | There's a user-visible flow to verify | The behavior is fully covered by a model spec |
| **Request** | There's an API endpoint or controller logic worth testing independently | The controller is a thin wrapper around the model |

## Test execution

```bash
# Run a single spec file
bundle exec rspec spec/models/game_spec.rb

# Run a specific example by line number
bundle exec rspec spec/models/game_spec.rb:24

# Run specs matching a description
bundle exec rspec spec/models/game_spec.rb -e 'for_player'

# Run the full suite (only before committing)
bundle exec rspec
```

Always run the focused spec while developing, not the full suite. Only run broader specs when checking for regressions.

## Spec patterns and conventions

Reference files in this skill's `references/` directory contain examples and conventions. Read the appropriate reference before writing a new spec.

### System specs (`references/system_spec.rb`)

- Test user-visible behavior from the browser
- Use `let!` for records that must exist before the page loads
- Use `within` blocks to scope interactions to specific parts of the page
- After any action (`visit`, `click_on`), expect visible content to confirm the page loaded
- Favor `have_content` and `have_current_path` for assertions
- One test can cover multiple assertions when they're part of the same user flow

### Model specs (`references/model_spec.rb`)

- Use `build` for validation tests (no database writes needed)
- Test scopes with multiple records covering include AND exclude cases
- Use `contain_exactly` for scope assertions (order doesn't matter)
- Test methods by verifying return values
- Skip testing Rails mechanics (associations, enums, delegations)

### RSpec conventions (`references/spec_conventions.md`)

Read this reference for detailed guidance on:
- `let` vs `let!` (lazy vs eager evaluation) with common pitfalls
- Validation testing patterns
- Element selection with `data-testid` and `dom_id`
- Scoping with `within` blocks
- Turbo confirm dialog testing
- FactoryBot conventions
