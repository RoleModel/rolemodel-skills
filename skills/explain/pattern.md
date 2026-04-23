## Explore

Use this playbook when the user is asking about a recurring *pattern* in the codebase — a convention, idiom, or shared approach that shows up in multiple places — rather than a single feature or term. Examples: "how are service objects structured here", "explain the policy pattern", "how do we handle form objects", "what's the convention for background jobs", "how are Stimulus controllers wired up".

The goal is to describe the pattern itself (structure, why), then ground it in real examples from this codebase.

### Identify the pattern

1. Read `TERMINOLOGY.md` and `ARCHITECTURE.md` from the project root (if they exist) to see if the pattern is named or described there.

2. If the pattern maps to a conventional directory (e.g. `app/services/`, `app/policies/`, `app/queries/`, `app/presenters/`, `app/decorators/`, `app/javascript/controllers/`, `spec/factories/`), list that directory to get a feel for scale and naming.

### Find representative examples

Pick **2–4 real instances** that best illustrate the pattern. Prefer:
- A simple, canonical example that shows the happy path
- A more complex example that shows how the pattern scales or bends
- Avoid outliers unless the user specifically asked about edge cases

Read those files closely. Look for:
- **Structure** — method signatures, return types, naming conventions, file layout
- **Dependencies** — what the pattern relies on (base classes, concerns, gems, parent objects)
- **Variations** — where instances diverge from the norm and why
- **Tests** — how this pattern is typically tested; pair each example with its spec if relevant

### Detect anti-patterns and drift

Briefly scan for instances that violate the pattern. If there's meaningful drift (old style vs new style, inconsistent naming, partial migrations), note it — the user likely wants to know which version to follow for new code.

---

## Output

Apply the **Output Format Rules** from SKILL.md (size, formatting constraints, file references). Omit sections that don't apply. Then follow this content structure per level:

For **Novella** and **Novel**, use the pattern name as a heading. For **Pamphlet**, do not use a heading; instead, begin with the pattern name inline in the opening sentence.

**If agent-triggered** (input began with `depth:`), skip all sections below and return this structured block instead:

```
WHAT: one-sentence description of the pattern and what problem it solves
WHERE: directory and naming convention (e.g. app/services/, *_service.rb)
HOW: the canonical structure — method signatures, return conventions, key dependencies
CONNECTS TO: comma-separated list of related patterns
```

For `depth:novella` or `depth:novel`, expand each field to a short paragraph and add:

```
DATA MODEL: n/a (or note base classes, concerns, or gems the pattern depends on)
EXAMPLES: 2–3 real file paths that best illustrate the pattern
```

---

**Pamphlet** — Name the pattern, say where it lives, and give the core rule in simple language. No examples, no file listings.

**Novella** — Cover:
- What the pattern is and what problem it solves
- The core structure (method names, return conventions, file location)
- One short example referenced by path (no full code block needed)
- Where the canonical rules are documented (instruction file, architecture doc)

**Novel** — A comprehensive walkthrough using these sections:
- **Overview** — the pattern in one paragraph, including *why* the codebase uses it
- **Structure** — the canonical structure: file location, naming, method signatures, expected inputs/outputs, testing conventions. Cite the instruction file if one exists.
- **Examples** — 2–4 real instances with `file:line_number` references. For each, a one-line summary of what it does and what it illustrates about the pattern. Include small code excerpts only when they clarify the shape.
- **Variations & Drift** — where instances diverge, and which variant is the current standard for new code
- **Implementation** — a short checklist for applying the pattern to a new case (file to create, spec to write, things to wire up)
- **Key Decisions** — non-obvious design choices: why this pattern over alternatives, constraints it enforces, gotchas to avoid
- **Related Patterns** — adjacent patterns the user should know about (e.g. services vs queries vs presenters). This should NOT be simply related files but other patterns that are adjacent or cover similar problems.
