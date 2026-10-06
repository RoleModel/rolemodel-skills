#!/usr/bin/env bash
# Prints the branch HEAD was cut from: the closest fork point among the
# default branch and every open PR's head. Ties go to the default branch.
set -euo pipefail

git rev-parse --verify -q origin/HEAD >/dev/null || git remote set-head origin --auto >/dev/null
default=$(git rev-parse --abbrev-ref origin/HEAD)
current=$(git branch --show-current)
head=$(git rev-parse HEAD)

candidates=$(gh pr list --state open --limit 200 --json headRefName \
  --jq ".[].headRefName | select(. != \"$current\") | \"origin/\" + .")

for branch in $default $candidates; do
  fork=$(git merge-base "$branch" HEAD 2>/dev/null) || continue
  [ "$fork" = "$head" ] && continue
  echo "$(git rev-list --count "$fork"..HEAD) $branch"
done | sort -n -s | head -1 | cut -d' ' -f2 | sed 's#^origin/##'
