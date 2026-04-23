## Explore

1. Read `TERMINOLOGY.md` from the project root (if it exists). Match the user's input against known terms, acronyms, and aliases. If the term is ambiguous between multiple concepts, ask the user a single focused question to disambiguate before continuing.

2. Read `ARCHITECTURE.md` from the project root (if it exists). Use it to identify the primary models, services, controllers, views, or other layers related to the resolved term.

3. If neither file exists, use `grep`, `find`, and Rails conventions to locate relevant files from the resolved term name.

4. Do a focused exploration of the key files you've identified — be surgical. For a Pamphlet you may only need the model and one service. For a Novel you'll need the full stack: data model, services, controller/view layer, background jobs, integrations, and non-obvious logic branches.

---

## Output

Apply the **Output Format Rules** from SKILL.md (size, formatting constraints, file references). Omit sections that don't apply. Then follow this content structure per level:

Start by naming the resolved term so the user immediately knows what you're explaining. For **Novella** and **Novel**, use the resolved term name as a heading. For **Pamphlet**, do not use a heading; instead, begin the opening paragraph with the resolved term name.

**If agent-triggered** (input began with `depth:`), skip all sections below and return this structured block instead:

```
WHAT: one-sentence definition using correct model/class names
WHERE: key file paths (model, service, controller, etc.)
HOW: brief description of the core flow or logic
CONNECTS TO: comma-separated list of related models or concepts
```

For `depth:novella` or `depth:novel`, expand each field to a short paragraph and add:

```
DATA MODEL: key attributes and associations (column names, foreign keys, enums)
```

---

**Pamphlet** — Answer "what is this and why does it exist?" Audience: a non-technical stakeholder or new team member on their first day.

**Novella** — Give a developer a working mental model. Cover the main moving parts (key models, services, flows) without going deep on implementation.

**Novel** — A comprehensive technical walkthrough using headings (e.g. Data Model, Business Logic, API/Controller Layer, Views, Background Jobs, External Integrations, Key Decisions, Key Gotchas). Always include a **Key Decisions** section when meaningful design choices are present — explain *why* things were built the way they were, not just *how*. Look for signals in comments, naming conventions, environment guards, and non-obvious logic branches.
