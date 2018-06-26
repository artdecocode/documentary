import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import createReplaceStream from '../../../src/lib/replace-stream'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'replaces a type'(
    { createReadable, catchment, type, SNAPSHOT_DIR }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `%TYPE
${type}
%`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    await test('replace-stream/type.txt', res)
  },
  async 'replaces a type for toc headings'(
    { createReadable, catchment, type, SNAPSHOT_DIR }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `%TYPE true
${type}
%`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    await test('replace-stream/type-headings.txt', res)
  },
}

export default T
