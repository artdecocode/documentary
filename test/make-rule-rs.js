import { deepEqual } from 'zoroaster/assert'
import { makeTestSuite } from 'zoroaster'
import Context from './context'

/**
 * Create a mask test suite to extract all matches for a regular expression.
 * @param {string} path Path to the mask file.
 * @param {RegExp} regex The regex to test.
 * @param {string[]} keys Keys for the extracted values.
 */
const makeTs = (path, regex, keys) => {
  const ts = makeTestSuite(path, {
    /**
       * @param {string} input
       * @param {Context} context
       */
    async getResults(input, { mismatch }) {
      const s = mismatch(regex, input, keys)
      return s
    },
    assertResults(result, { matches }) {
      deepEqual(result, matches)
    },
    context: Context,
    jsonProps: ['matches'],
  })
  return ts
}

export default makeTs