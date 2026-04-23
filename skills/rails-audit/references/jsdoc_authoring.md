# JSDoc Authoring and Type Annotating

## JSDoc Fundamentals

### 1. JSDoc Syntax Fundamentals

All public functions and methods in `.js`, `.cjs`, and `.mjs` files should include JSDoc type annotations:

```javascript
/**
 * Brief description of what the function does.
 *
 * More detailed explanation if needed.
 *
 * @param {Type} paramName - Description of parameter
 * @param {Type} [optionalParam] - Optional parameter (use square brackets)
 * @returns {Type} Description of return value
 */
function myFunction(paramName, optionalParam) {
  // implementation
}
```

### 2. Type Import Syntax

Thundercloud uses a mix of CommonJS and ESM modules. The correct type import approach depends on the module system.

**For ESM files (.mjs) - Use `@import`:**

```javascript
// Default export
/** @import Locator from '../locators/Locator.js' */

// Named export
/** @import { Locator } from '../geometry/index.js' */

// Multiple named exports
/** @import { Edge, Locator } from '../geometry/index.js' */
```

**For CommonJS files (.js or .cjs) - Types come from `require` statements:**

```javascript
// Default require - type is inferred from the import
const ThunderCloudBoard = require('shared/domain-models/ThunderCloudBoard')

// Destructured require
const { ApiClient } = require('@rolemodel/lightning-cad/drawing-editor')

// .default accessor
const EnvironmentService = require('helpers/EnvironmentService').default
```

When a CommonJS file needs to reference a type that is NOT already required, use `@import` or `@typedef`:

```javascript
/** @import ThunderCloudDrawingController from 'shared/editor-models/ThunderCloudDrawingController' */
```

**Avoid the older `@typedef` import style for new code:**

```javascript
// ❌ OLD - verbose @typedef approach
/** @typedef { import('../Locator.js').default } Locator */

// ✅ NEW - clean @import style mirrors ESM
/** @import Locator from '../Locator.js' */
```

Note: `@typedef` is still appropriate for *defining* inline duck types (e.g., `@typedef {object} MyInterface`), just not for importing types from other modules.

**Best Practice:** Place type imports at the top of the file, just after ES module or CommonJS imports, one per line:

```javascript
const ThunderCloudBoard = require('shared/domain-models/ThunderCloudBoard')
const { extend } = require('@rolemodel/lightning-cad/standard-utilities')

/** @import ReadableProperty from '../ReadableProperty.js' */
/** @import EditableProperty from '../EditableProperty.js' */

/**
 * @typedef {object} DisplayPropertiesSource
 * @property {() => Array<ReadableProperty|EditableProperty>} restorableProperties
 */
```

This makes it clear which types are used in the file and prevents `any` types from creeping in.

**Anti-pattern to avoid:** Do not use inline `import('...')` expressions inside JSDoc type positions (`@param`, `@returns`, `@type`, casts, etc.).

```javascript
// ❌ Anti-pattern
/** @param {import('@rolemodel/lightning-cad-railings').RailingSection} section */

// ✅ Preferred
/** @import { RailingSection } from '@rolemodel/lightning-cad-railings' */
/** @param {RailingSection} section */
```

`@import` tags should appear in a dedicated top-of-file block immediately after runtime imports/requires and before implementation code.

### 3. Common Type Annotations

**Primitive types:**
- `{string}`, `{number}`, `{boolean}`
- `{void}`, `{undefined}`, `{null}`

**Complex types:**
- `{object}`, `{Array}`, `{Set}`, `{Map}`
- Custom classes: `{ClassName}`
- Generics: `{Array<string>}`, `{Set<number>}`
- Union types: `{string|number}`
- Function types: `{(param: Type) => ReturnType}`

**Unit types (thundercloud-specific):**
- `{math.Unit}` - Used for measurements (from mathjs)

### 4. Method Overload Documentation

When methods accept different parameter combinations, document each overload:

