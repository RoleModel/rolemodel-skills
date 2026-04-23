---
name: document-review
description: Simple post-generation doc accuracy pass. Create an Explore subagent to compare generated docs with code/test evidence, then apply doc-only fixes. Use when the user runs `/document-review` or as the final phase after `/document-this`.
---

# /document-review

## Purpose
Review `generated-docs/` for accuracy and fix incorrect or stale content.

## Invocation

```bash
/document-review
/document-review <file-path>
```

- No argument: review all docs.
- With `<file-path>`: focus related sections first, then do a ripple check.

## Rules

- Edit only files in `generated-docs/`.
- Do not change source code, tests, or configs.
- If `generated-docs/` is missing, stop and tell the caller to run `/document-this` first.

## Process

1. Gather evidence from disk and scripts (or fallback to Read/Glob/Grep if `node` is unavailable).
2. Create an `Explore` subagent for read-only mismatch detection.
3. Validate and fix these files:
   - `workflows.md` (test-backed workflows only)
   - `architecture.md` (stack, structure, entities, conventions)
   - `ai-orientation.md` (entry points, coverage map, known gaps, glossary)
   - `diagrams/data-model.mmd` and `diagrams/architecture.mmd`
4. Remove unresolved placeholders like `{{...}}` and stale links.
5. Re-check once after edits.

## Accuracy Policy

- Be aggressive when evidence is strong.
- If evidence conflicts, use conservative wording and add a Known Gaps note.
- Never invent behavior not supported by code or tests.

## Output

Return a short summary with:
- Files updated
- Main fixes made
- Remaining uncertainties
