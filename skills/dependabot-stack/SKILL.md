---
name: dependabot-stack
description: Group all open Dependabot PRs on a repository into a single ordered stack using gh-stack. Run weekly, after Dependabot's batch of grouped-update PRs lands. Use when asked to stack, organize, or clean up Dependabot PRs.
allowed-tools: Bash(gh pr list:*) Bash(gh pr diff:*) Bash(gh repo view:*) Bash(gh extension list:*) Bash(gh extension install github/gh-stack:*) Bash(gh stack:*) Bash(git worktree:*) Bash(git fetch:*) Bash(git checkout:*) Bash(git rebase:*) Bash(git add:*) Bash(git push:*) Bash(bundle lock:*) Bash(yarn install:*) Bash(git rev-parse:*) Bash(git branch:*) Bash(mktemp:*)
---

# Dependabot Stack

Turns the week's open Dependabot PRs into one ordered stack of PRs (each based
on the previous, via `gh stack link`), so they land as a single reviewable,
mergeable chain instead of N independent PRs that will conflict on shared
lockfiles.

Requires the `gh-stack` extension (`gh extension install github/gh-stack` if
`gh stack --help` fails).

## Step 0 — Establish repo and starting point

The target repo defaults to the current checkout. Only when `$ARGUMENTS` names a
repo (`owner/name`) does that win:

```bash
REPO="${ARGUMENTS:-$(gh repo view --json nameWithOwner --jq .nameWithOwner)}"
DEFAULT_BRANCH=$(gh repo view "$REPO" --json defaultBranchRef --jq .defaultBranchRef.name)
ROOT=$(git rev-parse --show-toplevel)
ORIGINAL_BRANCH=$(git branch --show-current)
```

`gh repo view` with no argument reads the current directory's `origin` remote,
so this fails outside a git checkout — if it does, ask the user which repo to
stack rather than guessing.

Steps 3 and 4 rebase and push locally, so run this skill from a checkout of
`$REPO`. If `$ARGUMENTS` names a repo the current directory isn't a checkout of,
stop and ask the user to run it from there. `$DEFAULT_BRANCH` stands in for
`main` on repos that use another name.

## Step 1 — List the open Dependabot PRs

```bash
gh pr list --repo "$REPO" --author app/dependabot --state open \
  --json number,title,headRefName,baseRefName
```

Drop any `*-major-updates` PRs from the list before counting; they never enter
the stack. If 0 or 1 PRs remain, stop — there's nothing to stack.

## Step 2 — Determine ordering

Ordering is driven by file overlap, not just category: two PRs that touch the
same lockfile (`Gemfile.lock`, `yarn.lock`/`package.json`) MUST be adjacent in
the stack in a fixed priority order, because rebasing one on the other is what
avoids a manual lockfile-conflict resolution later. PRs touching disjoint files
(e.g. `.github/workflows/*.yml`) have no ordering constraint from Dependabot
and can go anywhere, but default to the end of the stack for a stable,
predictable order week to week.

Check file overlap per PR:

```bash
for pr in <pr-numbers>; do
  echo "=== PR $pr ==="
  gh pr diff $pr --repo "$REPO" --name-only
done
```

Within an overlapping group, order by this fixed priority (most important /
most likely-to-conflict first):

1. `*-security` groups (e.g. `production-security`, `development-security`)
2. `production-minor-updates` (bundler before npm/yarn if both present)
3. `development-minor-updates` (bundler before npm/yarn if both present)
4. Anything else touching the same lockfile family

`*-major-updates` PRs are left out of the stack on purpose. A major bump can
carry breaking changes, so each one needs its own review and its own test run —
stacking it would bury that behind the rest of the stack. Leave them open and
tell the user which ones you skipped.

PRs with no file overlap with any other open PR (typically
`github-actions-updates`, since it only touches `.github/workflows/*.yml`) go
at the very end of the single combined stack — there's no correctness reason
to stack them, but keeping one stack instead of a separate ungrouped PR keeps
the weekly review to one thing to look at.

Produce a single ordered list of branch names, bottom of stack first, e.g.:

```
dependabot/npm_and_yarn/production-security-XXXX
dependabot/bundler/production-minor-updates-XXXX
dependabot/npm_and_yarn/production-minor-updates-XXXX
dependabot/bundler/development-minor-updates-XXXX
dependabot/npm_and_yarn/development-minor-updates-XXXX
dependabot/github_actions/github-actions-updates-XXXX
```

## Step 3 — Rebase each branch onto the previous one

Do this in a scratch git worktree off the default branch so the user's current
branch and working tree are never touched:

```bash
WT=$(mktemp -d)/stack-wt
git worktree add "$WT" "$DEFAULT_BRANCH"
cd "$WT"
git fetch origin <branch-1> <branch-2> ... <branch-N>
git checkout -q -B <branch-1> origin/<branch-1>
```

The bottom branch is already based on the default branch and needs no rebase,
but it must exist as a local branch for the next one to rebase onto. Then walk
the ordered list from Step 2 pairwise:

```bash
git checkout -q -B <branch-N> origin/<branch-N>
git rebase <branch-N-minus-1>
```

Rebase onto the local `<branch-N-minus-1>`, never `origin/<branch-N-minus-1>` —
the local one carries the rebase from the previous pair, which hasn't been
pushed yet.

Rebase strictly in stack order, one pair at a time, top of stack last. If any
rebase conflicts, stop and resolve it manually before continuing to the next
pair. Resolve the manifest diff (`Gemfile`, `package.json`) by hand, then
regenerate the lockfile:

```bash
bundle lock
yarn install --mode=update-lockfile
```

`--mode=update-lockfile` rewrites `yarn.lock` without installing `node_modules`,
which the scratch worktree does not need.

`yarn.lock` can conflict on its own even when `package.json` merges cleanly —
its dependency-metadata block is a conflict site in its own right. Regenerating
the lockfile settles it; do not hand-edit the block.

## Step 4 — Push the rebased branches

```bash
git push origin <branch-2> <branch-3> ... <branch-N> --force-with-lease
```

(The bottom branch, `<branch-1>`, was never rebased, so it doesn't need
pushing.)

Clean up the worktree:

```bash
cd "$ROOT"
git worktree remove "$WT" --force
```

## Step 5 — Register the stack on GitHub

```bash
gh stack link <pr-1> <pr-2> <pr-3> ... <pr-N>
```

Pass PR numbers in the same bottom-to-top order as Step 2/3. This both
retargets each PR's base branch to the previous branch in the stack (if not
already done by the rebase push) and registers them as a `gh-stack` stack.

Verify:

```bash
gh stack checkout <stack-number>
gh stack view
```

Then switch back to whatever branch the user was on before this skill ran:

```bash
git checkout "$ORIGINAL_BRANCH"
```

## Notes

- Dependabot will force-push its own branches again if it detects new
  upstream releases before the stack merges — re-run this skill if that
  happens rather than trying to patch the stack incrementally.
- Merge from the bottom of the stack up. Merging the bottom PR into the
  default branch should cause GitHub to auto-retarget the next PR's base.
- This process is destructive to branch history (force-push, rebase) — it
  only touches Dependabot's own auto-generated branches, never a
  human-authored branch.
