import Context from '../context'
import SnapshotContext from 'snapshot-context'

/** @type {Object.<string, (c: Context, s: SnapshotContext)>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'runs the toc command against source readme'({ SNAPSHOT_DIR, toc, README_PATH }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const { stdout } = await toc(README_PATH)
    await test('source-readme.md', stdout.trim())
  },
}

export default T
