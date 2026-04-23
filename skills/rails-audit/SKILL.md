---
name: rails-audit
description: Perform comprehensive code audits of Ruby on Rails applications based on thoughtbot best practices. Use this skill when the user requests a code audit, code review, quality assessment, or analysis of a Rails application. The skill analyzes the entire codebase focusing on testing practices (RSpec), security vulnerabilities, code design (skinny controllers, domain models, PORO with ActiveModel), Rails conventions, database optimization, and Ruby best practices. Outputs a detailed markdown audit report grouped by category (Testing, Security, Models, Controllers, Code Design, Views) with severity levels (Critical, High, Medium, Low) within each category.
allowed-tools:
  - Read
  - Grep
  - Glob
compatibility:
  repo: "*"
metadata:
  author: OpenAI
  version: 1.0.0
license: MIT
---

# Rails Audit Skill (thoughtbot Best Practices)

Perform comprehensive Ruby on Rails application audits based on thoughtbot's Ruby Science and Testing Rails best practices, with emphasis on Plain Old Ruby Objects (POROs) over Service Objects.

## Audit Scope

The audit can be run in two modes:
1. **Full Application Audit**: Analyze entire Rails application
2. **Targeted Audit**: Analyze specific files or directories

## Ignore File

Projects may opt out of specific findings by creating `.rails-audit-ignore.yml` at the project root. Each entry identifies a finding by file path + a short description substring. Ignored findings are hidden completely from the report — they do not appear in category sections, executive summary counts, or files-analyzed counts.

Format:

```yaml
# Findings listed here are suppressed from RAILS_AUDIT_REPORT.md.
# Each entry matches when:
#   - the finding's file path contains `file`, AND
#   - the finding's title or details contain `matches` (case-insensitive substring)
# `reason` is documentation only — not used for matching.

ignore:
  - file: app/javascript/controllers/toggle_controller.js
    matches: setTimeout
    reason: Intentional animation hack — deferring to next tick so CSS transition picks up

  - file: db/schema.rb
    matches: long method
    reason: Generated file
```

Matching rules:
- `file` — substring match against the finding's file reference (so `app/javascript/controllers/toggle_controller.js` matches `app/javascript/controllers/toggle_controller.js:12-14`)
- `matches` — case-insensitive substring match against the finding's heading plus details text
- Both must match for a finding to be suppressed
- A missing file is not an error — the audit proceeds as if no ignores exist
- If the file is present but malformed YAML, print a warning and proceed as if it were empty

## Execution Flow

### Step 1: Determine Audit Scope

Ask user or infer from request:
- Full audit: Analyze all of `app/`, `spec/` or `test/`, `config/`, `db/`, `lib/`
- Targeted audit: Analyze specified paths only

### Step 2: Collect Optional Metrics (SimpleCov + RubyCritic)

Ask the user **both questions upfront** in a single `AskUserQuestion` so they can decide once:
- **Question**: "Before starting the audit, would you like to collect automated metrics?\n\n1. **SimpleCov** — runs your test suite to capture actual code coverage percentages\n2. **RubyCritic** — analyzes code complexity, duplication, and smells (does not run tests)\n\nBoth are recommended for the most thorough audit."
- **Options**: "Yes to both (Recommended)" / "SimpleCov only" / "RubyCritic only" / "Skip both"

Based on the user's choice, spawn the accepted subagents **in parallel** using the Task tool. Both can run at the same time because SimpleCov modifies the test helper while RubyCritic only reads source files — they don't conflict.

**SimpleCov subagent** (if accepted):

> Read the file `agents/simplecov_agent.md` and follow all steps described in it. The audit scope is: {{SCOPE from Step 1}}. Return the coverage data in the output format specified in that file.

**RubyCritic subagent** (if accepted):

> Read the file `agents/rubycritic_agent.md` and follow all steps described in it. The audit scope is: {{SCOPE from Step 1}}. Return the code quality data in the output format specified in that file.

**After both agents finish**, clean up:
- If SimpleCov ran: `rm -rf coverage/`
- If RubyCritic ran: `rm -rf tmp/rubycritic/`

**Interpreting responses:**
- `COVERAGE_FAILED` / `RUBYCRITIC_FAILED`: no data for that tool — use estimation mode (SimpleCov) or omit the section (RubyCritic). Note the failure reason in the report.
- `COVERAGE_DATA`: parse and keep in context for Steps 4 and 5 (overall coverage, per-directory breakdowns, lowest-coverage files, zero-coverage files).
- `RUBYCRITIC_DATA`: parse and keep in context for Steps 4 and 5 (overall score, per-directory ratings, worst-rated files, top smells, most complex files).

### Step 3: Load Reference Materials

Before analyzing, read the relevant reference files:
- `references/code_smells.md` - Code smell patterns to identify
- `references/ruby_testing_guidelines.md` - Ruby testing best practices
- `references/javascript_testing_guidelines.md` - Javascript testing best practices
- `references/poro_patterns.md` - PORO and ActiveModel patterns
- `references/security_checklist.md` - Security vulnerability patterns
- `references/rails_antipatterns.md` - Rails-specific antipatterns (external services, migrations, performance)
- `references/stimulus_patterns.md` - Stimulus controller patterns and anti-patterns (betterstimulus.com)
- `references/javascript_code_smells.md` - JavaScript/TypeScript code smells (callback hell, god modules, magic numbers, etc.)
- `references/javascript_antipatterns.md` - JavaScript/TypeScript runtime anti-patterns (memory leaks, eval, innerHTML, layout thrashing, etc.)

### Step 4: Analyze Code by Category

Analyze in this order:

