# BEM CSS Methodology Skill

## Overview

This skill guides AI in writing CSS using the BEM (Block Element Modifier) methodology for creating maintainable, scalable, and reusable stylesheets with clear naming conventions and component structure.

## When to Use This Skill

Use this skill when:
- Writing CSS for any project that uses BEM naming conventions
- Creating component-based CSS architectures
- Refactoring CSS to be more maintainable and scalable
- Working on projects where multiple developers need clear naming standards
- Building reusable UI component libraries

## What is BEM?

BEM stands for **Block Element Modifier** - a methodology that helps you create reusable components and code sharing in front-end development.

### The Three Parts

1. **Block** - Standalone entity that is meaningful on its own
2. **Element** - A part of a block that has no standalone meaning
3. **Modifier** - A flag on a block or element to change appearance or behavior

## BEM Naming Convention

### Basic Syntax

```
.block { }
.block__element { }
.block--modifier { }
.block__element--modifier { }
```

### Naming Rules

- Use **kebab-case** for multi-word names: `.user-profile`, `.dropdown-menu`
- Use **double underscore** (`__`) to separate block from element
- Use **double dash** (`--`) to separate block/element from modifier
- Keep names semantic and descriptive
- Avoid abbreviations that aren't universally understood

## Block

A **block** is a standalone component that is meaningful on its own and can be reused anywhere in your project.

### Characteristics

- Independent and can exist on its own
- Represents a higher-level component
- Can contain other blocks
- Should not affect its environment (no margin on the block itself)

### Examples

```css
/* Good block names */
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

### Block Best Practices

```css
/* ✅ DO - Block is independent */
.card {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  /* No margin - let the parent control positioning */
}

/* ❌ DON'T - Block affects its environment */
.card {
  padding: 20px;
  margin: 20px; /* Don't add margin to blocks */
  border: 1px solid #ccc;
}

/* ✅ DO - Use semantic names */
.product-card { }
.user-avatar { }
.navigation-menu { }

/* ❌ DON'T - Use presentational names */
.blue-box { }
.left-column { }
.big-text { }
```

## Element

An **element** is a part of a block that has no standalone meaning and is semantically tied to its block.

### Characteristics

- Cannot exist outside its parent block
- Always part of a block, never standalone
- Named to describe what it is, not what it looks like
- Can't contain other elements in the naming (no `.block__element__element`)

### Syntax

```
.block__element
```

### Examples

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

### Element Best Practices

```css
/* ✅ DO - Keep element naming flat */
.menu { }
.menu__item { }
.menu__link { }
.menu__icon { }

/* ❌ DON'T - Don't create deeply nested element names */
.menu { }
.menu__item { }
.menu__item__link { } /* Wrong! */
.menu__item__link__icon { } /* Wrong! */

/* Instead, keep it flat: */
.menu__link { }
.menu__icon { }

/* ✅ DO - Elements describe what they are */
.card__title { }
.card__description { }
.card__button { }

/* ❌ DON'T - Elements describe appearance */
.card__large-text { }
.card__blue-button { }
.card__top-section { }
```

### HTML Structure vs BEM Naming

The HTML structure doesn't need to match the BEM naming exactly.

```html
<!-- HTML structure can be nested -->
<div class="card">
  <div class="card__header">
    <h2 class="card__title">Title</h2>
    <p class="card__subtitle">Subtitle</p>
  </div>
  <div class="card__body">
    <p class="card__text">Content</p>
  </div>
</div>
```

```css
/* But BEM naming stays flat */
.card { }
.card__header { }
.card__title { }
.card__subtitle { } /* Not .card__header__subtitle */
.card__body { }
.card__text { } /* Not .card__body__text */
```

## Modifier

A **modifier** is a flag on a block or element that changes its appearance, behavior, or state.

### Characteristics

- Represents a different state or variation
- Cannot be used alone - always attached to a block or element
- Describes "how it looks" or "what state it's in"
- Can have a boolean form or a key-value form

### Syntax

```
.block--modifier
.block__element--modifier
```

### Boolean Modifiers

Used when the presence of the modifier is meaningful.

```css
/* States */
.button--disabled { }
.menu__item--active { }
.card--highlighted { }

/* Variants */
.button--primary { }
.button--secondary { }
.alert--success { }
.alert--error { }
```

### Key-Value Modifiers

Used when the modifier value is important (though syntax looks the same).

```css
/* Sizes */
.button--small { }
.button--medium { }
.button--large { }

/* Themes */
.card--light { }
.card--dark { }

/* Types */
.icon--arrow { }
.icon--checkmark { }
```

### Modifier Best Practices

```css
/* ✅ DO - Use modifiers for variations */
.button {
  padding: 10px 20px;
  background: blue;
  color: white;
}

