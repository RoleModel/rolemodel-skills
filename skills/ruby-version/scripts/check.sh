#!/usr/bin/env bash
# Print the latest stable MRI Ruby known to ruby-build and the Ruby versions
# installed locally via rbenv. Used by the ruby-version skill to keep the
# agent honest about what Rubies actually exist.

set -euo pipefail

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

ruby_build_version="$(rbenv install --version 2>/dev/null | awk '{print $NF}')"

# Highest stable MRI version: lines that look like X.Y.Z with only digits and
# dots, no suffixes like -dev, -preview, -rc, no jruby-/truffleruby-/mruby-.
# Use awk for version comparison (portable, works on macOS/BSD and Linux).
latest_stable="$(
  rbenv install -l 2>/dev/null \
    | awk '{$1=$1; print}' \
    | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' \
    | awk -F. '
      {
        v = sprintf("%05d.%05d.%05d", $1, $2, $3);
        if (v > max) { max = v; version = $0 }
      }
      END { print version }
    '
)"

if [ -z "$latest_stable" ]; then
  echo "error: could not determine latest stable Ruby from rbenv install -l" >&2
  exit 1
fi

installed="$(rbenv versions --bare 2>/dev/null | grep -E '^[0-9]+\.[0-9]+\.[0-9]+' || true)"

echo "latest-stable: $latest_stable"
echo "ruby-build:    $ruby_build_version"
echo "installed:"
if [ -z "$installed" ]; then
  echo "  (none installed via rbenv)"
else
  while IFS= read -r v; do
    echo "  $v"
  done <<< "$installed"
fi
