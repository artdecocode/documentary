import { equal } from 'zoroaster/assert'
import Context from '../context'
import SnapshotContext from 'snapshot-context'
import { createReadStream } from 'fs'
import Toc from '../../src/lib/Toc'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'reads TOC'({ SNAPSHOT_DIR, README_PATH, catchment }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const toc = new Toc()
    const rs = createReadStream(README_PATH)
    rs.pipe(toc)
    const res = await catchment(toc)
    await test('bin/toc.md', res)
  },
}

export default T
