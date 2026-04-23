---
name: trace
description: >
  Trace code through the stack — upward to entry points, downward to data,
  or laterally across boundaries. Use when the user asks "where does this get
  called from", "what calls this method", "trace this through the stack", "how
  does this request flow", "where does this data come from", "follow this
  through the code", or pastes/selects a piece of code and wants to understand
  where it fits in the larger system.
allowed-tools: Read Bash(grep,find) WebSearch
compatibility: Designed for Claude Code (or similar products)
metadata:
  author: rolemodel
  version: "1.0"
license: MIT
---

# Code Tracer

Given a piece of code, a symbol, or a file reference, trace it through the
stack and produce a diagram showing where it sits, what calls it, and what it
depends on.

## Step 1: Identify the Input

The input is one of:
- **Selected code** — a method, class, block, or snippet pasted directly
- **Symbol name** — a method name, class name, or route (e.g. `InvoiceService#create`, `POST /invoices`)
- **File reference** — a path with optional line number (e.g. `app/services/invoice_service.rb:42`)

If no input is provided, ask: "What code do you want to trace? Paste a snippet, name a method or class, or give a file path."

## Step 2: Detect the Stack

Identify the framework before tracing — conventions differ significantly:

| Framework      | Detection Signal |
|----------------|-----------------|
| Rails          | `Gemfile` contains `rails`; has `app/`, `db/schema.rb` |
| Django         | `pyproject.toml` or `requirements.txt` contains `django` |
| FastAPI/Flask  | `pyproject.toml` or `requirements.txt` contains `fastapi` or `flask` |
| Laravel        | `composer.json` contains `laravel/framework` |
| Next.js        | `package.json` contains `next`; has `pages/` or `app/` dir |
| Node/Express   | `package.json` exists; `app.js` or `server.js` entry point |
| Go             | `go.mod` exists |
| Elixir/Phoenix | `mix.exs` exists |
| .NET           | `*.csproj` or `*.sln` exists |

## Step 3: Locate the Code

Find the actual source before tracing:
- If given a symbol name, use `grep`/`find` to locate the definition
- If given a file reference, read the file at that line
- If given a snippet, grep for a distinctive identifier to find where it lives

Read the located code closely before tracing.

## Step 4: Classify the Code

Determine what layer the code belongs to. Use the detected stack's conventions:

| Layer | Rails example | Django example | Node example |
|-------|--------------|----------------|--------------|
| Entry point / route | `config/routes.rb` | `urls.py` | `app.js` route |
| Controller / handler | `app/controllers/` | `views.py` | route handler |
| Service / business logic | `app/services/` | `services/` | `src/services/` |
| Model / domain | `app/models/` | `models.py` | ORM model |
| Data access | ActiveRecord query | QuerySet | repository |
| Background job | `app/jobs/` | Celery task | queue worker |
| Serializer / presenter | `app/serializers/` | DRF serializer | DTO |
| View / template | `app/views/` | `templates/` | JSX component |
| External integration | `app/services/*_client.rb` | `integrations/` | API client |

## Step 5: Trace

Follow **[references/playbook.md](references/playbook.md)** for the full trace procedures, including detailed steps for each direction, handling of inheritance/polymorphism/god objects, and how to handle ambiguous traces with multiple entry points.

Summary:

**Trace upward** (toward the entry point / caller):
- Find what calls this code — grep for the method name, class instantiation, or route
- Follow the chain: caller → caller's caller → entry point
- Stop when you reach a route definition, job enqueue, webhook receiver, or console/CLI call

**Trace downward** (toward data and dependencies):
- Find what this code calls — read the method body and identify all outbound calls
- Follow into service objects, models, external clients, and jobs
- Stop at the data layer (database query, cache read, external API call, file I/O)

**Trace laterally** (cross-cutting concerns):
- Identify callbacks, hooks, observers, or event publishers triggered along the path
- Note authorization checks (policy, middleware, before_action) and what happens on failure
- Note audit logging, analytics events, and instrumentation (ActiveSupport::Notifications, StatsD, Sentry breadcrumbs)
- Flag any async handoffs (background jobs, ActionCable broadcasts, webhooks out)

**If the trace gets complex** — deep inheritance, polymorphic dispatch, god objects, or dynamically-generated methods — read the "Handling Common Complexity" section in `playbook.md` before continuing.

**If the input could belong to multiple flows** — read "When the Trace Is Ambiguous" in `playbook.md` and ask the user to clarify before tracing.

## Step 6: Output

Present a vertical stack diagram, then a prose walkthrough.

### Stack diagram format

```
[Entry point]         e.g. POST /invoices → InvoicesController#create
  ↓
[Controller/Handler]  e.g. InvoicesController#create
  ↓
[Service/Logic]       e.g. InvoiceService#create
  ↓ (async)
[Background Job]      e.g. SendInvoiceEmailJob
  ↓
[Model/Data]          e.g. Invoice.create!, LineItem.insert_all
  ↓
[External/Storage]    e.g. Stripe API, PostgreSQL
```

Use `↓` for synchronous calls, `↓ (async)` for background/async handoffs, `→` for lateral triggers (callbacks, events). Use actual names from the codebase — not generic placeholders.

After the diagram, write 3–5 sentences explaining how data flows through these layers for this specific code path. Note any non-obvious hops, authorization points, or side effects.

### File references

Use clickable `[file:line](path/to/file#Lline)` links for every layer cited.

---

**Want to go deeper?**

End with 2–3 specific follow-up suggestions based on the trace — e.g.:
- Dig into one layer of the trace that has complex logic
- Find the tests that cover this code path
- Trace a related flow that shares some of these layers
- See what happens when this flow fails (error handling path)
