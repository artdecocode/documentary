import { equal } from 'zoroaster/assert'
import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import createReplaceStream from '../../../src/lib/replace-stream'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'works with code which has been removed by comments'({ getCodeBlock, codeBlock, getComment, createReadable, catchment }) {
    const code = getCodeBlock('console.log(\'hello\')')
    const comment = getComment(codeBlock)
    const t = `${comment}${code}`
    const rs = createReadable(`${t}${comment}`)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s, true)
    equal(res, code.replace(/^\s+/, '')) // comments re also strips new lines
  },
}

export default T
