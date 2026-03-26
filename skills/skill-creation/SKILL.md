---
name: skill-creation
description: Create and update SKILL.md files following the Agent Skills format specification. Use when building new skills or improving existing skill documentation for AI agents.
---

# Skill Creation Guide

Generate properly formatted SKILL.md files that help AI agents perform domain-specific tasks effectively.

## File Structure

Every skill must have:

- YAML frontmatter with required fields
- Markdown body with clear instructions
- Progressive disclosure (concise main file, detailed references separate)

Optional directories:

- `scripts/`: Executable code agents can run. Keep scripts self-contained or document dependencies, and include clear error handling.
- `references/`: On-demand documentation (for example, `REFERENCE.md`, templates, domain notes). Keep files focused and small for efficient context usage.
- `assets/`: Static resources such as templates, diagrams, and data files.

Recommended layout:

```text
skill-name/
├── SKILL.md
├── scripts/      # Optional
├── references/   # Optional
├── assets/       # Optional
└── ...
```

## Frontmatter Requirements

`SKILL.md` must start with YAML frontmatter, followed by Markdown instructions.

### Required Fields

```yaml
---
name: skill-name
description: What this skill does and when to use it.
---
```

**name field rules:**

- 1-64 characters
- Lowercase alphanumeric characters and hyphens only
- No leading/trailing hyphens
- No consecutive hyphens (`--`)
- Must match parent directory name

**description field rules:**

- 1-1024 characters
- Include WHAT the skill does
- Include WHEN to use it (trigger keywords)
- Be specific about use cases

### Optional Fields

Optional frontmatter fields and constraints:

- `license`: License name or reference to a bundled license file
- `compatibility`: 1-500 characters when present; describe environment requirements only when needed
- `metadata`: Key-value mapping for additional metadata
- `allowed-tools`: Space-delimited list of pre-approved tools (experimental; support varies by agent)

```yaml
license: Apache-2.0
compatibility: Requires git, docker, and internet access
metadata:
  author: org-name
  version: "1.0"
allowed-tools: Bash(git:*) Bash(jq:*) Read
```

## Body Content Guidelines

**Structure:**

1. Clear overview of capability
2. Step-by-step instructions
3. Examples with inputs/outputs
4. Edge cases and considerations

**Best Practices:**

- Keep main SKILL.md under 500 lines (~5000 tokens)
- Use bullet points for scanability
- Include code examples where helpful
- Reference external files for detailed content
- Write for progressive disclosure

## Progressive Disclosure Pattern

Optimize for efficient context usage:

1. **Metadata** (~100 tokens): name + description loaded at startup
2. **Instructions** (<5000 tokens): Full SKILL.md loaded when activated
3. **Resources** (as needed): Reference files loaded on demand

Move detailed content to separate files:

- `references/REFERENCE.md` - Technical details
- `scripts/` - Executable code
- `assets/` - Templates, data files

## Common Patterns

### Good Description Examples

```yaml
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDFs, document extraction, or form filling.
```

```yaml
description: Write automated tests using RSpec, Capybara, and FactoryBot for Rails applications. Use when implementing features, fixing bugs, or when testing is mentioned.
```

### Poor Description Examples

```yaml
description: Helps with PDFs. # Too vague, no trigger keywords
```

```yaml
description: A comprehensive system... # Doesn't say what it does
```

## File References

Use relative paths from skill root:

```markdown
See [detailed reference](references/REFERENCE.md) for more.

Run the script: scripts/process.py
```

Keep references one level deep - avoid nested chains.

## Validation Checklist

Before finalizing a SKILL.md:

- [ ] Frontmatter has valid `name` and `description`
- [ ] Name matches directory name
- [ ] Name follows character rules (lowercase alphanumeric + hyphens, no `--`)
- [ ] Description includes both what and when
- [ ] Description has relevant trigger keywords
- [ ] Optional fields follow spec limits (`compatibility` <= 500 chars, `allowed-tools` is space-delimited)
- [ ] Main body is under 500 lines
- [ ] Instructions are actionable and clear
- [ ] Examples included where helpful
- [ ] Detailed content moved to reference files
- [ ] File references use relative paths

Validate with `skills-ref validate ./my-skill` when available.
