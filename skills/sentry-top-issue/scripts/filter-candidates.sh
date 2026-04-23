#!/usr/bin/env bash
set -euo pipefail
# filter-candidates.sh — Drop Sentry issue IDs that already have an open GitHub PR.
#
# Usage: filter-candidates.sh <id1> [<id2> ...]
# Output: surviving IDs, one per line. Empty output is valid (all filtered).
#
# Matches the fixer skill's PR title format `[SENTRY <suffix>] ...` where
# <suffix> is everything after the first `-` in the issue ID (e.g.
# ALMANAC-1G → 1G). Bare alphanumeric IDs (no prefix) are used as-is.
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

# Single API call: fetch all open PR titles once, then filter locally.
if ! open_titles="$(gh pr list --state open --limit 200 --json title --jq '.[].title' 2>/dev/null)"; then
  echo "warn: gh pr list failed; skipping PR filter" >&2
  printf '%s\n' "$@"
  exit 0
fi

for id in "$@"; do
  suffix="${id#*-}"   # strip through first `-`; bare IDs stay unchanged
  marker="[SENTRY ${suffix}]"
  if ! grep -Fq -- "$marker" <<<"$open_titles"; then
    printf '%s\n' "$id"
  fi
done
