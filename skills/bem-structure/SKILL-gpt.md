---
name: bem-structure
description: Think of this skill as your BEM consultant. Refactor existing and write new CSS with Optics-aligned BEM structure.
---

# Skill: BEM CSS Authoring & Refactoring

## Purpose
This skill enables an agent to analyze, write, and refactor CSS using the BEM (Block–Element–Modifier) methodology while exercising judgment about scope, risk, and architectural impact.

The agent should prioritize clarity, predictability, and minimal unintended side effects.

---

## Core Capabilities

### 1. Rewrite Existing CSS Using BEM

When given an existing CSS file (and optionally HTML/JSX):

- Identify **implicit components** and elevate them to explicit BEM Blocks
- Convert descendant selectors, tag selectors, and state-based classes into:
  - Blocks
  - Elements
  - Modifiers
- Flatten selectors (no nesting dependencies)
- Preserve visual behavior unless explicitly told otherwise
- Prefer renaming over restructuring markup unless required

The agent MUST:
- Explain major naming decisions
- Call out any assumptions made about component boundaries
- Warn if markup changes are required to achieve correct BEM structure

The agent MUST NOT:
- Introduce IDs
- Introduce deeply nested selectors
- Create element-of-element chains (e.g. `block__el__subel`)

---

### 2. Write New CSS Using BEM

When authoring new CSS:

- Define the Block first and describe its responsibility
- Define Elements only when they are conceptually owned by the Block
- Use Modifiers strictly for:
  - Visual variants
  - Behavioral states
- Prefer explicit modifier classes over conditional styling

The agent SHOULD:
- Suggest example HTML usage
- Keep class names semantic and domain-oriented
- Avoid encoding layout context into names (e.g. `sidebar__button-left`)

---

### 3. Answer Questions About BEM Naming Conventions

When asked about BEM naming:

- Respond using canonical BEM terminology
- Give concrete examples (HTML + CSS)
- Distinguish clearly between:
  - Blocks vs layout containers
  - Modifiers vs state classes
  - BEM vs utility classes

If a question reveals ambiguity or misuse of BEM:
- Gently correct it
- Explain *why* the distinction matters

---

### 4. Assess Refactor / Rewrite Impact

Before performing or recommending a refactor, the agent must evaluate:

- How many components reference the existing classes
- Whether classes are reused across unrelated contexts
- Whether CSS is coupled to JS behavior or tests
- Whether class names encode business meaning vs presentation

If impact is high, the agent SHOULD:
- Warn that the change may cascade
- Suggest incremental or parallel refactors
- Recommend introducing BEM alongside existing styles temporarily

Use phrases like:
- “This change likely affects multiple components…”
- “A full rewrite here may be higher risk than necessary…”

---

### 5. Suggest When More Thought Is Needed

The agent MUST pause and flag concerns when:

- A single Block appears to be doing multiple jobs
- Elements seem reusable outside the Block
- Modifiers exceed reasonable complexity
- Naming decisions feel arbitrary or unclear
- The request conflicts with BEM principles

In these cases, the agent SHOULD:
- Ask clarifying questions *only when necessary*
- Propose alternative structures
- Suggest stepping back to define component boundaries first

Example signals:
- “This might indicate a missing Block.”
- “This element may deserve its own component.”
- “This modifier is acting more like a separate variant.”

---

## BEM Rules to Enforce

- Classes only (no IDs)
- Flat selectors only
- No tag-based styling
- No styling based on DOM hierarchy
- One conceptual responsibility per Block
- Elements do not exist outside their Block

---

## Non-Goals

This skill does NOT:
- Enforce a specific CSS preprocessor
- Replace design system decisions
- Automatically refactor without surfacing risk
- Optimize for brevity over clarity

Correctness, predictability, and maintainability take precedence.

---
