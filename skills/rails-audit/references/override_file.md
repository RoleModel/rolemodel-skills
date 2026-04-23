# Audit Override File

Projects may customize audit behavior by creating `.rails-audit-override.md` at the project root.

## Format

```markdown
# Rails Audit Override

## Scope

**Include:**
- app/
- lib/

**Exclude:**
- app/javascript/

## Skip Categories

- JavaScript Code Smells
- JavaScript Anti-Patterns

## Severity Overrides

- `long method` → low — Team standard allows methods up to 30 lines
- `missing index` → medium — Indexes added via a separate migration sprint

## Custom Checks

**Category:** Security Vulnerabilities
**Heading:** Hardcoded API Keys
**Pattern:** `api_key\s*=\s*["\'][^"\']{10,}["\']`
**Severity:** critical

## Report Path

doc/audit/REPORT.md
```

## Section Rules

### `## Scope`
- `**Include:**` list — paths to audit (overrides the default full-app scope); substring match against file paths
- `**Exclude:**` list — paths to skip even if covered by Include; substring match against file paths
- Either sub-list may be omitted

### `## Skip Categories`
- One category name per bullet
- Case-insensitive substring match against category headings
- Matching categories are omitted entirely from the report and summary counts

### `## Severity Overrides`
- One override per bullet in the form: `` `<match text>` → <severity> — <optional reason> ``
- `<match text>` — case-insensitive substring match against a finding's heading + details
- `<severity>` — `critical`, `high`, `medium`, or `low`
- Reason is optional; if present it is noted in the report alongside the finding

### `## Custom Checks`
- One check per block; fields are `**Category:**`, `**Heading:**`, `**Pattern:**`, `**Severity:**`
- `**Category:**` — which report category to add the finding to; creates a new category if it doesn't match an existing one
- `**Pattern:**` — Ruby-compatible regex searched with Grep across the audit scope
- `**Severity:**` — `critical`, `high`, `medium`, or `low`
- Separate multiple custom checks with a blank line between blocks

### `## Report Path`
- Single line containing the output path relative to the project root
- Parent directories must already exist
- Default: `RAILS_AUDIT_REPORT.md`

## Updating the Override File During a Session

While presenting or discussing findings, listen for user signals that should be persisted. When detected, offer to update `.rails-audit-override.md` immediately — do not wait until the end of the session.

### Signals and mappings

| User says something like… | Write this override |
|---|---|
| "that's a false positive", "ignore that", "not an issue for us" | `## Severity Overrides` entry → `low` with their reason |
| "skip [category] entirely", "[category] doesn't apply to us" | `## Skip Categories` entry |
| "don't audit [path]", "exclude [directory]" | `## Scope` → `**Exclude:**` entry |
| "downgrade this to [severity]" | `## Severity Overrides` entry with the new severity |
| "also check for [pattern]" | `## Custom Checks` block in the relevant category |

### How to write the update

1. If `.rails-audit-override.md` does not exist, create it with a `# Rails Audit Override` heading before adding any sections.
2. If the target section already exists, append the new entry to it.
3. If the target section does not exist, append the entire section (heading + entry) to the end of the file.
4. Use the finding's heading text (shortened to the key phrase) as the `<match text>` for severity overrides — prefer specific phrases over generic ones.
5. Always include the user's stated reason in the override entry.
6. After writing, confirm to the user: "Saved to `.rails-audit-override.md` — this finding will be suppressed in future audits."

### Offer proactively, write immediately

- Offer after any finding the user dismisses, disputes, or deprioritizes — one short offer, not a prompt for every finding.
- If the user says yes, write the file before moving on. Do not batch updates for later.
- If the user says no, continue without writing.
- Do not offer for findings the user accepts or agrees with — only for ones they push back on.

## Application Rules

- Override file is read at the start of Step 1, before any analysis begins
- `## Scope` overrides apply before ignore rules from `.rails-audit-ignore.yml`
- `## Severity Overrides` are applied after all findings are collected, before the report is written
- `## Custom Checks` patterns are run during Step 4 alongside the standard checks for the matching category
- Missing file → no overrides applied (not an error)
- Unrecognized sections are silently ignored