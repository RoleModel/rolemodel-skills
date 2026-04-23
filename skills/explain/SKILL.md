---
name: explain
description: Explains features, terms, and concepts from a codebase. Use whenever the user asks to explain, describe, or understand something ("explain X", "what is X", "how does X work"). Also use when starting an implementation, refactor, or test task — invoke as `depth:pamphlet <concept>` before writing code, `depth:novella <concept>` before designing an approach, or `depth:novel <concept>` before a deep refactor. Agent-triggered mode (depth: prefix) skips the interview and returns a structured WHAT/WHERE/HOW/CONNECTS TO block instead of a narrative.
allowed-tools: Read(~/.claude/PROFILE.md) AskUserQuestion WebSearch WebFetch
compatibility: Designed for Claude Code (or similar products)
metadata:
  author: rolemodel
  version: "1.0"
license: MIT
---

# Codebase Explorer

## STOP — Read This First

**Does the input start with `depth:pamphlet`, `depth:novella`, or `depth:novel`?**

- **YES** → This is an agent call. Do the following and nothing else:
  1. Do not ask any questions. Do not run the interview.
  2. Route to the correct playbook: architecture questions → `architecture.md`, pattern questions → `pattern.md`, technology or named-library questions → `technology.md`, everything else → `default.md`.
  3. Return only a structured block:
     ```
     WHAT: one-sentence definition
     WHERE: key file paths
     HOW: core flow or logic
     CONNECTS TO: related concepts/models
     ```
     For `depth:novella` or `depth:novel`, expand each field to a paragraph and add `DATA MODEL: key attributes and associations`.
  4. Stop. Do not add narrative, analogies, or the "want more detail?" footer.

- **NO** → Continue reading below and run the full interview.

---

## Phase 1: Interview

Ask these three questions **one at a time**, waiting for the answer before proceeding to the next. Do not ask multiple questions at once — the interview pace matters because each answer shapes what you ask next.

1. **Detail level** — Use `AskUserQuestion` with the question "How much detail do you need?" (header: "Detail level"), offering these options:
   - **Pamphlet** — a brief, high-level summary: what it is and where to find it
   - **Novella** — a short overview with the key concepts and how they connect
   - **Novel** — a comprehensive deep-dive: data model, flow, entry points, and enough depth to really understand how it works

### If the skill was called without an input

  3. **Intentions** — Ask as plain text (do NOT use `AskUserQuestion`): "What are you trying to do? Is there a specific area or feature you are trying to understand? (e.g., get a general orientation, understand something before making a change)"

Use the answers to calibrate depth and vocabulary throughout. A backend developer writing docs should get thorough model/relationship coverage. A frontend developer making a UI change should get more focus on API surface and data shape.

---

## Phase 2: Route to the Right Playbook

Based on the user's question, follow the appropriate playbook:

- **Technology questions** — the user is asking about a specific library, gem, npm package, framework feature, or external service used in the app — what it is, how it's configured, and how this codebase uses it (e.g. "how does Pundit work here", "how are we using StimulusJS", "explain how Turbo is set up", "how is Harvest integrated", "what gems handle auth"): follow `technology.md`
- **Architecture questions** — the user wants to understand how the codebase is structured, how a feature area is organized, or how components fit together (e.g. "how does X work", "explain the structure of", "what files are involved in", "I'm new to this project"): follow `architecture.md`
- **Pattern questions** — the user is asking about a recurring convention or idiom that appears across many files rather than a single feature (e.g. "how are service objects structured", "explain the policy pattern", "what's the convention for X", "how do we do Y here"): follow `pattern.md`
- **Everything else** — explaining a specific term, concept, model, or feature: follow `default.md`

When in doubt between technology and pattern: if the user named a specific library or gem, route to `technology.md`. If they named a coding convention or approach without naming a library, route to `pattern.md`.

If unclear, default to `default.md`.

**Tailoring by intent (all levels):**
- *"Just getting oriented"* — favor narrative over exhaustive lists; use analogies for unfamiliar patterns
- *"Making a change"* — emphasize the flow, point to where changes would go, note where the tests live

