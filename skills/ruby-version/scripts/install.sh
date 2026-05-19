#!/usr/bin/env bash
# Install a specific Ruby version via rbenv + ruby-build.
# Validates the version against ruby-build's known list first so we fail fast
# with an actionable message instead of mid-compile.

set -euo pipefail

if [ "$#" -ne 1 ] || [ -z "${1:-}" ]; then
  echo "usage: install.sh <version>" >&2
  echo "example: install.sh 3.4.2" >&2
  exit 2
fi

version="$1"

if ! command -v rbenv >/dev/null 2>&1; then
  echo "error: rbenv not found on PATH" >&2
  echo "hint: brew install rbenv ruby-build && rbenv init" >&2
  exit 1
fi

if ! rbenv install --version >/dev/null 2>&1; then
  echo "error: ruby-build not available (rbenv install fails)" >&2
  echo "hint: brew install ruby-build" >&2
  exit 1
fi

if ! rbenv install -l 2>/dev/null | awk '{$1=$1; print}' | grep -Fxq "$version"; then
  echo "error: '$version' is not in rbenv's known versions list" >&2
  echo "hint: brew upgrade ruby-build   # ruby-build's catalog may be stale" >&2
  echo "      bash skills/ruby-version/scripts/check.sh   # see the latest known stable" >&2
  exit 1
fi

echo "Installing Ruby $version via rbenv..."
rbenv install --skip-existing "$version"

echo
echo "Installed Ruby $version."
echo "Next steps (pick one — install.sh does NOT set this for you):"
echo "  rbenv global $version                          # use everywhere by default"
echo "  cd <project> && rbenv local $version           # pin to a single project"
