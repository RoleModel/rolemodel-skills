#!/usr/bin/env node
// fingerprint.mjs
// Probes a project root and emits JSON describing what it is:
// language/framework/test layout/dep files/project name.
// Stdout = JSON. Stderr = human progress. Exit 0 on success.
//
// Usage: node fingerprint.mjs [project-root]
//   project-root defaults to cwd.

import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';

const root = resolve(process.argv[2] ?? process.cwd());

const exists = (p) => existsSync(join(root, p));
const read = (p) => {
  try { return readFileSync(join(root, p), 'utf-8'); } catch { return null; }
};
const readJson = (p) => {
  const s = read(p);
  if (!s) return null;
  try { return JSON.parse(s); } catch { return null; }
};

// Dep-file probes — presence is the signal, parsing is secondary.
const depFileProbes = [
  { file: 'package.json',    ecosystem: 'node',   manager: 'npm' },
  { file: 'yarn.lock',       ecosystem: 'node',   manager: 'yarn' },
  { file: 'pnpm-lock.yaml',  ecosystem: 'node',   manager: 'pnpm' },
  { file: 'bun.lockb',       ecosystem: 'node',   manager: 'bun' },
  { file: 'Gemfile',         ecosystem: 'ruby',   manager: 'bundler' },
  { file: 'Gemfile.lock',    ecosystem: 'ruby',   manager: 'bundler' },
  { file: 'pyproject.toml',  ecosystem: 'python', manager: 'poetry-or-pep517' },
  { file: 'requirements.txt',ecosystem: 'python', manager: 'pip' },
  { file: 'Pipfile',         ecosystem: 'python', manager: 'pipenv' },
  { file: 'go.mod',          ecosystem: 'go',     manager: 'go-modules' },
  { file: 'Cargo.toml',      ecosystem: 'rust',   manager: 'cargo' },
  { file: 'composer.json',   ecosystem: 'php',    manager: 'composer' },
  { file: 'pom.xml',         ecosystem: 'jvm',    manager: 'maven' },
  { file: 'build.gradle',    ecosystem: 'jvm',    manager: 'gradle' },
  { file: 'build.gradle.kts',ecosystem: 'jvm',    manager: 'gradle' },
  { file: 'mix.exs',         ecosystem: 'elixir', manager: 'mix' },
];

const depFilesPresent = depFileProbes.filter(p => exists(p.file));

// Project name — best source per ecosystem.
function detectProjectName() {
  const pkg = readJson('package.json');
  if (pkg?.name) return pkg.name;

  const gemspec = readdirSync(root).find(f => f.endsWith('.gemspec'));
  if (gemspec) {
    const m = read(gemspec)?.match(/\.name\s*=\s*['"]([^'"]+)['"]/);
    if (m) return m[1];
  }

  const pyproject = read('pyproject.toml');
  if (pyproject) {
    const m = pyproject.match(/^\s*name\s*=\s*"([^"]+)"/m);
    if (m) return m[1];
  }

  const composer = readJson('composer.json');
  if (composer?.name) return composer.name;

  const cargo = read('Cargo.toml');
  if (cargo) {
    const m = cargo.match(/^\s*name\s*=\s*"([^"]+)"/m);
    if (m) return m[1];
  }

  // Fallback to directory name.
  return basename(root);
}

