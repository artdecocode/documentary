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
  async 'removes comments'(
    { SNAPSHOT_DIR, createReadable, catchment, comment }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const t = 'The program will perform the necessary operations.'
    const rs = createReadable(`${t}\n${comment}`)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s)
    await test('comments-strip.md', res.trim())
  },
  async 'removes comments from different places'(
    { createReadable, catchment, getComment }
  ) {
    const t = 'Hello World'
    const rs = createReadable(`${getComment('test')}${t}${getComment('test')}`)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s)
    equal(res, t)
  },
  async 'does not remove non-comments because of back-ticks'({ createReadable, catchment }) {
    const t = 'Text surrounded by the `<!--` and `-->` blocks is not removed.'
    const rs = createReadable(t)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s)
    equal(res, t)
  },
  async 'does not remove comments found in code blocks'(
    { comment, getCodeBlock, createReadable, catchment }
  ) {
    const t = getCodeBlock(comment)
    const rs = createReadable(t)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s, true)
    equal(res, t)
  },
}

export default T