.button--large {
  padding: 15px 30px;
  font-size: 18px;
}

.button--primary {
  background: blue;
}

.button--secondary {
  background: gray;
}

/* ❌ DON'T - Create separate blocks for variations */
.button-large { } /* Should be .button--large */
.primary-button { } /* Should be .button--primary */
.blue-button { } /* Should use modifier, not separate block */

/* ✅ DO - Apply modifiers to blocks AND elements */
.menu--vertical { }
.menu__item--active { }

/* ✅ DO - Use multiple modifiers when needed */
<button class="button button--large button--primary">
  Click me
</button>
```

## Complete BEM Examples

### Example 1: Button Component

```html
<!-- HTML -->
<button class="button button--primary button--large">
  <span class="button__icon">→</span>
  <span class="button__text">Click me</span>
</button>

<button class="button button--secondary button--small button--disabled">
  <span class="button__text">Disabled</span>
</button>
```

```css
/* CSS */

/* Block */
.button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

/* Elements */
.button__icon {
  font-size: 16px;
}

.button__text {
  line-height: 1;
}

/* Modifiers - Variants */
.button--primary {
  background-color: #007bff;
  color: white;
}

.button--primary:hover {
  background-color: #0056b3;
}

.button--secondary {
  background-color: #6c757d;
  color: white;
}

.button--secondary:hover {
  background-color: #545b62;
}

/* Modifiers - Sizes */
.button--small {
  padding: 6px 12px;
  font-size: 12px;
}

.button--large {
  padding: 15px 30px;
  font-size: 18px;
}

/* Modifiers - States */
.button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Example 2: Card Component

```html
<!-- HTML -->
<article class="card card--elevated card--featured">
  <div class="card__header">
    <img src="image.jpg" alt="" class="card__image">
  </div>
  <div class="card__body">
    <h2 class="card__title">Card Title</h2>
    <p class="card__description">This is the card description.</p>
  </div>
  <div class="card__footer">
    <button class="card__button card__button--primary">Read More</button>
  </div>
</article>
```

```css
/* CSS */

/* Block */
.card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

/* Elements */
.card__header {
  position: relative;
}

.card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card__body {
  padding: 20px;
}

.card__title {
  margin: 0 0 10px;
  font-size: 24px;
  font-weight: 700;
}

.card__description {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.card__footer {
  padding: 0 20px 20px;
  margin-top: auto;
}

.card__button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

/* Element modifier */
.card__button--primary {
  background: #007bff;
  color: white;
}

/* Block modifiers */
.card--elevated {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card--featured {
  border: 2px solid #007bff;
}

.card--compact .card__body {
  padding: 15px;
}

.card--compact .card__title {
  font-size: 18px;
}
```

### Example 3: Navigation Menu

```html
<!-- HTML -->
<nav class="nav nav--horizontal">
  <ul class="nav__list">
    <li class="nav__item nav__item--active">
      <a href="#" class="nav__link">Home</a>
    </li>
    <li class="nav__item">
      <a href="#" class="nav__link">About</a>
    </li>
    <li class="nav__item nav__item--disabled">
      <a href="#" class="nav__link">Services</a>
    </li>
  </ul>
</nav>
```

```css
/* CSS */

/* Block */
.nav {
  background: #333;
}

/* Elements */
.nav__list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav__item {
  /* Base item styles */
}

.nav__link {
  display: block;
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  transition: background 0.2s;
}

.nav__link:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Element modifiers */
.nav__item--active .nav__link {
  background: #007bff;
  font-weight: 700;
}

.nav__item--disabled .nav__link {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Block modifiers */
.nav--horizontal .nav__list {
  flex-direction: row;
}

.nav--vertical .nav__list {
  flex-direction: column;
}

.nav--compact .nav__link {
  padding: 10px 15px;
  font-size: 14px;
}
```

## Mixing BEM with Blocks

Blocks can contain other blocks - this is perfectly valid and encouraged.

```html
<!-- A search-form block containing a button block -->
<form class="search-form">
  <input type="text" class="search-form__input">
  <!-- Button is its own block, not an element of search-form -->
  <button class="button button--primary">
    <span class="button__text">Search</span>
  </button>
</form>
```

