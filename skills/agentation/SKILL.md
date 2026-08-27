---
name: agentation
description: Add Agentation visual feedback toolbar to a project. Use when the user asks to "install Agentation", "add the Agentation toolbar", or "set up visual feedback". Handles Rails and other server-rendered hosts (Django, Laravel, Phoenix, plain webpack/Vite) by adding React as a development-only dependency, and hosts that already bundle React.
---

# Agentation Setup

Set up the Agentation annotation toolbar in this project.

Agentation ships a single React component. React is therefore required — but it is
required **only in development**, and it must never reach the production bundle.
In a project that already uses React that is automatic. In a project that does not,
add React as a development-only dependency rather than declining to install.

## Steps

1. **Check if already installed**
   - Look for `agentation` in package.json `dependencies` or `devDependencies`
   - If not found, install it as a **dev dependency**: `npm install -D agentation`
     (or `yarn add -D` / `pnpm add -D` based on the lockfile)

2. **Check if already configured**
   - Search for `<Agentation` or `from "agentation"` / `from 'agentation'` across the
     project's source directories (`src/`, `app/`, `assets/`, `frontend/`)
   - If found, report that Agentation is already set up and exit

3. **Check for React — add it as a dev dependency if absent**
   - Look for `react` and `react-dom` in package.json `dependencies` **or**
     `devDependencies`
   - If either is already present anywhere, leave it alone — never move an existing
     runtime dependency into devDependencies, and never change its version range
   - If absent, install the latest React as dev dependencies — do not pin an older
     major:
     ```bash
     npm install -D react react-dom
     ```
     Agentation's peer range is `>=18`, so whatever `latest` resolves to satisfies
     it. Nothing is being shipped to users here, so there is no reason to hold back
     to an older major.

4. **Detect the host**

   | Host | Signal |
   | ---- | ------ |
   | Non-React host | React was added in step 3 — a server-rendered app (Rails, Django, Laravel, Phoenix) or a plain bundler setup. **This is the common case.** |
   | Host that already bundles React | `react` was already a dependency before step 3 |

   For a non-React host, also identify the bundler (`webpack.config.js`,
   `vite.config.*`, `rollup.config.*`), its **output directory** (webpack `output.path`,
   shakapacker's `public/packs/` or `app/assets/builds/`, Vite's `build.outDir`), and the
   server-rendered layout template that emits `<script>` tags. You need all three — step 6
   verifies against the output directory.

5. **Add the component**

   **Non-React host** (Rails and friends — the path below is the one you almost always
   want) — do NOT add React to the app's existing entry point. Create a
   separate, dev-only bundle entry so the main bundle is untouched:

   a. Write a standalone entry (e.g. `app/javascript/agentation.js`). Use
      `createElement` rather than JSX so the project needs no JSX toolchain config:

   ```js
   // Development-only entry: mounts the Agentation feedback toolbar.
   import { createElement } from 'react'
   import { createRoot } from 'react-dom/client'
   import { Agentation } from 'agentation'

   const CONTAINER_ID = 'agentation-root'
   const ENDPOINT = 'http://localhost:4747' // agentation-mcp HTTP server

   let root = null

   function mount() {
     if (document.getElementById(CONTAINER_ID)) return

     root?.unmount()

     const container = document.createElement('div')
     container.id = CONTAINER_ID
     document.body.appendChild(container)

     root = createRoot(container)
     root.render(createElement(Agentation, { endpoint: ENDPOINT }))
   }

   // Re-mount after client-side navigation that swaps <body>.
   document.addEventListener('turbo:load', mount)   // Turbo / Hotwire
   document.addEventListener('turbo:morph', mount)
   mount()
   ```

   b. Register the entry **only in the bundler's development mode**. This is the real
      production guarantee — the dev dependency alone is not enough. webpack:

   ```js
   const isDevelopment = mode === 'development'

   entry: {
     application: './app/javascript/application.js',
     ...(isDevelopment && { agentation: './app/javascript/agentation.js' })
   }
   ```

   c. Emit the script from the server-rendered layout, gated on the server's
      development environment. Rails/Slim:

   ```slim
   - if Rails.env.development?
     = javascript_include_tag 'agentation', defer: true
   ```

   Do not add cache-busting/asset-tracking attributes (e.g. Turbo's
   `data-turbo-track: 'reload'`) to this tag — rebuilding the dev bundle would then
   force full page reloads.

   **Host that already bundles React** — render `<Agentation />` once near the root of
   the tree, behind a `process.env.NODE_ENV === 'development'` check. Import it through a
   dev-only dynamic import rather than a top-level `import`: a top-level import leaves the
   module in the production bundle unless the bundler can prove it side-effect free, and
   the point of this skill is that it never gets there.

6. **Confirm and verify**
   - Tell the user the Agentation toolbar component is configured
   - For a non-React host, verify the production boundary before reporting success.
     Run these against the output directory found in step 4 — `$OUT` below is that
     directory (`public/packs`, `app/assets/builds`, `dist`, …), **not** a literal:
     ```bash
     # build the way production builds, then confirm nothing leaked
     RAILS_ENV=production npm run build       # or NODE_ENV=production, per project
     ls "$OUT" | grep -i agentation           # expect: no matches
     grep -rlc "react-dom" "$OUT"             # expect: no application bundle listed
     ```
     If the bundler writes hashed filenames through a manifest
     (`public/packs/manifest.json`, `.vite/manifest.json`), grep the manifest for an
     `agentation` entry instead of guessing the filename. A missing file because you
     checked the wrong path is a false pass — confirm the directory exists first.
     Restore the development build afterward.

7. **Recommend MCP server setup**
   - Explain that for real-time annotation syncing with AI agents, they should also set up the MCP server
   - Recommend one of the following approaches:
     - **Universal (supports 9+ agents including Claude Code, Cursor, Codex, Windsurf, etc.):**
       See [add-mcp](https://github.com/neondatabase/add-mcp) — run `npx add-mcp` and follow the prompts to add `agentation-mcp` as an MCP server
     - **Claude Code only (interactive wizard):**
       Run `agentation-mcp init` after installing the package
   - Tell user to restart their coding agent after MCP setup to load the server
   - Explain that once configured, annotations will sync to the agent automatically

## Notes

- The `NODE_ENV` / bundler-mode / server-env checks ensure Agentation only loads in
  development. In a non-React host, layer all three — the bundler-mode check is the
  one that actually keeps React out of the production bundle.
- Agentation's peer range is `>=18`, so installing React at `latest` is always
  compatible. It declares those peers as **optional**, so a package manager will not
  warn when they are absent — check package.json yourself rather than relying on
  install output.
- `Agentation` renders as a **React portal into `document.body`** and injects its
  `<style>` tags into `<head>`. The styles survive navigation; the portal does not.
  Any host that swaps `document.body` on navigation — Turbo/Hotwire, htmx boosting,
  Astro view transitions — needs the re-mount listeners shown above, or the toolbar
  silently disappears after the first link click.
- Without an `endpoint` prop the toolbar is localStorage + clipboard only. Pass
  `endpoint: "http://localhost:4747"` to sync with `agentation-mcp`. If that server
  is not running, expect a console fetch error on send; annotations still persist
  locally.
- Agentation is licensed PolyForm Shield 1.0.0 — fine for an internal dev tool, but
  worth mentioning in a client codebase.
- The MCP server runs on port 4747 by default for the HTTP server
- MCP server exposes tools like `agentation_get_all_pending`, `agentation_resolve`, and `agentation_watch_annotations`
- Run `agentation-mcp doctor` to verify setup after installing
