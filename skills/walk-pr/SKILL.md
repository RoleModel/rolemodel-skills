---
name: walk-pr
description: >
  Produce a reviewer's guide to a pull request — a reading order, the decisions
  the diff makes that its ticket doesn't, what the change can break, and what a
  user would notice. Emits questions for a human to answer, not defect claims.
  Trigger when someone is about to review a PR and wants to know where to look,
  asks to walk through a PR, asks what matters in a diff, or is reviewing a
  change in unfamiliar code.
allowed-tools: Read, Glob, Grep, Bash
metadata:
  author: rolemodel
  version: "1.0"
  triggers: "walk this PR, review guide, where should I look, what matters in this diff, help me review"
---

# Walk PR

A review tool says what is wrong. This says **where to look and what to decide**.
Those are different jobs, and the second one has no owner.

Everything here is addressed to a human who is about to read the diff. If a finding
is a defect claim, it belongs in the code review — leave it out.

## Three constraints

1. **Shorter than the diff.** A guide that takes longer to read than the code has
   failed. Aim for one screen.
2. **Questions, not verdicts.** You are routing judgment to the person who has
   context you don't. "Does the ticket intend X?" not "X is wrong."
3. **End with what you could not determine.** That section is the deliverable, not
   a disclaimer. A guide that projects total confidence is worse than none.

## Gather

Read the ticket if one is reachable (branch name or PR title carries the ID, the
`linear` MCP server has the description and acceptance criteria). Read the diff.
Read the repo's conventions for the paths it touches. Do not read existing review
comments — you are writing for someone who has not read them either, and you will
just restate them.

## Emit, in this order

### 1. The spine

Name the 2–5 files that carry the change, in the order they should be read —
usually entry point, then the model or service it calls, then what renders. Say in
one line why that order. Then name what is mechanical (migrations, schema, permitted
params, generated files) so the reader can skim it.

If every file is mechanical, say so and stop. Some PRs need no guide.

### 2. Decide these

The decisions the diff makes that the ticket doesn't settle. Each is one line, a
file:line anchor, and a question. Draw from what the code does, not what it should
do — you are surfacing choices, not grading them.

Look hardest at: money and rounding, anything keyed to a state or jurisdiction, who
can see or do a thing, what a customer signs or receives, and defaults applied to
existing records. A backfill that sets a value for records that already exist is
always a decision.

Cap this at five. If there are more, the PR is too big and that is the finding.

### 3. Blast radius

Mechanical, not judged. For each changed method or template: existing call sites,
and existing specs that cover it and were **not** updated in this diff. Compute it —
`grep -rn` the method name across `app lib spec` — and report counts with paths.

**Check out the PR's head first.** Grepping from the base branch finds nothing,
because the code under review isn't there yet, and "0 call sites" then looks like a
finding instead of a mistake. Confirm you are on the head commit before you count.

Report nothing you did not actually run. If a name is too generic to grep usefully,
say that instead of guessing.

### 4. What a user sees

Screens, copy, emails, and documents that change. For anything rendered to a
customer — a contract PDF, an email — say plainly that the reviewer should look at
the rendered output, and name the file. A diff of a template is not a review of
what it produces.

If nothing user-visible changes, one line saying so.

### 5. Could not determine

What you tried to check and couldn't, and why. Business rules with no source in the
repo. Behavior that depends on data you can't see. Anything where you found a
plausible answer but could not verify it — say that you could not verify it rather
than reporting the plausible answer.

Never cite a file, line, or value you have not read. A fabricated citation in this
section defeats the entire purpose of the guide.
