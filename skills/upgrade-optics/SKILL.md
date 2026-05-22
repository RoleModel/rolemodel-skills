---
name: upgrade-optics
description: Upgrade @rolemodel/optics to a target version. Reviews release notes for every intermediate version, audits the codebase for breaking changes, implements all required fixes, verifies the CSS build, and optionally opens a PR.
metadata:
  triggers:
    - upgrade optics
    - update optics
    - optics version
---

## Steps

### 1. Identify current and target versions

Check `package.json` for the current `@rolemodel/optics` version. The user will supply the target version; if not, use the latest (`gh release list --repo RoleModel/optics --limit 1`).

### 2. Choose an upgrade mode

Ask the user:

> There are X versions between your current version and the target. Would you like to:
> - **Release by release** — step through each version one at a time. After each one, you can open a PR and give the green light before the next version begins.
> - **All at once** — upgrade straight to the target in one pass, then optionally open a single PR for all the work.

---

## Mode A: Release by release

Repeat the following cycle for each version in order.

### A1. Fetch release notes for the next version

```bash
gh release view <next-tag> --repo RoleModel/optics
```

Present a summary of what changed. Flag anything under headings like **Component Changes**, **Base Token Changes**, **Layout Changes**, **Distribution Changes**, or **Breaking**. Note additive-only releases as low-risk.

### A2. Audit the codebase against this version's changes

For each flagged change, derive what to search for from the release note itself. The goal is to find every place the app touches the changed behaviour.

General approach:
1. Identify what the app would have to be doing to be affected (e.g. using a renamed token, importing a path that moved, overriding a property that no longer exists).
2. Search broadly — not just stylesheets. Optics class names and tokens can appear in many places depending on the stack:
   - **Rails views** (`.slim`, `.erb`) — hardcoded class names, icon font classes, inline style attributes
   - **React components** (`.jsx`, `.tsx`) — `className` strings, CSS module references, inline style objects using token values
   - **Web components** — CSS custom properties (tokens) are the primary styling vector through shadow DOM; a renamed token silently stops applying inside any shadow root that references it
   - **Spec files** (RSpec, Capybara, Playwright) — CSS selectors and class name assertions that reference Optics classes or icon font classes will fail if those names change; search `spec/` for any affected class or token name
3. Determine whether each hit is still correct, needs updating, or is now dead code.
4. Note anything that can't be resolved automatically and flag it for visual QA.

### A3. Bump the version and install

Edit `package.json` to set `"@rolemodel/optics": "<this-version>"`, then:

```bash
yarn install
```

### A4. Check the new dist structure

```bash
ls node_modules/@rolemodel/optics/dist/css/
ls node_modules/@rolemodel/optics/dist/css/addons/fonts/
```

Confirm that any import paths in the app's main stylesheet still exist in the new dist. Update any that have moved.

### A5. Implement all required fixes

Apply every fix identified in A2.

### A6. Verify the CSS build

Run the project's CSS build command (e.g. `yarn build:css`) and confirm it completes without errors.

### A7. Pause for user review

Present a summary of what was changed for this version and ask:

> - Open a PR for this version?
> - Continue to the next version?
> - Stop here?

If they want a PR, follow the PR step below, then ask about continuing. Return to A1 for the next version when they give the green light.

---

## Mode B: All at once

### B1. Fetch release notes for every version in range

```bash
gh release list --repo RoleModel/optics --limit 30
```

For each release between the current version (exclusive) and the target (inclusive):

```bash
gh release view <tag> --repo RoleModel/optics
```

Read every release note carefully. Flag anything under headings like **Component Changes**, **Base Token Changes**, **Layout Changes**, **Distribution Changes**, or **Breaking**. Additive-only releases require no action.

### B2. Audit the codebase against all flagged changes

Apply the same general approach as Mode A step A2, covering all flagged changes across all versions.

### B3. Bump the version and install

Edit `package.json` to set `"@rolemodel/optics": "<target>"`, then:

```bash
yarn install
```

### B4. Check the new dist structure

```bash
ls node_modules/@rolemodel/optics/dist/css/
ls node_modules/@rolemodel/optics/dist/css/addons/fonts/
```

Confirm that any import paths in the app's main stylesheet still exist in the new dist. Update any that have moved.

### B5. Implement all required fixes

Apply every fix identified in B2.

### B6. Verify the CSS build

Run the project's CSS build command (e.g. `yarn build:css`) and confirm it completes without errors.

---

## PR step (optional)

If the user wants a PR:

```bash
git add <changed files>
git commit -m "[TICKET] Upgrade Optics to vX.Y.Z"
git push -u origin <branch>
gh pr create --draft --title "[TICKET] Upgrade Optics to vX.Y.Z" \
  --reviewer <requested reviewer> \
  --body "..."
```

Check for a PR template (`cat .github/pull_request_template.md`) and follow it exactly.

After creating the PR, mark it ready for review only if the user asks:

```bash
gh pr ready <number>
```
