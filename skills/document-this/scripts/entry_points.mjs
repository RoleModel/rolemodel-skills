#!/usr/bin/env node
// entry_points.mjs
// Finds routes, controllers/handlers, and service layer directories across any project.
// Supports: Rails, Express/Node, Django, Next.js, Spring, FastAPI, and generic structures.
// Stdout = JSON. Exit 0 on success.
//
// Usage: node entry_points.mjs [project-root]

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const root = resolve(process.argv[2] ?? process.cwd());

const exists = (p) => existsSync(join(root, p));
const read = (p) => {
  try { return readFileSync(join(root, p), 'utf-8'); } catch { return null; }
};

function listDir(dir, maxDepth = 2, depth = 0) {
  if (depth > maxDepth) return [];
  let entries;
  try { entries = readdirSync(join(root, dir), { withFileTypes: true }); }
  catch { return []; }
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    if (['node_modules', 'dist', 'build', 'vendor', '.git'].includes(entry.name)) continue;
    const rel = `${dir}/${entry.name}`;
    if (entry.isFile()) files.push(rel);
    else if (entry.isDirectory() && depth < maxDepth) files.push(...listDir(rel, maxDepth, depth + 1));
  }
  return files;
}

function countFiles(dir) {
  if (!exists(dir)) return 0;
  let n = 0;
  const stack = [join(root, dir)];
  while (stack.length) {
    const d = stack.pop();
    let entries;
    try { entries = readdirSync(d, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      if (e.name.startsWith('.')) continue;
      if (['node_modules', 'dist', 'build', 'vendor'].includes(e.name)) continue;
      if (e.isFile()) n++;
      else if (e.isDirectory()) stack.push(join(d, e.name));
    }
  }
  return n;
}

const result = {
  projectRoot: root,
  routes: [],
  controllers: [],
  services: [],
  applicationEntries: [],
};

// ─── Routes / URL Configuration ───────────────────────────────────────────────

// Rails
if (exists('config/routes.rb')) {
  const src = read('config/routes.rb') ?? '';
  const topLevel = (src.match(/^\s*(resources|namespace|scope|get|post|put|patch|delete|root|mount)\b.*/gm) ?? [])
    .slice(0, 30)
    .map(l => l.trim());
  result.routes.push({ type: 'rails', file: 'config/routes.rb', topLevelEntries: topLevel });
}

// Express / Node route files
const nodeRouteProbes = [
  'src/routes/index.js', 'src/routes/index.ts',
  'routes/index.js', 'routes/index.ts',
  'src/app/routes.ts', 'src/router.ts', 'router.ts', 'routes.ts',
];
for (const f of nodeRouteProbes) {
  if (exists(f)) result.routes.push({ type: 'node', file: f });
}
for (const dir of ['src/routes', 'routes']) {
  if (exists(dir)) {
    const files = listDir(dir, 1).filter(f => /\.(js|ts)$/.test(f));
    if (files.length) result.routes.push({ type: 'node', directory: dir, files });
  }
}

// Django
const djangoUrlFiles = [];
function findDjangoUrls(dir, depth = 0) {
  if (depth > 6) return;
  let entries;
  try { entries = readdirSync(join(root, dir), { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.name.startsWith('.') || ['node_modules', 'dist', 'build', 'vendor', '.git'].includes(e.name)) continue;
    const rel = `${dir}/${e.name}`;
    if (e.isFile() && e.name === 'urls.py') djangoUrlFiles.push(rel);
    else if (e.isDirectory()) findDjangoUrls(rel, depth + 1);
  }
}
findDjangoUrls('.');
if (djangoUrlFiles.length) result.routes.push({ type: 'django', files: djangoUrlFiles });

// Next.js (file-based routing)
if (exists('pages')) result.routes.push({ type: 'nextjs-pages', directory: 'pages', note: 'file-based routing' });
if (exists('app') && (exists('next.config.js') || exists('next.config.ts') || exists('next.config.mjs'))) {
  result.routes.push({ type: 'nextjs-app-router', directory: 'app', note: 'App Router file-based routing' });
}

// FastAPI / Flask
const pythonAppFiles = ['main.py', 'app.py', 'src/main.py', 'src/app.py', 'api/main.py'];
for (const f of pythonAppFiles) {
  if (exists(f)) {
    const src = read(f) ?? '';
    if (/@app\.route|@router\.(get|post|put|delete|patch)|APIRouter|FastAPI|Flask/.test(src)) {
      result.routes.push({ type: 'python-app', file: f });
    }
  }
}

// Spring @Controller / @RestController
const springControllers = [];
function findSpringControllers(dir, depth = 0) {
  if (depth > 8) return;
  let entries;
  try { entries = readdirSync(join(root, dir), { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.name.startsWith('.') || ['node_modules', 'dist', 'build', 'target', 'vendor'].includes(e.name)) continue;
    const rel = `${dir}/${e.name}`;
    if (e.isFile() && /\.(java|kt)$/.test(e.name)) {
      const src = read(rel) ?? '';
      if (/@(Rest)?Controller\b/.test(src)) springControllers.push(rel);
    } else if (e.isDirectory()) findSpringControllers(rel, depth + 1);
  }
}
findSpringControllers('.');
if (springControllers.length) result.routes.push({ type: 'spring', controllers: springControllers.slice(0, 30) });

// ─── Controllers / Handlers ───────────────────────────────────────────────────

for (const dir of ['app/controllers', 'src/controllers', 'controllers', 'handlers', 'src/handlers']) {
  if (!exists(dir)) continue;
  const count = countFiles(dir);
  const topFiles = listDir(dir, 1)
    .filter(f => /\.(rb|ts|js|py|java|kt)$/.test(f) && !f.includes('/concerns/'))
    .slice(0, 20);
  result.controllers.push({ directory: dir, fileCount: count, sampleFiles: topFiles });
}

// ─── Service Layer ────────────────────────────────────────────────────────────

const serviceDirs = [
  'app/services', 'src/services', 'services',
  'app/queries', 'app/jobs', 'app/workers', 'app/policies',
  'app/mailers', 'app/serializers',
  'src/use-cases', 'use-cases', 'src/domain', 'domain',
  'lib/services', 'lib',
];

for (const dir of serviceDirs) {
  if (!exists(dir)) continue;
  const count = countFiles(dir);
  if (count === 0) continue;
  result.services.push({ directory: dir, fileCount: count });
}

// ─── Application Entry Files ──────────────────────────────────────────────────

const entryProbes = [
  // Rails
  'config/application.rb', 'config/environment.rb',
  // Node
  'src/index.ts', 'src/index.js', 'index.ts', 'index.js',
  'src/main.ts', 'src/main.js', 'main.ts', 'main.js',
  'src/server.ts', 'src/server.js', 'server.ts', 'server.js',
  // Python
  'main.py', 'app.py', 'manage.py', 'wsgi.py', 'asgi.py',
  // Go
  'main.go', 'cmd/main.go',
  // Rust
  'src/main.rs',
];

for (const f of entryProbes) {
  if (exists(f)) result.applicationEntries.push(f);
}

if (result.routes.length === 0 && result.controllers.length === 0 && result.services.length === 0) {
  result.warning = 'No entry points detected from common locations. Use Glob/Grep to find routes/controllers for this project structure.';
}

process.stdout.write(JSON.stringify(result, null, 2) + '\n');
