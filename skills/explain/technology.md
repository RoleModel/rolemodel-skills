## Explore

Use this playbook when the user is asking about a specific library, gem, npm package, framework feature, or external service used in the app — what it is, why we use it, and how it's wired up here. Examples: "how does Pundit work in this app", "how are we using StimulusJS", "explain how Turbo is set up", "what is Action Policy doing here", "how is Harvest integrated".

The goal is to give a general understanding of what the technology is (from its own documentation), then pivot to how this codebase specifically uses it.

### Step 1: Identify the technology

Extract the library/gem/package name from the user's question. If ambiguous (e.g. "how does our auth work"), find what gem or library backs the feature before proceeding.

### Step 2: Fetch documentation

Search for and read the library's official documentation:

1. Use `WebSearch` to find the official docs site or README (e.g. `"Pundit gem documentation"`, `"turbo-rails README"`). Prefer the official site, GitHub repo README, or rubygems/npmjs pages over third-party articles.
2. Use `WebFetch` to read the most relevant page — aim for the overview, README, or "how it works" section rather than a specific API reference.

If docs are unavailable or inaccessible, fall back to what you know from training — note that you're doing so.

### Step 3: Locate it in the codebase

Search for evidence of setup and usage. The right places to look depend on the stack — use the signals below:

**Dependency manifest** — confirm the library is present and note the version:
- Ruby/Rails: `Gemfile` / `Gemfile.lock`
- Node/JS: `package.json` / `yarn.lock` / `package-lock.json`
- Python: `requirements.txt`, `pyproject.toml`, `Pipfile`
- PHP/Laravel: `composer.json`
- Go: `go.mod`
- Rust: `Cargo.toml`

**Initialization & configuration** — where the library is wired up at startup:
- Rails: `config/initializers/`, `config/application.rb`, `app/controllers/application_controller.rb`
- Django: `settings.py`, `apps.py`, `urls.py`
- Laravel: `config/`, `app/Providers/`
- Express/Node: `app.js`, `server.js`, `src/index.ts`, middleware directories
- Generic: any bootstrap/startup file at the project root or in a `config/` directory

**Relevant source directories** — where the library's abstractions live in this app. Infer from the library's conventions (e.g. policy classes, controller plugins, middleware, decorators) and the project's directory structure — don't assume Rails-style paths.

**Grep for usage** — search for the library's key identifiers: class names it exports, module includes, decorators, method calls, or import statements. Use the library's own documentation to know what to search for.

**Tests** — look for test helpers, fixtures, or shared examples that exercise the library. Location varies by stack (`spec/`, `test/`, `__tests__/`, `tests/`).

### Step 4: Find representative examples

Pick **2–4 real uses** that show how the library is exercised in this app. Prefer:
- The configuration/setup file
- A simple, canonical usage that shows the happy path
- A more complex or non-obvious usage that shows how the app bends or extends the library

---

## Output

Apply the **Output Format Rules** from SKILL.md (size, formatting constraints, file references). Omit sections that don't apply. Then follow this content structure per level:

For **Novella** and **Novel**, use the technology name as a heading. For **Pamphlet**, do not use a heading; instead, begin with the technology name inline in the opening sentence.

**If agent-triggered** (input began with `depth:`), skip all sections below and return this structured block instead:

```
WHAT: one-sentence description of what the library does
WHERE: key setup/config paths and primary usage directories
HOW: brief description of how the app uses it (the integration approach)
CONNECTS TO: comma-separated list of related libraries, patterns, or concepts
```

For `depth:novella` or `depth:novel`, expand each field to a short paragraph and add:

```
CONFIGURATION: how the library is initialized or configured in this app
USAGE PATTERN: the canonical way the library is called in this codebase
```

---

**Pamphlet** — One sentence on what the library does in general, one sentence on how and where this app uses it.

**Novella** — Cover:
- **Overview** — what the library does and what problem it solves (from docs)
- **Usage** — how it's integrated here: configuration, key files, and the primary usage pattern
- **Examples** — 1–2 files that give the clearest picture of the integration

**Novel** — A comprehensive walkthrough using these sections:
- **Overview** — what the library does and why it exists (from docs, 2–3 sentences)
- **Why we use it** — what problem it's solving in this app and why this library was chosen (if inferrable)
- **Setup & Configuration** — how it's installed and configured: dependency manifest entry (Gemfile, package.json, requirements.txt, etc.), version, and any initialization or application-level config
- **Integration Points** — where and how the library shows up in the codebase; use a table if there are multiple distinct integration points (e.g. base class include, per-controller usage, view helpers)
- **Examples** — 2–4 real instances with clickable `[file:line](path/to/file#Lline)` references; one-line summary of what each shows about how the library is being used; small code excerpts only when they clarify the shape
- **Key Decisions & Gotchas** — non-obvious configuration choices, places where the app extends or customizes the library, known limitations or things to watch out for
- **Related Technologies** — other libraries, patterns, or parts of the stack that interact with this one

For the follow-up block, add one technology-specific suggestion — e.g. seeing how errors from this library are handled, exploring a related library it integrates with, or finding the tests that exercise this integration.
