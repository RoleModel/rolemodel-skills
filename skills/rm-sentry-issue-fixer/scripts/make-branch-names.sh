#!/usr/bin/env bash
set -euo pipefail
# make-branch-names.sh — Produce validated branch / commit names for a Sentry fix.
#
# Required: --issue-id <ID>       (e.g. "PROJECT-123", "ALMANAC-1G", or "1G")
#           --description <text>  (imperative short description)
# Optional: --permalink <url>     (added to commit body when provided)
#
# Output: JSON with {branch, commitSubject, commitBody}.
# Exit codes: 0 success, 2 invalid args, 3 subject failed /^\[SENTRY [A-Za-z0-9]+\] .+/.

ISSUE_ID=""
DESCRIPTION=""
PERMALINK=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --issue-id)    ISSUE_ID="$2"; shift 2 ;;
    --description) DESCRIPTION="$2"; shift 2 ;;
    --permalink)   PERMALINK="$2"; shift 2 ;;
    *)             echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

[[ -z "$ISSUE_ID"    ]] && { echo "--issue-id required" >&2; exit 2; }
[[ -z "$DESCRIPTION" ]] && { echo "--description required" >&2; exit 2; }

if [[ "$ISSUE_ID" =~ ^([A-Za-z0-9]+-)?([A-Za-z0-9]+)$ ]]; then
  SUFFIX="${BASH_REMATCH[2]}"
else
  echo "invalid --issue-id: expected 'PROJECT-ABC123' or alphanumeric" >&2
  exit 2
fi

SLUG="$(printf '%s' "$DESCRIPTION" \
  | LC_ALL=C tr '[:upper:]' '[:lower:]' \
  | LC_ALL=C sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//' \
  | cut -c1-60)"

[[ -z "$SLUG" ]] && { echo "description produced empty slug" >&2; exit 2; }

BRANCH="sentry-$(printf '%s' "$SUFFIX" | LC_ALL=C tr '[:upper:]' '[:lower:]')-${SLUG}"
SUBJECT="[SENTRY ${SUFFIX}] ${DESCRIPTION}"

if [[ ! "$SUBJECT" =~ ^\[SENTRY\ [A-Za-z0-9]+\]\ .+ ]]; then
  echo "subject failed /^\\[SENTRY [A-Za-z0-9]+\\] .+/ validation" >&2
  exit 3
fi

if [[ -n "$PERMALINK" ]]; then
  BODY="$(printf '%s\n\nSentry: %s' "$SUBJECT" "$PERMALINK")"
else
  BODY="$SUBJECT"
fi

jq -cn \
  --arg branch "$BRANCH" \
  --arg subject "$SUBJECT" \
  --arg body "$BODY" \
  '{branch:$branch, commitSubject:$subject, commitBody:$body}'