```css
.search-form {
  display: flex;
  gap: 10px;
}

.search-form__input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Button is separate - can be reused anywhere */
.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

## Common BEM Patterns

### Pattern 1: State Modifiers

```css
/* Boolean state modifiers */
.modal--open { }
.dropdown--expanded { }
.tab--active { }
.form--loading { }
.input--error { }
.checkbox--checked { }
```

### Pattern 2: Theme Modifiers

```css
/* Theme variations */
.card--light { }
.card--dark { }
.button--primary { }
.button--secondary { }
.button--danger { }
.alert--success { }
.alert--warning { }
```

### Pattern 3: Size Modifiers

```css
/* Size variations */
.button--x-small { }
.button--small { }
.button--medium { }
.button--large { }
.button--x-large { }
.avatar--small { }
.avatar--large { }
```

### Pattern 4: Layout Modifiers

```css
/* Layout variations */
.nav--horizontal { }
.nav--vertical { }
.card--full-width { }
.section--centered { }
.grid--2-columns { }
.grid--3-columns { }
```

## Common Mistakes to Avoid

### Mistake 1: Nested Element Names

```css
/* ❌ DON'T */
.card { }
.card__header { }
.card__header__title { }
.card__header__title__icon { }

/* ✅ DO */
.card { }
.card__header { }
.card__title { }
.card__icon { }
```

### Mistake 2: Creating Elements as Separate Blocks

```css
/* ❌ DON'T */
.card { }
.card-header { } /* Should be .card__header */
.card-body { }   /* Should be .card__body */

/* ✅ DO */
.card { }
.card__header { }
.card__body { }
```

### Mistake 3: Using Presentational Names

```css
/* ❌ DON'T */
.card--blue { }
.button--big-red { }
.text--left { }

/* ✅ DO */
.card--primary { }
.button--danger { }
.text--align-start { } /* Or use utility classes for this */
```

### Mistake 4: Modifying Blocks from Parent

```css
/* ❌ DON'T - Modifying block from parent selector */
.sidebar .button {
  background: gray; /* Don't style blocks based on location */
}

/* ✅ DO - Use modifier or create context-specific block */
.button--sidebar {
  background: gray;
}

/* OR if button behavior truly changes in sidebar context */
.sidebar-button {
  background: gray;
}
```

### Mistake 5: Using Modifiers Alone

```html
<!-- ❌ DON'T - Modifier without base class -->
<button class="button--primary">Click</button>

<!-- ✅ DO - Always include base class -->
<button class="button button--primary">Click</button>
```

### Mistake 6: Tag Selectors

```css
/* ❌ DON'T - Relying on tag selectors */
.card h2 {
  font-size: 24px;
}

.card p {
  color: #666;
}

/* ✅ DO - Use BEM elements */
.card__title {
  font-size: 24px;
}

.card__description {
  color: #666;
}
```

## BEM Benefits

### 1. Modularity
Blocks are independent and reusable. No cascading issues from parent contexts.

### 2. Reusability
Components can be used anywhere without conflicts or unexpected styling.

### 3. Clarity
Class names clearly communicate structure and purpose.

### 4. Scalability
Easy to understand even in large codebases with many developers.

### 5. Team Communication
Shared vocabulary between designers, developers, and stakeholders.

## BEM Naming Checklist

When writing BEM CSS, verify:

- [ ] **Block names** are semantic and reusable (`.card`, `.button`, `.menu`)
- [ ] **Element names** are flat, not nested (`.card__title`, not `.card__header__title`)
- [ ] **Modifiers** describe state or variation (`.button--primary`, `.card--elevated`)
- [ ] **Kebab-case** used for multi-word names (`.user-profile`, `.dropdown-menu`)
- [ ] **Double underscore** (`__`) separates blocks from elements
- [ ] **Double dash** (`--`) separates modifiers
- [ ] **No tag selectors** - only class selectors
- [ ] **No location-based styling** - blocks work anywhere
- [ ] **Base class + modifier** used together in HTML
- [ ] **Semantic names**, not presentational (`.button--primary`, not `.button--blue`)

## Quick Reference

| Pattern | Syntax | Example |
|---------|--------|---------|
| **Block** | `.block` | `.card` |
| **Element** | `.block__element` | `.card__title` |
| **Block Modifier** | `.block--modifier` | `.card--elevated` |
| **Element Modifier** | `.block__element--modifier` | `.card__title--large` |
| **Multi-word names** | `.block-name` | `.user-profile` |

## HTML Usage

```html
<!-- Base component -->
<div class="card">
  <h2 class="card__title">Title</h2>
</div>

<!-- With modifier -->
<div class="card card--elevated">
  <h2 class="card__title">Title</h2>
</div>

<!-- Multiple modifiers -->
<div class="card card--elevated card--primary">
  <h2 class="card__title card__title--large">Title</h2>
</div>
```

## Resources

- [BEM Official Site](https://getbem.com/)
- [BEM Naming Convention](https://getbem.com/naming/)
- [BEM FAQ](https://getbem.com/faq/)
- [MindBEMding - Getting Your Head Round BEM Syntax](https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
- [CSS Guidelines - BEM-like Naming](https://cssguidelin.es/#bem-like-naming)

---

**Last Updated**: February 2026
**Skill Version**: 1.0.0
