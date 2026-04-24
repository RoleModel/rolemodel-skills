#!/usr/bin/env node


import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  extractAtImports,
  extractClassNames,
  extractCommonJSImports,
  extractDuckTypes,
  extractES6Imports,
  extractTemplateTypeParameters,
  extractTypeReferences,
  extractTypedefImports,
  extractTypedefNames,
  findInlineImportTypeExpressions,
  findMisplacedAtImports,
} from './check-type-imports.mjs'

// ── extractES6Imports ────────────────────────────────────────────────

describe('extractES6Imports', () => {
  it('extracts default imports', () => {
    const content = `import Foo from './Foo.js'`
    assert.deepStrictEqual(extractES6Imports(content), new Set(['Foo']))
  })

  it('extracts namespace imports', () => {
    const content = `import * as Utils from './utils.js'`
    assert.deepStrictEqual(extractES6Imports(content), new Set(['Utils']))
  })

  it('extracts named imports', () => {
    const content = `import { Alpha, Beta } from './stuff.js'`
    assert.deepStrictEqual(
      extractES6Imports(content),
      new Set(['Alpha', 'Beta']),
    )
  })

  it('handles aliased named imports (keeps local alias)', () => {
    const content = `import { Foo as Bar } from './Foo.js'`
    assert.deepStrictEqual(extractES6Imports(content), new Set(['Bar']))
  })

  it('extracts multiple import statements', () => {
    const content = [
      `import A from './A.js'`,
      `import { B, C } from './bc.js'`,
      `import * as D from './D.js'`,
    ].join('\n')
    assert.deepStrictEqual(
      extractES6Imports(content),
      new Set(['A', 'B', 'C', 'D']),
    )
  })

  it('returns empty set when no imports', () => {
    assert.deepStrictEqual(extractES6Imports('const x = 1'), new Set())
  })
})

// ── extractCommonJSImports ───────────────────────────────────────────

describe('extractCommonJSImports', () => {
  it('extracts default require', () => {
    const content = `const Foo = require('./Foo')`
    assert.deepStrictEqual(
      extractCommonJSImports(content),
      new Set(['Foo']),
    )
  })

  it('extracts require with .default access', () => {
    const content = `const Bar = require('./Bar').default`
    assert.deepStrictEqual(
      extractCommonJSImports(content),
      new Set(['Bar']),
    )
  })

  it('extracts destructured require', () => {
    const content = `const { Alpha, Beta } = require('./stuff')`
    assert.deepStrictEqual(
      extractCommonJSImports(content),
      new Set(['Alpha', 'Beta']),
    )
  })

  it('extracts destructured require with rename (keeps original name)', () => {
    const content = `const { Foo: LocalFoo } = require('./Foo')`
    assert.deepStrictEqual(
      extractCommonJSImports(content),
      new Set(['Foo']),
    )
  })

  it('handles let and var', () => {
    const content = [
      `let A = require('./A')`,
      `var B = require('./B')`,
    ].join('\n')
    assert.deepStrictEqual(
      extractCommonJSImports(content),
      new Set(['A', 'B']),
    )
  })

  it('returns empty set when no requires', () => {
    assert.deepStrictEqual(
      extractCommonJSImports('import Foo from "./Foo.js"'),
      new Set(),
    )
  })
})

// ── extractTypedefImports ────────────────────────────────────────────

describe('extractTypedefImports', () => {
  it('extracts typedef import with .default', () => {
    const content = `/** @typedef {import('./Circle.js').default} Circle */`
    assert.deepStrictEqual(
      extractTypedefImports(content),
      new Set(['Circle']),
    )
  })

  it('extracts typedef import without .default', () => {
    const content = `/** @typedef {import('./types.js').ShapeType} ShapeType */`
    assert.deepStrictEqual(
      extractTypedefImports(content),
      new Set(['ShapeType']),
    )
  })

  it('extracts multiple typedef imports', () => {
    const content = [
      `/** @typedef {import('./A.js').default} A */`,
      `/** @typedef {import('./B.js').default} B */`,
    ].join('\n')
    assert.deepStrictEqual(
      extractTypedefImports(content),
      new Set(['A', 'B']),
    )
  })

  it('returns empty set when no typedef imports', () => {
    assert.deepStrictEqual(extractTypedefImports('class Foo {}'), new Set())
  })
})

