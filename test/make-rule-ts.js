import { makeTestSuite } from 'zoroaster'
import Context from './context'

/**
 * Run a replaceable stream against each item in the mask file.
 * @param {string} path Path to the mask file
 * @param {Rule|Rule[]} rule A rule or a set of rules to use.
 */
const makeRuleTestSuite = (path, rule) => {
  const ts = makeTestSuite(path, {
    /**
     *
     * @param {string} input
     * @param {Context} context
     */
    async getResults(input, { replace }) {
      const { res } = await replace(rule, input)
      return res
    },
    context: Context,
  })
  return ts
}

/**
 * @typedef {import('restream').Rule} Rule
 */

export default makeRuleTestSuite