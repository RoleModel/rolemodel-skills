---
name: file-pr
description: >
  Opens pull requests with a consistent description format and assignment. Use when the user asks to open, create, or draft a PR or pull request, push a branch for review, or write a PR description.


metadata:
  author: rolemodelsoftware
  version: "1.0"
  triggers: "open a PR, create a PR, file a PR, draft a PR, pull request, PR description, write the PR body, update the PR description, push this for review, put this up for review, ready for review"
allowed-tools: Bash(git status:*), Bash(git fetch:*), Bash(git log:*), Bash(git diff:*), Bash(git branch:*), Bash(git switch:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(ls:*), Bash(gh pr create:*), Bash(gh pr edit:*), Bash(gh pr view:*), Bash(gh pr list:*), Bash(gh api user:*), Read, Write
---

# Opening a Pull Request

## Commands

Gather context before writing anything:

```bash
git status
git fetch origin
git log --oneline origin/HEAD..HEAD
git diff origin/HEAD...HEAD --stat
git diff origin/HEAD...HEAD
gh pr list --head "$(git branch --show-current)" --state open --json number,url,title
ls .github/pull_request_template.md .github/PULL_REQUEST_TEMPLATE.md .github/PULL_REQUEST_TEMPLATE/ docs/pull_request_template.md pull_request_template.md 2>/dev/null
```

Run these as one batch. Note `origin/HEAD...HEAD` — three dots. Two dots compares against the current tip of the default branch and misdescribes the PR.

The `gh pr list` result decides which path you are on. An open PR means updating the existing one — `gh pr create` fails outright on a branch that already has a PR.

Empty `git log` output means no commits ahead of the default branch — the work may be uncommitted, or you may still be on the default branch. When `git status` shows changes, describe the PR from the working-tree diff instead.

Never commit on the default branch. When `git status` reports `main` or `master`, create a branch with `git switch -c <branch>` first and tell the user the name you picked. Only ever create a new branch — switching to an existing one changes which work the PR describes.

Commit uncommitted work before pushing, but say what you are about to commit and wait for the user to agree first. Stage named paths, never `git add -A`, which sweeps unrelated changes into the PR. Review `git status` after staging; if anything unexpected appears, stop and ask.

Push with `git push -u origin HEAD`, then write the description to a file and open the PR:

```bash
gh pr create --title "<title>" --body-file <path> --assignee @me
```

Add `--draft` when the work is unfinished. Use the scratchpad directory for the body file. Always use `--body-file`, never `--body` — the shell eats backticks and `$` in a long inline string.

Assign the person opening the PR every time, whoever authored the commits. `--assignee @me` resolves to the account `gh` is authenticated as, so it needs no configuration; if it fails, pass the login from `gh api user --jq .login` instead. Add reviewers only when the user names them.

After creating, print the PR URL.

## Updating an existing PR

When the branch already has an open PR, read its current description first, so the rewrite starts from what is there:

```bash
gh pr view <pr> --json title,body
```

Write the full replacement description to a file and edit in place. Never assign or add reviewers again — the PR already has both.

```bash
gh pr edit <pr> --title "<title>" --body-file <path>
```

`--body-file` replaces the whole body, so the file must carry every heading, not just the changed part. Preserve whatever the user wrote under **Screenshots** — that content is theirs, and a careless edit drops it.

Print the PR URL when done.

## Description format

Use these headings, in this order. **Why**, **What Changed**, and **Screenshots** are always present; **Post-merge** appears only when the PR needs it.

```markdown
## Why

## What Changed

- [x] ...
- [x] ...

## Post-merge

- [ ] ...

## Screenshots
```

Every box under **What Changed** ships checked. Each line is work that is already done, so an unchecked box would read as unfinished.

**Post-merge** lists work someone has to do after the merge — a data backfill, a re-import, a config change, a manual migration step. Every box ships unchecked: it is a list to work through once the PR lands. One line per item, saying what to run and what stays broken until it runs. Omit the heading entirely when there is none.

Leave **Screenshots** empty — the user fills it in. When the PR changes nothing visible, keep the heading and write `N/A — no UI changes` under it, so reviewers are not left waiting for an image.

## The project's PR template

If the `ls` above found a template, read it before writing the body. `--body-file` replaces the template outright, so anything the repo expects and you don't write is simply gone.

Treat it as a hint, not a blueprint. The headings above still govern the shape of the description — a template asking for **Summary** instead of **Why** doesn't change what you write or what you call it.

What the template is good for is the section you would never have thought to include: a deploy or migration checklist, a ticket link, a rollout or rollback plan, a testing-notes block, an accessibility or security sign-off, a "did you update the docs" box. Those are repo standards, and the reviewer is looking for them. Carry over the ones this PR actually needs and fill them in — a heading left as an empty prompt is worse than no heading.

Drop the rest. Never copy the template's HTML comments or placeholder text into the body. When a template section asks for something only the user can answer, add the heading, leave it for them, and say so when you print the URL.

## Description rules

**Why**

- High level. Maximum two sentences per feature, preferably one sentence.
- If the PR covers more than one feature, give each its own short paragraph.
- When possible, explain the user-facing problem and how the change solves it.
- Explain anything unexpected — an odd workaround, a surprising dependency, a choice a reviewer would question — one sentence each. These do not count against the two-sentence cap; put them in their own paragraph after the feature paragraphs.
- State facts, not narrative. Cut stock phrases ("all along", "it turns out"), rhetorical contrasts between how things were and how they are now, and anything implying fault for the state of the code.
- Every clause must carry a fact a reviewer can act on. Cut clauses that exist for rhythm or that call back to a phrase used earlier, and claim no more than the change does — describe what it fixes, not the class of problem it gestures at.
- Use inline-code syntax sparingly. If you need it more than twice then you are probably including too much detail.
- When editing an existing PR, don't copy its prose as-is — read each sentence fresh and rewrite anything awkward, same as if you'd drafted it yourself.

**What Changed**

- A checkbox list, one line per change, every box checked.
- Five lines at most; a longer list stops being scannable. To get under five, drop internal plumbing a reviewer will meet in the diff anyway and fold each supporting change into the line for the change it serves.
- High level. Say what the change does, not how it is built — skip file names, class names, and method signatures unless the change is meaningless without them.
- Keep each line short enough to scan in one glance — roughly a dozen words.
- One clause per line. No "so that", "because", "rather than", "which" — reasons and contrasts belong in **Why**, or nowhere. A comma is fine when it folds related work into one line, not when it smuggles in a reason.
- Never restate a point already made in **Why**.
- Skip test changes — tests are assumed.
- A new or removed dependency always gets its own line.
- Group trivial churn into one line rather than listing every file.

**Title**

- One line, imperative mood, no trailing period.
- Prefix the ticket ID, separated by `|` — e.g. `ABC-123 | Add delivery status to invite list`.
- Look for the ID in the branch name first, then in the commit messages. If neither has one and the repo's recent PR titles use IDs, ask the user for it. Otherwise skip the prefix.

## Example

```markdown
## Why

Users could not tell whether an invite had been sent, so support kept fielding "did it go through?" tickets. This adds a visible status on the invite list.

Delivery status comes from the mail provider's webhook rather than our own send call, because our send only proves we queued the message.

## What Changed

- [x] Show delivery status on each row of the invite list
- [x] Record provider webhook events against the invite
- [x] Backfill status for invites sent in the last 30 days
- [x] Add the mail provider's webhook gem

## Post-merge

- [ ] Run `rake invites:backfill_status` — existing invites show no status until it runs.
- [ ] Point the provider's webhook at `/webhooks/mail` in the provider dashboard; no new events record until then.

## Screenshots
```
