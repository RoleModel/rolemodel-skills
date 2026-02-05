# Optics Design System - HTML/CSS Implementation Skill

## Overview

Optics is a RoleModel design system with a sophisticated HSL-based color system and comprehensive component library. This skill provides critical guidance for AI implementing HTML and CSS using Optics tokens and components.

## CRITICAL: Token Naming Structure

### The Three-Layer Architecture

Optics uses a **three-layer token architecture** that is fundamentally different from typical design systems:

```
HSL Base Variables → Scale Tokens → Semantic "On" Tokens
```

**IMPORTANT**: There is NO `--color-primary` token. You MUST use `--op-color-primary-base` instead.

### Token Naming Convention

All Optics tokens follow this structure:

```
--op-{category}-{name}-{modifier}
```

**Prefix**: ALL Optics tokens start with `--op-` (short for "Optics")

**Categories**:
- `color` - Color system (500+ tokens)
- `space` - Spacing system
- `font` - Typography
- `border` - Border radius and widths
- `shadow` - Elevation system

### Color Token Structure Explained

Optics has **500+ color tokens** organized as a predictable scale system. Understanding the naming layers is critical:

#### Layer 1: HSL Base Variables
Raw HSL values that define color foundations:
```css
--op-color-primary-h: 220;
--op-color-primary-s: 90%;
--op-color-primary-l: 50%;
```

#### Layer 2: Scale Tokens
Luminosity-based scales with granular plus/minus modifiers:
```css
/* Main Scale - Lighter to Darker */
--op-color-primary-plus-max      /* Lightest (100% / 10% in dark mode) */
--op-color-primary-plus-eight    /* 98% / 18% */
--op-color-primary-plus-seven    /* 96% / 16% */
--op-color-primary-plus-six      /* 94% / 14% */
--op-color-primary-plus-five     /* 90% / 10% */
--op-color-primary-plus-four     /* 84% / 14% */
--op-color-primary-plus-three    /* 70% / 10% */
--op-color-primary-plus-two      /* 64% / 14% */
--op-color-primary-plus-one      /* 45% / 15% */
--op-color-primary-base          /* Base color: 40% / 10% */
--op-color-primary-minus-one     /* 36% / 16% */
--op-color-primary-minus-two     /* 32% / 12% */
--op-color-primary-minus-three   /* 28% / 8% */
--op-color-primary-minus-four    /* 24% / 4% */
--op-color-primary-minus-five    /* 20% / 5% */
--op-color-primary-minus-six     /* 16% / 6% */
--op-color-primary-minus-seven   /* 8% / 88% */
--op-color-primary-minus-eight   /* 4% / 84% */
--op-color-primary-minus-max     /* Darkest (0% / 80%) */
```

**Scale Pattern**: Plus/minus modifiers with light-dark() for automatic theme switching
- `plus-max` through `plus-one`: Progressively lighter shades
- `base`: The core color value
- `minus-one` through `minus-max`: Progressively darker shades
- All scales automatically adapt between light and dark modes using `light-dark()`

#### Layer 3: Semantic "On" Tokens
Context-specific tokens for text/icons placed ON backgrounds, with alternative variants:
```css
/* Standard "On" tokens */
--op-color-on-primary-plus-max
--op-color-on-primary-plus-eight
--op-color-on-primary-plus-seven
--op-color-on-primary-plus-six
--op-color-on-primary-plus-five
--op-color-on-primary-plus-four
--op-color-on-primary-plus-three
--op-color-on-primary-plus-two
--op-color-on-primary-plus-one
--op-color-on-primary-base         /* Text/icons on primary-base background */
--op-color-on-primary-minus-one
--op-color-on-primary-minus-two
--op-color-on-primary-minus-three
--op-color-on-primary-minus-four
--op-color-on-primary-minus-five
--op-color-on-primary-minus-six
--op-color-on-primary-minus-seven
--op-color-on-primary-minus-eight
--op-color-on-primary-minus-max

/* Alternative "On" tokens for secondary text/subtle content */
--op-color-on-primary-plus-max-alt
--op-color-on-primary-plus-eight-alt
--op-color-on-primary-plus-seven-alt
/* ... continues for all scale levels with -alt suffix */
--op-color-on-primary-base-alt     /* Secondary text on primary-base */
--op-color-on-primary-minus-max-alt
```

**"On" Pattern**: Each main scale level has corresponding "on" and "on-alt" tokens
- Standard `on-{color}-{scale}`: Primary text/icons with guaranteed contrast
- Alternative `on-{color}-{scale}-alt`: Secondary/muted text on same background

