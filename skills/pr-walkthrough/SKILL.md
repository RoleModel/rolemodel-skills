---
name: pr-walkthrough
description: >-
  Structured, file-by-file walkthrough of a branch or PR that builds the
  reader's mental model of the change, rather than hunting for bugs. Use when
  the user asks to "walk me through this PR/branch", "help me understand this
  branch", wants a structured review for their own mental model, or wants to
  understand a change before reviewing or approving it. Understanding-oriented:
  never approves, rejects, or submits a review.
metadata:
  author: rolemodelsoftware
  version: "1.0"
  triggers: "walk me through this PR, walk me through this branch, PR walkthrough, branch walkthrough, help me understand this branch, help me understand this PR, structured review, review for my mental model, explain this PR file by file, onboard me to this PR"
allowed-tools: Bash(git fetch:*) Bash(git log:*) Bash(git diff:*) Bash(git status:*) Bash(git branch:*) Bash(git merge-base:*) Bash(git rev-parse:*) Bash(git show:*) Bash(gh pr view:*) Bash(gh pr diff:*) Bash(gh pr checks:*) Bash(gh pr list:*) Bash(gh api:*) Read Grep Glob
---

# PR / Branch Walkthrough Review

## Purpose

This is a teaching walkthrough, not a bug hunt. The goal is to build the user's mental model of a branch/PR by going through it file-by-file, in an order that tells the story of the change, explaining the "why" behind each diff.

Write so the walkthrough stands on its own. The user may read an entire batch without opening a single file — that is a success, not a failure. They open a file when they want to go *deeper* than the explanation, not in order to follow it. Everything needed to get the point belongs in the message, including the code (see **Quoting code** below).

Works on whatever branch/PR is currently checked out or named by the user — never assume a hardcoded branch name.

## Setup (ask only if not already clear from context)

- Confirm the branch/PR name (or use current checked-out branch if the user says "this branch").
- Default assumption: full walkthrough, every changed file included. Don't ask which file types to skip. Only exclude a category (e.g. CSS) if the user explicitly says so when invoking the skill (e.g. `/pr-walkthrough ignore css changes`) or earlier in the conversation.
- Ask if there's anything specific they already know they want touched on (new features, risky logic, particular files) — fold these into the plan rather than treating them as a separate list.

## Step 1 — Frame the PR, then plan the order

### The frame, before the first file

Open with a short framing section. Its job is to give the user something to hang every later batch on, so that "third instance of this pattern" lands in batch 6 instead of arriving cold:

- What the PR is actually trying to do, and what it builds on or follows from.
- Structural context the diff silently assumes — two parallel stacks, a vendored boundary, a half-finished migration, a stacked base branch. A small table often beats prose here.
- **The central idea, named.** One sentence, plus the concrete token to watch for while reading: a class name, a new option, a predicate, a pattern. This is the single highest-value paragraph in the whole review — it converts a sequence of file diffs into one argument with evidence.

If the PR genuinely has no unifying thesis — a grab-bag of unrelated fixes — say that plainly instead of manufacturing one. A false thesis is worse than none.

### The order

Decide an order that tells the story — not alphabetical, not by file type. Default heuristics:

- Foundational/shared changes first (types, schemas, models, utils)
- Then the core logic that depends on them
- Then UI/consumers of that logic
- Tests last for each logical unit (or grouped with their subject file if tightly coupled)

These are defaults, not rules. Narrative value wins: if a doc, ledger, config, or decision record pre-explains ugliness the reader will hit in later files, lead with it even though nothing depends on it in a dependency sense.

Group files that only make sense together (e.g. a component + its hook, or a migration + the model it changes) — don't force strict one-file-at-a-time if two files are one idea. Splitting one large file across two batches is fine when it carries two independent ideas.

Present the planned order/grouping before diving in, so the user knows what's coming and can reshuffle if they'd rather start elsewhere.

## Step 2 — Go through files, 1–3 at a time

Once the file order/grouping is set, the number of batches is fixed for the rest of the review — compute the total batch count up front so it can be referenced consistently.

Start every batch with a header of the form:

`Batch <current> of <total> — <short idea behind this batch>`

e.g. "Batch 7 of 10 — the legend becomes a property". The short phrase should capture the story-beat of that batch, not just list the filenames.

For each batch:

