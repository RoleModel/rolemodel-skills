# skill.md — Optics Design System (HTML + CSS Implementation)

This document defines **strict, enforceable rules** for an AI implementing HTML and CSS using the **Optics design system**. The AI must follow these rules exactly, especially around **token naming, structure, and usage**. Deviation from these rules is considered incorrect output.

---

## Source of Truth

- Optics tokens are defined in `src/core/tokens`
- Core tokens live in:
  - `src/core/tokens/base_tokens.css`
  - `src/core/tokens/scale_color_tokens.css`
- A canonical list and organizational reference of all current tokens exist in `docs/token_structure.json`

The AI must assume that **only tokens defined by Optics or explicitly provided by the user exist**. Never invent tokens.

---

## Core Principle

**All styling values must be expressed via Optics tokens whenever a token exists.**

Hard‑coded values (e.g. `#fff`, `16px`, `box-shadow: …`) are only acceptable when the user explicitly asks for a new token or when no relevant Optics token exists.

---

## Token Naming Structure (Mandatory)

All Optics tokens follow this structure:

```
--{prefix}-{category}-{sub-category?}-{variant-qualifier?}-{variant}: value;
```

Each segment is **lowercase**, **kebab‑case**, and **hyphen‑delimited**. Segments must appear **in this order only**. 

### Segments

#### 1. Prefix (required)
Namespace indicating ownership.

- `op` — Optics system tokens
- `ya` — application‑level tokens (used only when explicitly instructed)

> The AI must never change the prefix of an Optics token.

---

#### 2. Category (required)
Defines the token domain.

Common categories include:
- `color`
- `font`
- `space`
- `border`
- `shadow`

---

#### 3. Sub‑category (optional)
Further specialization within a category.

Examples:
- `font-size`
- `font-weight`
- `primary`

Only include a sub‑category when the Optics token definition includes one.

---

#### 4. Variant Qualifier (optional)
Qualifies the variant with a condition, state, or multiplier.

Examples:
- `x`, `2x`, `3x`
- `on`
- `active`

Variant qualifiers **must precede** the variant.

---

#### 5. Variant (required)
The concrete value choice.

Common variants:
- `small`
- `medium`
- `large`
- `plus-one`

---

## Valid Token Examples

```
--op-color-primary-on-plus-one
--op-font-size-large
--op-shadow-x-small
--op-border-bottom
```

## Invalid Token Examples (Do Not Generate)

```
--op-primary-color
--op-font-large
--op-color-primary-plus-one-on
--op_shadow_small
```

---

## Using Tokens in CSS

Tokens must be consumed via `var()`:

```css
color: var(--op-color-primary-on-plus-one);
font-size: var(--op-font-size-large);
```

Never redefine Optics tokens inside component styles unless explicitly instructed.

---

## Component‑Specific Tokens

Some components expose their own tokens. These follow a related but distinct structure.

### Structure

```
--{prefix}-{component-name}-{sub-name?}-{variant-qualifier?}-{variant}
```

- The **component name replaces the category**
- Sub‑names are optional and component‑defined

---

### Public vs Private Component Tokens

#### Public API Tokens
- Intended for user customization
- Safe to reference or override when documented

```
--prefix-component-name-sub-name-variant-qualifier-variant
```

#### Private API Tokens
- Used internally by the component
- **Must never be set or overridden by the AI**
- Identified by a double underscore prefix

```
__prefix-component-name-sub-name-variant-qualifier-variant
```

If a token starts with `__`, it is read‑only.

---

## HTML Responsibilities

The AI must:
- Use semantic HTML elements by default
- Avoid styling hooks that bypass Optics tokens
- Prefer structural markup over styling wrappers

---

## CSS Responsibilities

The AI must:
- Prefer existing Optics tokens over custom values
- Preserve exact token spelling and order
- Avoid creating new tokens unless explicitly instructed
- Never rearrange token segments

---

## Token Safety Rules (Non‑Negotiable)

- ❌ Do not invent tokens
- ❌ Do not reorder token segments
- ❌ Do not camelCase or snake_case tokens
- ❌ Do not inline raw values when a token exists
- ✅ Always assume the token structure is authoritative

---

## Failure Mode Examples

**Incorrect**
```css
padding: 16px;
```

**Correct**
```css
padding: var(--op-space-medium);
```

---

## Mental Model for the AI

Think of Optics tokens as a **strict grammar**, not a suggestion.

If a token name cannot be justified by the documented structure, it must not be emitted.

When uncertain:
- Reuse an existing token
- Ask for clarification
- Or leave the value unset

Never guess.

