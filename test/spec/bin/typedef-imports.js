import SnapshotContext from 'snapshot-context'
import Context from '../../context'

/** @type {Object.<string, (c: Context, s: SnapshotContext)>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'generates JSDoc to stdout'(
    { SNAPSHOT_DIR, doc, generateImports }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const { stdout } = await doc(generateImports, '-g', '-')
    await test('typedef/generate-imports.js', stdout.trim())
  },
}

export default T
