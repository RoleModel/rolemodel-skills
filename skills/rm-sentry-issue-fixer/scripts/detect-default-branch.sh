#!/usr/bin/env bash
set -euo pipefail
# detect-default-branch.sh — Print the remote's default branch (e.g. "main" or "master").
#
# Resolution order:
#   1. git symbolic-ref refs/remotes/origin/HEAD
#   2. git remote set-head origin --auto (then retry step 1)
#   3. presence of origin/main, then origin/master as a last-resort fallback
#
# Exits non-zero if none of the above resolve a branch. Prints the bare branch
# name (no "origin/" prefix) on success.

resolve_head() {
  git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null \
    | sed 's|^origin/||'
}

BRANCH="$(resolve_head || true)"

if [[ -z "$BRANCH" ]]; then
  git remote set-head origin --auto >/dev/null 2>&1 || true
  BRANCH="$(resolve_head || true)"
fi

if [[ -z "$BRANCH" ]]; then
  if git show-ref --verify --quiet refs/remotes/origin/main; then
    BRANCH=main
  elif git show-ref --verify --quiet refs/remotes/origin/master; then
    BRANCH=master
  fi
fi

if [[ -z "$BRANCH" ]]; then
  echo "could not determine default branch from origin/HEAD, origin/main, or origin/master" >&2
  exit 1
fi

printf '%s\n' "$BRANCH"
