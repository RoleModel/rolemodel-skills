# Audit Ignore File

Projects may suppress specific findings by creating `.rails-audit-ignore.yml` at the project root.

## Format

```yaml
ignore:
  - file: app/javascript/controllers/toggle_controller.js
    matches: setTimeout
    reason: Intentional animation hack

  - file: db/schema.rb
    matches: long method
    reason: Generated file
```

## Matching Rules

- `file` — substring match against the finding's file reference
- `matches` — case-insensitive substring match against the finding's heading + details
- Both must match for a finding to be suppressed
- Suppressed findings are hidden from category sections, summary counts, and file counts
- Missing file → no ignores applied (not an error)
- Malformed YAML → print a warning and proceed as if empty
