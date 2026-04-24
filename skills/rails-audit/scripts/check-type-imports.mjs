#!/usr/bin/env node
/* eslint-disable no-console */
/* global process */

/**
 * Check JSDoc Type Imports
 *
 * Validates that all type references in JSDoc comments have corresponding
 * imports (CommonJS require, ESM import, @import, @typedef, or class definitions).
 * Helps ensure TypeScript can properly infer types instead of falling back to 'any'.
 *
 * Usage:
 *   node check-type-imports.mjs [file1.js] [file2.mjs] ...
 *   node check-type-imports.mjs app/javascript/shared/**\/*.js
 */

import fs from 'node:fs'
import path from 'node:path'

// Built-in JavaScript types that don't need imports
const BUILTIN_TYPES = new Set([
  'Array',
  'Object',
  'Map',
  'Set',
  'Promise',
  'Function',
  'Math',
  'Number',
  'String',
  'Boolean',
  'Date',
  'RegExp',
  'Error',
  'TypeError',
  'RangeError',
  'SyntaxError',
  'Uint8Array',
  'Int8Array',
  'Uint16Array',
  'Int16Array',
  'Uint32Array',
  'Int32Array',
  'Float32Array',
  'Float64Array',
  'WeakMap',
  'WeakSet',
  'Symbol',
  'Proxy',
  'Reflect',
  'JSON',
  'Intl',
  'ArrayBuffer',
  'DataView',
  'SharedArrayBuffer',
  'Atomics',
  'BigInt',
  'BigInt64Array',
  'BigUint64Array',
  'FinalizationRegistry',
  'WeakRef',
  'HTMLElement',
  'Element',
  'Event',
  'Node',
  'Document',
  'Window',
  'URL',
  'URLSearchParams',
  'Headers',
  'Request',
  'Response',
  'FormData',
  'Blob',
  'File',
  'FileReader',
  'AbortController',
  'AbortSignal',
  'TextEncoder',
  'TextDecoder',
  'ReadableStream',
  'WritableStream',
  'TransformStream',
  'InstanceType',
])

export function extractES6Imports(content) {
  const imports = new Set()

  // Match: import Foo from './Foo.js'
  const defaultImportRegex = /^import\s+(\w+)/gm
  let match
  while ((match = defaultImportRegex.exec(content)) !== null) {
    imports.add(match[1])
  }

  // Match: import * as Foo from './Foo.js'
  const namespaceImportRegex = /^import\s+\*\s+as\s+(\w+)\s+from/gm
  while ((match = namespaceImportRegex.exec(content)) !== null) {
    imports.add(match[1])
  }

  // Match: import { Foo, Bar } from './Foo.js'
  const namedImportRegex = /^import\s+\{([^}]+)\}\s+from/gm
  while ((match = namedImportRegex.exec(content)) !== null) {
    match[1].split(',').forEach((name) => {
      const trimmed = name.trim()
      const aliasedMatch = trimmed.match(/^(\w+)\s+as\s+(\w+)$/)
      if (aliasedMatch) {
        imports.add(aliasedMatch[2])
      } else if (trimmed) {
        imports.add(trimmed)
      }
    })
  }

  return imports
}

export function extractCommonJSImports(content) {
  const imports = new Set()

  // Match: const Foo = require('./Foo')
  // Match: const Foo = require('./Foo').default
  const defaultRequireRegex = /(?:const|let|var)\s+(\w+)\s*=\s*require\s*\([^)]+\)(?:\.default)?/gm
  let match
  while ((match = defaultRequireRegex.exec(content)) !== null) {
    imports.add(match[1])
  }

  // Match: const { Foo, Bar } = require('./Foo')
  // Match: const { Foo: LocalFoo } = require('./Foo')
  const destructuredRequireRegex = /(?:const|let|var)\s+\{\s*([^}]+)\s*\}\s*=\s*require\s*\(/gm
  while ((match = destructuredRequireRegex.exec(content)) !== null) {
    match[1].split(',').forEach((name) => {
      const trimmed = name.replace(/\s*:\s*\w+/, '').trim()
      if (trimmed) imports.add(trimmed)
    })
  }

  return imports
}

export function extractTypedefImports(content) {
  const imports = new Set()
  // Match: /** @typedef {import('./File.js').default} TypeName */
  const typedefRegex = /@typedef\s*\{[^}]*import\([^)]+\)[^}]*\}\s*(\w+)/g
  let match

  while ((match = typedefRegex.exec(content)) !== null) {
    imports.add(match[1])
  }

  return imports
}

