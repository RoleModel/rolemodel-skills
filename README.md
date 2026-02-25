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
| **[laws-of-ux](skills/laws-of-ux)** | Review and guide UI implementations using the 21 Laws of UX (Fitts's Law, Hick's Law, Miller's Law, etc.). |
| **[usability-heuristics](skills/usability-heuristics)** | Audit UIs against Nielsen's 10 Usability Heuristics. Structured issue logs with severity ratings and remediation guidance. |
| **[frontend-patterns](skills/frontend-patterns)** | Frontend patterns for Rails apps using Slim templates, Stimulus, and CSS with Optics utilities. |
| **[stimulus-controllers](skills/stimulus-controllers)** | Create and register Stimulus controllers for interactive JavaScript features. |
| **[turbo-fetch](skills/turbo-fetch)** | Dynamic form updates using Turbo Streams and Stimulus (cascading dropdowns, conditional fields, dynamic option lists). |
| **[form-auto-save](skills/form-auto-save)** | Automatic form submission with debounce for seamless auto-save experiences. |
| **[dynamic-nested-attributes](skills/dynamic-nested-attributes)** | Rails nested attributes with dynamic add/remove using Turbo Streams and Simple Form. |

### Rails Backend

| Skill | Description |
|-------|-------------|
| **[controller-patterns](skills/controller-patterns)** | Rails controllers following RESTful conventions, authorization patterns, and proper error handling. |
| **[routing-patterns](skills/routing-patterns)** | RESTful resource routing, route concerns, and shallow nesting strategies. |
| **[action-cable](skills/action-cable)** | ActionCable for real-time features using WebSockets, broadcasting, and Turbo Streams over cable. |
| **[json-typed-attributes](skills/json-typed-attributes)** | Typed attributes backed by JSON fields in Rails models with type casting, validations, and form integration. |
| **[testing-patterns](skills/testing-patterns)** | Automated tests using RSpec, Capybara, and FactoryBot for Rails applications. |

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

**For Claude Code**, use the `--add-dir` flag to include the skills directory:

```bash
claude --add-dir .rolemodel-skills/skills
```

Or add it to your project's `.claude/settings.json`:

```json
{
  "additionalDirectories": [".rolemodel-skills/skills"]
}
```

Alternatively, symlink individual skills you want into `.claude/skills/`:

```bash
mkdir -p .claude/skills
ln -s ../../.rolemodel-skills/skills/bem-structure .claude/skills/bem-structure
ln -s ../../.rolemodel-skills/skills/laws-of-ux .claude/skills/laws-of-ux
```

**For GitHub Copilot**, symlink the skills you need into `.github/skills/`:

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
npx skillsadd RoleModel/rolemodel-skills
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
