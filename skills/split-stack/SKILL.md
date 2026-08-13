---
name: split-stack
description: Split one PR that does too much into a stack of PRs, one per concern, without changing the combined diff. Use when asked to split, extract, carve out, or unbundle part of a PR into its own stacked PR.
allowed-tools: Agent Read Write Bash(gh pr view:*) Bash(gh pr diff:*) Bash(gh pr edit:*) Bash(gh pr create:*) Bash(gh stack:*) Bash(gh extension install github/gh-stack) Bash(git log:*) Bash(git diff:*) Bash(git status:*) Bash(git branch:*) Bash(git checkout:*) Bash(git add:*) Bash(git commit:*) Bash(git push:*) Bash(git fetch:*) Bash(git rev-parse:*) Bash(git tag:*) Bash(python3 ~/.claude/skills/split-stack/scripts/strip_hunks.py:*) Bash(bundle exec rspec:*)
---

# Split Stack

Carves one or more concerns out of an existing PR into their own PRs, stacked
on the original. The base PR keeps the concern the reviewer cares about first;
each carved-out concern becomes a child PR based on the one below it.

The invariant that makes this safe: **the top of the stack must be
byte-identical to the original commit**. Verify it, don't assume it.

Argument: a PR number or URL, plus which concern to split out.

## Step 1 — Read the PR and classify every hunk

```bash
gh pr view <pr> --json number,title,body,headRefName,baseRefName,url
git fetch origin
git log --oneline <base>..<head>
git diff <base>...<head> --stat
git diff <base>...<head>
```

If the split isn't obvious from the PR body's checklist, ask which concern to
extract — before reading the diff, so the classification has a target.

Every hunk gets classified `keep` (stays in the base PR) or `extract` (moves to
the child PR). Classify by **concern, not by file** — one file usually contains
both. A file whose every hunk is `extract` moves whole; a new file added solely
for the extracted concern moves whole.

Read the diff **once**. Re-reading it per file costs more than holding it.

When `--stat` shows the diff is large (say over ~600 changed lines), don't pull
it into this conversation — delegate the read to a subagent and keep only the
classification it returns:

```
Agent(subagent_type: "Explore", run_in_background: false, prompt: """
Run: git diff <base>...<head>
Concern to extract: <concern>

Classify every hunk as keep or extract. Return JSON only:
{"files": [{"path": "...", "disposition": "whole|mixed|none",
  "extract_hunks": [{"exact_text": "<verbatim text to remove, copied
  character-for-character from the post-PR file including leading whitespace
  and trailing newline>", "replacement": "<main's version if this hunk MODIFIED
  existing code, else empty string>"}]}]}

Rules:
- exact_text must be copied verbatim from the file as it stands on <head>, not
  reconstructed from diff output and not stripped of its +/- prefixes.
- Each exact_text must be unique within its file. If it is not, widen it with
  surrounding context until it is.
- disposition "whole" means the whole file moves; omit extract_hunks for those.
- Do not edit anything. Read and classify only.
""")
```

Record the classification in that JSON shape either way — Step 3 feeds the file
straight to the strip script, so the verbatim-and-unique requirements are
load-bearing. A paraphrased snippet aborts the strip. That failure is the good
outcome: it stops a half-split commit. Re-run the classification for that file
rather than hand-patching the string.

Spot-check a couple of the returned snippets against the real files before
running the strip. Delegating the read does not delegate the invariant — the
empty `git diff <original-sha>` in Step 4 is still what proves the split.

## Step 2 — Pin the original and open the stack

```bash
git checkout <head>
git rev-parse HEAD                        # the original SHA — every later check compares against it
git tag split-stack-original <head>       # cheap undo anchor; delete when done
gh stack init --base <base> <head>        # adopts the existing branch; local only, PR untouched
```

Create the stack *before* the surgery, not after. `gh stack init` adopts an
existing branch without touching its PR, and from here `gh stack add` and
`gh stack submit` do the branch-creation and push/create/link work for you.

Requires the `gh-stack` extension (`gh extension install github/gh-stack`).

## Step 3 — Strip the extracted concern from the base branch

Work on `<head>` directly if the working tree is clean (`git status --short`);
a worktree is unnecessary and `git worktree add` fails on a checked-out branch
anyway.

