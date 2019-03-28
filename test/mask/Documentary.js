import makeTestSuite from '@zoroaster/mask'
import { collect } from 'catchment'
import TempContext from 'temp-context'
import { dirname } from 'path'
import alamode from 'alamode'
import Documentary from '../../src/lib/Documentary'
import Typedefs from '../../src/lib/Typedefs'
import { getStream } from '../../src/lib'

const preact = dirname(require.resolve('preact/package.json'))
alamode({
  pragma: `const { h } = require("${preact}");`,
})

const ts = makeTestSuite('test/result/Documentary', {
  getTransform() {
    const doc = new Documentary({ disableDtoc: true })
    return doc
  },
})

export const components2 = makeTestSuite('test/result/Documentary-components.md', {
  context: TempContext,
  /**
   * @param {TempContext} t
   */
  async getTransform({ TEMP, add }) {
    await add('test/fixture/.documentary')
    const doc = new Documentary({ cwd: TEMP, disableDtoc: true })
    return doc
  },
})

export const typedefs = makeTestSuite('test/result/Documentary-types.md', {
  async getReadable(input) {
    const t = new Typedefs()
    t.end(input)
    await collect(t)
    const { types, locations } = t
    const doc = new Documentary({ locations, types, disableDtoc: true })
    doc.end(input)
    return doc
  },
})

export const fixtures = makeTestSuite('test/result/Documentary-fixtures', {
  async getReadable(input) {
    const s = getStream(input)
    const doc = new Documentary({ disableDtoc: true, noCache: true })
    return s.pipe(doc)
  },
})

export default ts