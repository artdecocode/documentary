import { makeTestSuite } from 'zoroaster'
import Context from '../context'

const ts = makeTestSuite('test/result/bin/index.js', {
  fork: Context.DOC,
})

export default ts