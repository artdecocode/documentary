import { makeTestSuite } from 'zoroaster'
import Toc from '../../src/lib/Toc'

const ts = makeTestSuite('test/result/Toc/index.md', {
  streamResult() {
    const toc = new Toc()
    return toc
  },
})

const h1 = makeTestSuite('test/result/Toc/h1.md', {
  streamResult() {
    const toc = new Toc({ skipLevelOne: false })
    return toc
  },
})

export default ts
export { h1 }