---

## Output Format Rules

These format constraints apply to **all playbooks**. Each playbook defines *what content to include* — these rules define *how much and in what form* to write it.

Tailor the explanation to the user's profile. Read it from `~/.claude/PROFILE.md` if it exists, and use any stated preferences to shape vocabulary, tone, and emphasis. For example, if they say they prefer concise explanations, skip the analogies and narrative flourishes and get straight to the point. If they say they like thorough explanations, include more context, examples, and details. Use their role and experience to focus on things that are specific to this project and avoid over-explaining things they likely already know.

**Pamphlet** — 2–5 sentences as a single plain paragraph. No headings, no bullet points, no code blocks, no diagrams, no jargon. Pure prose.

**Novella** — 1–2 paragraphs. Light on code snippets, heavy on concepts. Use subheadings only when there are clearly distinct parts that need separation — otherwise, keep it as flowing prose.

**Novel** — A full technical walkthrough organized with headings. Include file references in `file:line_number` format. Cover every section the playbook specifies; omit a section only if it genuinely doesn't apply (e.g. no background jobs exist for this area).

---

Always end with:
> *Want more or less detail? Ask for the **Pamphlet** (brief summary), **Novella** (short overview), or **Novel** (full deep-dive).*
>
> *Want to see more examples or dig into a specific one? Just ask.*

If `~/.claude/PROFILE.md` was **not** found when you read it at the start of Phase 1, append this line after the standard footer (do not add it if the profile already exists):

> *Want to customize explanations to your preferences? Use `/create-profile`*

---

## Agent-Triggered Mode

When this skill is invoked by another agent (not a user explicitly running `/explain`), skip Phase 1 entirely and produce a condensed output optimized for model consumption rather than human reading.

### Input contract

Prefix the input with a depth tag, then the topic:

```
depth:pamphlet retainer drawdowns
depth:novella harvest sync architecture
depth:novel partner model
```

Omitting the prefix defaults to `depth:pamphlet`.

### Behavior

- **No interview.** Do not ask about role, detail level, or intentions.
- **Drop the narrative wrapper.** Skip analogies, rhetorical questions, and transitions written for human readers. Write dense, structured prose or bullet points.
- **Omit the "want more detail?" footer.** That prompt is for interactive users; it is noise in an agent pipeline.
- **Route to the same playbooks** (default.md / architecture.md / pattern.md) but render at reduced verbosity.

### Output contract

Return a structured block with these fields (omit any that are not applicable):

```
WHAT: one-sentence definition
WHERE: key file paths (model, service, controller, etc.)
HOW: brief description of the core flow or logic
CONNECTS TO: comma-separated list of related concepts/models
```

For `depth:novella` or `depth:novel`, expand each field to a short paragraph rather than a single line, and add a `DATA MODEL` field listing key attributes and associations.

The goal is a tight information packet the calling agent can reason over, not a walkthrough a developer would read.

---

## Example Interaction Shapes

**User-triggered:**
- `explain retainer drawdowns` → default.md
- `explain SHM novel` → default.md
- `what is a partner?` → default.md
- `give me a pamphlet on booked time` → default.md
- `how does harvest sync work` → architecture.md
- `explain the structure of the billing feature` → architecture.md
- `I'm new here, give me an overview` → architecture.md
- `how are service objects structured here` → pattern.md
- `explain the policy pattern` → pattern.md
- `what's our convention for background jobs` → pattern.md
- `how does Pundit work in this app` → technology.md
- `how are we using StimulusJS` → technology.md
- `explain how Turbo is set up here` → technology.md
- `how is Harvest integrated` → technology.md
- `what gems handle authorization` → technology.md

**Agent-triggered:**
- `depth:pamphlet retainer drawdowns` → default.md, structured block output
- `depth:novella harvest sync` → architecture.md, expanded structured block
- `depth:novel partner model` → default.md, full structured block with DATA MODEL field
- `depth:pamphlet service object pattern` → pattern.md, structured block output
- `depth:pamphlet Pundit` → technology.md, structured block output
- `depth:novella StimulusJS` → technology.md, expanded structured block
