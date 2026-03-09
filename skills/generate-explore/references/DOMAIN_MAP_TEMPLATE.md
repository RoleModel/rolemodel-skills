# Domain Map Template

This is a template for the generated `.agents/explore/references/DOMAIN_MAP.md`.
Replace all `{{PLACEHOLDER}}` values with data from the codebase analysis.

---

BEGIN TEMPLATE (copy everything below this line into
`.agents/explore/references/DOMAIN_MAP.md`)

---

```markdown
# {{PROJECT_NAME}} Discovery Conventions

How to dynamically locate code for any domain concept in {{PROJECT_NAME}}.
The skill should use Glob and Grep at runtime rather than relying on a static
file list.

## Naming Conventions (how domain concepts map to files)

Given a domain concept like "{{EXAMPLE_CONCEPT}}", here is how to find all
related code:

| Layer | Pattern | Example for "{{EXAMPLE_CONCEPT}}" |
|-------|---------|-----------------------------------|
{{NAMING_CONVENTION_TABLE}}

## Discovery Algorithm

When given a domain concept:

1. **Normalize the input**: determine naming variants
   {{NORMALIZATION_RULES}}

2. **Run parallel searches** using Glob and Grep:
{{SEARCH_COMMANDS}}

3. **Read the primary file(s)** to discover:
{{PRIMARY_FILE_DISCOVERY}}

4. **Read the handler/controller** (if applicable) to discover:
{{HANDLER_DISCOVERY}}

## Domain Profile Output Template

```
## <Concept> Domain Profile

{{PROFILE_SECTIONS}}
```

## Special Domain Areas

Some domains don't follow the standard patterns:

{{SPECIAL_DOMAINS}}

## Key Base Classes / Interfaces

When tracing inheritance, know these base types:
{{BASE_CLASSES}}

## Shared Behavior Locations

When a method/function can't be found on the primary file directly:
{{SHARED_BEHAVIOR_LOCATIONS}}
```
