---
name: document-this
description: Generate multi-audience documentation from any codebase — workflows for non-technical readers, architecture for developers, and AI orientation for agents. Deterministic JS scripts handle structural extraction; The agent writes the prose. Project-agnostic and self-orienting. Use when the user asks to "document this project", runs `/document-this`, runs `/document-this <file-path>`, or wants fresh documentation reflecting the current codebase state.
---

# /document-this

## Overview

Generates documentation across three audiences from one codebase:

- **Non-technical readers** — what the system does, in plain English, organized as user workflows backed by tests
- **Developers** — where things are, how they're structured, what patterns are in play
- **AI agents** — fastest path to useful context: entry points, test coverage map, known gaps, glossary

Scripts handle everything deterministic (directory structure, entity listing, test categorization). The agent handles everything that requires interpretation (prose, pattern recognition, workflow narratives).

---

## Invocation

```
/document-this                  # Full project documentation
/document-this <file-path>      # Targeted update of affected sections only
```

---

## Output

```
generated-docs/
├── README.md               # Navigation hub: project summary + links to all docs
├── workflows.md            # Non-technical: user-facing workflows from system/integration tests
├── architecture.md         # Developer: stack, directory map, data model, patterns & conventions
├── ai-orientation.md       # AI agents: entry points, coverage map, known gaps, glossary
└── diagrams/
    ├── data-model.mmd      # Key entities + relationships (Mermaid erDiagram)
    └── architecture.mmd    # High-level component/module map (Mermaid graph TD)
```

Regenerating overwrites previous output. The developer can use `git diff generated-docs/` to review changes.

If `generated-docs/` does not exist, create it.

---

## Scripts

All scripts live under `scripts/` in this skill and emit **JSON on stdout**. Invoke them with `node` from the project root:

| Script | Purpose | Key Output Fields |
|---|---|---|
| `fingerprint.mjs` | Language, framework, DB, dep files, config files, project name | `language`, `database`, `configFiles`, `testLayouts` |
| `front_matter.mjs` | Current date + project name | `date`, `projectName` |
| `directory_tree.mjs [--depth N]` | Pruned directory tree honoring `.gitignore` | `tree` |
| `tech_stack.mjs` | Parsed dependency listing per ecosystem | `ecosystems` |
| `test_inventory.mjs` | Test files grouped by system / integration / unit | `files`, `summary` |
| `entities.mjs` | Model/entity definitions across any framework | `sources`, `schemaFiles` |
| `entry_points.mjs` | Routes, controllers, service layer directories | `routes`, `controllers`, `services` |

**Invocation from project root:**

```bash
node .agents/skills/document-this/scripts/fingerprint.mjs
node .agents/skills/document-this/scripts/front_matter.mjs
node .agents/skills/document-this/scripts/directory_tree.mjs --depth 3
node .agents/skills/document-this/scripts/tech_stack.mjs
node .agents/skills/document-this/scripts/test_inventory.mjs
node .agents/skills/document-this/scripts/entities.mjs
node .agents/skills/document-this/scripts/entry_points.mjs
```

**Fallback rule:** if `node` is not available on PATH, do not error — fall back to agent-driven extraction using Read, Glob, and Grep for the same purposes. Scripts are an optimization, not a hard dependency.

---

## Templates

Under `templates/`. Each is a markdown scaffold with `{{PLACEHOLDER}}` tokens the agent fills:

- `README.template.md` — navigation hub linking all generated files.
- `workflows.template.md` — top-level scaffold for `workflows.md`.
- `workflow-entry.template.md` — one per workflow in the Workflows section.
- `architecture.template.md` — the Architecture section with explicit placeholders for stack, directory map, data model, patterns, optional JS architecture, and diagrams.
- `ai-orientation.template.md` — entry points, test coverage map (well-tested / undertested split), known gaps, glossary.

---

## Generation Process (full)

Execute in this order. Each step's output informs the next. Each phase can stand alone — you don't need to complete all phases in one run.

### Phase 1 — Project Fingerprint

Run the fingerprint and tree scripts to orient yourself:

```bash
node .agents/skills/document-this/scripts/fingerprint.mjs
node .agents/skills/document-this/scripts/directory_tree.mjs --depth 3
```

From the output, derive — **do not assume**:
- Language and framework
- Test framework and where tests live
- Database(s) in use
- Major areas of the codebase
- What domain the project is in

Also read the README if one was detected.

### Phase 2 — Workflow Discovery → `workflows.md`

**Goal:** Document every user-facing workflow in plain English, for a non-technical reader.

**Discovery mechanism:** Start from system/end-to-end and integration tests, not routes or controllers. Tests are human-authored descriptions of complete user interactions.

```bash
node .agents/skills/document-this/scripts/test_inventory.mjs
```

