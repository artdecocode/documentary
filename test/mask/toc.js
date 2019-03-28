import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import Toc from '../../src/lib/Toc'
import { getTypedefs } from '../../src/lib/Typedefs'
import { getStream } from '../../src/lib'
import Documentary from '../../src/lib/Documentary'

const ts = makeTestSuite('test/result/Toc/default', {
  getReadable(input) {
    const documentary = new Documentary({ noCache: true })
    const toc = new Toc({ documentary })
    documentary.end(input)
    return documentary.pipe(toc)
  },
  splitRe: /^\/\/ /gm,
})

const h1 = makeTestSuite('test/result/Toc/h1', {
  getReadable(input) {
    const documentary = new Documentary({ noCache: true })
    const toc = new Toc({ skipLevelOne: false })
    documentary.end(input)
    return documentary.pipe(toc)
  },
})

const typedefs = makeTestSuite('test/result/Toc/titles', {
  async getReadable(input) {
    const stream = getStream(input)
    const { locations } = await getTypedefs(stream)
    const documentary = new Documentary({ noCache: true, locations })
    const toc = new Toc({ documentary })
    const s2 = getStream(input)
    return s2.pipe(documentary).pipe(toc)
  },
})

const macros = makeTestSuite('test/result/Toc/macros', {
  /**
   * @param {string} input
   * @param {TempContext}
   */
  async getReadable(input, { write }) {
    const pp = await write('data.md', input)
    const stream = getStream(pp)
    const { locations } = await getTypedefs(stream)

    const documentary = new Documentary({ noCache: true, locations })
    const toc = new Toc({ documentary })
    const s2 = getStream(pp)
    return s2.pipe(documentary).pipe(toc)
  },
  context: TempContext,
  splitRe: /^\/\/ /gm,
})

export default ts
export { h1, typedefs, macros }