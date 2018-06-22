import { equal } from 'zoroaster/assert'
import SnapshotContext from 'snapshot-context'
import { createReadStream } from 'fs'
import Context from '../../context'
import createReplaceStream from '../../../src/lib/replace-stream'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'runs against fixture'({
    SNAPSHOT_DIR, README_PATH, catchment }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const rs = createReadStream(README_PATH)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s)
    await test('replace-stream/fixture.md', res.trim())
  },
  async 'keeps 4 back-ticks with a table code block'(
    { createReadable, catchment, rawTable, escapeBackticks }
  ) {
    const s = escapeBackticks(rawTable)
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    equal(res, s)
  },
  async 'keeps 4 back-ticks with a method title'(
    { createReadable, getRawMethodTitle, catchment, escapeBackticks }
  ) {
    const methodTitle = getRawMethodTitle()
    const s = escapeBackticks(methodTitle)
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    equal(res, s)
  },
}

export default T