```javascript
/**
 * Adds a locator or coordinates to this locator.
 *
 * Overloads:
 * - add(locator: Locator): Locator
 * - add(x: number, y: number, z?: number): Locator
 *
 * @param {Locator|number} xOrLocator - Either a Locator instance or the x coordinate
 * @param {number} [yOrUndefined] - The y coordinate (if xOrLocator is a number)
 * @param {number} [zOrUndefined] - The z coordinate (if xOrLocator is a number)
 * @returns {Locator} A new locator with the sum
 */
add(xOrLocator, yOrUndefined, zOrUndefined) {
  // implementation
}
```

### 5. Mixin Annotations

Use `@mixes` to document classes that incorporate mixin functionality:

```javascript
/**
 * @mixes ArithmeticMixin
 * @mixes ManipulationMixin
 */
class Locator extends Handleable {
  // ...
}
```

## Common Patterns

### Static Factory Methods

```javascript
/**
 * Creates a component from serialized data.
 *
 * @param {object} data - Serialized component data
 * @param {ThunderCloudProject} project - The parent project
 * @returns {ThunderCloudComponent} A new component instance
 */
static fromData(data, project) {
  // implementation
}
```

### Constructors

```javascript
/**
 * Creates a new dock section.
 *
 * @param {ThunderCloudProject} project - The parent project
 * @param {object} [options] - Optional configuration
 */
constructor(project, options) {
  // implementation
}
```

### Accessors (Simple Returns)

```javascript
/** @returns {number} The width in millimeters */
get width() {
  return this._width
}

/** @returns {number} The printed scale ratio */
printedScale() {
  return this._printedScale
}
```

## Working with Type Annotations in Thundercloud

### Overview

Thundercloud is a mixed JavaScript/TypeScript codebase. TypeScript files (`.ts`) have native type annotations. JavaScript files (`.js`, `.mjs`) use JSDoc comments for type information. This skill focuses on the JavaScript files.

For the full TypeScript style guide (including `type` vs `interface`, export patterns, and meta-programmed class typing), see `docs/typescript_style.md`.

### Mixins and Type Augmentation

#### Using `extend()` with Mixins

Thundercloud uses the `extend()` utility from lightning-cad to mix functionality into classes:

```javascript
const { extend } = require('@rolemodel/lightning-cad/standard-utilities')
const SystemStrategyRadiatorMixin = require('shared/domain-models/mixins/SystemStrategyRadiatorMixin')

class SpecialComponent {
  // class body
}

extend(SpecialComponent, SystemStrategyRadiatorMixin)

module.exports = SpecialComponent
```

Document mixin usage with `@mixes`:

```javascript
/**
 * A special component with system strategy support.
 * @mixes SystemStrategyRadiatorMixin
 */
class SpecialComponent {
  // ...
}
```

#### `.d.ts` Companion Files

For meta-programmed JavaScript classes where JSDoc can't fully represent the resulting type, create a `.d.ts` companion file. See `docs/typescript_style.md` for the full pattern, including:
- `declare class` with `implements` for mixins
- `declare namespace` for static members from mixins
- `export =` for CommonJS modules

#### `@typedef` for Class + Mixin Types

For meta-programmed JavaScript classes, the preferred lightweight alternative to `.d.ts` files is adding `@typedef`s at the bottom of the file, after mixins are applied:

```javascript
const { extend } = require('@rolemodel/lightning-cad/standard-utilities')
const SystemStrategyRadiatorMixin = require('shared/domain-models/mixins/SystemStrategyRadiatorMixin')

class SpecialComponent {
  // ...
}

extend(SpecialComponent, SystemStrategyRadiatorMixin)

/**
 * @typedef { typeof SpecialComponent & typeof SystemStrategyRadiatorMixin } SpecialComponentType
 * @typedef { SpecialComponentType['prototype'] & { constructor: SpecialComponentType } } SpecialComponentInstanceType
 */

module.exports = SpecialComponent
```

Consumers import the class value and the types separately:

```javascript
const SpecialComponent = require('./SpecialComponent')

/** @import { SpecialComponentType, SpecialComponentInstanceType } from './SpecialComponent' */

class SpecialComponentUser {
  /** @returns {SpecialComponentType} */
  static defaultComponentClass() {
    return SpecialComponent
  }

  /** @param {SpecialComponentInstanceType|undefined} component */
  constructor(component) {
    this._component = component
  }
}
```

