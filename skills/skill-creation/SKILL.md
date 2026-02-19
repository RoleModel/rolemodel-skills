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

## Frontmatter Requirements

### Required Fields

```yaml
---
name: skill-name
description: What this skill does and when to use it.
---
```

**name field rules:**
- 1-64 characters
- Lowercase letters, numbers, hyphens only
- No leading/trailing hyphens
- No consecutive hyphens (`--`)
- Must match parent directory name

**description field rules:**
- 1-1024 characters
- Include WHAT the skill does
- Include WHEN to use it (trigger keywords)
- Be specific about use cases

### Optional Fields

```yaml
license: Apache-2.0
compatibility: Requires git, docker, and internet access
metadata:
  author: org-name
  version: "1.0"
allowed-tools: Bash(git:*) Read Write
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
description: Helps with PDFs.  # Too vague, no trigger keywords
```

```yaml
description: A comprehensive system...  # Doesn't say what it does
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
- [ ] Name follows character rules (lowercase, hyphens only)
- [ ] Description includes both what and when
- [ ] Description has relevant trigger keywords
- [ ] Main body is under 500 lines
- [ ] Instructions are actionable and clear
- [ ] Examples included where helpful
- [ ] Detailed content moved to reference files
- [ ] File references use relative paths

## Example Complete SKILL.md

```yaml
---
name: controller-patterns
description: Review and update existing Rails controllers and generate new controllers following professional patterns and best practices. Covers RESTful conventions, authorization patterns, proper error handling, and maintainable code organization.
---

# Controller Patterns

Generate and review Rails controllers following professional conventions.

## RESTful Actions

Standard resource controllers should include:
- `index` - List resources
- `show` - Display single resource
- `new` - Form for new resource
- `create` - Process new resource form
- `edit` - Form for editing resource
- `update` - Process edit form
- `destroy` - Delete resource

## Authorization Pattern

Always authorize before actions:

\`\`\`ruby
before_action :authenticate_user!
before_action :set_resource, only: [:show, :edit, :update, :destroy]
before_action :authorize_resource

private

def authorize_resource
  authorize @resource
end
\`\`\`

## Error Handling

Handle common errors gracefully:

\`\`\`ruby
rescue_from ActiveRecord::RecordNotFound, with: :not_found

private

def not_found
  redirect_to root_path, alert: "Resource not found"
end
\`\`\`

See [references/EXAMPLES.md](references/EXAMPLES.md) for complete controller examples.
```

## Tips for Effective Skills

1. **Be specific**: Include domain terminology that agents can pattern match
2. **Show examples**: Concrete code beats abstract descriptions
3. **Think trigger words**: What would a user say that should activate this skill?
4. **Test readability**: Can an agent understand and execute without ambiguity?
5. **Keep it focused**: One skill = one clear capability
6. **Reference don't repeat**: Link to docs rather than duplicating content
