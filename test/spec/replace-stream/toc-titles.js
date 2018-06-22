import { equal } from 'assert'
import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import createReplaceStream from '../../../src/lib/replace-stream'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'replaces a title link with an anchor'({ createReadable, catchment }) {
    const t = '`Hello World`'
    const s = `[${t}](t)`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    equal(res, `<a name="hello-world">${t}</a>`)
  },
  async 'replaces a title within a table row'(
    { SNAPSHOT_DIR, createReadable, catchment, makeTable }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const t = '`Hello World`'
    const s = `["[${t}](t)"]`
    const table = makeTable(
      ['hello `[no-replace](t)`', 'world'],
      [s, 'test'],
    )
    const rs = createReadable(table)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    await test('replace-stream/toc-title-within-table.md', res)
  },
}

export default T
