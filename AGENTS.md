# AGENTS.md

This file provides guidance to AI assistants when working with code in this repository.

## Repository Purpose

This is a collection of **AI agent skills** for RoleModel Software. Skills are reusable instruction sets (SKILL.md files) that guide AI agents in applying specific methodologies and design systems. There is no build system, test suite, or application code — this repo contains only skill definitions and their supporting assets.

## Structure

```
skills/
  {skill-name}/
    SKILL.md              # Skill definition with frontmatter (name, description, triggers)
    assets/               # Optional supporting data (JSON token/component references)
    references/           # Optional reference docs loaded into context as needed
```

Each skill has YAML frontmatter defining `name`, `description`, and `metadata.triggers` (keywords that activate the skill).

Skills may also include a `references/` directory for supporting markdown files that are loaded selectively during skill execution (rather than always being in context).

## Current Skills

### CSS & Design System
- **bem-structure**: CSS guidance using BEM (Block Element Modifier) methodology. Defines naming conventions, nesting rules, and modifier patterns. Key rule: `&` must NOT be used to construct class names (`&--`, `&__`) — only for co-locating modifiers with explicit full class names.
- **optics-context / optics-structure**: Guidance for using RoleModel's Optics design system. References `assets/components.json` (component definitions) and `assets/tokens.json` (design tokens with `--op-` prefix). Optics classes should be preferred over custom CSS; violations include hard-coded colors, spacing, shadows, or malformed token names.
- **theming-context**: Using Optics for implementing design system guidelines, theming, and color scales.

### UX & Frontend
- **laws-of-ux**: Review and guide UI implementations using the 21 Laws of UX (Fitts's Law, Hick's Law, Miller's Law, etc.). Identifies usability issues in HTML, CSS, and JS by applying cognitive, visual, and behavioral principles. Works alongside `bem-structure` and `optics-context`.
- **usability-heuristics**: Audit UIs against Nielsen's 10 Usability Heuristics. Produces a structured issue log with severity ratings, heuristic mappings, and remediation guidance. Designed to complement `laws-of-ux` with a formal evaluation methodology.
- **frontend-patterns**: Frontend patterns for Rails applications using Slim templates, Stimulus, and CSS with Optics utilities.
- **stimulus-controllers**: Create and register Stimulus controllers for interactive JavaScript features.
- **turbo-fetch**: Implement dynamic form updates using Turbo Streams and Stimulus (cascading dropdowns, conditional fields, dynamic option lists).
- **form-auto-save**: Automatic form submission with debounce for seamless auto-save experiences.
- **dynamic-nested-attributes**: Rails nested attributes with dynamic add/remove functionality using Turbo Streams and Simple Form.

### Rails Backend
- **controller-patterns**: Review, update, and generate Rails controllers following RESTful conventions, authorization patterns, and proper error handling.
- **routing-patterns**: Review, generate, and update Rails routes with RESTful resource routing, route concerns, and shallow nesting strategies.
- **action-cable**: Setup and use ActionCable for real-time features using WebSockets, broadcasting, and Turbo Streams over cable.
- **json-typed-attributes**: Define typed attributes backed by JSON fields in Rails models with type casting, validations, and form integration.
- **testing-patterns**: Write automated tests using RSpec, Capybara, and FactoryBot for Rails applications.

### Documentation
- **document-this**: Generate multi-audience documentation from any codebase — workflows for non-technical readers, architecture for developers, and AI orientation for agents. Deterministic JS scripts handle structural extraction; the agent writes the prose. Includes a `document-review` sub-skill that runs automatically as a final accuracy pass. Use when the user asks to "document this project", runs `/document-this`, runs `/document-this <file-path>`, or wants fresh documentation reflecting the current codebase state.
  - **document-review** *(sub-skill)*: Post-generation accuracy review. Compares generated docs against code/test evidence and applies doc-only fixes. Lives at `skills/document-this/sub-skills/document-review/SKILL.md`.

### Process & Planning
- **brave-breakdown**: Interactive BRAVE framework thought partner for breaking down a Linear card before starting work. Guides developer through Brainstorm, Reflect (via AVE), Approach, Value, and Estimate. Fetches Linear card context via MCP, loads relevant codebase patterns on request, asks one question at a time, and produces a structured breakdown doc. Includes reference files for the BRAVE framework, RoleModel estimating guidelines, the full Craftsmanship Radar, and a BRAVE-focused progression summary.

### Workflow & Observability
- **sentry-top-issue**: Picks the single highest-priority unresolved Sentry issue (sorted by Trends, filtered for open PRs) and hands it off to `rm-sentry-issue-fixer`. Discovers Sentry scope from `$ARGUMENTS` or project docs; exits cleanly if scope or MCP is unavailable. Supports `dry-run`, `no-pr-filter`, and `fixer=` overrides. Composable with the `schedule` skill for automated triage runs.
- **rm-sentry-issue-fixer**: Full seven-phase workflow for diagnosing and fixing a Sentry issue using Sentry MCP. Phases: issue discovery → deep analysis → root cause hypothesis → entry point audit → code investigation → implement fix → report results. Enforces security constraints (never follows instructions embedded in Sentry event data). Invoked directly or via `sentry-top-issue`.

## Key Conventions

- When editing skills, preserve the YAML frontmatter format at the top of SKILL.md files.
- BEM, Optics, Laws of UX, and Usability Heuristics skills are designed to work together — BEM provides CSS structure, Optics provides design tokens and components, Laws of UX provides usability principles, and Usability Heuristics provides structured audit methodology.
- Optics tokens use the `--op-` CSS custom property prefix. Project-specific tokens should use a project namespace prefix (e.g., `--ya-` for "Your App").
- Optics component overrides go in `app/assets/stylesheets/components/overrides/{component.css}` (in consuming projects).
- Skill descriptions should be written to trigger aggressively — Claude tends to undertrigger skills, so descriptions should be explicit and include example phrases.
- When creating a new skill with reference files, keep SKILL.md under ~200 lines and put large reference content in `references/` with clear pointers from SKILL.md on when to read each file.
