---
name: sentry-top-issue
description: Pick the single highest-priority unresolved Sentry issue and hand it off to a fixer skill. Use when triaging Sentry errors, running automated issue triage, or when asked to fix the top Sentry issue in a project.
license: MIT
---

Skill behaviour

Inputs ($ARGUMENTS)

All optional, space-separated key=value tokens plus bare flags:

- org=<slug> — Sentry organization slug
- project=<slug> — Sentry project slug
- region=<url> — Sentry region URL (default: https://sentry.io)
- env=<name> — environment filter (default: production)
- fixer=<skill-name> — override the handoff skill (default: sentry-issue-fixer)
- dry-run — pick and print only; do not invoke the fixer
- no-pr-filter — skip the "open PR already exists" check (useful when gh isn't configured); also skips the merged-commit filter in Phase 3b, since both live behind the same flag

Phase 1 — Preflight (scope + gh install + PR cap)

Phase 1a — Run preflight

`preflight.sh` is the single source of truth for scope discovery, the `gh` install check, and the open-`[SENTRY …]` PR cap. Invoke it unconditionally with any explicit values from `$ARGUMENTS` forwarded as flags — if scope can't be resolved, the script self-skips with a structured reason. Do not pre-check scope yourself; let the script speak.

```bash
bash skills/sentry-top-issue/scripts/preflight.sh \
  [--org <slug>] [--project <slug>] [--region <url>] [--env <name>] \
  [--no-pr-filter] --repo-root "$PWD" \
  --output .claude-output/sentry-summary.md
```

**Always echo the script's raw JSON output back to the user verbatim** (as a fenced ```json block) so the preflight result is visible in the transcript — regardless of whether the status is `ok` or `skip`. This is the preflight's audit trail; do not paraphrase or summarize it away.

Then read the JSON and branch:

- `{"status":"skip","reason":"..."}` — after printing the JSON, print `reason` verbatim on its own line and **stop — this is a successful completion** (see "Terminal states" below). Do not invoke AskUserQuestion, do not invoke the fixer, do not proceed to Phase 2. When `--output` was passed and the skip reason is PR cap, the script has already written a CI-visible summary to the output path. Common skip reasons: missing scope (add `organizationSlug`/`projectSlugOrId` to `AGENTS.md`, or pass `org=<slug> project=<slug>` as arguments), missing `SENTRY_AUTH_TOKEN`, missing `gh` when PR filter is on, PR cap reached, or missing `jq`.
- `{"status":"ok","org":...,"project":...,"region":...,"env":...,"prFilter":<bool>,"openSentryPrs":<n>}` — carry these values into Phase 2. `openSentryPrs` is informational; the cap has already been enforced by the script.

Scope precedence (as implemented by the script): explicit flags first, then AGENTS.md / CLAUDE.md / `.claude/**/*.md` under `--repo-root`, matching the three-line pattern (organizationSlug, projectSlugOrId, regionUrl) described in references/SCOPE_DISCOVERY.md. Skip reasons the script can emit: missing scope, missing `SENTRY_AUTH_TOKEN`, missing `gh` (when PR filter is on), missing `jq`, PR cap reached (default 3, overridable via `--pr-cap`). `gh` auth failures are logged to stderr and do not block.

Phase 2 & 3 — Fetch, filter, and select across priority tiers

Use `fetch-issues.sh` to query the Sentry REST API directly. The script requires `SENTRY_AUTH_TOKEN` (already verified by preflight) and uses `curl` to call the Sentry Issues API with the search query `is:unresolved issue.priority:<tier>`, sorted by event frequency (`sort=freq`).

**Iterate priority tiers in order: `high`, then `medium`, then `low`.** For each tier, fetch candidates and run all three filters. Stop at the first tier that produces a fresh (non-stale) survivor. If a tier's candidates are all filtered out or all stale, move to the next tier. After exhausting all three tiers, make one final untiered call (omit `--priority`). If that also yields nothing fresh, print "Nothing to pick — all candidates are either already handled or stale." and stop — this is a **successful completion**, not an error.

For each tier:

**Step 1 — Fetch:**

```bash
bash skills/sentry-top-issue/scripts/fetch-issues.sh \
  --org "$ORG" --project "$PROJECT" --region "$REGION" --env "$ENV" \
  --priority <tier>
```

The script outputs JSON on stdout:
- `{"status":"ok","issues":[...]}` — each issue object contains: `id` (shortId like PROJECT-123), `title`, `userCount`, `count`, `firstSeen`, `lastSeen`.
- `{"status":"error","reason":"..."}` — print the reason and stop.

**Always echo the script's raw JSON output back to the user verbatim** (as a fenced ```json block) so the fetch result is visible in the transcript.

If the tier returns zero issues, skip to the next tier.

**Step 2 — Filter (3a): Open PR and recent closed-PR filter**

Unless no-pr-filter is set, pipe the candidate IDs through `skills/sentry-top-issue/scripts/filter-candidates.sh`:

```bash
bash skills/sentry-top-issue/scripts/filter-candidates.sh <id1> <id2> ... <id10>
```

The script prints surviving IDs one per line (empty output = all filtered). Treat its stdout as authoritative. It applies two checks in one pass:

1. **Open PR** — drops any candidate that already has an open `[SENTRY <suffix>]` PR (work already in flight).
2. **Recent closed PR** — drops any candidate that has a closed `[SENTRY <suffix>]` PR within the last 30 days. A recently closed PR indicates the automation already acted on that issue recently; handing the same issue back immediately would risk wasting another PR before the prior attempt has been fully evaluated or deployed.

Both checks degrade gracefully when `gh` is unauthenticated or `jq` is missing — passing inputs through with a stderr warning — so no extra handling is needed here. (Missing `gh` is already caught by Phase 1 preflight when the PR filter is on.)

If zero survive, skip to the next tier.

**Step 3 — Filter (3b): Merged-commit filter**

Catches the case where the fixer skill has already merged a `[SENTRY <suffix>]` commit but the Sentry issue is still marked unresolved because the release hasn't deployed yet. Without this filter, the skill hands the same issue to the fixer again and wastes a PR.

- Resolve the default branch ref, in order of preference:
  1. `git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null` (yields `origin/main` or `origin/master` on most repos).
  2. `origin/main` if it resolves via `git rev-parse --verify origin/main`.
  3. `origin/master` if it resolves via `git rev-parse --verify origin/master`.
  4. Local `main` or `master` as a last resort.
- For each remaining candidate ID, compute its suffix by stripping the project prefix — everything through the first `-`. Examples: `ALMANAC-5` → `5`, `ALMANAC-1G` → `1G`, `PROJECT-123` → `123`. This matches the `[SENTRY <suffix>]` format that the sentry-issue-fixer skill uses for commit subjects (which preserves both numeric and base32-ish Sentry short-ID suffixes).
- Run: `git log <default-branch> --fixed-strings -i --grep "[SENTRY <suffix>]" -n 1 --format=%H`. A non-empty result means a merged commit already targets this issue; drop the candidate. This catches squash merges (PR title on the commit), rebase merges (original commits linearized), and regular merges (feature-branch commits are still in the log).
- If no default-branch ref can be resolved, log a one-line warning and continue without this sub-filter — never block the pick on this check.

If zero survive, skip to the next tier.

**Step 4 — Filter (3c): Stale-issue filter**

Filter out Sentry issues whose `lastSeen` is more than 7 days ago to avoid picking stale issues that may have been resolved in a hotfix or are no longer relevant.

If zero fresh candidates survive, **do not bypass the filter** — skip to the next tier instead. Only after all tiers (high, medium, low, and untiered) produce zero fresh candidates should you stop with "Nothing to pick."

Phase 4 — Select and justify

Take the top remaining candidate from the first tier that produced fresh survivors. Print:

Top issue: <ID> — <title>
Users: <userCount>  Events: <count>
First seen: <firstSeen>  Last seen: <lastSeen>
Why: ranked #1 by Sentry frequency sort within the highest-priority tier that had surviving candidates (unresolved, environment=<env>, priority=<tier>, no open PR, no merged `[SENTRY <suffix>]` commit on the default branch, seen within 7 days).

If no tier produced fresh candidates, print "Nothing to pick — all candidates are either already handled or stale." and stop. This is a **successful completion** — the skill did its job and found nothing actionable. If stale issues genuinely need attention, a human can invoke `/rm-sentry-issue-fixer <ID>` directly.

Phase 5 — Handoff

Unless dry-run is set, invoke the fixer skill (default rm-sentry-issue-fixer) via the Skill tool. Pass the selected issue ID **plus `automatic=true`** as args — for example: `PROJECT-123 automatic=true`. The existing fixer's Phase 1 already handles a direct ID input, and a fixer such as `rm-sentry-issue-fixer` reads the `automatic` flag to run fully non-interactively and always open a PR. Callers who want a more manual run should invoke the fixer skill directly with `automatic=false` instead of going through `sentry-top-issue`.

Terminal states and CI completion

Every exit path below is a **successful completion** of the skill — the skill ran its logic and reached a definitive outcome. When the caller provides a completion signal (e.g., `touch SKILL_COMPLETE`), execute it on **any** of these terminal states:

- **Preflight skip** — scope missing, auth token absent, `gh` missing, PR cap reached, `jq` missing. The skill determined it cannot or should not proceed.
- **Nothing to pick** — all tiers exhausted with zero fresh candidates surviving the filters.
- **Dry-run print** — a candidate was selected and printed, but `dry-run` prevented handoff.
- **Handoff complete** — the fixer skill was invoked successfully.

Only withhold the completion signal if the skill errors unexpectedly mid-execution (e.g., an API call fails partway through fetching/filtering). A preflight skip is not an error — it is the skill doing its job and finding that no action is warranted.

references/SCOPE_DISCOVERY.md content (summary)

- Documents the recommended way for a project to declare its Sentry scope in CLAUDE.md / AGENTS.md (the three-line pattern: organizationSlug, projectSlugOrId, regionUrl).
- Shows the regex/parse the skill uses (tolerant of YAML-ish and Markdown bullet formats).
- Notes that this pattern is compatible with the Sentry REST API and any Sentry deployment (SaaS regions, self-hosted).

Files to create / modify

┌────────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┐
│                      File                      │                                       Change                                        │
├────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ sentry-top-issue/SKILL.md                      │ New. The skill as described.                                                        │
├────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ sentry-top-issue/LICENSE                       │ New. MIT.                                                                           │
├────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ sentry-top-issue/references/SCOPE_DISCOVERY.md │ New. Short reference on how scope is discovered and how to declare it in a project. │
├────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ sentry-issue-fixer/SKILL.md                    │ No change. New skill composes via Skill tool.                                       │
└────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘

Install location during development: /Users/joshmcleod/.claude/skills/sentry-top-issue/. For publication: the directory is self-contained and can be moved to its own public repo root.

Reused existing pieces

- Sentry REST API — queried directly via `curl` and `SENTRY_AUTH_TOKEN`. No MCP server dependency; works in any environment with network access and a valid auth token.
- sentry-issue-fixer skill — invoked as-is for all diagnosis/fix work. The handoff mechanism is a plain Skill tool call, so any drop-in replacement with the same name works too (overridable via fixer=
  arg).
- gh CLI — used only for the "open PR already exists" best-effort filter; skill degrades gracefully when missing.
- git CLI — used only for the merged-commit filter (Phase 3b); the skill degrades gracefully if the default branch ref can't be resolved.

Verification

1. Skill-creation validation. Run the skill-creation checklist against the finished SKILL.md: frontmatter valid, name matches directory, description has what + when + trigger keywords, body under 500
   lines, references only one level deep. If skills-ref validate is available in the environment, run it too.
2. Scope discovery — explicit. Invoke /sentry-top-issue org=<real-slug> project=<real-slug> dry-run. Expect a top pick printed; no handoff.
3. Scope discovery — doc-driven. In a repo whose CLAUDE.md contains the documented scope block, invoke /sentry-top-issue dry-run with no args. Expect the same behaviour.
4. Scope discovery — missing. In a repo with no scope declaration and no scope args, invoke /sentry-top-issue dry-run. Expect the "No Sentry scope found …" line and a clean exit with no API calls and no fixer invocation.
5. Missing auth token. Unset SENTRY_AUTH_TOKEN and invoke /sentry-top-issue dry-run with valid scope. Expect preflight to skip with a clear message about the missing token.
6. Frequency sort vs UI. Compare the top pick against the project's Sentry Issues page sorted by Events (minus any open-PR filter). They should match.
7. Open-PR filter. Create a draft PR titled with one of the top candidate issue IDs; rerun in dry-run; confirm that candidate is skipped. Close the draft.
8. Merged-commit filter. On the default branch, land a commit with subject `[SENTRY <suffix>] test filter` where `<suffix>` matches a top candidate's ID suffix (e.g., ALMANAC-5 → `5`); rerun in dry-run; confirm that candidate is skipped. Revert the commit.
9. Empty-result path. Use env=nonexistent to force zero results; confirm the skill prints "Nothing to pick." and does not invoke the fixer.
10. Handoff path. Run /sentry-top-issue (no args, not dry-run) and confirm the fixer skill starts working on the chosen ID.
11. Scheduling smoke. Use the schedule skill to fire /sentry-top-issue dry-run two minutes out; confirm it runs unattended and prints a pick.

Non-goals

- No modifications to sentry-issue-fixer.
- No custom composite scoring. If "prefer novel issues" or "downweight noisy ones" becomes desirable later, add an optional rerank phase between 2 and 3 — not needed for v1.
- No cron/scheduler wiring inside the skill — that's the user's choice of /loop, schedule, or external cron.
- No project-specific org/project/region baked into the skill. Anything project-specific lives in that project's own docs.
