---
name: scaffold-docs
description: >
  Install the RoleModel agent-documentation structure in a project: a minimal
  AGENTS.md, a docs/ tree with CONVENTIONS.md and INDEX.md, a path-scoped
  Copilot instructions file, the surface_conventions PreToolUse hook, and the
  wrap-up skill.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
metadata:
  author: rolemodel
  version: "1.0"
  triggers: "scaffold docs, set up AGENTS.md, bootstrap agent docs, bootstrap docs structure, add conventions structure, point Copilot at a repo's conventions, port the docs setup from another repo, trim AGENTS.md, standardize agent instructions"
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

.github/instructions/conventions.instructions.md  (Copilot's entry to the same chain)
              └→ docs/CONVENTIONS.md
```

Every step merges. Never clobber a file that has content.

## 1. Survey

Note what exists — `AGENTS.md`, `CLAUDE.md`, `docs/`, `.claude/`. Find the test
and lint commands in `package.json`, `Rakefile`, `Makefile`, or CI config. If
they don't turn up in a minute, leave a `TODO` and report it. Never invent a
command.

## 2. docs tree

Copy from `templates/`, filling the `<>` placeholders:

| Template                   | Destination                                                           |
| -------------------------- | --------------------------------------------------------------------- |
| `CONVENTIONS.template.md`  | `docs/CONVENTIONS.md` — verbatim, empty index                         |
| `INDEX.template.md`        | `docs/INDEX.md` — verbatim, empty sections                            |
| `ARCHITECTURE.template.md` | `docs/ARCHITECTURE.md` — stack names only, no versions, no prose tour |

Create `docs/conventions/`, `docs/subsystems/`, `docs/guides/`, each holding a
`.gitkeep` — they end the run empty by design, and git won't carry an empty
directory. Where a file already exists, add only what's missing.

## 3. AGENTS.md

No `AGENTS.md` → copy `templates/AGENTS.template.md` and fill it in. The
template is the whole file; resist adding sections.

An `AGENTS.md` exists → follow `references/trimming.md`. Target under 50 lines.

Then make `CLAUDE.md` exactly `@AGENTS.md`. If it holds real content, trim that
into `AGENTS.md` first.

## 4. Copilot instructions

Copilot doesn't read `AGENTS.md`. Copy
`templates/conventions.instructions.template.md` to
`.github/instructions/conventions.instructions.md`, filling the `<>`
placeholders. Set `applyTo` from directories that exist — source, test,
migration, config — comma-separated in one quoted string.

It stays a pointer to `docs/CONVENTIONS.md`; don't restate a convention in it.
Merge if the file exists, and leave the directory's other `*.instructions.md`
files alone.

If the `linear` MCP server isn't connected yet, report that they should connect
it and store the key as a Copilot agent secret named
`COPILOT_MCP_LINEAR_API_KEY`. Never ask for the key.

## 5. Skills

Skills live in `.agents/skills/`, the tool-neutral location, but Claude Code
only discovers `.claude/skills/`. Bridge them once and commit the symlink — git
stores it as a link, so every checkout works:

```sh
mkdir -p .agents/skills .claude
touch .agents/skills/.gitkeep
ln -s ../.agents/skills .claude/skills
```

The `.gitkeep` matters: if the submodule step below is skipped, `.agents/skills/`
stays empty, git drops it, and `.claude/skills` dangles on a fresh checkout.

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

## 6. The hook

Hooks have no tool-neutral home, so they stay under `.claude/`. Copy
`assets/surface_conventions.rb` into `.claude/hooks/` (creating the directory),
make it executable, and register it in `.claude/settings.json` — merging into
any existing `hooks` object:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "^(Edit|Write)$",
        "hooks": [
          {
            "type": "command",
            "command": "\"${CLAUDE_PROJECT_DIR}\"/.claude/hooks/surface_conventions.rb"
          }
        ]
      }
    ]
  }
}
```

Matchers are unanchored regexes, so `^(Edit|Write)$` is deliberate — a bare
`Edit` would also fire on `NotebookEdit`.

The hook needs Ruby on PATH; without it, skip the hook and say so — the rest
works, minus just-in-time surfacing.

## 7. Verify and report

Check that every path the new files reference resolves, the skill symlinks
resolve, `AGENTS.md` is under 50 lines, the hook is executable,
`settings.json` is valid JSON, and every glob in `applyTo` matches something.

Report what was created, what was merged, what left `AGENTS.md` and where it
went, every `TODO` you left behind, and the Linear MCP setup from step 4 if it
isn't already in place.
