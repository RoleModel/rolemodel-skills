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
Namespace indicating ownership and the source of the token.

- `op` — Optics system tokens
- `ya` — application‑level tokens (used only when explicitly instructed, `ya` is an abbreviation for `your application`)

> The AI must never change the prefix of an Optics token.

---

#### 2. Category (required)
Defines the token domain and sub category of the token

Common categories include:
- `color` - color token
- `font` - font token
- `space` - space token
- `border` - border token
- `shadow` - shadow token

---

#### 3. Sub‑category (optional)
Further specialization within a category.

Examples:
- `size` - indicates a token that is a size, in our case a sub category of font
- `weight` - indicates a token that is a font weight, in our case a sub category of font
- `primary` - color
- `neutral` - color
- `warning` - color
- `danger` - color
- `info` - color
- `notice` - color

Only include a sub‑category when the Optics token definition includes one.

---

#### 4. Variant Qualifier (optional)
Qualifies the variant with a condition or multiplier.

Examples:
- `x`, `2x`, `3x`
- `on`

Variant qualifiers **must precede** the variant.

---

#### 5. Variant (required)
The concrete value choice that indicates a specific variant of the token.

Common variants:
- `3x-small` - font, space, border, shadow
- `2x-small` - font, space, border, shadow
- `x-small` - font, space, border, shadow
- `small` - font, space, border, shadow
- `medium` -  font, space, border, shadow
- `large` -  font, space, border, shadow
- `x-large` -  font, space, border, shadow
- `2x-large` -  font, space, border, shadow
- `3x-large` -  font, space, border, shadow
- `plus-three` - color
- `plus-two` - color
- `plus-one` - color
- `min-one` - color
- `min-two` - color
- `min-three` - color

---

## Token Example

✅ GOOD (Do this)
```
--op-color-primary-on-plus-one
--op-font-size-large
--op-shadow-x-small
--op-border-bottom
```

🚫 BAD (Don't do this)
```
--op-primary-color
--op-font-large
--op-color-primary-plus-one-on
--op_shadow_small
```

---

## Using Tokens in CSS

Tokens must be consumed via `var()`:

✅ GOOD (Do this)
```css
color: var(--op-color-primary-on-plus-one);
font-size: var(--op-font-size-large);
padding: var(--op-space-small);
box-shadow: var(--op-border-all) var(--op-color-border);
box-shadow: var(--op-shadow-x-small);
```

🚫 BAD (Don't do this)
```css
color: --op-color-primary-on-plus-one;
font-size: --op-font-size-large;
padding: --op-space-small;
box-shadow: --op-border-all, --op-color-border;
box-shadow: --op-shadow-x-small;
```

Never redefine Optics tokens inside component styles unless explicitly instructed.

---

## Component‑Specific Tokens

Some components expose their own tokens. These follow a related but distinct structure.

### Structure

```
--{prefix}-{component-name}-{sub-name?}-{variant-qualifier?}-{variant}: value;
```

- The **component name replaces the category**
- Sub‑names are optional and component‑defined

---

## Public vs Private Component Tokens

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

## Discovering Optics Classes
When you need classes follow these steps:

1. Check `.github/optics/components.json` for the appropriate component, modifiers, and attributes.
2. If you don't find an appropriate component, search in `app/assets/stylesheets` for any relevant components.
3. If nothing is found, create a new component in a CSS file named after the page that we're on.
3a. If you're creating new classes, always use existing CSS tokens. You can find these in the `.github/optics/tokens.json` file.

### Modifying Optics Classes
When modifying Optics classes, follow these guidelines:

- Always ensure that changes align with the overall design system principles.
- Follow BEM naming conventions for any new classes.
- Add changes to the appropriate CSS file in `app/assets/stylesheets/components/overrides/{component.css}`.
- Ensure that you import any new css files in the `application.scss`

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

- 🚫 Do not invent tokens
- 🚫 Do not reorder token segments
- 🚫 Do not camelCase or snake_case tokens
- 🚫 Do not inline raw values when a token exists
- 🚫 Always prioritize DRY principles - extract repeated markup into partials
- ✅ Always assume the token structure is authoritative

---

## Failure Mode Examples

🚫 BAD (Don't do this)
```css
padding: 16px;
```

✅ GOOD (Do this)
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
