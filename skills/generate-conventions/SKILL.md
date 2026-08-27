---
name: generate-conventions
description: >
  Interactively fill a project's docs/conventions/ — propose candidate rules
  from taste calls, from the codebase itself, and from patterns mined out of
  past PR review comments, then write the ones the user confirms.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion
metadata:
  author: rolemodel
  version: "1.1"
  triggers: "generate conventions, write conventions, document our conventions, mine review history, what do reviewers keep flagging, audit past PR feedback, update conventions from code reviews"
---

# Generate Conventions

The user decides what becomes a convention. You propose, hold the bar, and write
only what they confirm. Four sharp files beat twenty that restate the framework.

## 1. Read the bar

`docs/CONVENTIONS.md` must exist — if not, run `scaffold-docs` first. Its "What
belongs in a convention file" section governs everything below. Read the existing
`docs/conventions/` files too: a rule that fits one of them is an edit.

## 2. Gather candidates

Answer the prompts below against this project. Skip any that don't clearly apply
— no convention beats an unhelpful one. Each candidate needs evidence in the
code, and you don't get to invent the project's position. Skip anything a survey
already answers: the stack, the layout, the actions a controller happens to have.
That's architecture.

**Taste**

- What a template may not do: grouping, sorting, transforming.
- Helper or partial — which shape gets which.
- Whether a non-CRUD operation earns a custom action or its own controller.
- What a callback may do, versus what the caller must do explicitly.
- Whether names describe purpose or appearance.
- Which layers get tests, and which deliberately don't.
- What an assertion may reach for, and what not to assert at all.
- Duplication in tests: descriptive repetition, or extracted setup.
- Whether a behavior change updates the old test or adds one beside it.
- When a comment earns its place.
- What counts as scope creep: speculative abstractions, defensive branches, refactors outside the ask.

**Facts the code won't announce**

- The project's own wrapper, used instead of the library it hides.
- Behavior that's global rather than opt-in, so every test has to expect it.
- A framework helper that doesn't work on this stack, and its replacement.
- A change that looks free and isn't: user-facing copy, an enum value, a shared factory trait.
- The one class every value of a kind must pass through.
- The model that exists versus the one newcomers assume exists.

**Mined from review history**

Run `scripts/mine_review_comments.sh` (defaults to the last 100 merged PRs on the
current repo) to pull every human reviewer comment, already stripped of bots and
of the PR author's own replies. Cluster what comes back by the thing being
flagged, not by wording, and count distinct PRs and distinct reviewers per
cluster — a comment one reviewer made once is an opinion; the same correction
from more than one PR or more than one reviewer is a convention nobody wrote
down. Quote one or two comments as evidence when a cluster becomes a candidate.
When a cluster matches an existing `docs/conventions/` file, it's evidence for
strengthening that file, not a new one — see step 1.

Then ask the user what they keep correcting in review — highest signal, and you
can't grep it. Taste lives in one person's head while counterexamples sit in the
repo, so weigh what they say over what most files do. Mined clusters make good
follow-up questions here too: "reviewers flagged this in three PRs — does that
match what you'd tell someone joining the team?"

## 3. Kill most of them

Drop a candidate when a linter or test already fails on the violation, one file
shows it, a manifest pins it, it restates a framework default, it's true of any
codebase, or it happened once and nobody defends it. For mined clusters, "once"
means one PR or one reviewer — a recurring correction from a single person is
still just their preference until someone else echoes it or the user confirms it.

What survives is **how this project does something**, or **taste** — and would
cost someone a wrong guess.

## 4. Confirm one at a time

Show the survivors as a shortlist, one line each, naming the evidence. Ask which
they want (`AskUserQuestion`, multi-select) and what you missed.

Then per rule: state it back, get a yes, write the file, show it, next. Never
batch-write a directory.

## 5. Write it small

```md
# <Title>

<The rule, imperative, one or two sentences.>

<A second paragraph only for the trap that makes the rule non-obvious.>
```

Three to seven lines. Ten is long. Fifteen means two rules, or none.

- The rule is the first sentence — no preamble.
- Why only where the rule looks arbitrary without it.
- Name a reference implementation, don't transcribe it: "follow `person_spec.rb`"
  beats fifteen lines of example.
- A code sample only where prose can't state the rule — once, three lines.
- No headings.

Add one `docs/CONVENTIONS.md` entry: a clause after the em dash, plus an accurate
`<!-- paths: -->` glob so the hook surfaces it on edit.

## 6. Verify and report

Check that every path resolves, every glob matches something, and no file runs
past a screen. Leave `.github/instructions/conventions.instructions.md` alone —
it points at the index and must not restate a rule.

Report what you wrote, what you indexed, and what you rejected and why.