export function extractAtImports(content) {
  const imports = new Set()
  let match

  // Match: /** @import Foo from './Foo.js' */  (default import)
  const defaultRegex = /@import\s+(\w+)\s+from\s+['"][^'"]+['"]/g
  while ((match = defaultRegex.exec(content)) !== null) {
    imports.add(match[1])
  }

  // Match: /** @import { Foo, Bar } from './Foo.js' */  (named imports)
  // Match: /** @import { Foo as Bar } from './Foo.js' */  (aliased named imports)
  const namedRegex = /@import\s+\{([^}]+)\}\s+from\s+['"][^'"]+['"]/g
  while ((match = namedRegex.exec(content)) !== null) {
    match[1].split(',').forEach((name) => {
      const trimmed = name.trim()
      const aliasedMatch = trimmed.match(/^(\w+)\s+as\s+(\w+)$/)
      if (aliasedMatch) {
        imports.add(aliasedMatch[2])
      } else if (trimmed) {
        imports.add(trimmed)
      }
    })
  }

  return imports
}

export function extractDuckTypes(content) {
  const duckTypes = new Set()
  // Match: @typedef {object} TypeName
  const duckTypeRegex = /@typedef\s*\{object\}\s*(\w+)/g
  let match

  while ((match = duckTypeRegex.exec(content)) !== null) {
    duckTypes.add(match[1])
  }

  return duckTypes
}

export function extractTypedefNames(content) {
  const typedefs = new Set()
  // Match: @typedef {SomeType} LocalType or @typedef {SomeType} LocalType<T>
  const typedefRegex = /@typedef\s*\{[^}]+\}\s*([A-Za-z_$][\w$]*)/g
  let match

  while ((match = typedefRegex.exec(content)) !== null) {
    typedefs.add(match[1])
  }

  return typedefs
}

export function extractTemplateTypeParameters(content) {
  const templateTypes = new Set()
  // Match: @template T, U
  // Match: @template {Constraint} T
  const templateRegex = /@template(?:\s*\{[^}]+\})?\s+([^\n*]+)/g
  let match

  while ((match = templateRegex.exec(content)) !== null) {
    match[1]
      .split(',')
      .map((name) => name.trim())
      .forEach((name) => {
        if (/^[A-Za-z_$][\w$]*$/.test(name)) templateTypes.add(name)
      })
  }

  return templateTypes
}

export function extractClassNames(content) {
  const classes = new Set()
  // Match: class ClassName
  // Match: export default class ClassName
  const classRegex = /(?:export\s+default\s+)?class\s+(\w+)/g
  let match

  while ((match = classRegex.exec(content)) !== null) {
    classes.add(match[1])
  }

  return classes
}

export function extractTypeReferences(content) {
  const types = new Set()
  // Match @param {Type} or @returns {Type}
  const jsdocRegex = /@(?:param|returns|return|type)\s*\{([^}]+)\}/g
  let match

  while ((match = jsdocRegex.exec(content)) !== null) {
    const typeStr = match[1]
    // Extract type names starting with capital letter, but skip namespace-qualified types (e.g., math.Unit)
    // by checking if the capital-letter word is preceded by a dot (meaning it's accessed via a namespace)
    const typeNames = typeStr.matchAll(/(?<!\.)(\b[A-Z][a-zA-Z0-9]*)/g)
    for (const typeMatch of typeNames) {
      const type = typeMatch[1]
      if (!BUILTIN_TYPES.has(type)) {
        types.add(type)
      }
    }
  }

  return types
}

export function findInlineImportTypeExpressions(content) {
  const matches = []
  const inlineImportRegex = /@(?:param|returns|return|type|typedef)\s*\{[^}]*\bimport\([^)]+\)[^}]*\}/g
  let match

  while ((match = inlineImportRegex.exec(content)) !== null) {
    matches.push(match[0])
  }

  return matches
}

function isCommentOrBlank(line) {
  const trimmed = line.trim()
  return (
    trimmed === '' ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/*') ||
    trimmed.startsWith('*') ||
    trimmed.startsWith('*/')
  )
}

function isSingleLineAtImport(line) {
  return /^\s*\/\*\*\s*@import\b.+\*\/\s*$/.test(line)
}

function isRuntimeImportLine(line) {
  const trimmed = line.trim()
  return (
    /^import\s+.+/.test(trimmed) ||
    /^(?:const|let|var)\s+.+?=\s*require\([^)]+\)(?:\.\w+)?\s*;?$/.test(trimmed)
  )
}

