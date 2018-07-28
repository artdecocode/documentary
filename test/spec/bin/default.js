import { ok } from 'assert'
import SnapshotContext from 'snapshot-context'
import Context from '../../context'

/** @type {Object.<string, (c: Context, s: SnapshotContext)>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'generates correct markdown'({ SNAPSHOT_DIR, doc, README_PATH }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const { stdout } = await doc(README_PATH)
    await test('bin/markdown.md', stdout.trim())
  },
  async 'generates correct markdown from a directory'({ SNAPSHOT_DIR, doc, README_DIR_PATH }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const { stdout } = await doc(README_DIR_PATH)
    await test('bin/dir-markdown.md', stdout.trim())
  },
  async 'generates correct markdown and saves it to a file'(
    { SNAPSHOT_DIR, doc, README_PATH, OUTPUT, readOutput }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const { stdout } = await doc(README_PATH, '-o', OUTPUT)
    ok(/Saved/.test(stdout))
    const res = await readOutput()
    await test('bin/markdown.md', res.trim())
  },
  async 'prints the TOC with -t flag'(
    { SNAPSHOT_DIR, doc, README_PATH }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const { stdout } = await doc(README_PATH, '-t')
    await test('bin/toc.md', stdout.trim())
  },
}

export default T
