import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import Toc from '../../src/lib/Toc'
import { getTypedefs } from '../../src/lib/Typedefs'
import { getStream } from '../../src/lib'
import Documentary from '../../src/lib/Documentary'

export default makeTestSuite('test/result/Toc/default', {
  getReadable() {
    const documentary = new Documentary({ noCache: true })
    const toc = new Toc({ documentary })
    documentary.end(this.input)
    return documentary.pipe(toc)
  },
  splitRe: /^\/\/ /gm,
})

const h1 = makeTestSuite('test/result/Toc/h1', {
  getReadable() {
    const documentary = new Documentary({ noCache: true })
    const toc = new Toc({ skipLevelOne: false })
    documentary.end(this.input)
    return documentary.pipe(toc)
  },
})

const typedefs = makeTestSuite('test/result/Toc/titles', {
  async getReadable() {
    const stream = getStream(this.input, false, false)
    const { locations } = await getTypedefs(stream)
    const documentary = new Documentary({ noCache: true, locations })
    const toc = new Toc({ documentary })
    const s2 = getStream(this.input)
    return s2.pipe(documentary).pipe(toc)
  },
})

const macros = makeTestSuite('test/result/Toc/macros', {
  /**
   * @param {TempContext}
   */
  async getReadable({ write }) {
    const pp = await write('data.md', this.input)
    const stream = getStream(pp, false, false)
    const { locations } = await getTypedefs(stream)

    const documentary = new Documentary({ noCache: true, locations })
    const toc = new Toc({ documentary })
    const s2 = getStream(pp)
    return s2.pipe(documentary).pipe(toc)
  },
  context: TempContext,
  splitRe: /^\/\/ /gm,
})

export { h1, typedefs, macros }