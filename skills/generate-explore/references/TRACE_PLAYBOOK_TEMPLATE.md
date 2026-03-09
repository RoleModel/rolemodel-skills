# Trace Playbook Template

This is a template for the generated
`.agents/explore/references/TRACE_PLAYBOOK.md`. Replace all `{{PLACEHOLDER}}`
values with data from the codebase analysis.

---

BEGIN TEMPLATE (copy everything below this line into
`.agents/explore/references/TRACE_PLAYBOOK.md`)

---

```markdown
# Trace Backwards Playbook

Step-by-step procedures for tracing code through {{PROJECT_NAME}}'s stack.
Used by the explore skill in Mode 3.

## Step 1: Classify the Selected Code

Examine the selected code for these markers:

| Marker | Classification |
|--------|---------------|
{{CLASSIFICATION_TABLE}}

## Step 2: Trace Upward (toward the entry point / user)

{{TRACE_UPWARD_PROCEDURES}}

## Step 3: Trace Downward (toward the data / dependencies)

{{TRACE_DOWNWARD_PROCEDURES}}

## Step 4: Trace Laterally (cross-cutting concerns)

{{TRACE_LATERAL_PROCEDURES}}

{{ADDITIONAL_TRACE_STEPS}}

## Output Format

Present results as a vertical stack diagram:

```
{{STACK_DIAGRAM_FORMAT}}
```

After the stack diagram, write 3-5 sentences explaining how data flows through
these layers for this specific code path.

Then offer adaptive follow-up:
{{FOLLOW_UP_SUGGESTIONS}}
```
