---
name: scaffold-docs
description: >
  Install the RoleModel agent-documentation structure in a project: a minimal
  AGENTS.md, a docs/ tree with CONVENTIONS.md and INDEX.md, the
  surface_conventions PreToolUse hook, and the wrap-up skill. Trigger when
  someone wants to bootstrap agent docs, set up AGENTS.md, add conventions
  structure, port the docs setup from another repo, standardize a project's
  agent instructions, or trim a bloated AGENTS.md down to size.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
metadata:
  author: rolemodel
  version: "1.0"
  triggers: "scaffold docs, set up AGENTS.md, bootstrap docs structure, add conventions structure, trim AGENTS.md, standardize agent instructions"
---

# Scaffold Docs

Install the structure, not the content. Empty indexes are correct on day one —
the `wrap-up` skill fills them in over time.

Only the first link in the chain is always in context:

```
CLAUDE.md → AGENTS.md (<50 lines, always loaded)
              ├→ docs/CONVENTIONS.md → docs/conventions/*.md  (hook surfaces these on edit)
              ├→ docs/INDEX.md       → docs/subsystems/*.md, docs/guides/*.md
              └→ docs/ARCHITECTURE.md
```

Every step merges. Never clobber a file that has content.

## 1. Survey

Note what exists — `AGENTS.md`, `CLAUDE.md`, `docs/`, `.claude/`. Find the test
and lint commands in `package.json`, `Rakefile`, `Makefile`, or CI config. If
they don't turn up in a minute, leave a `TODO` and report it. Never invent a
command.

## 2. docs tree

Copy from `templates/`, filling the `<>` placeholders:

| Template | Destination |
|---|---|
| `CONVENTIONS.template.md` | `docs/CONVENTIONS.md` — verbatim, empty index |
| `INDEX.template.md` | `docs/INDEX.md` — verbatim, empty sections |
| `ARCHITECTURE.template.md` | `docs/ARCHITECTURE.md` — stack names only, no versions, no prose tour |

Create `docs/conventions/`, `docs/subsystems/`, `docs/guides/`. Where a file
already exists, add only what's missing.

## 3. AGENTS.md

No `AGENTS.md` → copy `templates/AGENTS.template.md` and fill it in. The
template is the whole file; resist adding sections.

An `AGENTS.md` exists → follow `references/trimming.md`. Target under 50 lines.

Then make `CLAUDE.md` exactly `@AGENTS.md`. If it holds real content, trim that
into `AGENTS.md` first.

## 4. Skills

Skills live in `.agents/skills/`, the tool-neutral location, but Claude Code
only discovers `.claude/skills/`. Bridge them once and commit the symlink — git
stores it as a link, so every checkout works:

```sh
mkdir -p .agents/skills .claude
ln -s ../.agents/skills .claude/skills
```

If `.claude/skills/` is already a real directory, move its contents into
`.agents/skills/` first.

`wrap-up` comes from the shared repo, not a copy, so upstream fixes reach the
project through `git submodule update --remote`:

```sh
git submodule add https://github.com/rolemodel/rolemodel-skills.git .github/rolemodel-skills
ln -s ../../.github/rolemodel-skills/skills/wrap-up .agents/skills/wrap-up
```

Skip the `add` if the submodule is already there, and confirm with the user
before running it — it writes `.gitmodules`. If the project already has a
session-end skill, leave it and report the conflict.

## 5. The hook

Hooks have no tool-neutral home, so they stay under `.claude/`. Copy
`assets/surface_conventions.rb` into `.claude/hooks/` (creating the directory),
make it executable, and register it in `.claude/settings.json` — merging into
any existing `hooks` object:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/surface_conventions.rb" }
        ]
      }
    ]
  }
}
```

The hook needs Ruby on PATH; without it, skip the hook and say so — the rest
works, minus just-in-time surfacing.

## 6. Verify and report

Check that every path the new files reference resolves, the skill symlinks
resolve, `AGENTS.md` is under 50 lines, the hook is executable, and
`settings.json` is valid JSON.

Report what was created, what was merged, what left `AGENTS.md` and where it
went, and every `TODO` you left behind.