Remove the `extract` hunks with **one scripted pass**, not file-by-file edits:

Write the Step 1 classification to a file, then hand it to the strip script:

```bash
python3 ~/.claude/skills/split-stack/scripts/strip_hunks.py classification.json --dry-run
python3 ~/.claude/skills/split-stack/scripts/strip_hunks.py classification.json
```

Run `--dry-run` first — it validates every snippet without writing anything.

The script checks all edits before touching a file, and aborts the whole run if
any snippet is missing or matches more than once. A silently-missed replacement
is the main failure mode, and this fails loudly instead of producing a
half-split commit. Fix the classification and re-run; don't hand-patch.

When a hunk *modified* an existing method, set `replacement` to main's version
rather than leaving it empty — that restores the old text instead of deleting
the method.

Verify the strip landed where you meant:

```bash
git diff <base> --stat            # extracted-only files should be gone entirely
git diff <base> -- <mixed-files>  # the remaining diff should be pure `keep`
```

Then amend, keeping the branch a single commit:

```bash
git add <paths>
git commit --amend --no-edit
```

`git add -A` in the same command as `commit --amend` can trip permission
classifiers — run `git add <paths>` and `git commit --amend --no-edit` as two
separate calls.

## Step 4 — Rebuild the child branch on top

Don't rebase the original commit onto the amended base — the diffs overlap and
it conflicts on every file. Instead, restore the original file contents on a
branch cut from the amended base:

```bash
gh stack add <child-branch>         # branch on top of <head>, already in the stack
git checkout <original-sha> -- <every file the extracted concern touched>
git diff --cached --stat
git diff <original-sha> --stat      # MUST be empty
git commit -m "<child PR title>"
```

`gh stack add` replaces `git checkout -B <child> <head>` and registers the
branch in the stack in the same step, so Step 5 has nothing left to wire up.

That empty diff is the proof the split lost nothing. Those files hold both
concerns, and the base branch already carries the `keep` half, so restoring
the original version yields exactly `keep + extract`.

If it isn't empty, a hunk was misclassified — fix the classification, don't
patch the child.

## Step 5 — Verify, push, open

Run the specs covering the touched code on **both** branches — the base branch
is the one that can break, since it's the tree that never existed before.

```bash
git checkout <child-branch> && bundle exec rspec <affected specs>
git checkout <head>          && bundle exec rspec <affected specs>
```

Use the narrow spec list, not the whole suite; if the full suite is warranted,
use `turbo_tests`, never bare `bundle exec rspec`.

One command pushes every branch (`--force-with-lease` per branch), creates the
child PR, retargets the base PR, and registers the stack on GitHub:

```bash
gh stack submit --auto --open
```

`--auto` is required — a bare `gh stack submit` opens an interactive TUI that
an agent can't drive. `--open` keeps new PRs out of draft. The trade-off is
that `--auto` generates the title and leaves the body empty, so set them
straight after:

```bash
gh pr edit <child-pr> --title "..." --body "..."
```

Write the child PR body in the **same voice and structure as the original**
(same `## Why?` / `## What Changed` headings, same checklist style, same
plain declarative tone). Move the relevant checklist lines out of the base
PR's body and into the child's; add a `Stacked on #<base>.` line. Then edit
the base PR body to drop those lines and point at the child.

## Step 6 — Confirm and clean up

```bash
gh stack view
git tag -d split-stack-original
git checkout <original-branch>
```

If the stack was never opened in Step 2 — you inherited branches and PRs that
already exist — `gh stack link <base-pr> <child-pr>` (bottom-to-top) registers
them after the fact without local tracking. Prefer `init` + `submit`.

## Notes

- Merge bottom-up. Merging the base into `main` auto-retargets the child to
  `main`.
- The base branch gets force-pushed, so its review comments stay but line
  anchors may move. Say so when handing the split back.
- More than two concerns: repeat Steps 3–4 per concern, each `gh stack add`
  landing on top of the previous child. Top of stack stays identical to the
  original. One `gh stack submit --auto --open` at the end covers them all.
- `gh stack modify` reorders, folds, or drops branches after the fact — reach
  for it instead of redoing the split when only the ordering is wrong.