1. **Testing Coverage & Quality**
   - If SimpleCov data was collected in Step 2, use actual coverage percentages instead of estimates
   - Cross-reference per-file SimpleCov data: files with 0% coverage = "missing tests"
   - Check for missing test files
   - Identify untested public methods
   - Review test structure (Four Phase Test)
   - Check for testing antipatterns

2. **Security Vulnerabilities**
   - SQL injection risks
   - Mass assignment vulnerabilities
   - XSS vulnerabilities
   - Authentication/authorization issues
   - Sensitive data exposure

3. **Models & Database**
   - Fat model detection
   - Missing validations
   - N+1 query risks
   - Callback complexity
   - Law of Demeter violations (voyeuristic models)
   - If RubyCritic data was collected, flag models with D/F ratings or high complexity

4. **Controllers**
   - Fat controller detection
   - Business logic in controllers
   - Missing strong parameters
   - Response handling
   - Monolithic controllers (non-RESTful actions, > 7 actions)
   - Bloated sessions (storing objects instead of IDs)
   - If RubyCritic data was collected, flag controllers with D/F ratings or high complexity

5. **Code Design & Architecture**
   - Service Objects → recommend PORO refactoring
   - Large classes
   - Long methods
   - Feature envy
   - Law of Demeter violations
   - Single Responsibility violations
   - If RubyCritic data was collected, cross-reference D/F rated files and high-complexity files with manual code review findings

6. **Views & Presenters**
   - Logic in views (PHPitis)
   - Missing partials for DRY
   - Helper complexity
   - Query logic in views
   - Stimulus controllers: hardcoded classes/selectors, lifecycle misuse, SRP violations (see references/stimulus_patterns.md)
   - Manual event listeners without `disconnect()` cleanup (memory leaks)
   - Page-level god controllers mixing multiple responsibilities

7. **External Services & Error Handling**
   - Fire and forget (missing exception handling for HTTP calls)
   - Sluggish services (missing timeouts, synchronous calls that should be backgrounded)
   - Bare rescue statements
   - Silent failures (save without checking return value)

8. **JavaScript Code Smells** (scan `app/javascript/` and `app/assets/javascripts/`)
   - Callback hell / missing `async`/`await` adoption
   - Unhandled promise rejections (`.then()` without `.catch()`)
   - Implicit type coercion (`==` instead of `===`)
   - `var` usage (should be `const`/`let`)
   - Magic numbers and strings
   - Long functions (> 20 lines), god modules (> 200 lines or > 10 exports)
   - Mutation of function arguments
   - Console statements left in production code, dead/commented-out code
   - See `references/javascript_code_smells.md` for full detection patterns

9. **JavaScript Anti-Patterns** (scan `app/javascript/` and `app/assets/javascripts/`)
   - Global variable pollution (`window.*` assignments)
   - Memory leaks: `addEventListener` without cleanup, uncancelled intervals/observers
   - `eval()` usage (flag Critical)
   - `innerHTML` with unsanitized content (flag Critical; cross-reference security checklist)
   - Layout thrashing (DOM reads/writes interleaved in loops)
   - Swallowed errors (empty or console-only catch blocks)
   - Missing module boundaries (implicit global script-order dependencies)
   - See `references/javascript_antipatterns.md` for full detection patterns

10. **Database & Migrations**
   - Messy migrations (model references, missing down methods)
   - Missing indexes on foreign keys, polymorphic associations, uniqueness validations
   - Performance antipatterns (Ruby iteration vs SQL queries)
   - Bulk operations without transactions

### Step 5: Generate Audit Report

Create `RAILS_AUDIT_REPORT.md` in project root with structure defined in `references/report_template.md`.

When SimpleCov coverage data was collected in Step 2, use the **SimpleCov variant** of the Testing section in the report template. When coverage data is not available, use the **estimation variant**.

When RubyCritic data was collected in Step 2, include the **Code Quality Metrics** section in the report using the RubyCritic variant from the report template. When RubyCritic data is not available, use the **not available variant**.

## Severity Definitions

- **Critical**: Security vulnerabilities, data loss risks, production-breaking issues
- **High**: Performance issues, missing tests for critical paths, major code smells
- **Medium**: Code smells, convention violations, maintainability concerns
- **Low**: Style issues, minor improvements, suggestions

## Key Detection Patterns

### Service Object → PORO Refactoring

When you find classes in `app/services/`:
- Classes named `*Service`, `*Manager`, `*Handler`
- Classes with only `.call` or `.perform` methods
- Recommend: Rename to domain nouns, include `ActiveModel::Model`

### Fat Model Detection

Models with:
- More than 200 lines
- More than 15 public methods
- Multiple unrelated responsibilities
- Recommend: Extract to POROs using composition

### Fat Controller Detection

Controllers with:
- Actions over 15 lines
- Business logic (not request/response handling)
- Multiple instance variable assignments
- Recommend: Extract to form objects or domain models

### Missing Test Detection

For each Ruby file in `app/`:
- Check for corresponding `_spec.rb` or `_test.rb`
- Check for tested public methods
- Report untested files and methods

## Analysis Commands

Use Claude Code's built-in tools instead of shell commands — they're faster, handle permissions correctly, and give better output:

- **Find Ruby files by type**: Use the Glob tool with patterns like `app/models/**/*.rb`, `app/controllers/**/*.rb`, `app/services/**/*.rb`
- **Find test files**: Use Glob with `spec/**/*_spec.rb` or `test/**/*_test.rb`
- **Search for patterns in code**: Use the Grep tool (e.g., search for `rescue\s*$`, `\.save\b`, `params\.permit!`)
- **Read and count lines in files**: Use the Read tool to inspect files; count lines from the output
- **Find long files**: Use Glob to list all `app/**/*.rb` files, then Read each to check line count

## Report Output

Always save the audit report to `RAILS_AUDIT_REPORT.md` in the project root and present it to the user.