1. **Open with the file list, as an unordered list.** Batch header first, then one bullet per file — a linked path plus an optional line range. Never a prose sentence that runs the filenames together and wraps. Include the list every time, even if those files were named earlier in the conversation. Then flow straight into the rest of the batch in the same message. Do NOT stop and wait for the user to confirm they've opened them — they can open files while reading, and a second confirmation for the same batch is wasted friction. The only pause per batch is the go-ahead at the end (step 5). Frame the list as where to look for more, not as a prerequisite — what follows has to work without it.
2. **Flags go here, above the explanation — never buried mid-body.** Anything genuinely wrong: a real bug, new logic that isn't sound, a behavior change that looks unintended, or a test-count problem (more cases than add value, tests that assert nothing meaningful). Mark each one so it survives a skim — a bolded `⚠ Flag:` lead-in, one or two sentences, with `file:line`. If a piece of logic is going to be reworked, don't then walk through the design intent of code that's about to change. If nothing is wrong, write nothing here — don't manufacture a flag, and don't assume the PR is in bad shape by default. Hunting for problems isn't the goal; not losing the ones you find is.
3. **The explanation** — the reasoning behind the change: what problem it solves and how it fits the bigger picture, not an inventory of what changed. When possible, explain the user-facing problem and how the change solves it — what someone using the app hit, and what they get instead. Call out cross-file ideas as they emerge ("this pattern returns in the next file", "this is the shared foundation for X and Y"). Only go deep on the "why" behind new logic once you're confident it's sound and staying as-is.
4. Close each batch with a hands-on callout — one time-boxed thing to go try ("Worth a click (2 min)"), saying what to look at and what would count as *wrong*. Pick the check that could plausibly fail over a tour of what obviously works. When a batch genuinely has nothing to verify by hand — a test helper, a lint fix, a pure deletion — say so explicitly and move on; an honest "nothing to click here, skip it" is better than a manufactured exercise. One per batch, not one per file.
5. End with a one-line hook at what's coming — the *idea* in the next batch, not just its filenames ("Next: where the legend goes, and how it becomes a domain-model concern instead of a view concern"). Then wait for the user's go-ahead. Naming the next batch's files here is fine and often helpful; it does not excuse step 1's file list, which is mandatory when that batch actually opens.

**The final batch is a batch like any other.** It carries its own flags and nothing more — no flag recap, no summary of the walkthrough, no roll-up of earlier batches. Its hook is a one-liner saying the closing section is next, and then it waits for the go-ahead the same as every other batch. The recap belongs to Step 3 and appears exactly once, there.

### Length budget

Target **300–450 words** of body per batch, and at most **3–4 sections**. This is the constraint most likely to be violated, and violating it has a measured cost: past walkthroughs ran 850–1500 words across 5–7 sections, and flagged problems went unread because the user was skimming by the time they arrived. Length actively buys less comprehension here, not more.

There is a floor as well as a ceiling. A batch still owes the user the story-beat, the *why*, and any cross-file thread. Don't collapse it into a file manifest or a row of one-line summaries.

The bar for any detail beyond that: it's a real problem, it's a non-obvious invariant that would bite them, or the beat doesn't land without it. Everything else is left out. Say once, early in the review, that they can ask for more depth on any file — then trust them to ask instead of pre-empting.

Standing on its own (see **Purpose**) is a claim about the *explanation* being self-sufficient, not a licence to quote the file into the message. Curation is how both constraints are satisfied at once.

### Quoting code — the balance that matters most

Getting this right is what separates a walkthrough the user can just *read* from a report they have to cross-reference in another window. Quote sparingly and curate ruthlessly. Never paste the diff or a whole hunk and never paste a whole file; lift only the few lines that carry the idea, and put them where the argument needs them.

**Budget: one or two blocks per batch** — three only in a genuinely dense batch — **eight lines or fewer each.** Reviews that ran five to eight blocks per batch read as diff-dumps and were skimmed. When you're at the budget and want one more block, that's the signal to describe the rest in prose.

Worth quoting:

- The 3–8 lines the point actually turns on, **as they exist after the change**. Usually a predicate, a signature, a class list, a return. New-code-only is the default shape.
- **Before/after pairs**, but reserved: only when the *delta itself* is the point — a subtle inversion, or an added line that's easy to miss and load-bearing. A pair costs double the budget and reads as a diff the user already has open, so it has to earn the slot. Never render one as a `+`/`-` block, and never quote CSS that way — describe what changed instead.
- **Side-by-side columns**, when two files are converging on the same shape (two stacks, two subclasses).
- **Code that isn't in the diff at all** — the base class being overridden, the vendored method being worked around, the callee whose contract explains the change, the config that makes a flag live. The change is a *response* to that code, and a reader who's never seen it can't evaluate the response. Go read it and quote the relevant few lines.
- A small table instead of code, when the point is about who-decides or before/after semantics rather than syntax.

Not worth quoting:

- Anything where the reader has to scan the block to find the interesting part. If the fragment needs more than ~12 lines, describe the shape in prose and quote only the pivot.
- Boilerplate surrounding the change — imports, unchanged wrappers, prop declarations — unless the boilerplate *is* the point.
- Code you're only quoting to prove you read it.

Techniques that make fragments carry more:

- Elide aggressively with `…` rather than truncating mid-thought.
- Add trailing comments pointing at the thing that matters (`// ← bare string, no wrapper class`, `// can never be true here`).
- Keep the fragment in the language it's written in; don't paraphrase code into pseudocode.