### Complete Token Examples

#### Color Tokens
```css
/* Primary Colors - Main Scale */
--op-color-primary-plus-max
--op-color-primary-plus-five
--op-color-primary-base
--op-color-primary-minus-five
--op-color-primary-minus-max

/* Primary Colors - "On" Scale */
--op-color-on-primary-base
--op-color-on-primary-base-alt
--op-color-on-primary-plus-eight
--op-color-on-primary-minus-seven

/* Neutral Colors - Main Scale */
--op-color-neutral-plus-max
--op-color-neutral-base
--op-color-neutral-minus-max

/* Neutral Colors - "On" Scale */
--op-color-on-neutral-base
--op-color-on-neutral-plus-five

/* Alert Colors */
--op-color-alert-warning-base
--op-color-alert-warning-plus-three
--op-color-alert-danger-base
--op-color-alert-info-base
--op-color-alert-notice-base
--op-color-on-alert-warning-base
--op-color-on-alert-danger-base
```

#### Spacing Tokens
Calc-based rem units with semantic size scale:
```css
--op-space-3x-small   /* Smallest spacing */
--op-space-2x-small   
--op-space-x-small    
--op-space-small      
--op-space-medium     
--op-space-large      
--op-space-x-large    
--op-space-2x-large   
--op-space-3x-large   /* Largest spacing */
```

#### Typography Tokens
Noto Sans/Serif fonts with comprehensive type scale:
```css
/* Font Families */
--op-font-family-sans
--op-font-family-serif

/* Font Sizes */
--op-font-size-x-small     
--op-font-size-small       
--op-font-size-medium      
--op-font-size-large       
--op-font-size-x-large     
--op-font-size-2x-large    
--op-font-size-3x-large    
--op-font-size-4x-large

/* Font Weights */
--op-font-weight-light     /* 300 */
--op-font-weight-regular   /* 400 */
--op-font-weight-medium    /* 500 */
--op-font-weight-semibold  /* 600 */
--op-font-weight-bold      /* 700 */

/* Line Heights */
--op-line-height-tight   /* 1.25 */
--op-line-height-normal  /* 1.5 */
--op-line-height-relaxed /* 1.75 */
```

#### Border Tokens
```css
/* Border Radius */
--op-border-radius-small     /* Small rounded corners */
--op-border-radius-medium    /* Medium rounded corners */
--op-border-radius-large     /* Large rounded corners */
--op-border-radius-pill      /* Fully rounded (pills) */
--op-border-radius-circle    /* Perfect circle */

/* Border Widths */
--op-border-width-thin
--op-border-width-medium
--op-border-width-thick
```

#### Shadow Tokens
Elevation system for depth:
```css
--op-shadow-x-small
--op-shadow-small
--op-shadow-medium
--op-shadow-large
--op-shadow-x-large
```

## Installation & Setup

### CDN Integration (Recommended)
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@rolemodel/optics@latest/dist/css/optics.min.css">
```

### NPM Integration
```bash
npm install @rolemodel/optics
```

Then import in your CSS:
```css
@import '@rolemodel/optics/dist/css/optics.min.css';
```

## Component Library (24 Components)

All components use Optics design tokens. Here are the available components:

### Layout Components
- **Card**: Content containers with elevation
- **Divider**: Content separators
- **Navbar**: Top navigation
- **Sidebar**: Side navigation
- **SidePanel**: Sliding side panels

### Interactive Components
- **Button**: Interactive buttons with variants
- **ButtonGroup**: Grouped button container
- **Switch**: Toggle switches
- **Tab**: Tabbed interfaces

### Form Components
- **Form**: Input fields, textareas, selects

### Feedback Components
- **Alert**: Notification messages (warning, danger, info, notice)
- **ConfirmDialog**: Action confirmation modals
- **Modal**: Overlay dialogs
- **Spinner**: Loading indicators
- **Tooltip**: Contextual information

### Data Display
- **Table**: Data tables
- **Pagination**: Page navigation
- **Avatar**: User profile pictures
- **Badge**: Status indicators and labels
- **Tag**: Categorization labels
- **TextPair**: Label-value pairs

### Navigation
- **Breadcrumbs**: Navigation hierarchy
- **Accordion**: Collapsible content panels

### Media
- **Icon**: Material Symbols icons

## Implementation Best Practices

### 1. Always Use Tokens, Never Hard-Code Values

**❌ WRONG:**
```css
.button {
  background-color: #3b82f6;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 14px;
}
```

**✅ CORRECT:**
```css
.button {
  background-color: var(--op-color-primary-base);
  padding: var(--op-space-medium) var(--op-space-large);
  border-radius: var(--op-border-radius-medium);
  font-size: var(--op-font-size-small);
}
```

### 2. Use Semantic Color Tokens Appropriately

**Understanding the Color Context:**

```css
/* For primary action backgrounds */
.btn-primary {
  background-color: var(--op-color-primary-base);
  color: var(--op-color-on-primary-base);  /* Text ON primary bg */
}

