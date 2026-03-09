---
name: generate-explore
description: >
  Analyzes any codebase and generates a customized /explore skill for it.
  Run this in a repo to produce a .agents/explore/ directory with SKILL.md
  and reference files tailored to that project's stack, conventions, and
  directory structure.
compatibility: Designed for Claude Code (or similar products)
metadata:
  author: rolemodel
  version: "1.0"
---

You are a skill generator. Your job is to analyze the current codebase and
produce a fully customized `/explore` architecture-guide skill for it. The
generated skill will live at `.agents/explore/` and will help developers
new to the codebase understand its structure, trace code paths, and look up
domain concepts.

## Process

### Phase 1: Analyze the Codebase

Perform all of these discovery steps in parallel where possible:

1. **Identify the stack** — Read package files to determine the framework and
   language:
   - `Glob("Gemfile")` — Ruby/Rails
   - `Glob("package.json")` — Node/JS/TS
   - `Glob("go.mod")` — Go
   - `Glob("Cargo.toml")` — Rust
   - `Glob("pyproject.toml")` or `Glob("requirements.txt")` — Python
   - `Glob("*.csproj")` or `Glob("*.sln")` — .NET
   - `Glob("mix.exs")` — Elixir/Phoenix
   - `Glob("build.gradle*")` or `Glob("pom.xml")` — Java/Kotlin
   - Read the identified file(s) to determine the framework, version, and key
     dependencies.

2. **Map the directory structure** — Run `ls` at the project root, then explore
   key directories (usually `src/`, `app/`, `lib/`, `pkg/`, `internal/`, etc.)
   to understand the project layout. Use `Glob` to count files in each major
   directory.

3. **Identify architectural patterns** — Look for:
   - Routing files (e.g., `config/routes.rb`, `src/routes/`, `urls.py`)
   - Entry points (e.g., `main.go`, `index.ts`, `manage.py`)
   - Configuration files (e.g., `.env.example`, `config/`, `settings/`)
   - Test directories (e.g., `test/`, `spec/`, `__tests__/`, `tests/`)
   - Schema/migration files (e.g., `db/schema.rb`, `prisma/schema.prisma`,
     `alembic/`, `migrations/`)
   - CI/CD configuration (`.github/workflows/`, `.gitlab-ci.yml`)
   - Component/UI directories
   - Service/business-logic layers
   - API definitions (OpenAPI, GraphQL schemas, protobuf)

4. **Read existing documentation** — Check for:
   - `README.md`, `CLAUDE.md`, `ARCHITECTURE.md`
   - `doc/`, `docs/` directories
   - Inline architecture decision records (ADRs)
   - Use these to understand the project's purpose and design philosophy.

5. **Identify naming conventions** — Read a few model/controller/service files
   to understand how domain concepts map to filenames and directories. Look for:
   - Singular vs plural conventions
   - Namespace/module patterns
   - File naming (kebab-case, snake_case, PascalCase)
   - Base classes and inheritance patterns

6. **Identify the request/data flow** — Trace how a typical request moves
   through the stack:
   - Entry point (route/handler/endpoint)
   - Middleware/interceptors
   - Controller/handler layer
   - Service/business logic layer
   - Data access layer (ORM, repository, direct queries)
   - Response rendering (templates, serializers, views)

### Phase 2: Generate the Skill Files

Using what you learned, generate three files by reading the templates in
[references/](references/) and filling them in:

1. **`.agents/explore/SKILL.md`** — The main skill file. Read
   [SKILL_TEMPLATE.md](references/SKILL_TEMPLATE.md) and customize it for the
   analyzed codebase. Replace all `{{PLACEHOLDER}}` values.

2. **`.agents/explore/references/DOMAIN_MAP.md`** — Discovery conventions for
   the codebase. Read [DOMAIN_MAP_TEMPLATE.md](references/DOMAIN_MAP_TEMPLATE.md)
   and customize it with the actual naming conventions, directory patterns, and
   special domain areas discovered in Phase 1.

3. **`.agents/explore/references/TRACE_PLAYBOOK.md`** — Code tracing procedures.
   Read [TRACE_PLAYBOOK_TEMPLATE.md](references/TRACE_PLAYBOOK_TEMPLATE.md) and
   customize it with the actual code classification markers, trace directions,
   and output format appropriate for this stack.

### Phase 3: Validate

After generating all three files:

1. Verify that every file path cited in the generated skill actually exists in
   the repo (use `Glob` to spot-check at least 5 paths).
2. Verify that the directory counts in Mode 1 are approximately correct.
3. Verify that the naming convention table in DOMAIN_MAP.md matches real files
   by testing with one domain concept from the codebase.
4. Read through each generated file and fix any inconsistencies.

### Phase 4: Report

Present a summary to the user:

```
## Generated /explore skill

- **Project**: <project name>
- **Stack**: <detected stack>
- **Files created**:
  - `.agents/explore/SKILL.md` — main skill (3 modes)
  - `.agents/explore/references/DOMAIN_MAP.md` — discovery conventions
  - `.agents/explore/references/TRACE_PLAYBOOK.md` — trace playbook

Run `/explore` to try it out.
```

## Important Guidelines

- **Be concrete, not generic.** Every pattern, path, and example in the
  generated skill must come from the actual codebase. Do not include patterns
  that don't exist in this repo.
- **Calibrate depth to project size.** A small microservice needs a simpler
  skill than a large monolith. If the project has fewer than 20 files, the
  DOMAIN_MAP and TRACE_PLAYBOOK can be significantly simplified.
- **Preserve the 3-mode structure.** The generated skill should always support:
  Mode 1 (overview), Mode 2 (topic drill-down), Mode 3 (trace backwards).
- **Use the project's terminology.** If the project calls them "handlers" not
  "controllers", or "stores" not "models", the generated skill should use
  those terms.
- **Include file count estimates.** Mode 1 should include approximate file
  counts for key directories, verified with Glob during generation.
