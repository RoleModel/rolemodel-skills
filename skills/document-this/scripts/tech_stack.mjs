#!/usr/bin/env node
// tech_stack.mjs
// Parses dependency files found in the project and emits a categorized
// list of technologies. Project-agnostic: handles each ecosystem only if its
// marker file exists.
//
// Usage: node tech_stack.mjs [project-root]

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? process.cwd());

const read = (p) => {
  try { return readFileSync(join(root, p), 'utf-8'); } catch { return null; }
};
const readJson = (p) => {
  const s = read(p);
  if (!s) return null;
  try { return JSON.parse(s); } catch { return null; }
};

const results = {
  projectRoot: root,
  ecosystems: {},
};

// ----- Node -----
const pkg = readJson('package.json');
if (pkg) {
  const deps = Object.entries(pkg.dependencies ?? {}).map(([n, v]) => ({ name: n, version: v, scope: 'runtime' }));
  const devDeps = Object.entries(pkg.devDependencies ?? {}).map(([n, v]) => ({ name: n, version: v, scope: 'dev' }));
  const peerDeps = Object.entries(pkg.peerDependencies ?? {}).map(([n, v]) => ({ name: n, version: v, scope: 'peer' }));
  results.ecosystems.node = {
    manager: existsSync(join(root, 'pnpm-lock.yaml')) ? 'pnpm'
          : existsSync(join(root, 'yarn.lock')) ? 'yarn'
          : existsSync(join(root, 'bun.lockb')) ? 'bun'
          : 'npm',
    packageMeta: {
      name: pkg.name ?? null,
      version: pkg.version ?? null,
      description: pkg.description ?? null,
      engines: pkg.engines ?? null,
    },
    dependencies: [...deps, ...devDeps, ...peerDeps],
  };
}

// ----- Ruby -----
const gemfile = read('Gemfile');
const gemfileLock = read('Gemfile.lock');
if (gemfile) {
  const gems = [];
  // Parse top-level `gem "name", "~> 1.2"` — groups captured but kept simple.
  const gemRe = /^\s*gem\s+['"]([^'"]+)['"](?:\s*,\s*['"]([^'"]+)['"])?/gm;
  let m;
  while ((m = gemRe.exec(gemfile)) !== null) {
    gems.push({ name: m[1], version: m[2] ?? null, scope: 'runtime' });
  }

  // Resolve versions from Gemfile.lock if available.
  if (gemfileLock) {
    const specs = {};
    // Specs: block of "    name (version)"
    const specRe = /^\s{4}([A-Za-z0-9_\-]+)\s+\(([^)]+)\)/gm;
    let s;
    while ((s = specRe.exec(gemfileLock)) !== null) {
      specs[s[1]] = s[2];
    }
    for (const g of gems) {
      if (!g.version && specs[g.name]) g.version = specs[g.name];
      else if (specs[g.name]) g.lockedVersion = specs[g.name];
    }
  }

  results.ecosystems.ruby = {
    manager: 'bundler',
    dependencies: gems,
  };
}

// ----- Python -----
const pyproject = read('pyproject.toml');
const requirements = read('requirements.txt');
if (pyproject || requirements) {
  const deps = [];
  if (pyproject) {
    // PEP 621 [project] dependencies
    const projBlock = pyproject.match(/\[project\][\s\S]*?(?=^\[|\Z)/m)?.[0] ?? '';
    const listMatch = projBlock.match(/dependencies\s*=\s*\[([\s\S]*?)\]/);
    if (listMatch) {
      for (const line of listMatch[1].split(',')) {
        const s = line.trim().replace(/^["']|["']$/g, '');
        if (s) {
          const parts = s.match(/^([A-Za-z0-9_\-\[\]\.]+)([<>=!~].*)?$/);
          if (parts) deps.push({ name: parts[1], version: parts[2] ?? null, scope: 'runtime' });
        }
      }
    }
    // Poetry style
    const poetryBlock = pyproject.match(/\[tool\.poetry\.dependencies\][\s\S]*?(?=^\[|\Z)/m)?.[0];
    if (poetryBlock) {
      const rowRe = /^([A-Za-z0-9_\-]+)\s*=\s*['"]([^'"]+)['"]/gm;
      let r;
      while ((r = rowRe.exec(poetryBlock)) !== null) {
        if (r[1] === 'python') continue;
        deps.push({ name: r[1], version: r[2], scope: 'runtime' });
      }
    }
  }
  if (requirements) {
    for (const line of requirements.split('\n')) {
      const s = line.split('#')[0].trim();
      if (!s) continue;
      const parts = s.match(/^([A-Za-z0-9_\-\[\]\.]+)([<>=!~].*)?$/);
      if (parts) deps.push({ name: parts[1], version: parts[2] ?? null, scope: 'runtime' });
    }
  }
  results.ecosystems.python = { manager: pyproject ? 'pyproject' : 'pip', dependencies: deps };
}

// ----- Go -----
const gomod = read('go.mod');
if (gomod) {
  const deps = [];
  const reqBlock = gomod.match(/require\s*\(([\s\S]*?)\)/);
  if (reqBlock) {
    for (const line of reqBlock[1].split('\n')) {
      const s = line.trim().replace(/\s*\/\/.*$/, '');
      if (!s) continue;
      const parts = s.split(/\s+/);
      if (parts[0] && parts[1]) deps.push({ name: parts[0], version: parts[1], scope: 'runtime' });
    }
  }
  // Inline requires
  const inlineRe = /^require\s+([^\s(]+)\s+(\S+)/gm;
  let im;
  while ((im = inlineRe.exec(gomod)) !== null) {
    deps.push({ name: im[1], version: im[2], scope: 'runtime' });
  }
  results.ecosystems.go = { manager: 'go-modules', dependencies: deps };
}

// ----- Rust -----
const cargo = read('Cargo.toml');
if (cargo) {
  const deps = [];
  const depsBlock = cargo.match(/\[dependencies\][\s\S]*?(?=^\[|\Z)/m)?.[0] ?? '';
  const devBlock = cargo.match(/\[dev-dependencies\][\s\S]*?(?=^\[|\Z)/m)?.[0] ?? '';
  const parse = (block, scope) => {
    const rowRe = /^([A-Za-z0-9_\-]+)\s*=\s*(?:['"]([^'"]+)['"]|\{[^}]*version\s*=\s*['"]([^'"]+)['"])/gm;
    let r;
    while ((r = rowRe.exec(block)) !== null) {
      deps.push({ name: r[1], version: r[2] ?? r[3] ?? null, scope });
    }
  };
  parse(depsBlock, 'runtime');
  parse(devBlock, 'dev');
  results.ecosystems.rust = { manager: 'cargo', dependencies: deps };
}

if (Object.keys(results.ecosystems).length === 0) {
  results.warning = 'No recognized dependency files found. Agent should inspect the codebase directly.';
}

process.stdout.write(JSON.stringify(results, null, 2) + '\n');
