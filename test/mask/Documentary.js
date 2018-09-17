import { makeTestSuite } from 'zoroaster'
import Documentary from '../../src/lib/Documentary'
import Typedefs from '../../src/lib/Typedefs'
import { collect } from 'catchment'

const ts = makeTestSuite('test/result/Documentary', {
  getTransform() {
    const doc = new Documentary()
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