Use `SpecialComponentType` when you need the class/constructor itself, and `SpecialComponentInstanceType` when you need an instance.

### Categories of Annotation Issues

#### 1. Missing JSDoc Comments

Files that have public methods but no type annotations need JSDoc comments added. Priority should be given to:
- Frequently used domain model classes
- Public API methods
- Core utility functions

#### 2. Incorrect or Incomplete Annotations

Existing annotations should be reviewed for:
- Accurate parameter types
- Correct return types
- All overloaded method signatures documented
- Proper optional parameter notation

#### 3. Types from Mixins

Classes that use `extend()` may have incomplete type information because mixin methods aren't directly visible. Solutions:
- Add `@mixes` annotations to document mixin usage
- Use `.d.ts` files for TypeScript-based type augmentation
- Use `@typedef` patterns for class + mixin type exports

### Type Checking

#### ESLint Integration

The project uses `eslint-plugin-jsdoc` with the `flat/recommended-typescript-flavor` preset and `mode: 'typescript'`. This means:

- **TypeScript-style types are expected** — use lowercase `string`, `number`, etc. (not `{String}`, `{Number}`)
- Both array shorthand `{Post[]}` and generic `{Array<Post>}` are acceptable; prefer the shorthand for named types (e.g., `{Post[]}`) and generics for primitives (e.g., `{Array<string>}`)
- Import syntax via `@import` is the expected pattern

**Explicitly added rules (on top of the `flat/recommended-typescript-flavor` preset):**
- `jsdoc/reject-any-type` — bans `{*}` and `{any}` types

**Rules intentionally off in the base config (best practice only, not enforced by default):**
- `jsdoc/empty-tags` — empty tag enforcement is off
- `jsdoc/tag-lines` — blank line enforcement between tags is off
- `jsdoc/require-jsdoc` — JSDoc on all functions is aspirational, not required
- `jsdoc/require-param-description` — descriptions on params are encouraged but not required
- `jsdoc/require-returns-description` — descriptions on returns are encouraged but not required
- `jsdoc/require-property-description` — descriptions on properties are encouraged but not required
- `jsdoc/require-returns-type` — return type is encouraged but not required
- `jsdoc/escape-inline-tags` — inline tag escaping is off

**Project-level overrides:** Individual projects or directories may re-enable stricter rules on top of the base config. When working in a specific project context, check `eslint.config.mjs` for any project-scoped config block that tightens these rules (e.g., turning `require-jsdoc` back on). If stricter rules apply, `yarn eslint` will enforce them and you should treat the full JSDoc as required.

Run `yarn eslint <path>` or `yarn eslint --fix <path>` to validate and auto-fix JSDoc issues.

### Running Type Checks

The project's `tsconfig.json` does not have `checkJs` enabled, so `yarn check_types` only checks `.ts`/`.tsx` files. To type-check JavaScript files with JSDoc annotations, pass `--checkJs` **and a specific file path**:

```bash
yarn check_types --checkJs --noEmit path/to/file.js
```

**Always scope to specific files.** Running `--checkJs` without a file path will surface thousands of errors across the entire JS codebase and is not useful. The `--noEmit` flag is required when passing file paths to avoid "would overwrite input file" errors.

#### Checking Type Imports

Use the provided script to validate that all JSDoc type references have proper imports:

```bash
node ../scripts/check-type-imports.mjs file1.js file2.js
```

Check modified files:

```bash
git diff --name-only | grep -E '\.(js|mjs)$' | xargs node ../scripts/check-type-imports.mjs
```

#### Finding Missing Documentation

```bash
node .agents/skills/rails-audit/scripts/find-missing-docs.mjs file1.js file2.js
```

Check modified files:

```bash
git diff --name-only | grep -E '\.(js|mjs)$' | xargs node ../scripts/find-missing-docs.mjs
```

#### Interpreting Errors

Common errors and how to fix them:

**"Cannot find name 'ClassName'"**
- Missing import statement (require or ESM import)
- Missing JSDoc `@import` type annotation
- Type not exported from module

