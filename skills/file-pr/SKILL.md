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

Gather context first, as one batch:

```bash
git status
git fetch origin
git log --oneline origin/HEAD..HEAD
git diff origin/HEAD...HEAD --stat
git diff origin/HEAD...HEAD
gh pr list --head "$(git branch --show-current)" --state open --json number,url,title
ls .github/pull_request_template.md .github/PULL_REQUEST_TEMPLATE.md .github/PULL_REQUEST_TEMPLATE/ docs/pull_request_template.md pull_request_template.md 2>/dev/null
```

Use three dots in `origin/HEAD...HEAD`. Two dots compares against the current tip of the default branch and misdescribes the PR.

An open PR from `gh pr list` means you are updating it — `gh pr create` fails on a branch that already has one.

Empty `git log` output means no commits ahead of the default branch. When `git status` shows changes, describe the PR from the working-tree diff.

Never commit on the default branch. On `main` or `master`, run `git switch -c <branch>` and tell the user the name. Only create a new branch — switching to an existing one changes which work the PR describes.

Before committing uncommitted work, say what you will commit and wait for the user to agree. Stage named paths, never `git add -A`. Check `git status` after staging; if anything unexpected appears, stop and ask.

Push with `git push -u origin HEAD`, write the description to a file in the scratchpad directory, and open the PR:

```bash
gh pr create --title "<title>" --body-file <path> --assignee @me
```

Add `--draft` when the work is unfinished. Always use `--body-file`, never `--body` — the shell eats backticks and `$` in a long inline string.

Always assign the person opening the PR, whoever authored the commits. If `@me` fails, pass the login from `gh api user --jq .login`. Add reviewers only when the user names them. Print the PR URL.

## Updating an existing PR

Read the current description first, then write the full replacement to a file and edit in place. Don't assign or add reviewers again.

```bash
gh pr view <pr> --json title,body
gh pr edit <pr> --title "<title>" --body-file <path>
```

`--body-file` replaces the whole body, so carry every heading. Keep whatever the user wrote under **Screenshots** and any checklist boxes they ticked. Print the PR URL.

## Description format

A repo PR template sets the shape — see the next section. Otherwise use these headings, in this order. **Post-merge** appears only when the PR needs it.

```markdown
## Why

## What Changed

- [x] ...

## Post-merge

- [ ] ...

## Screenshots
```

Every box under **What Changed** ships checked — each line is work already done.

**Post-merge** lists work someone must do after the merge — a backfill, a re-import, a config change. Every box ships unchecked. One line per item: what to run and what stays broken until it runs.

**Screenshots**: when the PR changes nothing visible, write `N/A — no UI changes`. When it changes the UI and you can capture the screen yourself — a browser tool, a simulator, a running dev server — take the screenshots by default; don't wait to be asked. Save them to the scratchpad directory, and keep real credentials and customer data out of frame. Use files the user gives you too. When you have no images, leave the section empty for the user.

Reference each file under **Screenshots** in the body, and pass the same path to `--attach` on `gh pr create` or `gh pr edit`:

```markdown
![Invite list showing delivery status](<scratchpad>/invite-status.png)
```

```bash
gh pr create --title "<title>" --body-file <path> --assignee @me --attach <scratchpad>/invite-status.png
```

`gh` uploads the file and rewrites the reference to the uploaded URL. An unreferenced file is appended below every other section, so always write the reference. If some uploads fail, `gh` still opens the PR, exits non-zero, and prints the URL — tell the user which files are missing. `--attach` needs `gh` 2.99.0 or later; on an older version, leave the section for the user.

## The project's PR template

If the `ls` found a template, read it first. `--body-file` replaces it outright, so any section you don't write is gone.

The template is the repo's expectation, and the place the team goes to change it. Keep its headings, wording, and order, and add none. Replace each placeholder, and follow its instructions for a section, such as deleting it when it doesn't apply.

The rules below say how to fill a section, not which sections exist. Apply the **Why** rules to its equivalent (**Why?**, **Summary**, **Motivation**) and the **What Changed** rules to its list of changes.

In a checklist, check each item this PR did. Check and strike through each item that doesn't apply: `- [x] ~~Updated relevant READMEs~~`. Leave an item unchecked only when it applies but isn't done. Leave a section only the user can answer for them. When you print the URL, mention both, and any post-merge work the template has no place for.

## Description rules

**Why**

- High level. Two sentences per feature at most, preferably one. Give each feature its own short paragraph.
- When possible, explain the user-facing problem and how the change solves it.
- Explain anything a reviewer would question — an odd workaround, a surprising dependency — one sentence each, in a paragraph after the features. These don't count against the cap.
- State facts, not narrative. Cut stock phrases ("all along", "it turns out"), contrasts between how things were and how they are now, and anything implying fault.
- Every clause must carry a fact a reviewer can act on. Cut clauses that exist for rhythm, and claim no more than the change does.
- Use inline code sparingly — more than twice usually means too much detail.
- When editing an existing PR, rewrite awkward prose rather than copying it.

**What Changed**

- One checkbox line per change, every box checked, five lines at most. Drop plumbing a reviewer will meet in the diff, and fold supporting changes into the line they serve.
- Say what the change does, not how it is built — no file, class, or method names unless the line is meaningless without them.
- Roughly a dozen words per line, one clause. No "so that", "because", "rather than", "which" — reasons belong in **Why**.
- Don't restate **Why**. Skip test changes. Give a new or removed dependency its own line. Group trivial churn into one line.

**Title**

- One line, imperative mood, no trailing period.
- Prefix the ticket ID in square brackets — e.g. `[ABC-123] Add delivery status to invite list`.
- Look for the ID in the branch name, then the commit messages. If neither has one and the repo's recent PR titles use IDs, ask the user. Otherwise skip the prefix.

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

![Invite list showing delivery status](<scratchpad>/invite-status.png)
```
