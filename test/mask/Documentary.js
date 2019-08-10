import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import Context from '../context'
import { dirname, resolve } from 'path'
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

export const methodTitles = makeTestSuite('test/result/rules/method-titles', {
  context: class extends TempContext {
    async _destroy() {
      await super._destroy()
      const path = resolve(this.resolve('.documentary/index.jsx'))
      // if (!(path in require.cache)) console.warn('Require cache wasn\'t cleared.')
      delete require.cache[path]
    }
  },
  /** @param {TempContext} t */
  async getTransform({ write, TEMP, readGlobal }) {
    if (this.preamble) {
      const code = await readGlobal(this.preamble)
      await write('.documentary/index.jsx', code)
    }
    const doc = new Documentary({
      cwd: TEMP, disableDtoc: true, skipUserComponents: false,
      skipHomedirComponents: true,
    })
    return doc
  },
})

export const components2 = makeTestSuite('test/result/Documentary-components.md', {
  context: class extends TempContext {
    async _destroy() {
      await super._destroy()
      const path = resolve(this.resolve('.documentary/index.jsx'))
      // if (!(path in require.cache)) console.warn('Require cache wasn\'t cleared.')
      delete require.cache[path]
    }
  },
  /**
   * @param {TempContext} t
   */
  async getTransform({ TEMP, add }) {
    await add('test/fixture/.documentary')
    const doc = new Documentary({
      cwd: TEMP, disableDtoc: true, skipUserComponents: false,
      skipHomedirComponents: true,
    })
    return doc
  },
})

// export const method = makeTestSuite('test/result/components/method', {
//   context: TempContext,
//   /**
//    * @param {TempContext} t
//    */
//   async getReadable({ TEMP, add, write }) {
//     const path = await write('index.js', this.input)
//     // await add('test/fixture/.documentary')
//     const doc = new Documentary()
//     // let s = this.method
//     doc.end(this.method || `<method>${path}</method>`)
//     return doc
//   },
// })

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