#!/usr/bin/env node
// test_inventory.mjs
// Walks the project and emits a JSON inventory of test files, grouped by
// convention (unit / integration / system). Feeds workflow discovery and
// the AI-Orientation test-coverage map.
//
// Usage: node test_inventory.mjs [project-root]

import { readdirSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const root = resolve(process.argv[2] ?? process.cwd());

const HARD_SKIP = new Set([
  '.git', 'node_modules', 'vendor', 'dist', 'build', 'target', 'coverage',
  'tmp', 'log', '.idea', '.vscode', '.yarn', '.next', '.nuxt', '.cache',
  '__pycache__', '.pytest_cache', '.mypy_cache', '.venv', 'venv', '.ruby-lsp',
  '.tox', '.gradle', 'out', 'public',
]);

// Where do tests live? We scan only these subtrees for efficiency.
const testRoots = [
  'spec', 'test', 'tests', '__tests__',
  'cypress', 'e2e', 'features',
].filter(d => existsSync(join(root, d)));

// Also scan the whole project for colocated Go/JS test files, but only at
// small depth and within the test roots we already matched — otherwise stop.
// For Go we do need a full walk because *_test.go lives beside source.
const isGoProject = existsSync(join(root, 'go.mod'));

function isTestFile(relPath) {
  const p = relPath.replace(/\\/g, '/');
  return (
    /_spec\.rb$/.test(p) ||
    /_test\.rb$/.test(p) ||
    /_test\.go$/.test(p) ||
    /\.test\.(t|j)sx?$/.test(p) ||
    /\.spec\.(t|j)sx?$/.test(p) ||
    /\.e2e\.(t|j)sx?$/.test(p) ||
    /\.cy\.(t|j)sx?$/.test(p) ||
    /^test_.*\.py$/.test(p.split('/').pop() ?? '') ||
    /.*_test\.py$/.test(p.split('/').pop() ?? '') ||
    /\.feature$/.test(p)
  );
}

// Classify a test file by path convention.
function classify(relPath) {
  const p = relPath.replace(/\\/g, '/');
  // system / e2e / feature tests — strongest signal of user-facing workflows
  if (/\/(system|features|e2e|acceptance|functional)\//.test(p)) return 'system';
  if (/^(cypress|e2e)\//.test(p)) return 'system';
  if (/\.e2e\./.test(p) || /\.cy\./.test(p) || /\.feature$/.test(p)) return 'system';
  // integration
  if (/\/integration\//.test(p)) return 'integration';
  if (/spec\/requests\//.test(p) || /test\/requests\//.test(p)) return 'integration';
  if (/spec\/controllers\//.test(p) || /test\/controllers\//.test(p)) return 'integration';
  // default unit
  return 'unit';
}

function walk(dir, collected, maxDepth = 12, depth = 0) {
  if (depth > maxDepth) return;
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); }
  catch { return; }

  for (const entry of entries) {
    if (HARD_SKIP.has(entry.name)) continue;
    if (entry.name.startsWith('.') && entry.name !== '.github') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, collected, maxDepth, depth + 1);
    else if (entry.isFile()) {
      const rel = relative(root, full);
      if (isTestFile(rel)) collected.push(rel);
    }
  }
}

const collected = [];
for (const r of testRoots) walk(join(root, r), collected);
if (isGoProject) walk(root, collected); // Go tests colocate with source.

// Dedupe
const files = [...new Set(collected)].sort();

const grouped = { system: [], integration: [], unit: [] };
for (const f of files) grouped[classify(f)].push(f);

const summary = {
  totalTestFiles: files.length,
  byCategory: {
    system: grouped.system.length,
    integration: grouped.integration.length,
    unit: grouped.unit.length,
  },
  testRootsScanned: testRoots,
};

process.stdout.write(JSON.stringify({
  projectRoot: root,
  summary,
  files: grouped,
}, null, 2) + '\n');
