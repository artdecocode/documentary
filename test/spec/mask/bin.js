import { resolve } from 'path'
import { makeTestSuite } from 'zoroaster'
import Context from '../../context'

const path = resolve(__dirname, '../../mask/bin/index.js')
const ts = makeTestSuite(path, {
  /**
   *
   * @param {string} input
   * @param {Context} context
   */
  async getResults(input, { doc }) {
    const [source, ...args] = input.split(' ')
    const { stdout, stderr } = await doc(source, ...args)
    if (stderr) {
      throw new Error(stderr)
    }
    return stdout
  },
  context: Context,
})

export default ts