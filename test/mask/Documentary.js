import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import Context from '../context'
import { dirname } from 'path'
import alamode from 'alamode'
import Documentary from '../../src/lib/Documentary'
import { getTypedefs } from '../../src/lib/Typedefs'
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
    const doc = new Documentary({ cwd: TEMP, disableDtoc: true, skipUserComponents: false })
    return doc
  },
})

export const typedefs = makeTestSuite('test/result/Documentary-typedef', {
  context: [Context, TempContext],
  /**
   * @param {Context} p
   * @param {TempContext} t
   */
  async getReadable({ createReadable }, { write }) {
    if (this.types) {
      await write('types.xml', this.types)
    }
    let p = createReadable(this.input)
    const { types, locations } = await getTypedefs(p, this.rootNamespace)
    const doc = new Documentary({ locations, types, disableDtoc: true })
    p = createReadable(this.input)
    return p.pipe(doc)
  },
  // jsProps: ['preamble'],
})

export const fixtures = makeTestSuite('test/result/Documentary-fixtures', {
  async getReadable() {
    const s = getStream(this.input)
    const doc = new Documentary({ disableDtoc: true, noCache: true })
    return s.pipe(doc)
  },
})

export default ts