# Conventions

Read the entries below, then the files relevant to the task. `AGENTS.md` explains when.

## What belongs in a convention file

Two things only:

1. **The way this project does something** — e.g. we write system tests rather than controller tests.
2. **Taste** — e.g. no custom controller actions; no business logic in templates.

State the rule, and the why only where the rule looks arbitrary without it. Keep each file to a screen.

**Never restate the implementation.** Signatures, argument lists, required attributes, and step-by-step walkthroughs belong in the code, which reads more easily and can't go stale. The same goes for anything a manifest, lockfile, or schema already states — version numbers above all. Name the file that holds the answer instead of copying the answer. A gotcha earns a line when it's a fact about the _world_ — how a library behaves, a database rule, an API that contradicts its own docs — that the code can't tell you on sight.

Each entry may carry a `<!-- paths: glob, glob -->` comment. The `surface_conventions.rb` PreToolUse hook reads these to surface a convention when a matching file is edited, so keep them accurate.

## Index

Entries take this shape — the em dash is what the hook parses. Delete this note once real ones land.

`- [Title](conventions/slug.md) — what it covers. <!-- paths: app/models/**/*.rb -->`