// ── extractAtImports ─────────────────────────────────────────────────

describe('extractAtImports', () => {
  it('extracts default @import', () => {
    const content = `/** @import Circle from './Circle.js' */`
    assert.deepStrictEqual(extractAtImports(content), new Set(['Circle']))
  })

  it('extracts named @imports', () => {
    const content = `/** @import { Foo, Bar } from './stuff.js' */`
    assert.deepStrictEqual(
      extractAtImports(content),
      new Set(['Foo', 'Bar']),
    )
  })

  it('handles both single and double quotes', () => {
    const a = `/** @import A from "./A.js" */`
    const b = `/** @import B from './B.js' */`
    assert.deepStrictEqual(extractAtImports(a), new Set(['A']))
    assert.deepStrictEqual(extractAtImports(b), new Set(['B']))
  })

  it('handles aliased named @imports (keeps local alias)', () => {
    const content = `/** @import { Foo as Bar } from './Foo.js' */`
    assert.deepStrictEqual(extractAtImports(content), new Set(['Bar']))
  })

  it('returns empty set when no @imports', () => {
    assert.deepStrictEqual(extractAtImports('const x = 1'), new Set())
  })
})

// ── extractDuckTypes ─────────────────────────────────────────────────

describe('extractDuckTypes', () => {
  it('extracts @typedef {object} declarations', () => {
    const content = `/** @typedef {object} PointLike */`
    assert.deepStrictEqual(
      extractDuckTypes(content),
      new Set(['PointLike']),
    )
  })

  it('extracts multiple duck types', () => {
    const content = [
      `/** @typedef {object} Foo */`,
      `/** @typedef {object} Bar */`,
    ].join('\n')
    assert.deepStrictEqual(
      extractDuckTypes(content),
      new Set(['Foo', 'Bar']),
    )
  })

  it('does not match non-object typedefs', () => {
    const content = `/** @typedef {string} Name */`
    assert.deepStrictEqual(extractDuckTypes(content), new Set())
  })

  it('returns empty set when no duck types', () => {
    assert.deepStrictEqual(extractDuckTypes('class Foo {}'), new Set())
  })
})

// ── extractTypedefNames ─────────────────────────────────────────────

describe('extractTypedefNames', () => {
  it('extracts typedef names', () => {
    const content = `/** @typedef {string} Name */`
    assert.deepStrictEqual(extractTypedefNames(content), new Set(['Name']))
  })

  it('extracts typedef names with generic suffixes', () => {
    const content = `/** @typedef {typeof Foo} FooType<T> */`
    assert.deepStrictEqual(extractTypedefNames(content), new Set(['FooType']))
  })
})

// ── extractTemplateTypeParameters ───────────────────────────────────

describe('extractTemplateTypeParameters', () => {
  it('extracts template parameters', () => {
    const content = `/** @template T, U */`
    assert.deepStrictEqual(extractTemplateTypeParameters(content), new Set(['T', 'U']))
  })

  it('extracts constrained template parameters', () => {
    const content = `/** @template {RailType} RT */`
    assert.deepStrictEqual(extractTemplateTypeParameters(content), new Set(['RT']))
  })
})

// ── extractClassNames ────────────────────────────────────────────────

describe('extractClassNames', () => {
  it('extracts class declaration', () => {
    const content = `class Circle {}`
    assert.deepStrictEqual(extractClassNames(content), new Set(['Circle']))
  })

  it('extracts export default class', () => {
    const content = `export default class Shape {}`
    assert.deepStrictEqual(extractClassNames(content), new Set(['Shape']))
  })

  it('extracts multiple classes', () => {
    const content = ['class A {}', 'class B extends A {}'].join('\n')
    assert.deepStrictEqual(extractClassNames(content), new Set(['A', 'B']))
  })

  it('returns empty set when no classes', () => {
    assert.deepStrictEqual(
      extractClassNames('function foo() {}'),
      new Set(),
    )
  })
})

// ── extractTypeReferences ────────────────────────────────────────────

