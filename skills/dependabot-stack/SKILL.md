---
name: dependabot-stack
description: Group all open Dependabot PRs on a repository into a single ordered stack using gh-stack. Run weekly, after Dependabot's batch of grouped-update PRs lands. Use when asked to stack, organize, or clean up Dependabot PRs.
allowed-tools: Bash(gh pr list:*) Bash(gh pr diff:*) Bash(gh repo view:*) Bash(gh extension list:*) Bash(gh extension install github/gh-stack:*) Bash(gh stack:*) Bash(git worktree add:*) Bash(git worktree remove:*) Bash(git fetch origin:*) Bash(git checkout:*) Bash(git rebase:*) Bash(git push origin:*) Bash(git rev-parse:*) Bash(git branch:*) Bash(mktemp:*) Bash(cd:*)
---

# Dependabot Stack

Turns the week's open Dependabot PRs into one ordered stack of PRs (each based
on the previous, via `gh stack link`), so they land as a single reviewable,
mergeable chain instead of N independent PRs that will conflict on shared
lockfiles.

Requires the `gh-stack` extension (`gh extension install github/gh-stack` if
`gh stack --help` fails).

## Step 0 — Establish repo and starting point

Run from the repository the PRs belong to. Take `REPO` from `$ARGUMENTS` if the
user named one, otherwise from the current checkout:

```bash
REPO=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
ROOT=$(git rev-parse --show-toplevel)
ORIGINAL_BRANCH=$(git branch --show-current)
```

Also note the repository's default branch — `main` below stands for whatever
`gh repo view --json defaultBranchRef --jq .defaultBranchRef.name` reports.

## Step 1 — List the open Dependabot PRs

```bash
gh pr list --repo "$REPO" --author app/dependabot --state open \
  --json number,title,headRefName,baseRefName
```

If there are 0 or 1 open Dependabot PRs, stop — there's nothing to stack.

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
git worktree add "$WT" main
cd "$WT"
git fetch origin <branch-1> <branch-2> ... <branch-N>
```

Then, walking the ordered list from Step 2 pairwise (skip the first branch —
it's already based on the default branch and needs no rebase):

```bash
git checkout -q <branch-N>
git rebase <branch-N-minus-1>   # use origin/<branch> if no local branch exists yet
```

Rebase strictly in stack order, one pair at a time, top of stack last. If any
rebase conflicts, stop and resolve the conflict manually (typically a lockfile
conflict — regenerate it with `bundle lock` / `yarn install` after resolving
the `Gemfile`/`package.json` diff by hand) before continuing to the next pair.

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
