import { makeTestSuite } from 'zoroaster'
import { deepEqual } from 'zoroaster/assert'
import mismatch from 'mismatch'
import { sectionBrakeRe } from '../../src/lib/rules/section-break'

const ts = [
  [
    sectionBrakeRe,
    'section breaks',
    'section-break.md',
    ['number', 'attrs'],
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