import makeTestSuite from '@zoroaster/mask'
import { deepEqual } from 'zoroaster/assert'
import mismatch from 'mismatch'
import { sectionBrakeRe } from '../../src/lib/rules/section-break'
import { linkRe, linkTitleRe } from '../../src/lib/rules'
import { macroRe, useMacroRe } from '../../src/lib/rules/macros'

const ts = [
  [
    sectionBrakeRe,
    'section breaks',
    'section-break.md',
    ['number', 'attrs'],
  ],
  [
    linkRe,
    'links',
    'links.md',
    ['title', 'prefix'],
  ],
  [
    linkTitleRe,
    'toc links',
    'toc-links.md',
    ['title', 'tOrHash', 'prefix'],
  ],
  [
    macroRe,
    'macros',
    'macro.md',
    ['p', 'name', 'body'],
  ],
  [
    useMacroRe,
    'use-macros',
    'use-macro.md',
    ['name', 'body'],
  ],
].reduce((acc, [regex, name, path, keys]) => {
  const p = `test/result/re/${path}`
  const t = makeTestSuite(p, {
    /**
     * @param {string} input
     */
    async getResults(input) {
      const s = mismatch(regex, input, keys)
      return s
    },
    assertResults(result, { matches }) {
      deepEqual(result, matches)
    },
    jsonProps: ['matches'],
  })
  return {
    ...acc,
    [name]: t,
  }
}, {})

export default ts