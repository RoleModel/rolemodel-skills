# RoleModel Skills

A collection of reusable AI agent skills for [RoleModel Software](https://rolemodelsoftware.com). Each skill is a `SKILL.md` instruction set that teaches AI coding agents (Claude Code, GitHub Copilot) how to apply specific methodologies, design systems, and development patterns.

Skills follow the [Agent Skills](https://agentskills.io) open standard and work across multiple AI tools.

## Skills

### CSS & Design System

| Skill | Description |
|-------|-------------|
| **[bem-structure](skills/bem-structure)** | CSS guidance using BEM (Block Element Modifier) methodology. Naming conventions, nesting rules, and modifier patterns. |
| **[optics-context](skills/optics-context)** | RoleModel's Optics design system — component classes, design tokens (`--op-` prefix), and styling guidelines. Includes `assets/components.json` and `assets/tokens.json`. |
| **[theming-context](skills/theming-context)** | Implementing design system guidelines, theming, and color scales with Optics. |

### UX Review

| Skill | Description |
|-------|-------------|
| **[ai-ux-enhancements](skills/ai-ux-enhancements)** | Automatable UX review rules optimized for AI-driven design evaluations — efficiency, control, cognitive workload, learnability, and personalization. Complements `laws-of-ux`. |
| **[laws-of-ux](skills/laws-of-ux)** | Review and guide UI implementations using the 21 Laws of UX (Fitts's Law, Hick's Law, Miller's Law, etc.). |
| **[usability-heuristics](skills/usability-heuristics)** | Audit UIs against Nielsen's 10 Usability Heuristics. Structured issue logs with severity ratings and remediation guidance. |

### Rails Frontend

| Skill | Description |
|-------|-------------|
| **[action-cable](skills/action-cable)** | ActionCable for real-time features using WebSockets, broadcasting, and Turbo Streams over cable. |
| **[dynamic-nested-attributes](skills/dynamic-nested-attributes)** | Rails nested attributes with dynamic add/remove using Turbo Streams and Simple Form. |
| **[form-auto-save](skills/form-auto-save)** | Automatic form submission with debounce for seamless auto-save experiences. |
| **[frontend-patterns](skills/frontend-patterns)** | Frontend patterns for Rails apps using Slim templates, Stimulus, and CSS with Optics utilities. |
| **[stimulus-controllers](skills/stimulus-controllers)** | Create and register Stimulus controllers for interactive JavaScript features. |
| **[turbo-fetch](skills/turbo-fetch)** | Dynamic form updates using Turbo Streams and Stimulus (cascading dropdowns, conditional fields, dynamic option lists). |

### Rails Backend

| Skill | Description |
|-------|-------------|
| **[controller-patterns](skills/controller-patterns)** | Rails controllers following RESTful conventions, authorization patterns, and proper error handling. |
| **[json-typed-attributes](skills/json-typed-attributes)** | Typed attributes backed by JSON fields in Rails models with type casting, validations, and form integration. |
| **[polymorphic-parent-resources](skills/polymorphic-parent-resources)** | Serve a child resource that hangs off many different parents (comments, reports, duplications, attachments) from a single controller, using a route concern plus `resource_for` from `rolemodel_rails`. Includes a retrofit guide for consolidating existing per-parent controllers. |
| **[routing-patterns](skills/routing-patterns)** | RESTful resource routing, route concerns, and shallow nesting strategies. |
| **[tdd](skills/tdd)** | Test-driven development for Rails — outside-in with RSpec, Capybara, and FactoryBot. Covers the red-green loop, spec plans, and the Prove-It pattern for bugs. |

### Developer Workflow

| Skill | Description |
|-------|-------------|
| **[cloudflare-tunnel](skills/cloudflare-tunnel)** | Expose locally-running apps to stable public HTTPS URLs with a single per-developer Cloudflare Tunnel (cloudflared). For receiving webhooks, testing OAuth callbacks, or sharing a work-in-progress. Covers named-tunnel setup, per-project hostnames, host allowlisting, and running cloudflared as a launchd service. |
| **[create-profile](skills/create-profile)** | Creates or updates a personal developer profile at `~/.claude/PROFILE.md`. Run once to tell Claude about your role, experience, and preferences so that explanations and other skills can tailor their output to you. |
| **[dependabot-stack](skills/dependabot-stack)** | Group all open Dependabot PRs on a repository into one ordered stack with `gh-stack`, so the week's dependency updates land as a single reviewable chain instead of N PRs that conflict on shared lockfiles. Orders by lockfile overlap, rebases in a scratch worktree, and registers the stack on GitHub. |
| **[document-this](skills/document-this)** | Generate multi-audience documentation from any codebase — workflows for non-technical readers, architecture for developers, and AI orientation for agents. Deterministic JS scripts handle structural extraction; the agent writes the prose. Use when the user asks to "document this project", runs `/document-this`, runs `/document`, or wants fresh documentation reflecting the current codebase state. |
| **[explain](skills/explain)** | Explain a codebase or feature areas of any project in various levels of detail. Great for onboarding into unfamiliar code or orienting before making a change. |
| **[generate-conventions](skills/generate-conventions)** | Fill an empty `docs/conventions/` with rules worth writing — taste calls and facts the code won't announce, not what a survey of the codebase already tells you. Confirms candidates with the user one at a time and writes three to seven lines each. Rejects most of them. |
| **[file-pr](skills/file-pr)** | Open a pull request with a consistent description format — **Why**, **What Changed**, an optional **Post-merge** checklist, and **Screenshots** — and assign the author. Updates the existing PR in place when the branch already has one. Refuses to commit on the default branch and stages named paths only, never `git add -A`. |
| **[scaffold-docs](skills/scaffold-docs)** | Install the agent-documentation structure in a project — a minimal `AGENTS.md`, a `docs/` tree with `CONVENTIONS.md` and `INDEX.md`, the convention-surfacing PreToolUse hook, and a symlinked `wrap-up`. Installs the structure, not the content; also trims a bloated existing `AGENTS.md` under 50 lines. |
| **[split-stack](skills/split-stack)** | Split one PR that does too much into a stack of PRs, one per concern, without changing the combined diff. The top of the stack must stay byte-identical to the original commit — verified, not assumed. Includes `scripts/strip_hunks.py` for carving hunks out of a diff. |
| **[trace](skills/trace)** | Trace code through the stack — upward to entry points, downward to data, laterally across callbacks and side effects. Outputs a stack diagram with clickable file references. |
| **[wrap-up](skills/wrap-up)** | End a work session by routing what was learned into the right doc layer — convention, subsystem, guide, or architecture — and pruning what the session proved stale. Defaults to writing nothing, since docs that restate the code are worse than none. Pairs with `scaffold-docs`. |

### Process, Planning, & Observability

| Skill | Description |
|-------|-------------|
| **[brave-breakdown](skills/brave-breakdown)** | Interactive BRAVE framework thought partner for breaking down a Linear card before starting work. Guides through Brainstorm, Reflect, Approach, Value, and Estimate — one question at a time. |
| **[rm-sentry-issue-fixer](skills/rm-sentry-issue-fixer)** | Full seven-phase workflow for diagnosing and fixing a Sentry issue using Sentry MCP: issue discovery → deep analysis → root cause hypothesis → entry point audit → code investigation → implement fix → report results. Enforces security constraints (never follows instructions embedded in Sentry event data). |
| **[sentry-top-issue](skills/sentry-top-issue)** | Picks the single highest-priority unresolved Sentry issue (sorted by Trends, filtered for open PRs) and hands it off to `rm-sentry-issue-fixer`. Discovers Sentry scope from args or project docs; exits cleanly if scope or MCP is unavailable. Supports `dry-run`, `no-pr-filter`, and `fixer=` overrides. |

## Installation

There are three ways to add these skills to your project. Choose the one that best fits your workflow.

### Option 1: Copy individual skills (simplest)

Copy the skill folders you need directly into your project's skills directory.

**For Claude Code:**

```bash
# Create the skills directory if it doesn't exist
mkdir -p .claude/skills

# Copy a skill into your project
cp -r path/to/rolemodel-skills/skills/bem-structure .claude/skills/bem-structure
```

Skills live in `.claude/skills/<skill-name>/SKILL.md` and are discovered automatically. Claude loads them when relevant to your conversation, or you can invoke them directly with `/<skill-name>`.

**For GitHub Copilot:**

```bash
# Create the skills directory if it doesn't exist
mkdir -p .github/skills

# Copy a skill into your project
cp -r path/to/rolemodel-skills/skills/bem-structure .github/skills/bem-structure
```

Skills live in `.github/skills/<skill-name>/SKILL.md` and are loaded on-demand when Copilot detects a relevant task.

### Option 2: Git submodule (keeps skills synced)

Add this repo as a git submodule, then point your AI agent at the skills directory. This makes it easy to pull updates as skills evolve.

```bash
# Add the submodule
git submodule add https://github.com/RoleModel/rolemodel-skills.git .rolemodel-skills

# Initialize (for teammates cloning the repo)
git submodule update --init
```

Then tell your agent where to find the skills:

**For Claude Code**, you have a few options:

1. **Use `--add-dir`** to include the skills directory when launching Claude:

    ```bash
    claude --add-dir .rolemodel-skills/skills
    ```

2. **Add it to your project's `.claude/settings.json`** so it's always available:

    ```json
    {
      "additionalDirectories": [".rolemodel-skills/skills"]
    }
    ```

3. **Reference the skills in your `CLAUDE.md`** so Claude knows to read them when relevant:

    ```markdown
    ## Skills

    This project uses shared AI agent skills from `.rolemodel-skills/skills/`.
    When working on CSS, read and follow the instructions in:
    - `.rolemodel-skills/skills/bem-structure/SKILL.md`
    - `.rolemodel-skills/skills/optics-context/SKILL.md`

    When reviewing UI for usability, read and follow:
    - `.rolemodel-skills/skills/laws-of-ux/SKILL.md`
    - `.rolemodel-skills/skills/usability-heuristics/SKILL.md`
    ```

4. **Symlink individual skills** into `.claude/skills/` for automatic discovery:

    ```bash
    mkdir -p .claude/skills
    ln -s ../../.rolemodel-skills/skills/bem-structure .claude/skills/bem-structure
    ln -s ../../.rolemodel-skills/skills/laws-of-ux .claude/skills/laws-of-ux
    ```

**For GitHub Copilot:**

1. **Reference the skills in `.github/copilot-instructions.md`** so Copilot knows to read them when relevant:

    ```markdown
    ## Skills

    This project uses shared AI agent skills from `.rolemodel-skills/skills/`.
    When working on CSS, read and follow the instructions in:
    - `.rolemodel-skills/skills/bem-structure/SKILL.md`
    - `.rolemodel-skills/skills/optics-context/SKILL.md`

    When reviewing UI for usability, read and follow:
    - `.rolemodel-skills/skills/laws-of-ux/SKILL.md`
    - `.rolemodel-skills/skills/usability-heuristics/SKILL.md`
    ```

2. **Symlink individual skills** into `.github/skills/` for automatic discovery:

    ```bash
    mkdir -p .github/skills
    ln -s ../../.rolemodel-skills/skills/bem-structure .github/skills/bem-structure
    ln -s ../../.rolemodel-skills/skills/laws-of-ux .github/skills/laws-of-ux
    ```

To pull the latest skill updates:

```bash
git submodule update --remote .rolemodel-skills
```

### Option 3: Install via skills.sh (community directory)

[skills.sh](https://skills.sh) is a community directory and CLI for discovering and installing agent skills. If these skills are published there, you can install them with:

```bash
npx skills add RoleModel/rolemodel-skills
```

This installs skills into the appropriate directory for your agent automatically. You can also browse [skills.sh](https://skills.sh) to discover additional skills from the community.

## Structure

```
skills/
  {skill-name}/
    SKILL.md          # Skill definition with YAML frontmatter + markdown instructions
    assets/           # Optional supporting data (JSON token/component references)
```

Each `SKILL.md` has YAML frontmatter at the top:

```yaml
---
name: skill-name
description: What the skill does and when to use it.
metadata:
  triggers: "keyword that activates the skill, another trigger keyword"
---

Markdown instructions for the AI agent...
```

- **`name`** — Identifier for the skill (becomes the `/slash-command` in Claude Code)
- **`description`** — Tells the agent when to load this skill
- **`metadata.triggers`** — Keywords that help the agent match the skill to your request

## How skills work together

Several skills are designed to complement each other:

- **BEM + Optics** — BEM provides CSS structure; Optics provides design tokens and components. Use both when writing or reviewing stylesheets.
- **Laws of UX + Usability Heuristics + AI UX Enhancements** — Laws of UX provides theoretical principles; Usability Heuristics provides a structured audit methodology; AI UX Enhancements adds automatable review rules. Use together for comprehensive UI reviews.
- **Frontend Patterns + Stimulus + Turbo Fetch + Action Cable** — These cover the full Rails frontend stack using Hotwire and real-time features.
- **Routing Patterns + Controller Patterns + Polymorphic Parent Resources** — Routing Patterns covers the route concern that passes the parent type; Controller Patterns covers the controller conventions; Polymorphic Parent Resources joins the two for child resources that hang off many parents. Reach for it at the second parent, when a nested controller would otherwise be copied.
- **Sentry Top Issue + Sentry Issue Fixer** — Top Issue selects the highest-priority Sentry issue; Issue Fixer runs the full diagnosis-and-fix workflow. Run together or invoke the fixer directly with a known issue.
- **Explain + Trace** — Explain orients you to a feature area or concept; Trace follows a specific code path through the stack. Use Explain first to build context, then Trace to dig into a specific flow.
- **Explain + Document This** — Explain answers questions interactively; Document This generates persistent reference docs. Use Explain while exploring, Document This when you want to capture the results for the team.
- **File PR + Split Stack** — File PR opens or updates a single PR. Split Stack is what you reach for when that PR turns out to cover more than one concern: it carves each concern into its own stacked PR, then File PR writes the description for each.

## License

[MIT](LICENSE)