/* For surface/card backgrounds */
.card {
  background-color: var(--op-color-neutral-plus-eight);
  color: var(--op-color-on-neutral-plus-eight);
}

/* For alert states */
.alert-warning {
  background-color: var(--op-color-alert-warning-base);
  color: var(--op-color-on-alert-warning-base);
}
```

### 3. Leverage the Luminosity Scale

When you need variations of a color, use the scale system:

```css
/* Interactive states using the scale */
.button-primary {
  background-color: var(--op-color-primary-base);
}

.button-primary:hover {
  background-color: var(--op-color-primary-minus-two); /* Darker on hover */
}

.button-primary:active {
  background-color: var(--op-color-primary-minus-four); /* Even darker on active */
}

.button-primary[disabled] {
  background-color: var(--op-color-primary-plus-five); /* Lighter when disabled */
  opacity: 0.6;
}
```

### 4. Spacing Consistency

Use the spacing scale for ALL spacing (margin, padding, gaps):

```css
.component {
  margin-bottom: var(--op-space-large);
  padding: var(--op-space-medium);
  gap: var(--op-space-small);
}

/* For precise control, combine tokens */
.hero {
  padding: var(--op-space-3x-large) var(--op-space-x-large);
}
```

### 5. Typography System

Combine font tokens for complete typography control:

```css
.heading-1 {
  font-family: var(--op-font-family-sans);
  font-size: var(--op-font-size-4x-large);
  font-weight: var(--op-font-weight-bold);
  line-height: var(--op-line-height-tight);
}

.body-text {
  font-family: var(--op-font-family-sans);
  font-size: var(--op-font-size-medium);
  font-weight: var(--op-font-weight-regular);
  line-height: var(--op-line-height-normal);
}
```

### 6. Shadow/Elevation System

```css
.card-elevated {
  box-shadow: var(--op-shadow-md);
}

.modal {
  box-shadow: var(--op-shadow-xl);
}

.dropdown {
  box-shadow: var(--op-shadow-sm);
}
```

## Common Mistakes to Avoid

### ❌ Mistake 1: Looking for Simple Token Names
```css
/* THESE DON'T EXIST */
color: var(--color-primary);
background: var(--primary);
padding: var(--spacing-medium);
```

**✅ Correct Usage:**
```css
color: var(--op-color-primary-base);
background: var(--op-color-primary-base);
padding: var(--op-space-md);
```

### ❌ Mistake 2: Forgetting the --op- Prefix
```css
/* WRONG */
color: var(--color-primary-base);
```

**✅ Correct:**
```css
color: var(--op-color-primary-base);
```

### ❌ Mistake 3: Using Wrong "On" Color
```css
/* WRONG - Using on-primary for text on neutral background */
.card {
  background: var(--op-color-neutral-100);
  color: var(--op-color-on-primary); /* Wrong context! */
}
```

**✅ Correct:**
```css
.card {
  background: var(--op-color-neutral-100);
  color: var(--op-color-on-surface); /* Correct for neutral surfaces */
}
```

### ❌ Mistake 4: Arbitrary Scale Numbers
```css
/* WRONG - Scale numbers aren't arbitrary */
background: var(--op-color-primary-550); /* This doesn't exist */
```

**✅ Correct:**
```css
/* Use defined scale: 100, 200, 300, 400, 500, 600, 700, 800, 900 */
background: var(--op-color-primary-500);
```

## Component Token Dependencies

Each component relies on specific tokens. Here are examples:

### Button Component
```css
.op-button {
  /* Typography */
  font-family: var(--op-font-family-sans);
  font-size: var(--op-font-size-base);
  font-weight: var(--op-font-weight-medium);
  
  /* Spacing */
  padding: var(--op-space-sm) var(--op-space-lg);
  
  /* Colors */
  background-color: var(--op-color-primary-base);
  color: var(--op-color-on-primary);
  
  /* Borders */
  border-radius: var(--op-border-radius-md);
  border: var(--op-border-width-thin) solid transparent;
  
  /* Shadows */
  box-shadow: var(--op-shadow-sm);
}