**"Property 'methodName' does not exist on type 'ClassName'"**
- Method defined in mixin but not documented
- Missing augmentation in `.d.ts` file
- Typo in method name

## Incremental Development

### Workflow

1. **Identify files**: Start with high-impact files (frequently used classes)
2. **Add annotations**: Add JSDoc to public methods and type imports
3. **Lint**: Run `yarn eslint <path>` to catch JSDoc issues (wrong types, `{*}`, missing `@param`/`@returns`, invalid tags)
4. **Validate imports**: Run `check-type-imports.mjs` on modified files to ensure all types are imported
5. **Check docs**: Run `find-missing-docs.mjs` to find undocumented methods
6. **Test**: Run `yarn check_types --checkJs --noEmit path/to/file.js` on each modified file to verify improvements
7. **Commit**: Make focused commits with clear messages describing what was fixed

### Commit Message Format

```
Add JSDoc type annotations to ThunderCloudBoard

- Add @param/@returns annotations to all public methods
- Document method overloads in JSDoc
- Add @import for referenced types
```

## Best Practices

1. **Be specific with types** - Use union types and specific class names rather than generic `{Object}` or `{*}`
2. **Avoid wildcard types** - Never use `{*}` for parameters or returns; always define proper types
3. **Import types properly** - If referencing types not already imported via `require` or `import`, use `@import` at the top of the file
4. **Create duck types for interfaces** - When a parameter needs specific methods, define a duck type:
   ```javascript
   /**
    * @typedef {object} DisplayPropertiesSource
    * @property {() => Array} restorableProperties - Method to get restorable properties
    */
   ```
5. **Document overloads** - If a method can take different parameter combinations, document each variant
6. **Keep it maintainable** - Comments should be clear and up-to-date with code changes
7. **Validate early** - Run `yarn eslint <path>` for JSDoc rule violations and `yarn check_types --checkJs --noEmit <path>` for type correctness
8. **Follow existing patterns** - Check `docs/typescript_style.md` for the project's TypeScript conventions
9. **Append "Type" to typedef names** - Consistent with the project's TypeScript style guide

### Type Specificity Guidelines

**Never use `{*}` — rejected by `jsdoc/reject-any-type`:**

```javascript
// ❌ WRONG - results in `any` type, rejected by ESLint
/** @param {*} sourceObject */
applyProperties(sourceObject) { ... }

// ✅ CORRECT - define duck type for what you need
/**
 * @typedef {object} PropertySourceType
 * @property {() => Array} getProperties
 */
/** @param {PropertySourceType} sourceObject */
applyProperties(sourceObject) { ... }
```

**Import referenced types:**

```javascript
// ❌ WRONG - Circle not imported, becomes `any`
/** @returns {Circle} */
createCircle() { ... }

// ✅ CORRECT - import type first
/** @import Circle from './Circle.js' */
/** @returns {Circle} */
createCircle() { ... }
```

**Define return types explicitly:**

```javascript
// ❌ WRONG - wildcard type
/** @returns {*} */
referenceFrame() { return this._referenceFrame }

// ✅ CORRECT - specific type
/** @returns {number} The reference frame for change tracking */
referenceFrame() { return this._referenceFrame }
```

**Use bare `@returns` for complex inferred types:**

When the return type is complex (e.g., deeply nested objects or large config structures) and TypeScript can already infer it from the function body, prefer a bare `@returns` tag over an incomplete or approximate `@returns {object}`:

```javascript
// ❌ IMPRECISE - loses type information
/** @returns {object} */
makeConfig() {
  return { construction: { class: Helper }, instance: { value: 42 } }
}

// ✅ PREFERRED - let TypeScript infer the precise type
/** @returns */
makeConfig() {
  return { construction: { class: Helper }, instance: { value: 42 } }
}
```

This is valid because `jsdoc/require-returns-type` is intentionally off in the base config.

## References

- [JSDoc Handbook](https://jsdoc.app/)
- [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-tags.html)
- [TypeScript Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/)
- [Thundercloud TypeScript Style Guide](../../../docs/typescript_style.md)
