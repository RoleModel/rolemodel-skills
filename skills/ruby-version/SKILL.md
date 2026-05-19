---
name: ruby-version
description: Verify what Ruby versions actually exist and install a specific Ruby via rbenv. Use BEFORE asserting that any Ruby version does or doesn't exist (e.g., "Ruby 4.0 isn't out yet", "the latest Ruby is 3.x", "Ruby X.Y.Z doesn't exist"). Also use when the user asks "what's the latest Ruby", "is Ruby X out", "does Ruby X.Y exist", "install Ruby", "switch to Ruby X", "what Ruby is installed", or mentions a specific Ruby version you're unsure about. Claude's training data may be out of date — run `check.sh` first.
license: MIT
metadata:
  triggers:
    - latest ruby
    - ruby version
    - install ruby
    - ruby X.Y exists
    - newest ruby
    - current ruby
    - switch ruby
    - rbenv
    - ruby-build
---

# ruby-version

Two-script skill that prevents the agent from hallucinating Ruby release information and provides a one-liner Ruby install.

## When to invoke this skill

**Mandatory: run `check.sh` before making any claim about whether a specific Ruby version exists, has been released, or is the latest.** Claude's training cutoff lags real Ruby releases — guessing is the failure mode this skill exists to prevent.

Also invoke when the user:
- Asks what Ruby versions are installed.
- Asks for the latest stable Ruby.
- Wants to install a specific Ruby (`install.sh`).

## Scripts

### `scripts/check.sh`

Prints:
- The latest stable MRI Ruby known to local ruby-build.
- All Ruby versions currently installed via rbenv.
- The ruby-build version (so staleness is visible — if it's months old, "latest" may lag reality).

```bash
bash skills/ruby-version/scripts/check.sh
```

No arguments. Exits non-zero with a remediation hint if `rbenv` or `ruby-build` is missing.

**How to read the output:** The line beginning `latest-stable:` is the highest stable MRI release ruby-build knows about. Treat that as ground truth over any version number you recall from training data. The `installed:` block is what the user has on this machine; an empty list means none installed via rbenv.

### `scripts/install.sh <version>`

Installs a specific Ruby via rbenv + ruby-build. Validates the version exists in ruby-build's known list first.

```bash
bash skills/ruby-version/scripts/install.sh 3.4.2
```

Does **not** set the version as global or local. After install, suggest the user run `rbenv global <version>` or `cd <project> && rbenv local <version>` based on their intent.

If the requested version isn't in `rbenv install -l`, the script prints a hint to upgrade ruby-build (`brew upgrade ruby-build`) rather than failing silently.

## Assumptions

- macOS with Homebrew, rbenv, and ruby-build installed.
- Scripts are bash (not Ruby) so they work even when Ruby is missing or broken.

## Anti-patterns

- Do not assert "Ruby X doesn't exist yet" from memory. Run `check.sh`.
- Do not have `install.sh` auto-set global or local Ruby — that's a user decision.
- Do not extend this skill into gemset/bundler management. It is a verification + install helper, nothing more.