.op-button:hover {
  background-color: var(--op-color-primary-600);
}
```

### Card Component
```css
.op-card {
  /* Colors */
  background-color: var(--op-color-neutral-plus-eight);
  color: var(--op-color-on-neutral-plus-eight);
  
  /* Spacing */
  padding: var(--op-space-large);
  
  /* Borders */
  border-radius: var(--op-border-radius-large);
  
  /* Shadows */
  box-shadow: var(--op-shadow-medium);
}
```

### Alert Component
```css
.op-alert {
  /* Spacing */
  padding: var(--op-space-medium);
  margin-bottom: var(--op-space-large);
  
  /* Borders */
  border-radius: var(--op-border-radius-medium);
  border-width: var(--op-border-width-thin);
}

.op-alert--warning {
  background-color: var(--op-color-alert-warning-base);
  color: var(--op-color-on-alert-warning-base);
  border-color: var(--op-color-alert-warning-minus-three);
}

.op-alert--danger {
  background-color: var(--op-color-alert-danger-base);
  color: var(--op-color-on-alert-danger-base);
  border-color: var(--op-color-alert-danger-minus-three);
}
```

## Accessibility Guidelines

Optics is built with WCAG standards in mind:

1. **Color Contrast**: The luminosity-based scale ensures proper contrast ratios
2. **Semantic Tokens**: Use "on" tokens to ensure text is readable on backgrounds
3. **Component Design**: All components meet accessibility standards

```css
/* Good contrast using semantic tokens */
.accessible-button {
  background-color: var(--op-color-primary-base);
  color: var(--op-color-on-primary-base); /* Guaranteed contrast */
}

/* For custom combinations, verify contrast */
.custom-text {
  background-color: var(--op-color-neutral-plus-five);
  color: var(--op-color-neutral-minus-max); /* High contrast */
}
```

## Icon System

Optics uses Material Symbols icons:

```html
<!-- Icon usage -->
<span class="op-icon">home</span>
<span class="op-icon">search</span>
<span class="op-icon">settings</span>
```

```css
.op-icon {
  font-family: 'Material Symbols Outlined';
  font-size: var(--op-font-size-x-large);
  color: var(--op-color-primary-base);
}
```

## Responsive Design

Use Optics spacing tokens with responsive breakpoints:

```css
.container {
  padding: var(--op-space-medium);
}

@media (min-width: 768px) {
  .container {
    padding: var(--op-space-x-large);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: var(--op-space-3x-large);
  }
}
```

## Theming & Customization

Override Optics tokens to create custom themes:

```css
:root {
  /* Override primary color HSL values */
  --op-color-primary-h: 280;  /* Purple instead of blue */
  --op-color-primary-s: 75%;
  --op-color-primary-l: 55%;
  
  /* Or override specific scale values */
  --op-color-primary-base: hsl(280, 75%, 55%);
  
  /* Override spacing if needed */
  --op-space-medium: 1.25rem;
}
```

## Quick Reference Card

### Token Structure
```
--op-{category}-{name}-{modifier}
```

### Categories
- `color` - Colors (500+ tokens with HSL base, scale, and "on" variants)
- `space` - Spacing (full-word scale: x-small to 3x-large)
- `font` - Typography (family, size, weight, line-height)
- `border` - Borders (radius, width)
- `shadow` - Shadows (x-small to x-large)

### Most Common Tokens

**Colors:**
- `--op-color-primary-base`
- `--op-color-on-primary-base`
- `--op-color-neutral-plus-max` through `--op-color-neutral-minus-max`
- `--op-color-on-neutral-base`
- Alert tokens: `--op-color-alert-{type}-base` and `--op-color-on-alert-{type}-base`

**Spacing:**
- `--op-space-small`, `--op-space-medium`, `--op-space-large`, `--op-space-x-large`

**Typography:**
- `--op-font-family-sans`
- `--op-font-size-medium`, `--op-font-size-large`, `--op-font-size-x-large`
- `--op-font-weight-regular`, `--op-font-weight-medium`, `--op-font-weight-bold`

**Borders:**
- `--op-border-radius-medium`
- `--op-border-width-thin`

**Shadows:**
- `--op-shadow-small`, `--op-shadow-medium`

## Example: Complete Component Implementation

```html
<div class="custom-card">
  <div class="custom-card__header">
    <h2 class="custom-card__title">
      <span class="op-icon">lightbulb</span>
      Feature Highlight
    </h2>
  </div>
  <div class="custom-card__body">
    <p class="custom-card__text">
      This card demonstrates proper use of Optics design tokens
      across all design properties.
    </p>
  </div>
  <div class="custom-card__footer">
    <button class="custom-button custom-button--primary">
      Learn More
    </button>
    <button class="custom-button custom-button--secondary">
      Dismiss
    </button>
  </div>
