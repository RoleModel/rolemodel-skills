#!/usr/bin/env node
// directory_tree.mjs
// Emits a pruned directory tree as JSON. Honors .gitignore patterns (subset)
// and hard-skips noisy dirs. Depth-limited to keep output useful, not overwhelming.
//
// Usage: node directory_tree.mjs [project-root] [--depth N]
//   default depth: 3

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const args = process.argv.slice(2);
let root = process.cwd();
let depth = 3;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--depth') { depth = parseInt(args[++i], 10); }
  else { root = args[i]; }
}
root = resolve(root);

const HARD_SKIP = new Set([
  '.git', 'node_modules', 'vendor', 'dist', 'build', 'target', 'coverage',
  'tmp', 'log', '.idea', '.vscode', '.yarn', '.next', '.nuxt', '.cache',
  '__pycache__', '.pytest_cache', '.mypy_cache', '.venv', 'venv', '.ruby-lsp',
  '.tox', '.gradle', 'out',
]);

// Very small .gitignore matcher — handles top-level ignores + simple globs.
function loadGitignorePatterns(root) {
  const gi = join(root, '.gitignore');
  if (!existsSync(gi)) return [];
  const lines = readFileSync(gi, 'utf-8').split('\n');
  return lines
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#') && !l.startsWith('!'))
    .map(p => p.replace(/^\/+/, '').replace(/\/+$/, ''));
}
const giPatterns = loadGitignorePatterns(root);

function isIgnoredByGitignore(name) {
  // Exact-name only — we don't expand full globs, but this catches most
  // top-level dir names like "tmp/", "coverage/", etc.
  return giPatterns.some(p => p === name || p === `${name}/*`);
}

function walk(dir, currentDepth) {
  if (currentDepth > depth) return null;
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); }
  catch { return null; }

  const result = { name: relative(root, dir) || '.', type: 'dir', children: [] };

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (HARD_SKIP.has(entry.name)) continue;
    if (entry.name.startsWith('.') && entry.name !== '.github') continue;
    if (isIgnoredByGitignore(entry.name)) continue;

    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const child = walk(full, currentDepth + 1);
      if (child) result.children.push(child);
      else if (currentDepth === depth) result.children.push({ name: entry.name, type: 'dir', truncated: true });
    } else if (entry.isFile()) {
      result.children.push({ name: entry.name, type: 'file' });
    }
  }
  return result;
}

const tree = walk(root, 0);

process.stdout.write(JSON.stringify({
  projectRoot: root,
  depth,
  tree,
}, null, 2) + '\n');
