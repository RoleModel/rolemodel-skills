#!/usr/bin/env node
/* eslint-disable no-console */
/* global process */

/**
 * Find Missing JSDoc Documentation
 *
 * Identifies public methods and functions that lack JSDoc comments.
 * Helps ensure all public APIs are properly documented.
 *
 * Usage:
 *   node find-missing-docs.mjs [file1.js] [file2.mjs] ...
 *   node find-missing-docs.mjs app/javascript/shared/**\/*.js
 */

import fs from 'node:fs'
import path from 'node:path'

// Methods that typically don't need documentation (standard/lifecycle methods)
const SKIP_METHODS = new Set(['constructor', 'toString', 'valueOf', 'toJSON'])

// Method name patterns that are usually self-documenting
const OBVIOUS_PATTERNS = [
  /^is[A-Z]/, // boolean checks
  /^has[A-Z]/, // boolean checks
]

function isObviousMethod(name) {
  if (SKIP_METHODS.has(name)) return true
  return OBVIOUS_PATTERNS.some((pattern) => pattern.test(name))
}

function extractMethods(content) {
  const methods = []

  // Keywords to exclude from matches
  const keywords = /^(if|for|while|switch|catch|else|do|return|new|delete|typeof|void|function)$/

  // 1. Class methods: methodName() {, static methodName() {, async methodName() {, get prop() {
  const methodRegex = /(?:^|\n)\s*(static\s+)?(?:async\s+)?(get\s+)?(\w+)\s*\([^)]*\)\s*\{/g
  let match

  while ((match = methodRegex.exec(content)) !== null) {
    const isStatic = Boolean(match[1])
    const isGetter = Boolean(match[2])
    const methodName = match[3]

    if (keywords.test(methodName)) {
      continue
    }

    const position = match.index
    const lineNum = content.substring(0, position).split('\n').length

    methods.push({
      name: methodName,
      isStatic,
      isGetter,
      line: lineNum,
      position,
    })
  }

  // 2. Standalone / exported function declarations:
  //    function foo() {}, export function foo() {}, export default function foo() {},
  //    async function foo() {}, export async function foo() {}
  const fnDeclRegex =
    /(?:^|\n)\s*(?:export\s+(?:default\s+)?)?(?:async\s+)?function\s+(\w+)\s*\([^)]*\)\s*\{/g

  while ((match = fnDeclRegex.exec(content)) !== null) {
    const fnName = match[1]
    const position = match.index
    const lineNum = content.substring(0, position).split('\n').length

    // Avoid duplicates from the class-method regex
    if (!methods.some((m) => m.position === position)) {
      methods.push({
        name: fnName,
        isStatic: false,
        isGetter: false,
        line: lineNum,
        position,
      })
    }
  }

  // 3. Arrow functions & function expressions assigned to variables:
  //    const foo = () => {}, const foo = (...) => {}, const foo = function() {},
  //    export const foo = () => {}, let foo = () => {}
  const arrowOrExprRegex =
    /(?:^|\n)\s*(?:export\s+(?:default\s+)?)?(const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:(?:\([^)]*\)|(\w+))\s*=>|function\s*\([^)]*\)\s*)\s*\{?/g

  while ((match = arrowOrExprRegex.exec(content)) !== null) {
    const varName = match[2]
    const position = match.index
    const lineNum = content.substring(0, position).split('\n').length

    methods.push({
      name: varName,
      isStatic: false,
      isGetter: false,
      line: lineNum,
      position,
    })
  }

  // Sort by position so output is in source order
  methods.sort((a, b) => a.position - b.position)

  return methods
}

function hasJSDocBefore(content, methodPosition) {
  // Look backwards from method position for JSDoc
  const beforeMethod = content.substring(0, methodPosition)

  // Find the last occurrence of */ before the method
  const lastDocEnd = beforeMethod.lastIndexOf('*/')
  if (lastDocEnd === -1) return false

  // Check if there's any non-whitespace between */ and the method
  const between = beforeMethod.substring(lastDocEnd + 2)
  const hasOnlyWhitespace = /^\s*$/.test(between)

  if (!hasOnlyWhitespace) return false

  // Find the corresponding /** opening
  const docStart = beforeMethod.lastIndexOf('/**', lastDocEnd)
  if (docStart === -1) return false

  // Extract the JSDoc comment
  const jsdoc = beforeMethod.substring(docStart, lastDocEnd + 2)

  // Check if it's actually a JSDoc comment (has @param, @returns, or description)
  const hasContent = /@param|@returns|@return|@description|@type|\*\s+\w/.test(jsdoc)

  return hasContent
}

function checkFile(filename, options = {}) {
  const { verbose = false, skipObvious = true } = options

  if (!fs.existsSync(filename)) {
    console.error(`❌ File not found: ${filename}`)
    return { ok: false, missing: [] }
  }

  const content = fs.readFileSync(filename, 'utf8')
  const methods = extractMethods(content)

  const missing = []

  for (const method of methods) {
    // Skip obvious methods if requested
    if (skipObvious && isObviousMethod(method.name)) {
      continue
    }

    // Check if method has JSDoc
    if (!hasJSDocBefore(content, method.position)) {
      missing.push(method)
    }
  }

  // Report results
  const basename = path.basename(filename)

  if (missing.length === 0) {
    if (verbose) {
      console.log(`✅ ${basename} - All ${methods.length} methods documented`)
    } else {
      console.log(`✅ ${basename}`)
    }
    return { ok: true, missing: [] }
  } else {
    console.log(`⚠️  ${basename}`)
    console.log(`   ${missing.length} method${missing.length > 1 ? 's' : ''} missing JSDoc:`)

    for (const method of missing) {
      let prefix = ''
      let suffix = '()'
      if (method.isStatic) {
        prefix = 'static '
      } else if (method.isGetter) {
        prefix = 'get '
        suffix = ''
      }
      console.log(`   - Line ${method.line}: ${prefix}${method.name}${suffix}`)
    }

    return { ok: false, missing }
  }
}

function main() {
  const args = process.argv.slice(2)

  // Parse options
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    skipObvious: !args.includes('--include-obvious'),
  }

  // Remove option flags from file list
  const files = args.filter((arg) => !arg.startsWith('--') && !arg.startsWith('-'))

  if (files.length === 0) {
    console.log('Usage: node find-missing-docs.mjs [options] [file1.js] [file2.mjs] ...')
    console.log('')
    console.log('Options:')
    console.log('  -v, --verbose         Show files with complete documentation')
    console.log('  --include-obvious     Include obvious methods (is*, has*, etc.)')
    console.log('')
    console.log('Finds public methods without JSDoc documentation.')
    process.exit(1)
  }

  let allOk = true
  let totalMissing = 0

  for (const filename of files) {
    const result = checkFile(filename, options)
    if (!result.ok) {
      allOk = false
      totalMissing += result.missing.length
    }
  }

  console.log('')
  if (allOk) {
    console.log('✅ All public methods are documented!')
    process.exit(0)
  } else {
    console.log(`Found ${totalMissing} method${totalMissing > 1 ? 's' : ''} missing documentation.`)
    console.log('')
    console.log('Tip: Add JSDoc comments above each method:')
    console.log('/**')
    console.log(' * Brief description of what the method does')
    console.log(' * @param {Type} paramName - Description')
    console.log(' * @returns {Type} Description')
    console.log(' */')
    process.exit(1)
  }
}

main()