</div>
```

```css
.custom-card {
  /* Layout */
  display: flex;
  flex-direction: column;
  
  /* Colors */
  background-color: var(--op-color-neutral-plus-eight);
  color: var(--op-color-on-neutral-plus-eight);
  
  /* Spacing */
  padding: var(--op-space-large);
  gap: var(--op-space-medium);
  
  /* Borders */
  border-radius: var(--op-border-radius-large);
  border: var(--op-border-width-thin) solid var(--op-color-neutral-plus-three);
  
  /* Shadows */
  box-shadow: var(--op-shadow-medium);
}

.custom-card__header {
  padding-bottom: var(--op-space-small);
  border-bottom: var(--op-border-width-thin) solid var(--op-color-neutral-plus-three);
}

.custom-card__title {
  /* Typography */
  font-family: var(--op-font-family-sans);
  font-size: var(--op-font-size-x-large);
  font-weight: var(--op-font-weight-semibold);
  line-height: var(--op-line-height-tight);
  
  /* Layout */
  display: flex;
  align-items: center;
  gap: var(--op-space-small);
  
  /* Reset */
  margin: 0;
}

.custom-card__title .op-icon {
  color: var(--op-color-primary-base);
  font-size: var(--op-font-size-2x-large);
}

.custom-card__body {
  flex: 1;
}

.custom-card__text {
  font-family: var(--op-font-family-sans);
  font-size: var(--op-font-size-medium);
  line-height: var(--op-line-height-normal);
  margin: 0;
}

.custom-card__footer {
  display: flex;
  gap: var(--op-space-small);
  padding-top: var(--op-space-small);
  border-top: var(--op-border-width-thin) solid var(--op-color-neutral-plus-three);
}

.custom-button {
  /* Typography */
  font-family: var(--op-font-family-sans);
  font-size: var(--op-font-size-medium);
  font-weight: var(--op-font-weight-medium);
  
  /* Spacing */
  padding: var(--op-space-small) var(--op-space-large);
  
  /* Borders */
  border-radius: var(--op-border-radius-medium);
  border: var(--op-border-width-thin) solid transparent;
  
  /* Interaction */
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Reset */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.custom-button--primary {
  background-color: var(--op-color-primary-base);
  color: var(--op-color-on-primary-base);
}

.custom-button--primary:hover {
  background-color: var(--op-color-primary-minus-two);
}

.custom-button--primary:active {
  background-color: var(--op-color-primary-minus-three);
}

.custom-button--secondary {
  background-color: transparent;
  color: var(--op-color-primary-base);
  border-color: var(--op-color-primary-base);
}

.custom-button--secondary:hover {
  background-color: var(--op-color-primary-plus-seven);
}

.custom-button--secondary:active {
  background-color: var(--op-color-primary-plus-five);
}
```

## Resources

- **Official Documentation**: https://docs.optics.rolemodel.design
- **GitHub Repository**: https://github.com/RoleModel/optics
- **MCP Server**: https://github.com/RoleModel/optics-mcp (for AI tooling)
- **CDN**: https://cdn.jsdelivr.net/npm/@rolemodel/optics@latest/dist/css/optics.min.css

## Summary Checklist

When implementing with Optics, always:

- ✅ Use the `--op-` prefix for all tokens
- ✅ Never hard-code colors, spacing, typography, or other values
- ✅ Use `-base` suffix for primary color values (e.g., `--op-color-primary-base`)
- ✅ Use `on-{color}-{scale}` tokens for text/icons on colored backgrounds (e.g., `--op-color-on-primary-base`)
- ✅ Leverage the plus/minus luminosity scale (plus-max to minus-max) for color variations
- ✅ Use full-word semantic tokens (small, medium, large, x-large) not abbreviations
- ✅ Combine typography tokens (family, size, weight, line-height)
- ✅ Follow accessibility guidelines with proper contrast
- ✅ Reference component token dependencies when needed
- ✅ Test your implementation across different states (hover, active, disabled)