The test for any block: it exists to make one specific point, and the sentence immediately before or after it says what that point is. If you can't write that sentence, cut the block.

## Step 3 — Close the walkthrough

This is a separate message, sent after the go-ahead on the final batch — never appended to it.

End with a short closing section, and put **a recap of every flag** in it: one line each, `file:line`, in batch order, including ones the user already responded to. A flag raised in batch 2 is easy to lose by batch 7, and this list is the safety net that makes the per-batch budget affordable.

This is the recap's **only** appearance in the whole walkthrough. Seeing the same list twice in a row reads as two different lists and sends the user hunting for the difference.

If nothing was flagged, say that outright rather than padding the section.

**Then stop.** The recap is the end of the walkthrough, not a run-up to Step 4. Say the closing pass is there when they want it and wait. The final batch's flags are usually the ones the user still has to act on, and they need room to go post comments before anything audits them.

## Step 4 — The closing pass, before approval

Wait to be asked. Run this when the user signals the review is wrapping up — they say they're about done, ask whether anything's left, or are heading toward approving. Never mid-walkthrough, and never volunteered on the heels of the last batch.

**Expect a gap before this step, and don't treat it as an omission.** Between the final batch and the closing pass the user is normally off leaving comments on that batch's items, or waiting on the author. Arriving here with recent flags unaddressed is the normal state of things, not something they missed — so report those neutrally as remaining work. No "you didn't handle this" framing, and no implying the gap was a mistake.

It usually lands after comments have gone up or the author has pushed fixes, so treat the branch as something that has moved since batch 1.

**1. Get the latest first.** `git fetch`, then compare the branch to its upstream and re-diff against the merge base. Commits may have landed while the walkthrough was in progress. Fast-forward only if the working tree is clean and the branch hasn't diverged — if there are local changes or a divergence, say so and let the user decide rather than pulling over their work. Report what's new since the walkthrough started, by sha and subject.

**2. Re-walk anything new.** Commits that arrived after batch 1 were never walked. Cover them in the normal batch shape if they're substantive, in a couple of lines if they aren't — and say explicitly whether they change any earlier beat.

**3. Reconcile every flag.** Take the Step 3 recap and put each one in exactly one bucket:

| State | What it means |
|---|---|
| **Fixed** | the code now differs — name the sha |
| **Commented** | it's on the PR and on record — link the comment |
| **Accepted** | the user decided to ship it as-is — say so |
| **Still open** | neither fixed nor recorded — the bucket to surface, stated plainly |

Nothing gets dropped silently. If a flag doesn't clearly fit one of the first three, it's still open — that's a note for the user's benefit, not a shortfall to point out. Ask whether they want the remaining ones commented rather than assuming they were forgotten.

**4. Verify the fixes rather than trusting them.** For anything claimed fixed, read the new code, and where a test covers it, run that test. A fix that introduced something new is itself a new flag. Check the PR's own state the same way: unresolved threads (including other reviewers'), and failing checks.

**5. Last flag sweep.** A final look for anything that should be raised before approval — and if there's nothing, say that plainly rather than inventing a reservation to seem thorough.

End with what's outstanding and whose call each item is. Don't render a verdict, and don't approve: the walkthrough stays understanding-oriented to the last message, and submitting a review or an approval on GitHub is the user's action — do it only if they ask for it directly.

## Tone / constraints

- This is understanding-oriented, not approval/rejection-oriented — no "LGTM" or sign-off framing.
- **Commit to verdicts.** "This looks like an invention. It isn't — it's a revert." Lead with the call, then the reasoning. Hedging every observation flattens the tone until the findings that genuinely matter read the same as the trivia.
- **State facts, not narrative.** Cut stock phrases ("all along", "it turns out"), rhetorical contrasts between how things were and how they are now, and anything implying fault for the state of the code.
- **Every clause must carry a fact a reviewer can act on.** Cut clauses that exist for rhythm or that call back to a phrase used earlier, and claim no more than the change does — describe what it fixes, not the class of problem it gestures at. A cross-file thread ("this pattern returns in the next file") is a fact and stays; an echo of earlier wording that adds nothing new goes.
- **Name the beats.** Sub-headings inside a batch should be editorial rather than generic — "The obstacle: the chrome was in the shadow root", "The one wart I'd mention in review", "The thing this batch actually exposes" — so the structure itself carries the story.
- **Vary the framing.** Don't open paragraph after paragraph with the same construction ("worth noting", "worth knowing", "worth registering"). It evens everything out and nothing stands out.
- Don't preview *explanations* of files that belong to a later batch — the one-line idea hook from step 5 is the exception, and it's deliberate.
- Skip any explicitly excluded file types (e.g. CSS) entirely — don't mention them even in passing, except to note when the last consumer of a class or token is being removed and the definition is now orphaned.
