#!/usr/bin/env node
// entities.mjs
// Finds entity/model definitions across any project type and emits JSON.
// Supports: Rails (app/models), Django (models.py), TypeScript (.entity.ts, .model.ts),
// Java/Kotlin (@Entity), Prisma/GraphQL/SQL/DBML/OpenAPI schema files,
// and generic models/ directories.
//
// Usage: node entities.mjs [project-root]

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const root = resolve(process.argv[2] ?? process.cwd());

const exists = (p) => existsSync(join(root, p));
const read = (p) => {
  try { return readFileSync(join(root, p), 'utf-8'); } catch { return null; }
};

const HARD_SKIP = new Set([
  '.git', 'node_modules', 'vendor', 'dist', 'build', 'target', 'coverage',
  'tmp', 'log', '.idea', '.vscode', '.yarn', '.next', '.nuxt', '.cache',
  '__pycache__', '.pytest_cache', '.mypy_cache', '.venv', 'venv',
  '.tox', '.gradle', 'out',
]);

function walkFiles(dir, maxDepth = 8, depth = 0) {
  if (depth > maxDepth) return [];
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); }
  catch { return []; }
  const files = [];
  for (const entry of entries) {
    if (HARD_SKIP.has(entry.name)) continue;
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(full, maxDepth, depth + 1));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

const result = {
  projectRoot: root,
  sources: [],
  schemaFiles: [],
};

function detectSchemaType(filePath) {
  if (/db\/schema\.rb$/.test(filePath)) return 'rails-schema';
  if (/schema\.prisma$/.test(filePath)) return 'prisma-schema';
  if (/schema\.(graphql|gql)$/.test(filePath)) return 'graphql-schema';
  if (/\.(dbml)$/.test(filePath)) return 'dbml-schema';
  if (/(openapi|swagger)\.(ya?ml|json)$/.test(filePath)) return 'openapi-schema';
  if (/(schema|structure)\.sql$/.test(filePath)) return 'sql-schema';
  if (/schema\.json$/.test(filePath)) return 'json-schema';
  return 'unknown-schema';
}

// ─── Rails: app/models/ ───────────────────────────────────────────────────────
if (exists('app/models')) {
  const modelFiles = walkFiles(join(root, 'app/models'))
    .filter(f => f.endsWith('.rb') && !f.includes('/concerns/'))
    .map(f => relative(root, f));

  if (modelFiles.length > 0) {
    const models = modelFiles.map(f => {
      const src = read(f) ?? '';
      const classMatch = src.match(/^class\s+(\S+)/m);
      const associations = (src.match(/^\s+(belongs_to|has_many|has_one|has_and_belongs_to_many)\s+:\S+/gm) ?? [])
        .map(l => l.trim());
      const validationCount = (src.match(/^\s*validates\b/gm) ?? []).length;
      return {
        file: f,
        className: classMatch?.[1] ?? null,
        associations,
        validationCount,
        lines: src.split('\n').length,
      };
    });
    result.sources.push({ type: 'rails-models', directory: 'app/models', models });
  }
}

// ─── Django: models.py files ──────────────────────────────────────────────────
const allFiles = walkFiles(root);
const djangoModelFiles = allFiles
  .filter(f => f.endsWith('models.py'))
  .map(f => relative(root, f));

if (djangoModelFiles.length > 0) {
  const models = djangoModelFiles.map(f => {
    const src = read(f) ?? '';
    const classes = [...src.matchAll(/^class\s+(\w+)\s*\(([^)]*)\)/gm)]
      .filter(m => /Model/.test(m[2]))
      .map(m => m[1]);
    return { file: f, classes };
  });
  result.sources.push({ type: 'django-models', models });
}

// ─── TypeScript: .entity.ts, .model.ts ────────────────────────────────────────
const tsEntityFiles = allFiles
  .filter(f => /\.(entity|model)\.(ts|js)$/.test(f))
  .map(f => relative(root, f));

if (tsEntityFiles.length > 0) {
  const models = tsEntityFiles.map(f => {
    const src = read(f) ?? '';
    const classMatch = src.match(/(?:export\s+(?:default\s+)?class|^class)\s+(\w+)/m);
    return {
      file: f,
      className: classMatch?.[1] ?? null,
      lines: src.split('\n').length,
    };
  });
  result.sources.push({ type: 'typescript-entities', models });
}

// ─── Generic model directories ────────────────────────────────────────────────
for (const dir of ['models', 'src/models', 'lib/models', 'app/domain', 'src/domain']) {
  if (!exists(dir)) continue;
  const files = walkFiles(join(root, dir))
    .map(f => relative(root, f))
    .filter(f => /\.(rb|py|ts|js|java|kt|go|rs)$/.test(f));
  if (files.length > 0) {
    result.sources.push({ type: 'generic-models', directory: dir, files });
  }
}

// ─── Java/Kotlin @Entity classes ──────────────────────────────────────────────
const javaFiles = allFiles.filter(f => /\.(java|kt)$/.test(f));
const entityJavaFiles = javaFiles.filter(f => {
  const src = read(relative(root, f)) ?? '';
  return /@Entity\b/.test(src);
}).map(f => {
  const rel = relative(root, f);
  const src = read(rel) ?? '';
  const classMatch = src.match(/(?:public\s+)?(?:class|data class)\s+(\w+)/m);
  return { file: rel, className: classMatch?.[1] ?? null, lines: src.split('\n').length };
});

if (entityJavaFiles.length > 0) {
  result.sources.push({ type: 'jpa-entities', models: entityJavaFiles });
}

// ─── Schema files (authoritative data model source) ───────────────────────────
const schemaProbes = [
  'db/schema.rb',
  'db/structure.sql',
  'db/schema.sql',
  'schema.sql',
  'database/schema.sql',
  'prisma/schema.prisma',
  'src/prisma/schema.prisma',
  'schema.graphql',
  'schema.gql',
  'src/schema.graphql',
  'src/schema.gql',
  'config/schema.graphql',
  'config/schema.gql',
  'db/schema.dbml',
  'schema.dbml',
  'openapi.yml',
  'openapi.yaml',
  'openapi.json',
  'swagger.yml',
  'swagger.yaml',
  'swagger.json',
];

const discoveredSchemas = new Set(schemaProbes.filter(p => exists(p)));

for (const abs of allFiles) {
  const rel = relative(root, abs);
  if (/(^|\/)(db\/schema\.rb|schema\.prisma|schema\.(graphql|gql)|schema\.dbml)$/.test(rel)) {
    discoveredSchemas.add(rel);
    continue;
  }
  if (/(^|\/)(schema|structure)\.sql$/.test(rel)) {
    discoveredSchemas.add(rel);
    continue;
  }
  if (/(^|\/)(openapi|swagger)\.(ya?ml|json)$/.test(rel)) {
    discoveredSchemas.add(rel);
    continue;
  }
}

for (const schemaFile of [...discoveredSchemas].sort()) {
  const src = read(schemaFile) ?? '';
  result.schemaFiles.push({
    file: schemaFile,
    type: detectSchemaType(schemaFile),
    lines: src.split('\n').length,
  });
}

if (result.sources.length === 0 && result.schemaFiles.length === 0) {
  result.warning = 'No entity/model definitions detected. Use Glob/Grep to find model files for this project structure.';
}

process.stdout.write(JSON.stringify(result, null, 2) + '\n');
