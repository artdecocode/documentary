import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import Toc from '../../src/lib/Toc'
import { getTypedefs } from '../../src/lib/Typedefs'
import { getStream } from '../../src/lib'

const ts = makeTestSuite('test/result/Toc/default.md', {
  getTransform() {
    const toc = new Toc()
    return toc
  },
  splitRe: /^\/\/ /gm,
})

const h1 = makeTestSuite('test/result/Toc/h1.md', {
  getTransform() {
    const toc = new Toc({ skipLevelOne: false })
    return toc
  },
})

const typedefs = makeTestSuite('test/result/Toc/titles.md', {
  async getReadable(input) {
    const stream = getStream(input)
    const { locations } = await getTypedefs(stream)
    const toc = new Toc({ locations })
    const s2 = getStream(input)
    s2.pipe(toc)
    return toc
  },
})

const macros = makeTestSuite('test/result/Toc/macros.md', {
  /**
   * @param {string} input
   * @param {TempContext}
   */
  async getReadable(input, { write }) {
    const pp = await write('data.md', input)
    const stream = getStream(pp)
    const { locations } = await getTypedefs(stream)
    const toc = new Toc({ locations })
    const s2 = getStream(pp)
    s2.pipe(toc)
    return toc
  },
  context: TempContext,
  splitRe: /^\/\/ /gm,
})

export default ts
export { h1, typedefs, macros }