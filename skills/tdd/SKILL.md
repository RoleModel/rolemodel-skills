---
name: tdd
description: Test-driven development workflow for Rails features. Drives implementation from tests through models, controllers, and views. Use when building new features, adding functionality, or when the user asks to work in TDD style.
compatibility: Requires Ruby on Rails, RSpec, Capybara, and FactoryBot
metadata:
  author: rolemodelsoftware
  version: "1.0"
allowed-tools: Bash(bundle exec rspec:*) Read
---

# TDD Workflow

Drive feature implementation using the red-green loop: write a failing test, write the minimum code to make it pass, then move to the next slice.

## Philosophy

Tests verify **behavior**, not implementation. A good test answers "does this work?" not "does this method exist?" If a test breaks when you refactor internals without changing behavior, it's testing the wrong thing.

### Seams

A seam is the public boundary you test at: the interface where you observe behavior without reaching inside. Before writing tests, identify your seams:

- **System test seam:** the browser. Does the user see the right thing?
- **Model test seam:** the public method or scope. Does it return the right result?
- **Request test seam:** the HTTP response. Does the endpoint do the right thing?

Test at the seam. Don't reach past it into private methods or internal state.

### Vertical Slices

Work in vertical slices: one feature, one test, one implementation, then the next. Do not write all your tests first and then implement. That tests imagined behavior instead of actual behavior.

### Anti-Patterns

Avoid these:

- **Implementation-coupled tests:** Tests that break during refactoring even though behavior hasn't changed. Test what the code does, not how it does it.
- **Tautological tests:** Assertions that recompute the expected value the same way the code does. If your test duplicates the logic, it can't catch bugs in that logic.
- **Horizontal slicing:** Writing all tests across the whole feature before any implementation. You end up testing a design that doesn't exist yet.

## Process

### 1. Plan the test coverage (the spec plan)

Before writing any code, create a spec plan at `docs/plans/<feature>-spec-plan.md`. This is where you (the student) decide **what to test and why**. The AI helps you write the test code, but you own the plan.

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

**Stop and let the user review the plan before proceeding.** They may adjust scope, reorder priorities, or cut tests.

### 2. Write the first failing test

Write one test. Run it. Confirm it fails for the right reason (missing route, missing method, missing template), not a syntax error or typo.

```bash
bundle exec rspec spec/system/game_histories_spec.rb
```

**Stop and let the user review the test before implementing.**

### 3. Make it pass

Write the minimum code to make the failing test pass. Follow this loop:

1. **Read the failure message.** What's missing?
2. **If the missing piece has its own testable behavior** (a model scope, a validation, complex logic), write a focused spec for it first. Run it, confirm it fails, implement, confirm it passes.
3. **If the missing piece is mechanical** (a route, a simple controller action, a view template), implement it directly.
4. **Re-run the test.** It should get further. Repeat until green.

### 4. Mark progress and continue

After each test passes, check off the requirements in your spec plan (`[x]`). Move to the next test in the plan and repeat steps 2-3.

### 5. Verify completeness

Once all planned tests pass:

1. **Completeness check:** re-read the feature summary. Is every behavior covered by a passing test? If there's a gap, flag it.
2. **Regression check:** run every spec listed in the Related specs section. If any fail, fix the regression before stopping.

```bash
# Run the related specs
bundle exec rspec spec/system/dashboard_spec.rb spec/models/player_spec.rb
```

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

## Spec patterns

Reference files in this skill's `references/` directory contain examples of each spec type. Read the appropriate reference before writing a new spec.

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
