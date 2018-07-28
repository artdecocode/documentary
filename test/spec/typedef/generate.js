import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import generateTypedef from '../../../src/bin/run/generate'
import { PassThrough } from 'stream'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'generates a typedef'({ catchment, SNAPSHOT_DIR, generateImports: source }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const stream = new PassThrough()
    const p = catchment(stream)
    await generateTypedef({
      stream,
      source,
    })
    const c = await p
    await test('generate-imports.js', c)
  },
}

export default T