export function findMisplacedAtImports(content) {
  const lines = content.split('\n')
  const atImportLines = []
  const runtimeImportLines = new Set()

  let pendingRequireAssignmentLine

  lines.forEach((line, index) => {
    if (isSingleLineAtImport(line)) atImportLines.push(index)

    if (isRuntimeImportLine(line)) {
      runtimeImportLines.add(index)
      return
    }

    const trimmed = line.trim()

    if (/^(?:const|let|var)\s+.+?=\s*$/.test(trimmed)) {
      pendingRequireAssignmentLine = index
      return
    }

    if (pendingRequireAssignmentLine !== undefined) {
      if (trimmed.startsWith('require(') || trimmed.includes(' require(')) {
        runtimeImportLines.add(pendingRequireAssignmentLine)
        runtimeImportLines.add(index)
      }
      pendingRequireAssignmentLine = undefined
    }
  })

  if (atImportLines.length === 0) return []

  const lastRuntimeImportLine = runtimeImportLines.size === 0 ? -1 : Math.max(...runtimeImportLines)
  const misplacedLines = []

  atImportLines.forEach((lineIndex) => {
    if (lineIndex <= lastRuntimeImportLine) {
      misplacedLines.push(lineIndex + 1)
      return
    }

    for (let i = lastRuntimeImportLine + 1; i < lineIndex; i += 1) {
      if (isCommentOrBlank(lines[i]) || isSingleLineAtImport(lines[i])) continue
      misplacedLines.push(lineIndex + 1)
      return
    }
  })

  return misplacedLines
}

function checkFile(filename) {
  if (!fs.existsSync(filename)) {
    console.error(`❌ File not found: ${filename}`)
    return false
  }

  const content = fs.readFileSync(filename, 'utf8')

  // Extract all imports and type definitions
  const es6Imports = extractES6Imports(content)
  const commonJSImports = extractCommonJSImports(content)
  const typedefImports = extractTypedefImports(content)
  const typedefNames = extractTypedefNames(content)
  const templateTypeParameters = extractTemplateTypeParameters(content)
  const atImports = extractAtImports(content)
  const duckTypes = extractDuckTypes(content)
  const classNames = extractClassNames(content)

  // Combine all available types
  const availableTypes = new Set([
    ...es6Imports,
    ...commonJSImports,
    ...typedefImports,
    ...typedefNames,
    ...templateTypeParameters,
    ...atImports,
    ...duckTypes,
    ...classNames,
  ])

  // Extract type references
  const typeRefs = extractTypeReferences(content)

  // Check for missing imports
  const missing = new Set()
  for (const type of typeRefs) {
    if (!availableTypes.has(type)) {
      missing.add(type)
    }
  }

  const inlineImportTypeExpressions = findInlineImportTypeExpressions(content)
  const misplacedAtImportLines = findMisplacedAtImports(content)

  // Report results
  const basename = path.basename(filename)

  if (
    missing.size === 0 &&
    inlineImportTypeExpressions.length === 0 &&
    misplacedAtImportLines.length === 0
  ) {
    console.log(`✅ ${basename}`)
    return true
  } else {
    console.log(`⚠️  ${basename}`)
    if (missing.size > 0) {
      console.log(`   Missing imports: ${Array.from(missing).sort().join(', ')}`)
    }

    if (inlineImportTypeExpressions.length > 0) {
      console.log('   Inline import() JSDoc types found (replace with top-of-file @import tags):')
      inlineImportTypeExpressions.forEach((expression) => {
        console.log(`   - ${expression}`)
      })
    }

    if (misplacedAtImportLines.length > 0) {
      const linesList = misplacedAtImportLines.join(', ')
      console.log(`   Misplaced @import tags at line(s): ${linesList}`)
      console.log('   Place @import tags after runtime imports/requires and before implementation code')
    }

    // Show where to add imports
    if (missing.size > 0 && (es6Imports.size > 0 || commonJSImports.size > 0 || typedefImports.size > 0)) {
      console.log(`   Add after existing imports at top of file`)
    } else if (missing.size > 0) {
      console.log(`   Add at top of file before class/function definitions`)
    }

    return false
  }
}

function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage: node check-type-imports.mjs [file1.js] [file2.mjs] ...')
    console.log('')
    console.log('Checks that all type references in JSDoc have corresponding imports.')
    process.exit(1)
  }

  let allOk = true

  for (const filename of args) {
    if (!checkFile(filename)) {
      allOk = false
    }
  }

  console.log('')
  if (allOk) {
    console.log('✅ All files have proper type imports!')
    process.exit(0)
  } else {
    console.log('⚠️  Some files have missing type imports. See details above.')
    process.exit(1)
  }
}

// Only run CLI when executed directly
const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)
if (isMain) {
  main()
}
