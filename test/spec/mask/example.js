import { resolve } from 'path'
import { makeTestSuite } from 'zoroaster'
import { Replaceable } from 'restream'
import Context from '../../context'
import rule from '../../../src/lib/rules/example'

const path = resolve(__dirname, '../../mask/example/replace.md')
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

export default ts