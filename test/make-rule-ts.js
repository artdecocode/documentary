import { makeTestSuite } from 'zoroaster'
import { Replaceable } from 'restream'
import Context from './context'

const makeRuleTestSuite = (path, rule) => {
  const ts = makeTestSuite(path, {
    /**
     *
     * @param {string} input
     * @param {Context} context
     */
    async getResults(input, { catchment }) {
      const rs = new Replaceable(rule)
      rs.end(input)
      const res = await catchment(rs)
      return res
    },
    context: Context,
  })
  return ts
}

export default makeRuleTestSuite