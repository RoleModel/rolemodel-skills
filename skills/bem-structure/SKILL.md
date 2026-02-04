---
name: bem-structure
description: Think of this skill as your BEM consultant. Refactor existing and write new CSS with Optics-aligned BEM structure.
---

## Overview

This skill guides AI in writing CSS using the BEM (Block Element Modifier) methodology for creating maintainable, scalable, and reusable stylesheets with clear naming conventions and component structure, while exercising judgment about scope, risk, and architectural impact.

The agent should prioritize clarity, predictability, and minimal unintended side effects.

## What is BEM?

BEM stands for **Block Element Modifier** - a methodology that helps you create reusable components and code sharing in front-end development.

### The Three Parts

**Block** - Encapsulates a standalone entity that is meaningful on its own. While blocks can be nested and interact with each other, semantically they remain equal; there is no precedence or hierarchy. Holistic entities without DOM representation (such as controllers or models) can be blocks as well.
- Naming: Block names may consist of lowecase Latin letters, digits, and dashes. To form a CSS class, add a short prefix for namespacing: `.block`. Spaces in long block names are replaced by dash.

**Element** - Parts of a block and have no standalone meaning. Any element is semantically tied to its block.

**Modifier** - Flags on blocks or elements. Use them to change appearance, behavior or state.

## Naming Convention
Use flat BEM classes with explicit `&` usage for modifiers.

### Basic Syntax

```
.block {
  .block__element {
    &.block__element--modifier { }
  }
  
  .block--modifier { }
}
```

### Rule Summary

- All class names MUST be fully explicit and flat BEM
- `&` may be used only as a textual reference to the full selector
- `&` MUST NOT be used to construct class names (`&--`, `&__`)
- Nesting is for organization only, not meaning

### Allowed Usage

`&` may be used to co-locate modifiers with their Block or Element while keeping selectors explicit.

```scss
.card {
  &.card--featured {}
  &.card--compact {}
  &.card--featured {
    &.card--compact {}
  }
}
```
### Disallowed Usage

```scss
.card {
  &--featured {}
  &__title {}
  &__title--large {}
}
```