Then:
1. Read each system/integration test file to identify workflows
2. Trace into source code only as needed to fill in details tests don't make explicit (validation rules, supported formats, role-based access)
3. Write each workflow using `templates/workflow-entry.template.md`
4. Group workflows logically by role or feature area
5. For 2–3 headline workflows (highest centrality or test count), add an inline `sequenceDiagram` mermaid block

**Persona filter:** Write as if the reader is a non-technical manager or end user. Do not assume they know what "modal", "CRUD", or "API" means.

**Inclusion rule:** Only document a workflow if backed by at least one system or integration test. If a workflow appears in code but has no test coverage, note it in Known Gaps instead.

**No-tests case:** if the project has zero system and integration tests, put a prominent note at the top of `workflows.md` using the `{{#if NO_SYSTEM_TESTS}}` block in the template.

### Phase 3 — Architecture Analysis → `architecture.md` + `diagrams/`

**Goal:** Give a developer enough orientation to understand the codebase in under 5 minutes.

```bash
node .agents/skills/document-this/scripts/tech_stack.mjs
node .agents/skills/document-this/scripts/directory_tree.mjs --depth 3
node .agents/skills/document-this/scripts/entities.mjs
node .agents/skills/document-this/scripts/entry_points.mjs
```

Cover these five things — keep each concise (not exhaustive documentation, just orientation):

1. **Stack & key dependencies** — language, framework, database, notable libraries worth knowing
2. **Directory map** — what lives where and why, one sentence per major folder
3. **Data model summary** — key entities and their relationships; do not enumerate every field
4. **Patterns & conventions** — e.g. "business logic lives in service objects", "controllers stay thin"
5. **JavaScript architecture** *(optional)* — include only if the project has significant JS: React/Vue/Angular component structure, state management, Stimulus or Alpine controllers, build/chunk strategy, Node.js services. Derive this from Glob/Grep — look for `components/`, `controllers/`, `src/`, etc.

Then create the Mermaid diagram files with extreme detail and precision:
- `diagrams/data-model.mmd` — entity relationships (`erDiagram` syntax), derived from `entities.mjs` output and schema files
- `diagrams/architecture.mmd` — high-level module/layer map (`graph TD` syntax), derived from `entry_points.mjs` and directory tree

### Phase 4 — AI Orientation → `ai-orientation.md`

**Goal:** Give an agent the fastest possible path to useful context without duplicating what's in `architecture.md`.

Open with:
> For stack, directory structure, data model, and conventions — see [Architecture](./architecture.md).

Then include exactly these four things:

1. **Entry points map** — for each major area of the codebase, the single best file to start reading (use `entry_points.mjs` output)
2. **Test coverage map** — split into "use tests as ground truth in" vs "read implementation code directly for" (derived from Phase 2 decisions and `test_inventory.mjs`)
3. **Known Gaps & Uncertainties** — things that couldn't be determined confidently during generation. Flag explicitly so future agents or developers know where to dig
4. **Terminology / Glossary** — project-specific terms, domain language, abbreviations, non-obvious naming conventions

### Phase 5 — README → `README.md`

Write a brief navigation document:
- One paragraph: what the project is and who uses it
- Links to `workflows.md`, `architecture.md`, `ai-orientation.md`, and the diagrams
- Generation timestamp and auto-generated warning (use `templates/README.template.md`)

---

## Targeted Update: `/document-this <file-path>`

When called with a path, do not regenerate the whole document. Instead:

1. Identify which sections the file is most likely to affect:
   - Test files → `workflows.md` + test coverage map in `ai-orientation.md`
   - Entity/model files → `architecture.md` (data model) + `diagrams/data-model.mmd` + possibly Terminology
   - Service/controller files → `architecture.md` (patterns) + possibly `workflows.md`
   - Config/dependency files → `architecture.md` (stack)
   - JavaScript/TypeScript files → `architecture.md` (JS Architecture section) + possibly `diagrams/architecture.mmd`

2. Re-run only the relevant scripts

3. Regenerate only the affected sections

4. **Ripple check:** After updating, scan other sections for cross-references or dependent content that is now stale. Update those too if needed.

5. Do not regenerate the entire document unless the file affects all sections.

---

## Quality Rules

- **Never invent workflows.** Only document what is evidenced by tests or source code.
- **Never duplicate content between sections.** If something belongs in Architecture, reference it from AI Orientation rather than restating it.
- **Plain English in Workflows.** Save technical language for Architecture and AI Orientation.
- **No system tests = say so.** Note this prominently at the top of `workflows.md`. Do not fabricate workflows from routes or controllers alone.
- **Keep Architecture scannable.** Short paragraphs or brief lists — not walls of text.
- **Flag uncertainty explicitly.** Use Known Gaps rather than guessing.
- **Don't assume framework.** Derive everything from what you find in the project.
- **When scripts disagree with disk, trust disk.** Update Known Gaps with the discrepancy.
