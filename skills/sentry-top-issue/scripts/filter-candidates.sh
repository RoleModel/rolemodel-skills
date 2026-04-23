#!/usr/bin/env bash
set -euo pipefail
# filter-candidates.sh — Drop Sentry issue IDs that already have an open GitHub PR.
#
# Usage: filter-candidates.sh <id1> [<id2> ...]
# Output: surviving IDs, one per line. Empty output is valid (all filtered).
#
# Degrades gracefully: if gh is missing or unauthenticated, prints a one-line
# warning to stderr and echoes all inputs unchanged, matching the skill's
# "never block on PR filter" contract.

if [[ $# -eq 0 ]]; then exit 0; fi

if ! command -v gh >/dev/null 2>&1; then
  echo "warn: gh not installed; skipping PR filter" >&2
  printf '%s\n' "$@"
  exit 0
fi

for id in "$@"; do
  if hits="$(gh pr list --state open --search "$id" --limit 1 --json number 2>/dev/null)"; then
    if [[ "$(jq 'length' <<<"$hits")" -eq 0 ]]; then
      printf '%s\n' "$id"
    fi
  else
    echo "warn: gh pr list failed for $id; passing it through" >&2
    printf '%s\n' "$id"
  fi
done
