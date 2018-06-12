import { ok } from 'assert'
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
  async 'replaces the %TOC% marker in the file'({ SNAPSHOT_DIR, toc, README_PATH }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const { stdout } = await toc(README_PATH, '-r')
    await test('source-replace.md', stdout.trim())
  },
  async 'replaces the %TOC% marker in the file and saves to given output'(
    { SNAPSHOT_DIR, toc, README_PATH, OUTPUT, readOutput }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const { stdout } = await toc(README_PATH, '-r', '-o', OUTPUT)
    console.log(stdout)
    ok(/Saved/.test(stdout))
    const output = await readOutput()
    await test('source-output.md', output.trim())
  },
}

export default T