// Language + framework guess. Heuristic, not perfect; we flag confidence.
function detectLanguageAndFramework() {
  let languages = [];
  let framework = null;
  let confidence = 'low';

  const eco = new Set(depFilesPresent.map(p => p.ecosystem));

  if (eco.has('ruby')) {
    languages.push('ruby');
    const gemfile = read('Gemfile') ?? '';
    if (/^\s*gem\s+['"]rails['"]/m.test(gemfile)) { framework = 'rails'; confidence = 'high'; }
    else if (/^\s*gem\s+['"]sinatra['"]/m.test(gemfile)) { framework = 'sinatra'; confidence = 'high'; }
    else if (/^\s*gem\s+['"]hanami['"]/m.test(gemfile)) { framework = 'hanami'; confidence = 'high'; }
  }
  if (eco.has('node')) {
    languages.push(exists('tsconfig.json') ? 'typescript' : 'javascript');
    const pkg = readJson('package.json') ?? {};
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
    if (deps['next']) { framework = framework ?? 'next'; confidence = 'high'; }
    else if (deps['@remix-run/react'] || deps['@remix-run/node']) { framework = framework ?? 'remix'; confidence = 'high'; }
    else if (deps['react']) { framework = framework ?? 'react'; confidence = 'high'; }
    else if (deps['vue']) { framework = framework ?? 'vue'; confidence = 'high'; }
    else if (deps['@angular/core']) { framework = framework ?? 'angular'; confidence = 'high'; }
    else if (deps['svelte']) { framework = framework ?? 'svelte'; confidence = 'high'; }
    else if (deps['express']) { framework = framework ?? 'express'; confidence = 'high'; }
    else if (deps['fastify']) { framework = framework ?? 'fastify'; confidence = 'high'; }
    else if (deps['@nestjs/core']) { framework = framework ?? 'nestjs'; confidence = 'high'; }
  }
  if (eco.has('python')) {
    languages.push('python');
    const pyproject = read('pyproject.toml') ?? '';
    const reqs = read('requirements.txt') ?? '';
    const all = pyproject + '\n' + reqs;
    if (/django/i.test(all) || exists('manage.py')) { framework = framework ?? 'django'; confidence = 'high'; }
    else if (/flask/i.test(all)) { framework = framework ?? 'flask'; confidence = 'high'; }
    else if (/fastapi/i.test(all)) { framework = framework ?? 'fastapi'; confidence = 'high'; }
  }
  if (eco.has('go')) {
    languages.push('go');
    const gomod = read('go.mod') ?? '';
    if (/gin-gonic\/gin/.test(gomod)) { framework = framework ?? 'gin'; confidence = 'high'; }
    else if (/labstack\/echo/.test(gomod)) { framework = framework ?? 'echo'; confidence = 'high'; }
  }
  if (eco.has('rust')) languages.push('rust');
  if (eco.has('php')) {
    languages.push('php');
    const composer = readJson('composer.json') ?? {};
    const allDeps = { ...(composer.require ?? {}), ...(composer['require-dev'] ?? {}) };
    if (Object.keys(allDeps).some(k => /laravel/i.test(k))) { framework = framework ?? 'laravel'; confidence = 'high'; }
    else if (Object.keys(allDeps).some(k => /symfony/i.test(k))) { framework = framework ?? 'symfony'; confidence = 'high'; }
  }
  if (eco.has('jvm')) {
    const pomXml = read('pom.xml') ?? '';
    const gradleFile = read('build.gradle') ?? read('build.gradle.kts') ?? '';
    const all = pomXml + gradleFile;
    if (/build\.gradle\.kts/.test(readdirSync(root).join('\n') + '')) {
      languages.push('kotlin');
    } else {
      languages.push('java');
    }
    if (/spring-boot/i.test(all)) { framework = framework ?? 'spring-boot'; confidence = 'high'; }
    else if (/quarkus/i.test(all)) { framework = framework ?? 'quarkus'; confidence = 'high'; }
    else if (/micronaut/i.test(all)) { framework = framework ?? 'micronaut'; confidence = 'high'; }
  }
  if (eco.has('elixir')) {
    languages.push('elixir');
    const mixExs = read('mix.exs') ?? '';
    if (/phoenix/i.test(mixExs)) { framework = framework ?? 'phoenix'; confidence = 'high'; }
  }

  if (languages.length === 0) {
    // Last-ditch: scan a shallow layer for .ext signals.
    const counts = {};
    for (const entry of readdirSync(root)) {
      const p = join(root, entry);
      try {
        if (!statSync(p).isDirectory()) continue;
      } catch { continue; }
      if (/^(\.|node_modules|vendor|dist|build|target|coverage)$/.test(entry)) continue;
      for (const inner of readdirSync(p).slice(0, 50)) {
        const m = inner.match(/\.([a-zA-Z0-9]+)$/);
        if (m) counts[m[1]] = (counts[m[1]] ?? 0) + 1;
      }
    }
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (top) languages.push(top[0]);
  }

  return { languages, framework, confidence };
}

// Test framework + test directory convention guess.
function detectTestLayout() {
  const candidates = [];

  // Ruby/Rails
  if (exists('spec')) {
    const framework = exists('spec/spec_helper.rb') || exists('spec/rails_helper.rb') ? 'rspec' : 'unknown-ruby';
    const systemDir = ['spec/system', 'spec/features', 'spec/integration'].find(exists) ?? null;
    candidates.push({ root: 'spec', framework, systemTestsDir: systemDir });
  }
  if (exists('test')) {
    const framework = exists('test/test_helper.rb') ? 'minitest'
                    : exists('test/test_helper.exs') ? 'exunit'
                    : 'unknown';
    const systemDir = ['test/system', 'test/integration', 'test/e2e'].find(exists) ?? null;
    candidates.push({ root: 'test', framework, systemTestsDir: systemDir });
  }
  // Node
  if (exists('tests') || exists('__tests__') || exists('cypress') || exists('e2e') || exists('playwright.config.ts') || exists('playwright.config.js')) {
    const pkg = readJson('package.json') ?? {};
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
    let framework = 'unknown';
    if (deps['jest']) framework = 'jest';
    else if (deps['vitest']) framework = 'vitest';
    else if (deps['mocha']) framework = 'mocha';
    else if (deps['@playwright/test']) framework = 'playwright';
    else if (deps['cypress']) framework = 'cypress';
    const root = exists('tests') ? 'tests' : exists('__tests__') ? '__tests__' : exists('cypress') ? 'cypress' : exists('e2e') ? 'e2e' : null;
    const systemDir = ['cypress/e2e', 'e2e', 'tests/e2e', 'tests/integration'].find(exists) ?? null;
    candidates.push({ root, framework, systemTestsDir: systemDir });
  }
  // Python
  if (exists('tests/') || exists('tests')) {
    const pyproject = read('pyproject.toml') ?? '';
    const framework = /pytest/i.test(pyproject) ? 'pytest' : 'unittest';
    candidates.push({ root: 'tests', framework, systemTestsDir: ['tests/integration', 'tests/e2e', 'tests/functional'].find(exists) ?? null });
  }
  // Go
  if (exists('go.mod')) {
    candidates.push({ root: '.', framework: 'go-test', systemTestsDir: null, note: 'Go tests live beside source as *_test.go' });
  }

  return candidates;
}

// Database detection — heuristic based on dep files and config files.
function detectDatabase() {
  const signals = [];
  // Rails database.yml
  const dbYml = read('config/database.yml');
  if (dbYml) {
    const m = dbYml.match(/adapter:\s*(\S+)/);
    if (m) signals.push(m[1]);
  }
  // package.json / Gemfile signals
  const gemfile = read('Gemfile') ?? '';
  if (/\bpg\b/.test(gemfile)) signals.push('postgresql');
  if (/\bmysql2\b/.test(gemfile)) signals.push('mysql');
  if (/\bsqlite3\b/.test(gemfile)) signals.push('sqlite');
  const pkg = readJson('package.json') ?? {};
  const allPkgDeps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  if (allPkgDeps['pg'] || allPkgDeps['postgres']) signals.push('postgresql');
  if (allPkgDeps['mysql2'] || allPkgDeps['mysql']) signals.push('mysql');
  if (allPkgDeps['better-sqlite3'] || allPkgDeps['sqlite3']) signals.push('sqlite');
  if (allPkgDeps['mongoose'] || allPkgDeps['mongodb']) signals.push('mongodb');
  if (allPkgDeps['redis']) signals.push('redis');
  if (allPkgDeps['prisma'] || allPkgDeps['@prisma/client']) {
    // Read prisma schema for provider
    const schema = read('prisma/schema.prisma');
    if (schema) {
      const m = schema.match(/provider\s*=\s*"([^"]+)"/);
      if (m) signals.push(`prisma/${m[1]}`);
      else signals.push('prisma');
    } else {
      signals.push('prisma');
    }
  }
  // pom.xml / build.gradle
  const pomXml = read('pom.xml') ?? '';
  const gradleFile = read('build.gradle') ?? read('build.gradle.kts') ?? '';
  const jvmAll = pomXml + gradleFile;
  if (/postgresql/i.test(jvmAll)) signals.push('postgresql');
  if (/mysql/i.test(jvmAll)) signals.push('mysql');
  if (/h2database/i.test(jvmAll)) signals.push('h2');
  // Python
  const reqs = read('requirements.txt') ?? '';
  const pyproject = read('pyproject.toml') ?? '';
  const pyAll = reqs + pyproject;
  if (/psycopg2|psycopg/i.test(pyAll)) signals.push('postgresql');
  if (/mysqlclient|pymysql/i.test(pyAll)) signals.push('mysql');
  if (/pymongo/i.test(pyAll)) signals.push('mongodb');

  return [...new Set(signals)];
}

// Config / infrastructure files present.
function detectConfigFiles() {
  const candidates = [
    '.env.example', '.env.sample', '.env.test',
    'docker-compose.yml', 'docker-compose.yaml',
    'Dockerfile', '.dockerignore',
    'Procfile', 'Procfile.dev',
    'app.json', 'fly.toml', 'render.yaml', 'railway.json',
    'vercel.json', 'netlify.toml',
    '.github/workflows',
    'k8s', 'kubernetes', 'helm',
    'terraform', 'infrastructure',
  ];
  return candidates.filter(p => exists(p));
}

// README probe.
function detectReadme() {
  for (const name of ['README.md', 'README.rst', 'README.txt', 'README']) {
    if (exists(name)) return name;
  }
  return null;
}

// Major top-level directories (1 level deep, no config noise).
function topLevelDirs() {
  const ignore = /^(\.|node_modules|vendor|dist|build|target|coverage|tmp|log|\.git|\.idea|\.vscode|\.yarn)$/;
  const dirs = [];
  for (const entry of readdirSync(root)) {
    if (ignore.test(entry)) continue;
    try {
      if (statSync(join(root, entry)).isDirectory()) dirs.push(entry);
    } catch { /* symlink/etc */ }
  }
  return dirs.sort();
}

const out = {
  projectRoot: root,
  projectName: detectProjectName(),
  readme: detectReadme(),
  language: detectLanguageAndFramework(),
  database: detectDatabase(),
  configFiles: detectConfigFiles(),
  depFiles: depFilesPresent,
  testLayouts: detectTestLayout(),
  topLevelDirs: topLevelDirs(),
  generatedAt: new Date().toISOString(),
};

process.stdout.write(JSON.stringify(out, null, 2) + '\n');
