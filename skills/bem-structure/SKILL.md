---
name: bem-structure
description: Think of this skill as your BEM consultant. Refactor existing and write new CSS with Optics-aligned BEM structure.
---

## Overview

This skill guides AI in writing CSS using the BEM (Block Element Modifier) methodology for creating maintainable, scalable, and reusable stylesheets with clear naming conventions and component structure, while exercising judgment about scope, risk, and architectural impact. It also should use BEM in conjunction with Optics, our RoleModel design system, so that isn't not recreating things that already exist. If there is already an Optics component that fits the need, it should be used and/or overridden as necessary instead of creating a new BEM block.

The agent should prioritize clarity, predictability, and minimal unintended side effects.

## What is BEM?

BEM stands for **Block Element Modifier** - a methodology that helps you create reusable components and code sharing in front-end development.

### Basic Syntax

#### Overview

  ✅ DO, GOOD
  ``` css
  .block { }
  .block__element { }
  .block--modifier { }
  .block__element--modifier { }
  ```

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
### Block
Encapsulates a standalone entity that is meaningful on its own. While blocks can be nested and interact with each other, semantically they remain equal; there is no precedence or hierarchy. Holistic entities without DOM representation (such as controllers or models) can be blocks as well.

  #### Naming:
  Block names may consist of lowercase Latin letters, digits, and dashes. To form a CSS class, add a short prefix for namespacing: `.block`. Spaces in long block names are replaced by dash.
  
  #### HTML: 
  Any DOM node can be a block if it accepts a class name. `<div class="block">...</div>`
  
  #### CSS:
  Use class name selector only. No tag name or ids. No dependency on other blocks/elements on a page. `.block { color: #042; }`
  
    ✅ DO, GOOD
    ```css
    .card { }
    .button { }
    .menu { }
    .header { }
    .search-form { }
    .user-profile { }
    .modal { }
    .navigation { }
    .dropdown-menu { }
    ```

### Element
Parts of a block and have no standalone meaning. Any element is semantically tied to its block.

  #### Naming:
  Element names may consist of lowercase Latin letters, digits, dashes and underscores. CSS class is formed as block name plus two underscores plus element name: `.block__elem`. Spaces in long element names are replaced by dash.
  
  #### HTML: 
  Any DOM node within a block can be an element. Within a given block, all elements are semantically equal.
  
  #### CSS: 
  `<div class="block"><span class="block__elem"></span></div>`
  
    ✅ DO, GOOD
    ```css
    /* Card block with elements */
    .card { }
    .card__header { }
    .card__title { }
    .card__body { }
    .card__footer { }
    .card__image { }
    
    /* Menu block with elements */
    .menu { }
    .menu__item { }
    .menu__link { }
    .menu__icon { }
    
    /* Search form block with elements */
    .search-form { }
    .search-form__input { }
    .search-form__button { }
    .search-form__label { }
    ```
  
    ✅ DO, GOOD
    ```css
    /* Keep element naming flat */
    .menu { }
    .menu__item { }
    .menu__link { }
    .menu__icon { }
    ```
    
    🚫 DON'T, BAD
    ``` css
    /* Don't create deeply nested element names */
    .menu { }
    .menu__item { }
    .menu__item__link { } /* Wrong! */
    .menu__item__link__icon { } /* Wrong! */
    ```
  
    ✅ DO, GOOD
    ``` css
    /* Instead, keep it flat: */
    .menu__link { }
    .menu__icon { }
    
    /* Elements describe what they are */
    .card__title { }
    .card__description { }
    .card__button { }
    ```
  
    🚫 DON'T, BAD
    ``` css
    /* - Elements describe appearance */
    .card__large-text { }
    .card__blue-button { }
    .card__top-section { }
    ```
  - Element Example:
  
    ✅ DO, GOOD
    ``` css
    .block__elem { color: #042; }
    ```
  
    🚫 DON'T, BAD
    ``` html
    .block .block__elem { color: #042; }
      div.block__elem { color: #042; }
    ```
  
### Modifier
Flags on blocks or elements. Use them to change appearance, behavior or state.

  #### Naming: 
  Modifier names may consist of lowercase Latin letters, digits, dashes and underscores. CSS class is formed as block’s or element’s name plus two dashes: `.block--mod` or `.block__elem--mod` and `.block--color-black` with `.block--color-red`. Spaces in complicated modifiers are replaced by dash.
  
  #### HTML:
  Modifier is an extra class name which you add to a block/element DOM node. Add modifier classes only to blocks/elements they modify, and keep the original class.
  
  #### CSS: 
  Use modifier class name as selector: `.block--hidden { }` To alter elements based on a block-level modifier: `.block--mod` `.block__elem { }` Element modifier: `.block__elem--mod { }`
  - Modifier Example:
  
    ✅ DO, GOOD
    ```
    <div class="block block--mod">...</div>
    <div class="block block--size-big block--shadow-yes">...</div>
    ```
    
    🚫 DON'T, BAD
    ```
    <div class="block--mod">...</div>
    ```

### Other Rules
- Classes only (no IDs)
- Flat classes and selectors only
- No tag-based styling
- No styling based on DOM hierarchy
- One conceptual responsibility per Block
- Elements do not exist outside their Block
- Use **kebab-case** for multi-word names: `.user-profile`, `.dropdown-menu`
- Use **double underscore** (`__`) to separate block from element
- Use **double dash** (`--`) to separate block/element from modifier
- Keep names semantic and descriptive
- Avoid abbreviations that aren't universally understood

### Syntax Example
Suppose you have block form with modifiers `theme: "xmas"` and `simple: true` and with elements `input` and `submit`, and element `submit` with its own modifier `disabled: true` for not submitting form while it is not filled:

  ✅ DO, GOOD
  
  ``` html
  <form class="form form--theme-xmas form--simple">
    <input class="form__input" type="text" />
    <input
      class="form__submit form__submit--disabled"
      type="submit" />
  </form>
  ```
  
  ``` css
  .form { }
  .form--theme-xmas { }
  .form--simple { }
  .form__input { }
  .form__submit { }
  .form__submit--disabled { }
  ```
  
