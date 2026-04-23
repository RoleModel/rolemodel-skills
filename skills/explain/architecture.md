## Explore

### Framework Detection

Detect the project type before exploring. Check these signals in parallel:

| Framework      | Detection Signal |
|----------------|-----------------|
| Rails          | `Gemfile` contains `rails`; has `app/`, `db/schema.rb` |
| Django         | `requirements.txt` or `pyproject.toml` contains `django`; has `migrations/` dirs |
| FastAPI/Flask  | `requirements.txt` or `pyproject.toml` contains `fastapi` or `flask` |
| Laravel        | `composer.json` contains `laravel/framework`; has `database/migrations/` |
| Node/Express   | `package.json` exists; no framework-specific files |
| Next.js        | `package.json` contains `next`; has `pages/` or `app/` dir |
| Prisma         | `prisma/schema.prisma` exists |
| Go             | `go.mod` exists |
| Rust           | `Cargo.toml` exists |
| Elixir/Phoenix | `mix.exs` exists |
| .NET           | `*.csproj` or `*.sln` exists |
| Java/Kotlin    | `build.gradle` or `pom.xml` exists |
| Generic SQL    | `schema.sql`, `*.sql`, or any `migrations/` directory |

Read the identified package file(s) to confirm the framework, version, and key dependencies. Use the detected framework to determine where models, schemas, routes, jobs, and tests live — don't assume Rails conventions apply everywhere.

### Check Existing Docs

Before reading code, look for documentation that may already answer the question: `README.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `TERMINOLOGY.md`, `CONTRIBUTING.md`, `docs/`. Cite relevant sections in output rather than re-deriving from code.

### Explore by Scope

**High-level overview:**
- Map the top-level directory structure (skip `node_modules`, `vendor`, `.git`, `tmp`, `log`)
- Identify entry points: routes file, main controllers, application config
- Find the data layer: schema file, models directory
- Note key service objects, background jobs, mailers, or other domain layers

**Specific area or feature:**
- Find relevant models and their schema definitions (columns, types, foreign keys)
- Find controllers or API endpoints that handle requests for this area
- Look for service objects, jobs, or other non-MVC classes involved
- Locate tests — they often reveal intent better than the code itself

**Schema and data layer:**
Read the schema source of truth directly — don't guess at column names:
- Rails: `db/schema.rb` + recent migrations for design intent
- Django: `migrations/` directories per app
- Prisma: `prisma/schema.prisma`

**Central identity model:**
Most apps have a central identity model (`User`, `Person`, `Member`, etc.) that anchors everything else. Always find it and note how the target area connects back to it via foreign keys — even when the user asked about a specific feature.

**Interface and entry points:**
For each significant operation, find where it is triggered: route definitions, controllers/views, background jobs, admin interfaces, CLI commands.

**When the area can't be found:**
If no matching models, controllers, files, or routes exist — don't fabricate an explanation. Tell the user clearly, show what was searched for, and surface the closest related areas that do exist.

---

## Output

Apply the **Output Format Rules** from SKILL.md (size, formatting constraints, file references). Omit sections that don't apply. Then follow this content structure per level:

**If agent-triggered** (input began with `depth:`), skip all sections below and return this structured block instead:

```
WHAT: one-sentence description of what this area does
WHERE: key file paths (models, services, controllers, jobs, etc.)
HOW: brief end-to-end flow description
CONNECTS TO: comma-separated list of related areas or models
```

For `depth:novella` or `depth:novel`, expand each field to a short paragraph and add:

```
DATA MODEL: key models and their relationships in plain text (e.g. Partner has_many Iterations; Iteration belongs_to Partner)
```

---

**Pamphlet** — Say what the area does, what the main moving parts are, and where to start reading.

**Novella** — Use these sections (one paragraph each, no deep dives):
- **Overview** — what this area does and why it exists
- **Key Concepts** — main models and how they relate, in plain language; name files but don't enumerate every column
- **How It Works** — main flow from trigger to outcome
- **Where to Start** — 1–2 files that give the most context fastest

**Novel** — Use these sections:
- **Overview** — what this area does and why it exists (2–4 sentences)
- **Tech Stack** — framework, language version, and key libraries for this area
- **Key Files** — prioritized list with actual paths; one-line description per file
- **Interface & Entry Points** — routes/endpoints, controllers, jobs, admin interfaces; use a table where there are multiple entry points
- **How It Fits Together** — end-to-end flow from trigger through key components to outcome
- **What to Look at Next** — 2–3 specific files or areas to explore next, based on the user's role and intentions
- **Existing Documentation** — any relevant docs found during exploration

Append this to the "Always end with" block from SKILL.md:
> *Want to capture the data model as a diagram? Ask to save it to a doc.*

If the user asks for the diagram, generate a Mermaid `erDiagram` showing the relevant models and relationships; always include the central identity model if it connects; point to `db/schema.rb` for the full column list. Save it to a timestamped file under `docs/` with a filename based on the question asked.
