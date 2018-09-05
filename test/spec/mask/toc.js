import { resolve } from 'path'
import { makeTestSuite } from 'zoroaster'
import Context from '../../context'
import Toc from '../../../src/lib/Toc'

const path = resolve(__dirname, '../../mask/toc/index.js')
const path2 = resolve(__dirname, '../../mask/toc/h1.js')
const ts = makeTestSuite(path, {
  /**
   *
   * @param {string} input
   * @param {Context} context
   */
  async getResults(input, { catchment }) {
    const toc = new Toc()
    toc.end(input)
    const res = await catchment(toc)
    return res
  },
  context: Context,
})

const h1 = makeTestSuite(path2, {
  /**
   *
   * @param {string} input
   * @param {Context} context
   */
  async getResults(input, { catchment }) {
    const toc = new Toc({ skipLevelOne: false })
    toc.end(input)
    const res = await catchment(toc)
    return res
  },
  context: Context,
})

let T = ts

export default T
export { h1 }