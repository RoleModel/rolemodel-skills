# JavaScript Anti-Patterns Reference

This reference covers runtime and behavioral JavaScript anti-patterns in `app/javascript/` — patterns that cause security vulnerabilities, memory problems, or performance failures. For structural/design smells, see `javascript_code_smells.md`.

**Cross-references:**
- Structural code smells (callback hell, god modules, magic numbers, etc.): see `javascript_code_smells.md`
- Stimulus controller architecture violations: see `stimulus_patterns.md`
- XSS and security context: see `security_checklist.md`

---

## 1. Global Variable Pollution

**Pattern**: Writing properties onto `window` or relying on implicit globals instead of using modules.

**Detection**:
- `window.myApp = ...` assignments
- Variables used without declaration (implicit globals)
- Cross-file state sharing via `window.*` or global constants without a module system

**Severity**: High

**Solutions**:
- Use ES module `import`/`export` to share state explicitly
- Replace shared mutable globals with a dedicated state module

**Example**:
```javascript
// Bad: attaches to global scope
window.currentUser = { id: 1, name: "Alice" };

// Good: module-level singleton
// current-user.js
let _currentUser = null;
export const setCurrentUser = (user) => { _currentUser = user; };
export const getCurrentUser = () => _currentUser;
```

**Audit Check**: `grep -rn "window\." app/javascript/ --include="*.js"` — flag writes (assignments) vs reads.

---

## 2. Memory Leaks (Missing Cleanup)

**Pattern**: Event listeners, timers, or closures that keep references alive beyond their intended lifecycle, causing memory to grow unbounded.

**Detection**:
- `addEventListener` calls without a paired `removeEventListener` (outside Stimulus `disconnect()`)
- `setInterval`/`setTimeout` IDs not stored or cleared on teardown
- Closures capturing large objects (e.g., entire DOM nodes) that aren't released
- Observers (`MutationObserver`, `IntersectionObserver`, `ResizeObserver`) without `.disconnect()`

**Severity**: High

**Solutions**:
- Store and cancel timer IDs in teardown (Stimulus `disconnect()` or framework equivalent)
- Use `AbortController` to cancel fetch requests and associated listeners
- Prefer event delegation over per-element listeners when working with dynamic lists

**Example**:
```javascript
// Bad: listener never removed
document.addEventListener("keydown", handleKey);

// Good: cleanup on teardown
connect() {
  this._handleKey = this.handleKey.bind(this);
  document.addEventListener("keydown", this._handleKey);
}
disconnect() {
  document.removeEventListener("keydown", this._handleKey);
}
```

**Audit Check**: Search for `addEventListener` calls outside Stimulus `connect()`. Flag `setInterval` calls without a corresponding `clearInterval`. Flag Observer instantiation without `.disconnect()`.

---

## 3. `eval()` Usage

**Pattern**: Using `eval()`, `new Function()`, or `setTimeout("string")` to execute dynamically constructed code strings.

**Detection**:
- Direct `eval(...)` calls
- `new Function(...)` construction
- `setTimeout` or `setInterval` passed a string argument

**Severity**: Critical (security + performance)

**Solutions**:
- Replace `eval` with plain function calls or object lookups
- Never pass strings to `setTimeout`/`setInterval`

**Audit Check**: `grep -rn "\beval(" app/javascript/`. Flag any match.

---

## 4. `innerHTML` / `outerHTML` with Unsanitized Content

**Pattern**: Directly assigning user-supplied or server-derived strings to `innerHTML`, creating XSS vectors.

> Also covered in `security_checklist.md`. Listed here for completeness during JS code review.

**Detection**:
- `element.innerHTML = someVariable`
- `element.insertAdjacentHTML("...", userContent)`
- Template literals assigned to `innerHTML` containing interpolated values

**Severity**: Critical

**Solutions**:
- Use `textContent` for text; use DOM APIs (`createElement`, `appendChild`) for structure
- Sanitize with DOMPurify if HTML assignment is unavoidable

**Audit Check**: `grep -rn "innerHTML\s*=" app/javascript/`. Flag any assignment containing a variable.

---

## 5. Layout Thrashing (DOM Read/Write Interleaving)

**Pattern**: Alternating DOM reads and writes inside a loop, forcing the browser to recalculate layout on every iteration.

**Detection**:
- Reading layout properties (`offsetWidth`, `getBoundingClientRect`, `scrollTop`) inside loops that also write to the DOM
- No use of `requestAnimationFrame` for batched visual updates
- Style reads and writes interleaved in the same function

**Severity**: Medium (performance)

**Solutions**:
- Batch all reads first, then all writes
- Use `requestAnimationFrame` to defer visual changes to the next paint cycle
- Cache layout values outside the loop

**Example**:
```javascript
// Bad: layout thrash — browser recalculates each iteration
items.forEach(el => {
  const height = el.offsetHeight; // read → forces layout
  el.style.height = height + 10 + "px"; // write
});

// Good: batch reads, then writes
const heights = items.map(el => el.offsetHeight); // all reads
items.forEach((el, i) => {
  el.style.height = heights[i] + 10 + "px"; // all writes
});
```

**Audit Check**: Search for `offsetWidth`, `offsetHeight`, `getBoundingClientRect`, `scrollTop` inside loop bodies that also contain style assignments.

---

## 6. Swallowed Errors / Empty Catch Blocks

**Pattern**: `catch` blocks that do nothing, hiding failures and making debugging impossible.

**Detection**:
- Empty `catch` blocks: `catch (e) {}`
- `catch` blocks with only `console.log(e)` and no re-throw or user notification
- `.catch(() => {})` on Promises

**Severity**: High

**Solutions**:
- Log to an error reporter (Sentry, Honeybadger) and re-throw or show user feedback
- Only suppress errors you explicitly expect and can recover from

**Example**:
```javascript
// Bad
try {
  parseConfig(data);
} catch (e) {}

// Good
try {
  parseConfig(data);
} catch (e) {
  ErrorReporter.notify(e);
  showConfigError("Failed to load configuration.");
}
```

**Audit Check**: `grep -rn "catch\s*(.*)\s*{}" app/javascript/`. Flag `.catch\(\s*\(\)\s*=>\s*\{\s*\}\)` patterns.

---

## 7. Missing Module Boundaries (Implicit Global Dependencies)

**Pattern**: Files that rely on other files having already executed (global script order dependencies) instead of using explicit imports.

**Detection**:
- References to symbols that are not imported and not defined in the file
- No `import`/`export` statements in files that use cross-file logic
- Scripts loaded in a specific required order in a layout/manifest without a module bundler

**Severity**: Medium

**Solutions**:
- Use ES modules (`import`/`export`) for all cross-file dependencies
- Migrate Rails asset pipeline JS to Importmap or a bundler (esbuild, Vite) with explicit module graph

**Audit Check**: Check `app/javascript/` for files without `import` statements that reference external symbols. Review `config/importmap.rb` or `app/assets/config/` for ordering-dependent declarations.

---

## Quick Reference: Detection Patterns

| Anti-Pattern | Search Pattern | Location |
|---|---|---|
| Global pollution | `window\..*=` (assignments) | app/javascript/ |
| Memory leaks | `addEventListener` without cleanup | app/javascript/ |
| `eval` usage | `\beval(` | app/javascript/ |
| Unsafe innerHTML | `innerHTML\s*=` with variables | app/javascript/ |
| Layout thrash | `offsetHeight`/`getBoundingClientRect` in loops | app/javascript/ |
| Empty catch | `catch.*\{\s*\}` | app/javascript/ |
| Missing module boundaries | files without `import` using external symbols | app/javascript/ |
