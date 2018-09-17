import { makeTestSuite } from 'zoroaster'
import Toc from '../../src/lib/Toc'
import { getTypedefs } from '../../src/lib/Typedefs'
import { getStream } from '../../src/lib';

const ts = makeTestSuite('test/result/Toc/index.md', {
  getTransform() {
    const toc = new Toc()
    return toc
  },
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

export default ts
export { h1, typedefs }