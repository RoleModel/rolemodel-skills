# Stimulus Controller Patterns Reference

Source: [Better Stimulus](https://betterstimulus.com/) — curated StimulusJS best practices by Julian Rubisch.

## Scope

This reference applies to Stimulus controllers in `app/javascript/controllers/**/*.js` (and `*.ts`). Use it alongside:

- `references/code_smells.md` — general SRP, large-class, long-method smells apply to JS too
- `references/security_checklist.md` — see XSS section for unsafe DOM sinks in controllers

## Detection Checklist

For each pattern, identify the issue, assess severity, and recommend a solution with a code example.

---

## Architecture

### 1. Hardcoded CSS Classes or Selectors in JS

**Pattern**: Controller strings a CSS class or DOM selector literal instead of reading it from the element.

**Detection**:
- String literals passed to `classList.add/remove/toggle/contains`
- `querySelector`/`querySelectorAll` calls with literal selectors
- Missing `static classes = [...]` declaration when classes are toggled

**Severity**: Medium

**Solutions**:
- Declare `static classes = ['active']` and read via `this.activeClass`
- Move selectors to targets or `data-*` attributes so controllers are reusable across contexts

**Example Issue**:
```javascript
// Bad: class name is baked into the controller
connect() {
  this.element.classList.add('is-open')
}

// Good: class comes from the view
static classes = ['open']
connect() {
  this.element.classList.add(this.openClass)
}
```

**Audit Check**: `Grep "classList\.(add|remove|toggle|contains)\(['\"]" app/javascript/controllers`

---

### 2. State in Instance Variables Instead of `static values`

**Pattern**: Controller stores runtime state on `this` instead of declaring a `static values` schema.

**Detection**:
- `this.foo = ...` assignments outside the Values API
- No `static values = { ... }` declaration for state that the view reads/writes
- Missing `fooValueChanged()` callbacks where state changes should trigger view updates

**Severity**: Medium

**Solutions**:
- Declare `static values = { count: Number }` and read/write via `this.countValue`
- DOM becomes the single source of truth — safe across Turbo caching and morphs
- Never store sensitive data in values (it's serialized to `data-*` attributes)

**Example Issue**:
```javascript
// Bad: state lost on Turbo cache restore
connect() {
  this.count = 0
}

// Good
static values = { count: Number }
countValueChanged() { this.render() }
```

**Audit Check**: `Grep "^\s*this\.[a-z]\w* = " app/javascript/controllers` — review each match for state that should live in values.

---

### 3. Namespaced Data Attributes Missing

**Pattern**: Multiple data values on one element without controller-specific prefixes, causing collisions.

**Detection**:
- `data-url`, `data-id`, `data-type` used directly (not `data-[controller]-*-value`)
- Raw `this.element.dataset` access without filtering by prefix

**Severity**: Low

**Solutions**:
- Use the Values API which auto-namespaces (`data-filter-query-value`)
- For bulk config, filter `dataset` by `startsWith('controllerPrefix')` and strip the prefix

**Audit Check**: `Grep "this\.element\.dataset\." app/javascript/controllers`

---

### 4. Mixing `this.element` and Targets in One Controller

**Pattern**: Single controller manages both its root element's behavior and child targets' behavior — divergent change smell / SRP violation.

**Detection**:
- Controller has `static targets` AND mutates `this.element` directly
- Class is hard to describe in one sentence
- Changes to either the element's role or the targets' role require editing the same file

**Severity**: High

**Solutions**:
- Split into two controllers on the same element (Stimulus supports multiple)
- Communicate via custom events or outlets

**Audit Check**: `Grep -l "static targets" app/javascript/controllers` — spot-check each for direct `this.element` mutation beyond lifecycle setup.

---

### 5. Missing `ApplicationController` Base Class

**Pattern**: No shared base controller for cross-cutting concerns (error handling, shared helpers).

**Detection**:
- No `app/javascript/controllers/application_controller.js`
- Concrete controllers extend `Controller` from `@hotwired/stimulus` directly
- Duplicated error-handling/logging code across controllers

**Severity**: Low

**Solutions**:
- Create `ApplicationController extends Controller` for shared lifecycle hooks
- Keep it thin — only truly cross-cutting behavior; don't let it become a junk drawer

**Audit Check**: `Glob app/javascript/controllers/application_controller.js`

---

### 6. Inheritance Where Mixins or Composition Fit

**Pattern**: Deep `extends` chains used for "acts as a" (shared behavior) or "has a" (collaboration) relationships.

**Detection**:
- Controller extends a non-`ApplicationController` ancestor for reusable helpers
- Shared behavior copy-pasted across controllers instead of extracted

**Severity**: Medium

**Solutions**:
- "Is a" specialization → inheritance
- "Acts as a" shared behavior → mixin function (`useOverlay(this)` called in `connect`)
- "Has a" collaborator → compose a separate module instantiated in `connect`

**Audit Check**: `Grep "extends " app/javascript/controllers` — filter for extends of classes other than `ApplicationController` / `Controller`.

---

## Lifecycle & Events

### 7. Overuse of `connect()` for State Init or Event Binding

**Pattern**: `connect()` method bloated with responsibilities Stimulus handles declaratively.

**Detection**:
- State initialization that duplicates `static values` defaults
- Calls to `this.element.addEventListener(...)` for events that `data-action` could bind
- Generic setup logic unrelated to DOM preconditions or 3rd-party libraries

**Severity**: Medium

**Solutions**:
- Reserve `connect()` for: 3rd-party library init, DOM preconditions, non-serializable state
- Move event bindings to `data-action` attributes in the view
- Move state defaults to `static values`

**Audit Check**: `Grep -A 20 "^\s*connect\(\)" app/javascript/controllers` — review each for the above smells.

---

### 8. Manual Event Listeners Without `disconnect()` Cleanup

**Pattern**: `addEventListener` called in `connect()` (or elsewhere) but no matching `removeEventListener` in `disconnect()` — memory leak across Turbo navigation.

**Detection**:
- `addEventListener` in controller code
- No `disconnect()` method, or `disconnect()` missing corresponding `removeEventListener`
- `.bind(this)` called inline in the `addEventListener` call (new reference each invocation — removal impossible)

**Severity**: High

**Solutions**:
- Prefer `data-action` with `@window` / `@document` modifiers over manual listeners
- If manual: store bound reference once (`this.boundHandler = this.handler.bind(this)`) and use the same reference for add and remove

**Example Issue**:
```javascript
// Bad: new bound function each call — removal removes nothing
connect() {
  window.addEventListener('resize', this.layout.bind(this))
}
disconnect() {
  window.removeEventListener('resize', this.layout.bind(this))
}

// Good
connect() {
  this.boundLayout = this.layout.bind(this)
  window.addEventListener('resize', this.boundLayout)
}
disconnect() {
  window.removeEventListener('resize', this.boundLayout)
}
```

**Audit Check**: `Grep -n "addEventListener" app/javascript/controllers` — for each match, verify a matching `removeEventListener` in `disconnect()` with the same function reference.

---

### 9. Third-Party Libraries Bound to `turbo:load` Instead of Lifecycle Hooks

**Pattern**: Controllers (or nearby JS) initialize libraries via `document.addEventListener('turbo:load', ...)` instead of `connect()` / `disconnect()`.

**Detection**:
- `turbo:load` or `turbo:before-cache` listeners in controller files
- Manual instance tracking arrays (e.g., `this.instances = []`) to clean up on cache

**Severity**: High

**Solutions**:
- Instantiate library in `connect()`, destroy in `disconnect()`
- Let Stimulus handle lifecycle — don't track instances manually
- Configure library options via `data-*` attributes

**Audit Check**: `Grep "turbo:(load|before-cache)" app/javascript`

---

## SOLID

### 10. Page-Level "God" Controllers

**Pattern**: Controller named for a page or section (e.g., `checkout_controller`, `dashboard_controller`) mixing modal, form, and nav concerns.

**Detection**:
- Controller name matches a page/route rather than a reusable UI concern
- Multiple unrelated responsibilities in one file
- Cannot be reused on a different page

**Severity**: High

**Solutions**:
- One controller per responsibility: `modal_controller`, `form_controller`, `nav_controller`
- Compose them on the same element via multiple `data-controller` values

**Audit Check**: `Glob app/javascript/controllers/*_controller.js` — flag any whose name maps to a page/route.

---

### 11. `switch`/Type Dispatch Inside `connect()`

**Pattern**: `connect()` branches on a type value to configure itself — Open-Closed violation.

**Detection**:
- `switch (this.typeValue)` or chained `if/else if` on a type attribute inside `connect()`
- Adding a new type requires editing the base controller

**Severity**: Medium

**Solutions**:
- Template method pattern: base controller with overridable `setup()`
- Subclasses (`ToggleController`, `DropdownController`) override `setup()` with their own values
- New types become new subclasses, not edits to the base

**Audit Check**: `Grep -B 2 -A 10 "switch\s*\(" app/javascript/controllers`

---

### 12. Concrete API Instantiation in `connect()`

**Pattern**: `connect()` calls `new ConcreteClient()` — Dependency Inversion violation, hard to swap or test.

**Detection**:
- `new [CapitalName](...)` calls for collaborators inside `connect()`
- Client class imported at the top of every controller that uses it

**Severity**: Medium

**Solutions**:
- Declare `static values = { api: String }` and receive the implementation name from the view
- Dynamic `await import(...)` in the value-change callback
- Ensure all implementations share the same interface contract

**Audit Check**: `Grep "new [A-Z]\w+\(" app/javascript/controllers`

---

## Interaction

### 13. Excessive Outlets

**Pattern**: Many `static outlets` declarations tightly coupling controllers across the DOM.

**Detection**:
- More than 2–3 outlets on a single controller
- Outlets used for fire-and-forget notifications (events would do)

**Severity**: Medium

**Solutions**:
- Use outlets only when a caller needs to query state or invoke a specific method on a known collaborator
- Prefer custom events (`this.dispatch('changed')`) for loose coupling

**Audit Check**: `Grep "static outlets" app/javascript/controllers`

---

### 14. Callbacks Used for Orchestration

**Pattern**: Callback pattern (message-bus style) misused to trigger unrelated actions rather than query state.

**Detection**:
- Dispatched events pass callbacks that mutate the requestor's unrelated state
- Callback chains replace what should be direct event listeners

**Severity**: Low

**Solutions**:
- Reserve callbacks for state queries (requestor asks respondent for a value)
- For orchestration, use plain custom events and let each listener handle its own concern

---

## Turbo Integration

### 15. Missing `teardown()` for `turbo:before-cache`

**Pattern**: Controller mutates non-idempotent DOM state (e.g., third-party widget markup) but doesn't restore it before Turbo caches the page — stale markup on back navigation.

**Detection**:
- Controller wraps/replaces child markup (uses `<template>` restore pattern, or mutates innerHTML)
- No `teardown()` method distinct from `disconnect()`
- No `turbo:before-cache` coordination

**Severity**: Medium

**Solutions**:
- Define a `teardown()` method that restores the pre-connect DOM state
- Register a single global `turbo:before-cache` listener that iterates controllers and calls `teardown()` when present
- Keep `disconnect()` focused on controller cleanup (listeners, instances), not DOM restoration

**Audit Check**: `Grep "innerHTML\s*=" app/javascript/controllers` — for each match, check whether pre-cache restoration exists.

---

### 16. Click-Based Form Submission

**Pattern**: Controllers dispatch form submits via click handlers or `form.submit()` instead of `requestSubmit()` + `submit->` intercept.

**Detection**:
- `this.formTarget.submit()` calls
- Click handlers that call `.click()` on a submit button to trigger submission
- No `action: "submit->form#intercept"` pattern

**Severity**: Low

**Solutions**:
- Use `this.element.requestSubmit()` for programmatic submits from non-submit events (select change, etc.)
- Intercept via `data-action="submit->form#intercept"`, call `event.preventDefault()`, build `new FormData(this.element)`, submit via `@rails/request.js` with `responseKind: 'turbo-stream'`

**Audit Check**: `Grep "\.submit\(\)" app/javascript/controllers`

---

## Error Handling

### 17. No Central `application.handleError` Override

**Pattern**: Errors in Stimulus controllers go uncaught or are logged ad-hoc per controller instead of routed through a single handler.

**Detection**:
- `application.handleError` is not overridden anywhere
- No Sentry / Honeybadger integration for Stimulus errors
- Try/catch blocks scattered across controllers with inconsistent reporting

**Severity**: Medium

**Solutions**:
- Override `application.handleError` in the Stimulus application bootstrap (or `ApplicationController`)
- Preserve and compose the default handler rather than replacing it
- Include context in reports: controller identifier, values snapshot, environment

**Audit Check**: `Grep "handleError" app/javascript`

---

## Summary Audit Checklist

When reviewing `app/javascript/controllers/**/*.js`, run through:

1. Classes/selectors externalized via `static classes` and `data-*`? (§1)
2. State in `static values` with change callbacks, not instance vars? (§2, §3)
3. One responsibility per controller, no element/target mixing? (§4, §10)
4. `ApplicationController` base, mixins for shared behavior, composition for collaborators? (§5, §6)
5. `connect()` limited to library init / DOM preconditions / non-serializable state? (§7)
6. Every `addEventListener` paired with `removeEventListener` using a stored bound reference? (§8)
7. No `turbo:load` / `turbo:before-cache` document listeners for setup/teardown? (§9)
8. No type-dispatch `switch` in `connect()`; polymorphism via subclasses? (§11)
9. No direct `new ConcreteClient()` in `connect()`; dependencies injected via values? (§12)
10. Outlets used sparingly; events preferred for loose coupling? (§13, §14)
11. Non-idempotent DOM changes restored via `teardown()` on `turbo:before-cache`? (§15)
12. Programmatic submits use `requestSubmit()` + `submit->` intercept? (§16)
13. Central `application.handleError` with error reporting integration? (§17)
