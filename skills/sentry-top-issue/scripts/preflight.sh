#!/usr/bin/env bash
set -euo pipefail
# preflight.sh — Consolidated preflight for sentry-top-issue.
#
# Emits exactly one JSON line on stdout. Always exits 0; "skip" is a status, not an error.
#
# Inputs (all optional):
#   --org <slug>         Sentry organization slug
#   --project <slug>     Sentry project slug or ID
#   --region <url>       Sentry region URL
#   --env <name>         environment filter (default: production)
#   --no-pr-filter       skip gh install check + PR cap check
#   --repo-root <dir>    directory to search for scope docs (default: cwd)
#   --pr-cap <n>         max concurrent open [SENTRY ...] PRs (default: 3)
#
# Scope precedence: explicit flags > AGENTS.md/CLAUDE.md/.claude/**/*.md.
#
# Output schemas:
#   ok:   {"status":"ok","org":...,"project":...,"region":...,"env":...,"prFilter":bool,"openSentryPrs":N}
#   skip: {"status":"skip","reason":"..."}

if ! command -v jq >/dev/null 2>&1; then
  printf '{"status":"skip","reason":"jq is not installed — skipping. Install jq to enable preflight checks, or re-run with no-pr-filter to bypass."}\n'
  exit 0
fi

skip() {
  jq -cn --arg reason "$1" '{status:"skip", reason:$reason}'
  exit 0
}

require_arg_value() {
  local flag="$1"
  local value="${2-}"
  if [[ -z "$value" || "$value" == --* ]]; then
    skip "missing value for $flag"
  fi
}

ORG=""
PROJECT=""
REGION=""
ENV_NAME="production"
PR_FILTER=1
REPO_ROOT="$(pwd)"
PR_CAP=3

while [[ $# -gt 0 ]]; do
  case "$1" in
    --org)
      require_arg_value "$1" "${2-}"
      ORG="$2"; shift 2 ;;
    --project)
      require_arg_value "$1" "${2-}"
      PROJECT="$2"; shift 2 ;;
    --region)
      require_arg_value "$1" "${2-}"
      REGION="$2"; shift 2 ;;
    --env)
      require_arg_value "$1" "${2-}"
      ENV_NAME="$2"; shift 2 ;;
    --no-pr-filter)
      PR_FILTER=0; shift ;;
    --repo-root)
      require_arg_value "$1" "${2-}"
      REPO_ROOT="$2"; shift 2 ;;
    --pr-cap)
      require_arg_value "$1" "${2-}"
      if [[ ! "$2" =~ ^[0-9]+$ ]]; then
        skip "invalid --pr-cap: must be a non-negative integer"
      fi
      PR_CAP="$2"; shift 2 ;;
    *)
      skip "unknown arg: $1" ;;
  esac
done

scope_files=()
[[ -f "$REPO_ROOT/AGENTS.md" ]] && scope_files+=("$REPO_ROOT/AGENTS.md")
[[ -f "$REPO_ROOT/CLAUDE.md" ]] && scope_files+=("$REPO_ROOT/CLAUDE.md")
if [[ -d "$REPO_ROOT/.claude" ]]; then
  while IFS= read -r -d '' f; do scope_files+=("$f"); done \
    < <(find "$REPO_ROOT/.claude" -type f -name '*.md' -print0 2>/dev/null)
fi

find_scope() {
  local key="$1"
  [[ ${#scope_files[@]} -eq 0 ]] && return 0
  # `|| true` keeps a no-match grep from tripping set -e / pipefail.
  { grep -h -E "^[[:space:]]*[-*]?[[:space:]]*${key}[[:space:]]*[:=]" "${scope_files[@]}" 2>/dev/null || true; } \
    | head -n 1 \
    | sed -E "s/^[[:space:]]*[-*]?[[:space:]]*${key}[[:space:]]*[:=][[:space:]]*//" \
    | sed -E 's/^["'\''`]//; s/["'\''`][[:space:]]*$//'
}

[[ -z "$ORG"     ]] && ORG="$(find_scope organizationSlug)"
[[ -z "$PROJECT" ]] && PROJECT="$(find_scope projectSlugOrId)"
[[ -z "$REGION"  ]] && REGION="$(find_scope regionUrl)"

if [[ -z "$ORG" || -z "$PROJECT" ]]; then
  skip "No Sentry scope found in \$ARGUMENTS or project docs — skipping."
fi

OPEN_PRS=0
if [[ $PR_FILTER -eq 1 ]]; then
  if ! command -v gh >/dev/null 2>&1; then
    skip "GitHub CLI (gh) is not installed — skipping. Re-run with no-pr-filter to bypass this check."
  fi
  if gh_json="$(cd "$REPO_ROOT" && gh pr list --state open --search '[SENTRY' --json number,title 2>/dev/null)"; then
    OPEN_PRS="$(jq '[.[] | select(.title | test("^\\[SENTRY [A-Za-z0-9]+\\]"))] | length' <<<"$gh_json")"
    if [[ "$OPEN_PRS" -ge "$PR_CAP" ]]; then
      skip "Sentry PR cap reached ($OPEN_PRS open) — skipping. Close or merge existing Sentry PRs before running again."
    fi
  else
    echo "warn: gh pr list failed (auth?); proceeding without cap check" >&2
  fi
fi

PR_FILTER_JSON=$([[ $PR_FILTER -eq 1 ]] && echo true || echo false)

jq -cn \
  --arg org "$ORG" \
  --arg project "$PROJECT" \
  --arg region "$REGION" \
  --arg env "$ENV_NAME" \
  --argjson prFilter "$PR_FILTER_JSON" \
  --argjson openSentryPrs "$OPEN_PRS" \
  '{status:"ok", org:$org, project:$project, region:$region, env:$env, prFilter:$prFilter, openSentryPrs:$openSentryPrs}'
