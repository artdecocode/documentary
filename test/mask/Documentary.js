import { makeTestSuite } from 'zoroaster'
import Documentary from '../../src/lib/Documentary'

const ts = makeTestSuite('test/result/Documentary', {
  streamResult() {
    const doc = new Documentary()
    return doc
  },
})

export default ts