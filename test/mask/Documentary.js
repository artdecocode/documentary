import { makeTestSuite } from 'zoroaster'
import { collect } from 'catchment'
import TempContext from 'temp-context'
import Documentary from '../../src/lib/Documentary'
import Typedefs from '../../src/lib/Typedefs'
import { dirname } from 'path'
import alamode from 'alamode'

const preact = dirname(require.resolve('preact/package.json'))
alamode({
  pragma: `const { h } = require("${preact}");`,
})

const ts = makeTestSuite('test/result/Documentary', {
  getTransform() {
    const doc = new Documentary()
    return doc
  },
})

export const components = makeTestSuite('test/result/Documentary-components.md', {
  context: TempContext,
  /**
   * @param {TempContext} t
   */
  async getTransform({ TEMP, add }) {
    await add('test/fixture/.documentary')
    const doc = new Documentary({ cwd: TEMP })
    return doc
  },
})

const typedefs = makeTestSuite('test/result/Documentary-types.md', {
  async getReadable(input) {
    const t = new Typedefs()
    t.end(input)
    await collect(t)
    const { types, locations } = t
    const doc = new Documentary({ locations, types })
    doc.end(input)
    return doc
  },
})

export default ts
export { typedefs }