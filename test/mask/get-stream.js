import { makeTestSuite } from 'zoroaster'
import { getStream } from '../../src/lib'
import Documentary from '../../src/lib/Documentary'

const ts = makeTestSuite('test/result/get-stream', {
  getReadable(input) {
    const s = getStream(input)
    const doc = new Documentary()
    s.pipe(doc)
    return doc
  },
})

export default ts