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

### UX & Frontend

| Skill | Description |
|-------|-------------|
| **[ai-ux-enhancements](skills/ai-ux-enhancements)** | Automatable UX review rules optimized for AI-driven design evaluations — efficiency, control, cognitive workload, learnability, and personalization. Complements `laws-of-ux`. |
| **[dynamic-nested-attributes](skills/dynamic-nested-attributes)** | Rails nested attributes with dynamic add/remove using Turbo Streams and Simple Form. |
| **[form-auto-save](skills/form-auto-save)** | Automatic form submission with debounce for seamless auto-save experiences. |
| **[frontend-patterns](skills/frontend-patterns)** | Frontend patterns for Rails apps using Slim templates, Stimulus, and CSS with Optics utilities. |
| **[laws-of-ux](skills/laws-of-ux)** | Review and guide UI implementations using the 21 Laws of UX (Fitts's Law, Hick's Law, Miller's Law, etc.). |
| **[stimulus-controllers](skills/stimulus-controllers)** | Create and register Stimulus controllers for interactive JavaScript features. |
| **[turbo-fetch](skills/turbo-fetch)** | Dynamic form updates using Turbo Streams and Stimulus (cascading dropdowns, conditional fields, dynamic option lists). |
| **[usability-heuristics](skills/usability-heuristics)** | Audit UIs against Nielsen's 10 Usability Heuristics. Structured issue logs with severity ratings and remediation guidance. |

### Rails Backend

| Skill | Description |
|-------|-------------|
| **[action-cable](skills/action-cable)** | ActionCable for real-time features using WebSockets, broadcasting, and Turbo Streams over cable. |
| **[controller-patterns](skills/controller-patterns)** | Rails controllers following RESTful conventions, authorization patterns, and proper error handling. |
| **[json-typed-attributes](skills/json-typed-attributes)** | Typed attributes backed by JSON fields in Rails models with type casting, validations, and form integration. |
| **[routing-patterns](skills/routing-patterns)** | RESTful resource routing, route concerns, and shallow nesting strategies. |
| **[testing-patterns](skills/testing-patterns)** | Automated tests using RSpec, Capybara, and FactoryBot for Rails applications. |

### Process & Planning

| Skill | Description |
|-------|-------------|
| **[brave-breakdown](skills/brave-breakdown)** | Interactive BRAVE framework thought partner for breaking down a Linear card before starting work. Guides through Brainstorm, Reflect, Approach, Value, and Estimate — one question at a time. |
| **[sentry-fix-issue](skills/sentry-fix-issue)** | Find and fix production issues from Sentry using MCP. Analyzes stack traces, breadcrumbs, and context to identify root causes and apply fixes. |

### Documentation

| Skill | Description |
|-------|-------------|
| **[document-this](skills/document-this)** | Generate multi-audience documentation from any codebase — workflows for non-technical readers, architecture for developers, and AI orientation for agents. Deterministic JS scripts handle structural extraction; the agent writes the prose. Use when the user asks to "document this project", runs `/document-this`, runs `/document`, or wants fresh documentation reflecting the current codebase state. |

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
  triggers:
    - keyword that activates the skill
    - another trigger keyword
---

Markdown instructions for the AI agent...
```

- **`name`** — Identifier for the skill (becomes the `/slash-command` in Claude Code)
- **`description`** — Tells the agent when to load this skill
- **`metadata.triggers`** — Keywords that help the agent match the skill to your request

## How skills work together

Several skills are designed to complement each other:

- **BEM + Optics** — BEM provides CSS structure; Optics provides design tokens and components. Use both when writing or reviewing stylesheets.
- **Laws of UX + Usability Heuristics** — Laws of UX provides theoretical UX principles; Usability Heuristics provides a structured audit methodology. Use both for comprehensive UI reviews.
- **Frontend Patterns + Stimulus + Turbo Fetch** — These cover the full frontend stack for Rails apps using Hotwire.

## License

[MIT](LICENSE)
