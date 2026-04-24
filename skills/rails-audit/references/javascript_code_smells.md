# JavaScript Code Smells Reference

This reference covers structural JS/TS code quality issues found in `app/javascript/`. These are smells — patterns that signal poor design or maintainability — as opposed to runtime anti-patterns (see `javascript_antipatterns.md`).

**Cross-references:**
- Runtime/behavioral anti-patterns (memory leaks, `eval`, `innerHTML`, etc.): see `javascript_antipatterns.md`
- Stimulus controller architecture violations: see `stimulus_patterns.md`
- JS testing antipatterns: see `javascript_testing_guidelines.md`

---

## 1. Callback Hell

**Pattern**: Deeply nested callbacks that grow rightward, making control flow hard to follow.

**Detection**:
- Callbacks nested 3+ levels deep
- Error handling duplicated at every level
- No use of Promises or `async`/`await`

**Severity**: High

**Solutions**:
- Flatten with `async`/`await`
- Chain `.then()/.catch()` for linear Promise composition

**Example**:
```javascript
// Bad: rightward drift
fetchUser(id, function(err, user) {
  fetchOrders(user.id, function(err, orders) {
    fetchItems(orders[0].id, function(err, items) {
      render(items);
    });
  });
});

// Good: async/await
async function loadUserItems(id) {
  const user = await fetchUser(id);
  const orders = await fetchOrders(user.id);
  return fetchItems(orders[0].id);
}
```

**Audit Check**: Search for functions with 3+ levels of nested function arguments. Flag files using `$.ajax` or `XMLHttpRequest` callbacks instead of `fetch`/`async`.

---

## 2. Unhandled Promise Rejections

**Pattern**: Promises or `async` functions with no rejection handling, causing silent failures or unhandled rejection warnings.

**Detection**:
- `.then()` chains without a `.catch()`
- `async` functions called without `try/catch` or `.catch()`
- `Promise.all()` without rejection handling
- `await` outside `try/catch` for operations that can fail (network, parsing)

**Severity**: High

**Solutions**:
- Always attach `.catch()` to Promise chains that can fail
- Wrap `await` calls in `try/catch` for recoverable errors
- Use a global `unhandledrejection` listener as a last-resort safety net, not primary handling

**Example**:
```javascript
// Bad: rejection silently swallowed or crashes
fetch("/api/data").then(res => res.json()).then(render);

// Good: explicit failure handling
fetch("/api/data")
  .then(res => res.json())
  .then(render)
  .catch(err => showErrorBanner(err.message));
```

**Audit Check**: Search for `.then(` without a paired `.catch(` on the same chain. Search for `async function` definitions where the call site lacks `.catch()` or `try/catch`.

---

## 3. Implicit Type Coercion (`==` Instead of `===`)

**Pattern**: Loose equality operators that trigger implicit type conversion and produce surprising results.

**Detection**:
- `==` or `!=` comparisons (except intentional `null == undefined` checks)
- String-to-number comparisons without explicit `parseInt`/`Number()`
- Truthy/falsy checks on values that could be `0` or `""`

**Severity**: Medium

**Solutions**:
- Use `===` and `!==` by default
- Use explicit coercion (`Number()`, `String()`, `Boolean()`) when needed
- Enable `eqeqeq` ESLint rule

**Example**:
```javascript
// Bad: "0" == false → true (surprising)
if (response.count == false) { ... }

// Good
if (response.count === 0) { ... }
```

**Audit Check**: Search for `\s==\s` and `\s!=\s` (single equals) patterns excluding `===`/`!==`.

---

## 4. `var` Usage

**Pattern**: Using `var` instead of `const`/`let`, leading to function-scoped hoisting and hard-to-trace bugs.

**Detection**:
- Any `var` declaration in non-legacy code
- `var` in loop bodies (classic closure-in-loop bug)

**Severity**: Low (Medium in loop contexts)

**Solutions**:
- Replace `var` with `const` by default; use `let` only when reassignment is needed
- Enable `no-var` ESLint rule

**Audit Check**: `grep -r "\bvar " app/javascript/`

---

## 5. Magic Numbers and Strings

**Pattern**: Unnamed literal values scattered through code, making intent opaque and changes error-prone.

