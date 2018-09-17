import { makeTestSuite } from 'zoroaster'
import Context from '../context'

const ts = makeTestSuite('test/result/bin/index.js', {
  context: Context,
  /**
   *
   * @param {string} input
   * @param {Context} context
   */
  async getResults(input, { doc }) {
    const [source, ...args] = input.split(' ')
    const { stdout } = await doc(source, ...args)
    return stdout
  },
})

export default ts