---
name: optics-context
description: Use the Optics design framework for styling applications. Apply Optics classes for layout, spacing, typography, colors, and components. Use when working on CSS, styling views, or implementing design system guidelines.
---

# Optics Design Framework

Apply the Optics design system for consistent, token-based styling in Rails applications.

## Core Principles

1. **Use tokens, not hard-coded values** - All colors, spacing, typography from `assets/tokens.json`
2. **Follow BEM structure** - Block, Element, Modifier naming conventions
3. **Check existing components first** - Reuse before creating new
4. **Progressive enhancement** - Start with semantic HTML, layer styles

## Finding Optics Classes

Search for components in this order:

1. **Check Optics components** - `skills/optics-context/assets/components.json`
   - Find appropriate component, modifiers, and attributes
   - Modify using BEM if needed
2. **Search project styles** - Look in `app/assets/stylesheets` for existing classes
3. **Create new component** - Only if nothing exists (see "Creating Components" below)

## Using Optics Tokens

**Always use CSS custom properties from `assets/tokens.json`:**

- **Colors**: `var(--op-color-primary)`, `var(--op-color-background)`
- **Spacing**: `var(--op-space-small)`, `var(--op-space-medium)`, `var(--op-space-large)`
- **Typography**: `var(--op-font-size-base)`, `var(--op-line-height-normal)`
- **Borders**: `var(--op-radius-small)`, `var(--op-border-width)`
- **Shadows**: `var(--op-shadow-small)`, `var(--op-shadow-medium)`

## Detecting Violations

**Never use hard-coded values:**

❌ **Colors**: `#fff`, `#000`, `rgb(...)`, `rgba(...)`, `hsl(...)`, color names like `white`, `black`
❌ **Spacing**: Bare `px`, `rem`, `em` values in padding, margin, gap
❌ **Shadows**: `box-shadow: 0 1px 3px rgba(...)`
❌ **Borders**: `border: 1px solid #ddd`
❌ **Gradients**: `linear-gradient(...)` with literal colors

**Common token mistakes:**

❌ `var(--op_color_primary_base)` - Wrong separator (underscore instead of hyphen)
❌ `var(--color-primary-base)` - Missing `--op-` prefix
❌ `var(--op-primary-color-base)` - Wrong segment order

✅ `var(--op-color-primary-base)` - Correct format

**Fix violations by replacing with tokens from `assets/tokens.json`**

## BEM Structure

**Block, Element, Modifier naming:**

```css
.block { }                    /* Component base */
.block__element { }           /* Part of component */
.block--modifier { }          /* Variant of component */
.block__element--modifier { } /* Variant of element */
```

**Nest modifiers and elements:**

```css
.card {
  /* Base styles */
  
  &.card--padded {
    /* Modifier */
  }
  
  .card__header {
    /* Element */
  }
}
```

## Creating Components

**File organization:**
- Create CSS file: `app/assets/stylesheets/components/{component-name}.css`
- Or override: `app/assets/stylesheets/components/overrides/{component-name}.css`
- Import in `application.scss`

**Component structure:**

1. Define base block with semantic name
2. Add nested elements (parts of component)
3. Add modifiers (variants)
4. Use only Optics tokens
5. One component per file unless tightly coupled

**Example - Card component:**

```css
.card {
  position: relative;
  border-radius: var(--op-radius-medium);
  background-color: var(--op-color-background);
  box-shadow: var(--op-shadow-small);
  
  /* Modifiers */
  &.card--padded {
    padding: var(--op-space-medium);
  }
  
  &.card--elevated {
    box-shadow: var(--op-shadow-large);
  }
  
  /* Elements */
  .card__header {
    padding: var(--op-space-medium);
    border-bottom: var(--op-border-width) solid var(--op-color-border);
    border-start-start-radius: var(--op-radius-medium);
    border-start-end-radius: var(--op-radius-medium);
  }
  
  .card__body {
    padding: var(--op-space-medium);
  }
  
  .card__footer {
    padding: var(--op-space-medium);
    border-top: var(--op-border-width) solid var(--op-color-border);
    border-end-start-radius: var(--op-radius-medium);
    border-end-end-radius: var(--op-radius-medium);
  }
}
```

**Example - Button component:**

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--op-space-small) var(--op-space-medium);
  font-size: var(--op-font-size-base);
  font-weight: var(--op-font-weight-medium);
  border-radius: var(--op-radius-small);
  border: var(--op-border-width) solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
  
  &.btn--large {
    padding: var(--op-space-medium) var(--op-space-large);
    font-size: var(--op-font-size-large);
  }
  
  &.btn--small {
    padding: var(--op-space-xsmall) var(--op-space-small);
    font-size: var(--op-font-size-small);
  }
  
  &.btn--disabled,
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.btn.btn--primary {
  background-color: var(--op-color-primary);
  color: var(--op-color-on-primary);
  
  &:hover {
    background-color: var(--op-color-primary-hover);
  }
}

.btn.btn--secondary {
  background-color: var(--op-color-secondary);
  color: var(--op-color-on-secondary);
  
  &:hover {
    background-color: var(--op-color-secondary-hover);
  }
}

.btn.btn--outline {
  background-color: transparent;
  border-color: var(--op-color-border);
  color: var(--op-color-text);
  
  &:hover {
    background-color: var(--op-color-background-hover);
  }
}
```

## Creating Custom Tokens

**First ensure there isn't an existing token that fits your need**
**When tokens are missing, create component-specific ones:**

**Project-specific tokens** (preferred for custom needs):
- Use namespace prefix: `--{project-prefix}-{category}-{name}`
- Example: `--ya-color-brand-accent` for "Your App" project
- Keeps project tokens separate from core Optics

**Token categories:**
- **Color**: `--op-color-{name}` or `--{prefix}-color-{name}`
- **Spacing**: `--op-space-{size}` or `--{prefix}-space-{size}`
- **Typography**: `--op-font-{property}-{value}`
- **Border**: `--op-radius-{size}`, `--op-border-{property}`
- **Shadow**: `--op-shadow-{size}`

## Quick Reference

**Discovery workflow:**
1. Check `assets/components.json` for existing component
2. Search `app/assets/stylesheets` for project styles
3. Create new component with Optics tokens

**Token workflow:**
1. Check `assets/tokens.json` for appropriate token
2. Use token in CSS: `var(--op-category-name)`
3. Create custom token if needed (use project prefix)

**Component workflow:**
1. Create CSS file in `components/` or `components/overrides/`
2. Define block with base styles
3. Add nested elements and modifiers
4. Use only Optics tokens (no hard-coded values)
5. Import in `application.scss`

See `assets/components.json` for available Optics components and `assets/tokens.json` for all design tokens.