**Detection**:
- Numeric literals other than `0`, `1`, `-1` in logic
- String literals used for state/type comparisons repeated in multiple places
- Hard-coded URLs, timeouts, or configuration values

**Severity**: Medium

**Solutions**:
- Extract to named `const` at module or file scope
- Group related constants in a dedicated module

**Example**:
```javascript
// Bad
if (status === 3) { ... }
setTimeout(flush, 5000);

// Good
const ORDER_STATUS_SHIPPED = 3;
const FLUSH_INTERVAL_MS = 5_000;
```

**Audit Check**: Flag numeric literals > 1 in conditional branches. Flag repeated string literals used in comparisons.

---

## 6. Long Functions

**Pattern**: Functions that span too many lines or handle multiple concerns, mirroring the Ruby Long Method smell.

**Detection**:
- Functions longer than 20 lines
- Functions with more than one level of nesting
- Functions mixing data fetching, transformation, and rendering

**Severity**: Medium

**Solutions**:
- Extract helper functions for distinct steps
- Single Responsibility: one function = one job

**Audit Check**: Scan for function bodies exceeding 20 lines. Flag functions with mixed abstraction levels (e.g., DOM manipulation alongside business logic).

---

## 7. God Module / File

**Pattern**: A single JS/TS file or module that owns too many responsibilities, becoming a catch-all.

**Detection**:
- Files > 200 lines
- A single file exporting > 10 distinct functions or classes covering unrelated concerns
- `utils.js` / `helpers.js` files that grow indefinitely

**Severity**: High

**Solutions**:
- Split by domain concern (e.g., `date-utils.js`, `format-utils.js`)
- Prefer small, focused modules with narrow exports

**Audit Check**: List files in `app/javascript/` by line count. Flag any file > 200 lines or with > 10 exports.

---

## 8. Mutation of Function Arguments

**Pattern**: Functions that modify their input parameters, causing caller-side surprises and breaking referential transparency.

**Detection**:
- Direct property assignment on object parameters: `param.foo = ...`
- `Array.prototype.push/splice/sort` called on array arguments without copying
- `Object.assign(target, ...)` where `target` is the received argument

**Severity**: Medium

**Solutions**:
- Return new values instead of mutating: `return { ...obj, foo: newVal }`
- Copy arrays before sorting: `[...arr].sort(...)`

**Audit Check**: Search for parameter names followed by property assignment inside function bodies.

---

## 9. Console Statements in Production Code

**Pattern**: `console.log`, `console.error`, `console.warn` left in committed source code, leaking internal state to browser devtools.

**Detection**:
- Any `console.` call outside test files

**Severity**: Low

**Solutions**:
- Remove debug `console.log` calls before committing
- Use a structured logger module (or conditional `if (DEBUG)` guard) for intentional logging
- Enable `no-console` ESLint rule

**Audit Check**: `grep -rn "console\." app/javascript/ --include="*.js" --include="*.ts" | grep -v "\.test\." | grep -v spec`

---

## 10. Dead Code and Commented-Out Code

**Pattern**: Unreachable branches, unused exports, and blocks of commented-out code left in place.

**Detection**:
- Code after `return` statements
- Exported symbols never imported elsewhere
- Large commented-out blocks (`// old implementation`, `/* TODO: remove */`)

**Severity**: Low

**Solutions**:
- Delete dead code; git history preserves it if needed
- Enable `no-unreachable` and `no-unused-vars` ESLint rules

**Audit Check**: Search for multi-line comment blocks. Check exported symbols for imports across the codebase.

---

## Quick Reference: Detection Patterns

| Smell | Search Pattern | Location |
|---|---|---|
| Callback hell | `function.*function.*function` (nested) | app/javascript/ |
| Unhandled promises | `\.then\(` without `.catch(` | app/javascript/ |
| Loose equality | `[^=!]==[^=]` | app/javascript/ |
| `var` usage | `\bvar ` | app/javascript/ |
| Magic numbers | numeric literals in conditionals | app/javascript/ |
| Long functions | function bodies > 20 lines | app/javascript/ |
| God modules | files > 200 lines | app/javascript/ |
| Argument mutation | `param\.foo\s*=` inside functions | app/javascript/ |
| Console statements | `console\.` | app/javascript/ |
| Dead code | code after `return`, unused exports | app/javascript/ |