describe('extractTypeReferences', () => {
  it('extracts types from @param tags', () => {
    const content = `/** @param {Circle} circle */`
    assert.deepStrictEqual(
      extractTypeReferences(content),
      new Set(['Circle']),
    )
  })

  it('extracts types from @returns tags', () => {
    const content = `/** @returns {Shape} */`
    assert.deepStrictEqual(
      extractTypeReferences(content),
      new Set(['Shape']),
    )
  })

  it('extracts types from @return tags', () => {
    const content = `/** @return {Widget} */`
    assert.deepStrictEqual(
      extractTypeReferences(content),
      new Set(['Widget']),
    )
  })

  it('extracts types from @type tags', () => {
    const content = `/** @type {Panel} */`
    assert.deepStrictEqual(
      extractTypeReferences(content),
      new Set(['Panel']),
    )
  })

  it('extracts multiple types from a union', () => {
    const content = `/** @param {Circle|Rectangle} shape */`
    assert.deepStrictEqual(
      extractTypeReferences(content),
      new Set(['Circle', 'Rectangle']),
    )
  })

  it('extracts generic type parameters', () => {
    const content = `/** @param {Array<Segment>} segments */`
    assert.deepStrictEqual(
      extractTypeReferences(content),
      new Set(['Segment']),
    )
  })

  it('ignores built-in types', () => {
    const content = `/** @param {Array} items */`
    assert.deepStrictEqual(extractTypeReferences(content), new Set())
  })

  it('ignores lowercase types (primitives)', () => {
    const content = `/** @param {string} name */`
    assert.deepStrictEqual(extractTypeReferences(content), new Set())
  })

  it('skips namespace-qualified types (e.g., math.Unit)', () => {
    const content = `/** @param {math.Unit} value */`
    // 'Unit' is preceded by a dot, so it should be skipped
    assert.deepStrictEqual(extractTypeReferences(content), new Set())
  })

  it('extracts non-qualified type alongside namespace-qualified', () => {
    const content = `/** @param {math.Unit|Circle} value */`
    assert.deepStrictEqual(
      extractTypeReferences(content),
      new Set(['Circle']),
    )
  })

  it('handles nullable types', () => {
    const content = `/** @param {?Circle} circle */`
    assert.deepStrictEqual(
      extractTypeReferences(content),
      new Set(['Circle']),
    )
  })
})

// ── findInlineImportTypeExpressions ────────────────────────────────

describe('findInlineImportTypeExpressions', () => {
  it('finds inline import() in @param', () => {
    const content = `/** @param {import('./Circle.js').default} circle */`
    assert.deepStrictEqual(findInlineImportTypeExpressions(content), ["@param {import('./Circle.js').default}"])
  })

  it('finds inline import() in @typedef', () => {
    const content = `/** @typedef {typeof import('./Circle.js')} CircleType */`
    assert.deepStrictEqual(findInlineImportTypeExpressions(content), ["@typedef {typeof import('./Circle.js')}"])
  })

  it('returns empty array when only @import tags are used', () => {
    const content = `/** @import Circle from './Circle.js' */`
    assert.deepStrictEqual(findInlineImportTypeExpressions(content), [])
  })
})

// ── findMisplacedAtImports ─────────────────────────────────────────

describe('findMisplacedAtImports', () => {
  it('accepts @import after require statements', () => {
    const content = [
      `const Foo = require('./Foo')`,
      ``,
      `/** @import Bar from './Bar.js' */`,
      `class Baz {}`,
    ].join('\n')

    assert.deepStrictEqual(findMisplacedAtImports(content), [])
  })

  it('flags @import before runtime imports', () => {
    const content = [
      `/** @import Bar from './Bar.js' */`,
      `const Foo = require('./Foo')`,
      `class Baz {}`,
    ].join('\n')

    assert.deepStrictEqual(findMisplacedAtImports(content), [1])
  })

  it('flags @import after implementation code', () => {
    const content = [
      `const Foo = require('./Foo')`,
      `const value = 42`,
      `/** @import Bar from './Bar.js' */`,
      `class Baz {}`,
    ].join('\n')

    assert.deepStrictEqual(findMisplacedAtImports(content), [3])
  })
})
